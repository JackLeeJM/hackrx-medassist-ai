import time
import traceback
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from app.config.logging_setup import get_logger
from app.services.data.patient_service import PatientService
from app.models.patient import PatientInfo, PatientList, ConditionInfo, ConditionList
from app.api.deps import verify_api_key
from fastapi import APIRouter


router = APIRouter()


patient_service = PatientService()

@router.get("/", response_model=List[PatientInfo])
async def get_patient_list(limit:int = Query(50, ge=1, le=2287), auth_info: str = Depends(verify_api_key)):
    return patient_service.get_patient_list(limit=limit)

@router.get("/conditions", response_model=List[ConditionInfo])
async def get_condition_list(auth_info: str = Depends(verify_api_key)):
    return patient_service.get_condition_list()

@router.post("/by-conditions", response_model=PatientList)
async def get_patients_by_condition_id(
    payload: ConditionList,
    auth_info: str = Depends(verify_api_key)
):
    return PatientList(patient_ids=patient_service.get_patients_by_condition_id(payload.condition_ids))