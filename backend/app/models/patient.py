import pandas as pd
from typing import List
from pydantic import BaseModel, ConfigDict


class PatientInfo(BaseModel):
    id: str
    name: str
    age: int
    gender: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "bdb70c06-5516-04de-1a09-c605efea0569",
                "name": "Mickey Armstrong",
                "age": 61,
                "gender": "F"
            }
        }
    )

class PatientList(BaseModel):
    patient_ids: List[str]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "patient_ids": [
                    "03f9cbe6-35bf-a854-19a9-f17f251be102",
                    "0c855d60-ec04-e31f-e342-59b0f48b6ac8"
                ]
            }
        }
    )


class ConditionList(BaseModel):
    condition_ids: List[int]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "condition_ids": [44054006, 97331000119101]
            }
        }
    )


class ConditionInfo(BaseModel):
    code: int
    description: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "code": 44054006,
                "description": "Diabetes mellitus type 2"
            }
        }
    )


class PatientServiceLoadedData(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    allergies: pd.DataFrame
    careplans: pd.DataFrame
    conditions: pd.DataFrame
    encounters: pd.DataFrame
    immunizations: pd.DataFrame
    medications: pd.DataFrame
    observations: pd.DataFrame
    organizations: pd.DataFrame
    patients: pd.DataFrame
    payers: pd.DataFrame
    procedures: pd.DataFrame
    providers: pd.DataFrame