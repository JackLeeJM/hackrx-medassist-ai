import time
import traceback
from datetime import datetime
from cachetools import TTLCache
from fastapi import APIRouter, Depends
from app.config.logging_setup import get_logger
from app.config.settings import get_settings
from app.services.data.patient_service import PatientService
from app.services.llm.pipelines.clinical_summary import ClinicalSummaryPipeline
from app.models.services import PatientSummaryResponse, ComprehensivePatientProfile
from app.models.patient import PatientInfo, PatientList
from app.services.data.summary_service import load_generated_summary
from app.api.deps import verify_api_key


logger = get_logger(__name__)
settings = get_settings()
router = APIRouter()

patient_service = PatientService()

# Loads internal generated summaries
generated_summary = load_generated_summary()

# Auto-evicts after 1 hour or when >1000 entries
summary_cache = TTLCache(maxsize=1000, ttl=3600)

# Groq
groq_summary_generator = ClinicalSummaryPipeline(
    model=settings.GROQ_MODEL_REASONING,
    ollama_url=settings.GROQ_API_URL
)

# Ollama
summary_generator = ClinicalSummaryPipeline(
    model=settings.OLLAMA_MODEL,
    ollama_url=settings.OLLAMA_API_URL
)

@router.get("/patients/generated-summary", response_model=PatientList)
async def get_patients_with_generated_summary(
    auth_info: str = Depends(verify_api_key)
):
    try:
        patient_ids = list(generated_summary.keys())
        return PatientList(patient_ids=patient_ids)

    except Exception as e:
        msg = f"An error occurred when getting patients with generated patient summary: {e}.\n{traceback.format_exc()}"
        logger.error(msg)


@router.post("/patients/generated-summary/{patient_id}", response_model=ComprehensivePatientProfile)
async def get_comprehensive_patient_profiles_with_generated_summary(
    patient_id: str,
    auth_info: str = Depends(verify_api_key)
):
    try:
        profile = patient_service.get_comprehensive_patient_profile(patient_id)
        return ComprehensivePatientProfile(**profile)

    except Exception as e:
        msg = f"An error occurred when getting comprehensive patient profiles with generated patient summary: {e}.\n{traceback.format_exc()}"
        logger.error(msg)


@router.post("/{patient_id}", response_model=PatientSummaryResponse)
async def generate_patient_summary(
    patient_id: str,
    auth_info: str = Depends(verify_api_key)
):
    """Generate AI-powered clinical summary using Haystack pipeline"""
    try:
        # # Check internal generated cache
        # if patient_id in generated_summary:
        #     logger.info(f"Generatd Summary hit for patient_id={patient_id}")
        #     return generated_summary[patient_id]
        
        # Check cache
        if patient_id in summary_cache:
            logger.info(f"Cache hit for patient_id={patient_id}")
            return summary_cache[patient_id]

        # Generate summary
        start_time = time.time()
        summary_result = await groq_summary_generator.generate_summary(patient_id)
        sanitized_result = summary_result["llm"]["replies"][0]
        elapsed = time.time() - start_time

        response_data = PatientSummaryResponse(
            patient_id=patient_id,
            summary=sanitized_result,
            model_used=settings.GROQ_MODEL_REASONING,
            generated_at=datetime.now().isoformat(),
            generation_elapsed_second=float(round(elapsed, 2))
        )

        # Store in cache
        summary_cache[patient_id] = response_data
        logger.info(f"Cache stored for patient_id={patient_id}")
        
        return response_data

    except Exception as e:
        msg = f"An error occurred when generating patient summary: {e}.\n{traceback.format_exc()}"
        logger.error(msg)