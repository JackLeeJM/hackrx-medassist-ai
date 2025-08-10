import traceback
from datetime import datetime, timedelta, timezone
import pandas as pd
from typing import Dict, List, Any
from app.models.patient import PatientServiceLoadedData
from app.config.logging_setup import get_logger
from app.utils.file_locator import ROOT_DIR


logger = get_logger(__name__)


class PatientService:
    def __init__(self):
        self.DATA_DIR = ROOT_DIR / "data" / "processed"
        self.data = self._load_data()
        self._convert_dates()
        
    def _load_data(self) -> PatientServiceLoadedData:
        try:
            return PatientServiceLoadedData(**{
                file.stem:pd.read_parquet(file) for file in self.DATA_DIR.glob("*.parquet")
            })
        except Exception as e:
            msg = f"An error occurred while loading data: {e}.\n{traceback.format_exc()}"
            logger.error(msg)

    def _convert_dates(self):
        """Convert date columns to datetime"""
        date_columns = {
            'patients': ['BIRTHDATE', 'DEATHDATE'],
            'encounters': ['START', 'STOP'],
            'observations': ['DATE'],
            'conditions': ['START', 'STOP'],
            'procedures': ['START', 'STOP'],
            'medications': ['START', 'STOP'],
            'allergies': ['START', 'STOP'],
            'immunizations': ['DATE']
        }
        
        for df_name, columns in date_columns.items():
            df = getattr(self.data, df_name)
            if df is not None:
                for col in columns:
                    if col in df.columns:
                        df[col] = pd.to_datetime(df[col], errors='coerce')

    def get_patients_by_condition_id(self, condition_ids: List[int]):
        """
        Returns a list of patient IDs who have ALL the condition codes specified in condition_ids.
        """
        # Filter only rows where CODE is in condition_ids
        filtered = self.data.conditions[self.data.conditions["CODE"].isin(condition_ids)]

        # Group by PATIENT and get unique condition codes per patient
        patient_ids = filtered.groupby("PATIENT")["CODE"].nunique()

        # Keep only patients who have all N condition_ids
        matching_patients = patient_ids[patient_ids >= len(set(condition_ids))].index.tolist()

        return matching_patients
    
    def get_condition_list(self) -> List[Dict[str, str]]:
        """Get list of unique conditions"""
        df = self.data.conditions[["CODE","DESCRIPTION"]].copy(deep=True).drop_duplicates(subset=["CODE", "DESCRIPTION"], keep="first")
        df.columns = df.columns.str.lower()
        return df.to_dict(orient="records")
    
    def get_patient_list(self, limit: int = 50) -> List[Dict[str, str]]:
        """Get list of patients for dropdown"""
        
        # Filter for living patients with recent activity
        living_patients = self.data.patients[self.data.patients['DEATHDATE'].isna()].head(limit)
        
        return [
            {
                "id": row['Id'],
                "name": f"{row['FIRST']} {row['LAST']}",
                "age": self._calculate_age(row['BIRTHDATE']),
                "gender": row['GENDER']
            }
            for _, row in living_patients.iterrows()
        ]
    
    def _calculate_age(self, birthdate: pd.Timestamp) -> int:
        """Calculate age from birthdate"""
        if pd.isna(birthdate):
            return 0
        today = datetime.now()
        return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    
    def get_comprehensive_patient_profile(self, patient_id: str) -> Dict[str, Any]:
        """Get complete patient profile for clinical summary"""
        
        # Basic demographics
        patient_info = self._get_patient_demographics(patient_id)
        if not patient_info:
            return {}
        
        # Medical data
        conditions = self._get_patient_conditions(patient_id)
        medications = self._get_current_medications(patient_id)
        recent_observations = self._get_recent_observations(patient_id)
        allergies = self._get_patient_allergies(patient_id)
        recent_encounters = self._get_recent_encounters(patient_id)
        procedures = self._get_recent_procedures(patient_id)
        immunizations = self._get_immunizations(patient_id)
        
        # Chart data for visualizations
        chart_data = self._generate_chart_data(patient_id)
        
        return {
            "patient_info": patient_info,
            "conditions": conditions,
            "medications": medications,
            "observations": recent_observations,
            "allergies": allergies,
            "encounters": recent_encounters,
            "procedures": procedures,
            "immunizations": immunizations,
            "chart_data": chart_data,
            "summary_stats": self._get_summary_stats(patient_id)
        }
    
    def _get_patient_demographics(self, patient_id: str) -> Dict[str, Any]:
        """Get patient demographics"""
        patient = self.data.patients[self.data.patients['Id'] == patient_id]
        if patient.empty:
            return {}
        
        row = patient.iloc[0]
        return {
            "id": patient_id,
            "name": f"{row['FIRST']} {row['LAST']}",
            "age": self._calculate_age(row['BIRTHDATE']),
            "gender": row['GENDER'],
            "race": row['RACE'],
            "ethnicity": row['ETHNICITY'],
            "address": f"{row['ADDRESS']}, {row['CITY']}, {row['STATE']} {row['ZIP']}",
            "birthdate": row['BIRTHDATE'].strftime('%Y-%m-%d') if pd.notna(row['BIRTHDATE']) else None,
            "marital_status": row.get('MARITAL') if pd.notna(row.get('MARITAL')) else 'Unknown',
            "healthcare_expenses": int(row.get('HEALTHCARE_EXPENSES', 0)),
            "income": int(row.get('INCOME', 0))
        }
    
    def _get_patient_conditions(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get patient conditions with timeline"""
        conditions = self.data.conditions[self.data.conditions['PATIENT'] == patient_id]
        
        # Focus on active conditions (no stop date or recent)
        now = conditions['STOP'].max()
        active_conditions = conditions[
            (conditions['STOP'].isna()) | 
            (conditions['STOP'] > (now - timedelta(days=365)))
        ].sort_values('START', ascending=False)
        
        return [
            {
                "description": row['DESCRIPTION'],
                "start_date": row['START'].strftime('%Y-%m-%d') if pd.notna(row['START']) else None,
                "stop_date": row['STOP'].strftime('%Y-%m-%d') if pd.notna(row['STOP']) else None,
                "is_active": pd.isna(row['STOP']),
                "code": row['CODE']
            }
            for _, row in active_conditions.head(10).iterrows()
        ]
    
    def _get_current_medications(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get current and recent medications"""
        medications = self.data.medications[self.data.medications['PATIENT'] == patient_id]
        
        # Focus on active medications
        now = medications['STOP'].max()
        active_meds = medications[
            (medications['STOP'].isna()) | 
            (medications['STOP'] > (now - timedelta(days=90)))
        ].sort_values('START', ascending=False)
        
        return [
            {
                "description": row['DESCRIPTION'],
                "start_date": row['START'].strftime('%Y-%m-%d') if pd.notna(row['START']) else None,
                "stop_date": row['STOP'].strftime('%Y-%m-%d') if pd.notna(row['STOP']) else None,
                "is_active": pd.isna(row['STOP']),
                "cost": row.get('TOTALCOST', 0),
                "reason": row.get('REASONDESCRIPTION', 'Unknown')
            }
            for _, row in active_meds.head(15).iterrows()
        ]
    
    def _get_recent_observations(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get recent lab results and vital signs"""
        try:
            observations = self.data.observations[self.data.observations['PATIENT'] == patient_id]
            
            # Get observations from last 6 months
            cutoff_date = observations['DATE'].max() - timedelta(days=180)
            recent_obs = observations[observations['DATE'] > cutoff_date]
            
            # Group by description and get latest values
            latest_obs = recent_obs.sort_values('DATE').groupby('DESCRIPTION').tail(1)
            
            return [
                {
                    "description": row['DESCRIPTION'],
                    "value": row['VALUE'],
                    "units": row['UNITS'],
                    "date": row['DATE'].strftime('%Y-%m-%d') if pd.notna(row['DATE']) else None,
                    "category": row['CATEGORY'],
                    "type": row['TYPE']
                }
                for _, row in latest_obs.head(20).iterrows()
            ]
        except Exception as e:
            msg = f"An error occurred when getting recent observations: {e}.\n{traceback.format_exc()}"
            print(msg)
    
    def _get_patient_allergies(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get patient allergies"""
        allergies = self.data.allergies[self.data.allergies['PATIENT'] == patient_id]
        
        # Focus on active allergies
        active_allergies = allergies[allergies['STOP'].isna()]
        
        return [
            {
                "description": row['DESCRIPTION'],
                "type": row['TYPE'],
                "category": row['CATEGORY'],
                "reaction": row.get('DESCRIPTION1', 'Unknown reaction'),
                "severity": row.get('SEVERITY1', 'Unknown')
            }
            for _, row in active_allergies.iterrows()
        ]
    
    def _get_recent_encounters(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get recent healthcare encounters"""
        encounters = self.data.encounters[self.data.encounters['PATIENT'] == patient_id]
        
        # Get encounters from last year
        cutoff_date = encounters['START'].max() - timedelta(days=365)
        recent_encounters = encounters[encounters['START'] > cutoff_date]
        recent_encounters = recent_encounters.sort_values('START', ascending=False)
        
        return [
            {
                "date": row['START'].strftime('%Y-%m-%d %H:%M') if pd.notna(row['START']) else None,
                "class": row['ENCOUNTERCLASS'],
                "description": row['DESCRIPTION'],
                "cost": row.get('TOTAL_CLAIM_COST', 0),
                "reason": row.get('REASONDESCRIPTION', 'Routine care')
            }
            for _, row in recent_encounters.head(10).iterrows()
        ]
    
    def _get_recent_procedures(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get recent procedures"""
        procedures = self.data.procedures[self.data.procedures['PATIENT'] == patient_id]
        
        # Get procedures from last year
        cutoff_date = procedures['START'].max() - timedelta(days=365)
        recent_procedures = procedures[procedures['START'] > cutoff_date]
        recent_procedures = recent_procedures.sort_values('START', ascending=False)
        
        return [
            {
                "date": row['START'].strftime('%Y-%m-%d') if pd.notna(row['START']) else None,
                "description": row['DESCRIPTION'],
                "cost": row.get('BASE_COST', 0),
                "reason": row.get('REASONDESCRIPTION', 'Unknown')
            }
            for _, row in recent_procedures.head(10).iterrows()
        ]
    
    def _get_immunizations(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get immunization history"""
        immunizations = self.data.immunizations[self.data.immunizations['PATIENT'] == patient_id]
        recent_immunizations = immunizations.sort_values('DATE', ascending=False)
        
        return [
            {
                "date": row['DATE'].strftime('%Y-%m-%d') if pd.notna(row['DATE']) else None,
                "description": row['DESCRIPTION'],
                "cost": row.get('BASE_COST', 0)
            }
            for _, row in recent_immunizations.head(10).iterrows()
        ]
    
    def _generate_chart_data(self, patient_id: str) -> Dict[str, Any]:
        """Generate chart data for Recharts visualization"""
        
        # 1. Vital signs trends (line chart)
        vital_trends = self._get_vital_trends(patient_id)
        
        # 2. Conditions timeline (bar chart)
        conditions_timeline = self._get_conditions_timeline(patient_id)
        
        # 3. Healthcare costs (pie chart)
        cost_breakdown = self._get_cost_breakdown(patient_id)
        
        # 4. Medication adherence (line chart)
        medication_timeline = self._get_medication_timeline(patient_id)
        
        return {
            "vital_trends": vital_trends,
            "conditions_timeline": conditions_timeline,
            "cost_breakdown": cost_breakdown,
            "medication_timeline": medication_timeline
        }
    
    def _get_vital_trends(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get vital signs trends for line chart"""
        observations = self.data.observations[self.data.observations['PATIENT'] == patient_id]
        
        # Focus on key vitals from last year
        vital_codes = ['8480-6', '8462-4', '8310-5', '9279-1']  # BP systolic, diastolic, temp, resp rate
        vital_names = {
            '8480-6': 'Systolic BP',
            '8462-4': 'Diastolic BP', 
            '8310-5': 'Body Temperature',
            '9279-1': 'Respiratory Rate'
        }
        
        cutoff_date = observations['DATE'].max() - timedelta(days=365)
        recent_vitals = observations[
            (observations['DATE'] > cutoff_date) & 
            (observations['CODE'].isin(vital_codes))
        ].copy(deep=True)

        # Convert VALUE column to float
        recent_vitals['VALUE'] = pd.to_numeric(recent_vitals['VALUE'], errors='coerce')

        # Group by month and get averages
        recent_vitals.loc[:, 'month'] = recent_vitals['DATE'].dt.to_period('M')
        monthly_vitals = recent_vitals.groupby(['month', 'DESCRIPTION'])['VALUE'].mean().reset_index()
        
        # Convert to Recharts format
        chart_data = []
        for month_period in monthly_vitals['month'].unique():
            month_data = {"month": str(month_period)}
            month_vitals = monthly_vitals[monthly_vitals['month'] == month_period]
            
            for _, row in month_vitals.iterrows():
                month_data[row['DESCRIPTION']] = round(float(row['VALUE']), 1)
            
            chart_data.append(month_data)
        
        return sorted(chart_data, key=lambda x: x['month'])
    
    def _get_conditions_timeline(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get conditions count by year for bar chart"""
        conditions = self.data.conditions[self.data.conditions['PATIENT'] == patient_id]
        
        # Get conditions by year
        conditions = conditions.copy(deep=True)
        conditions.loc[:, 'year'] = conditions['START'].dt.year
        yearly_counts = conditions.groupby('year').size().reset_index(name='count')
        
        return [
            {"year": int(row['year']), "conditions": int(row['count'])}
            for _, row in yearly_counts.tail(5).iterrows()
        ]
    
    def _get_cost_breakdown(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get healthcare cost breakdown for pie chart"""
        
        # Encounter costs
        encounters = self.data.encounters[self.data.encounters['PATIENT'] == patient_id]
        encounter_cost = encounters['TOTAL_CLAIM_COST'].sum()
        
        # Procedure costs
        procedures = self.data.procedures[self.data.procedures['PATIENT'] == patient_id]
        procedure_cost = procedures['BASE_COST'].sum()
        
        # Medication costs
        medications = self.data.medications[self.data.medications['PATIENT'] == patient_id]
        medication_cost = medications['TOTALCOST'].sum()
        
        # Immunization costs
        immunizations = self.data.immunizations[self.data.immunizations['PATIENT'] == patient_id]
        immunization_cost = immunizations['BASE_COST'].sum()
        
        return [
            {"name": "Encounters", "value": float(encounter_cost), "fill": "#8884d8"},
            {"name": "Procedures", "value": float(procedure_cost), "fill": "#82ca9d"},
            {"name": "Medications", "value": float(medication_cost), "fill": "#ffc658"},
            {"name": "Immunizations", "value": float(immunization_cost), "fill": "#ff7c7c"}
        ]
    
    def _get_medication_timeline(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get medication count over time"""
        medications = self.data.medications[self.data.medications['PATIENT'] == patient_id]
        
        # Get active medications by month for last year
        cutoff_date = medications['START'].max() - timedelta(days=365)
        recent_meds = medications[medications['START'] > cutoff_date]
        
        recent_meds['month'] = recent_meds['START'].dt.to_period('M')
        monthly_meds = recent_meds.groupby('month').size().reset_index(name='count')
        
        return [
            {"month": str(row['month']), "medications": int(row['count'])}
            for _, row in monthly_meds.iterrows()
        ]
    
    def _get_summary_stats(self, patient_id: str) -> Dict[str, Any]:
        """Get summary statistics for patient"""
        
        # Count active conditions
        conditions = self.data.conditions[self.data.conditions['PATIENT'] == patient_id]
        active_conditions = conditions[conditions['STOP'].isna()]
        
        # Count active medications
        medications = self.data.medications[self.data.medications['PATIENT'] == patient_id]
        active_medications = medications[medications['STOP'].isna()]
        
        # Total healthcare expenses
        encounters = self.data.encounters[self.data.encounters['PATIENT'] == patient_id]
        total_costs = encounters['TOTAL_CLAIM_COST'].sum()
        
        # Recent encounter count
        cutoff_date = encounters['START'].max() - timedelta(days=365)
        recent_encounters = encounters[encounters['START'] > cutoff_date]
        
        return {
            "active_conditions": len(active_conditions),
            "active_medications": len(active_medications),
            "total_healthcare_costs": float(total_costs),
            "encounters_last_year": len(recent_encounters),
            "last_encounter_date": encounters['START'].max().strftime('%Y-%m-%d') if not encounters.empty else None
        }
