from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ComprehensivePatientProfile(BaseModel):
    patient_info: Optional[Dict[str, Any]] = None
    conditions: Optional[List[Dict[str, Any]]] = None
    medications: Optional[List[Dict[str, Any]]] = None
    observations: Optional[List[Dict[str, Any]]] = None
    allergies: Optional[List[Dict[str, Any]]] = None
    encounters: Optional[List[Dict[str, Any]]] = None
    procedures: Optional[List[Dict[str, Any]]] = None
    immunizations: Optional[List[Dict[str, Any]]] = None
    chart_data: Optional[Any] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "patient_info": {
                    "id": "a0e59eb6-e663-ab3b-eb8f-cfa01cb2bf9d",
                    "name": "Shelby Bins",
                    "age": 69,
                    "gender": "M",
                    "race": "white",
                    "ethnicity": "nonhispanic",
                    "address": "502 Gottlieb Avenue, Northampton, Massachusetts 1060",
                    "birthdate": "1956-05-11",
                    "marital_status": "M",
                    "healthcare_expenses": 287432,
                    "income": 66920
                },
                "conditions": [
                    {
                        "description": "Macular edema and retinopathy due to type 2 diabetes mellitus (disorder)",
                        "start_date": "2014-09-30",
                        "stop_date": "null",
                        "is_active": True,
                        "code": 97331000119101
                    },
                    {
                        "description": "Hyperlipidemia (disorder)",
                        "start_date": "2014-02-21",
                        "stop_date": "null",
                        "is_active": True,
                        "code": 55822004
                    }
                ],
                "medications": [
                    {
                        "description": "24 HR Metformin hydrochloride 500 MG Extended Release Oral Tablet",
                        "start_date": "2025-04-24",
                        "stop_date": "null",
                        "is_active": True,
                        "cost": 34.29,
                        "reason": "Diabetes mellitus type 2 (disorder)"
                    }
                ],
                "observations": [
                    {
                        "description": "Hemoglobin A1c/Hemoglobin.total in Blood",
                        "value": "5.5",
                        "units": "%",
                        "date": "2025-04-24",
                        "category": "laboratory",
                        "type": "numeric"
                    },
                    {
                        "description": "Systolic Blood Pressure",
                        "value": "127.0",
                        "units": "mm[Hg]",
                        "date": "2025-04-24",
                        "category": "vital-signs",
                        "type": "numeric"
                    }
                ],
                "allergies": [],
                "encounters": [
                    {
                        "date": "2025-06-25 10:54",
                        "class": "ambulatory",
                        "description": "Ophthalmic examination and evaluation (procedure)",
                        "cost": 3668.36,
                        "reason": "null"
                    },
                ],
                "procedures": [
                    {
                        "date": "2025-06-25",
                        "description": "Intravitreal injection of anti-vascular endothelial growth factor (procedure)",
                        "cost": 431.4,
                        "reason": "Nonproliferative diabetic retinopathy due to type 2 diabetes mellitus (disorder)"
                    },
                ],
                "immunizations": [
                    {
                        "date": "2025-04-24",
                        "description": "Influenza  seasonal  injectable  preservative free",
                        "cost": 136
                    }
                ],
                "chart_data": {
                    "vital_trends": [
                        {
                            "month": "2025-04",
                            "Diastolic Blood Pressure": 100,
                            "Respiratory rate": 13,
                            "Systolic Blood Pressure": 127
                        }
                    ],
                    "conditions_timeline": [
                        {
                            "year": 2021,
                            "conditions": 2
                        },
                        {
                            "year": 2022,
                            "conditions": 7
                        },
                        {
                            "year": 2023,
                            "conditions": 1
                        },
                        {
                            "year": 2024,
                            "conditions": 5
                        },
                        {
                            "year": 2025,
                            "conditions": 2
                        }
                    ],
                    "cost_breakdown": [
                        {
                            "name": "Encounters",
                            "value": 343293.84,
                            "fill": "#8884d8"
                        },
                        {
                            "name": "Procedures",
                            "value": 266100.93000000005,
                            "fill": "#82ca9d"
                        },
                        {
                            "name": "Medications",
                            "value": 75107.92000000001,
                            "fill": "#ffc658"
                        },
                        {
                            "name": "Immunizations",
                            "value": 2040,
                            "fill": "#ff7c7c"
                        }
                    ],
                    "medication_timeline": [
                        {
                            "month": "2024-07",
                            "medications": 3
                        },
                        {
                            "month": "2024-10",
                            "medications": 3
                        },
                        {
                            "month": "2025-01",
                            "medications": 3
                        },
                        {
                            "month": "2025-03",
                            "medications": 3
                        },
                        {
                            "month": "2025-04",
                            "medications": 7
                        },
                        {
                            "month": "2025-05",
                            "medications": 1
                        },
                        {
                            "month": "2025-06",
                            "medications": 3
                        }
                    ]
                }
            }
        }
    )


class PatientSummaryResponse(BaseModel):
    patient_id: str
    summary: str
    model_used: str
    generated_at: str
    generation_elapsed_second: float

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "patient_id": "healthy",
                "summary": "# Patient Summary\n\nThis patient has a medical history of recurring viral infection...",
                "model_used": "llama3.2:3b",
                "generated_at": "2025-08-06T15:07:37.853493",
                "generation_elapsed_second": 7
            }
        }
    )