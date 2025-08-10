import traceback
from haystack import Pipeline
from haystack.utils import Secret
from haystack.components.builders import PromptBuilder
from haystack_integrations.components.generators.ollama import OllamaGenerator
from haystack.components.generators import OpenAIGenerator
from app.config.settings import get_settings
from app.config.logging_setup import get_logger
from prompts.clinical_summary import summary_template
from app.services.data.patient_service import PatientService


logger = get_logger(__name__)

settings = get_settings()


class ClinicalSummaryPipeline:
    """Haystack pipeline for generating clinical summaries."""

    def __init__(self, model: str = "llama3.2:3b", ollama_url: str = settings.OLLAMA_API_URL_LOCAL):
        self.pipeline = Pipeline()
        self.model = model
        self.ollama_url = ollama_url
        self._build_pipeline()

    def _build_pipeline(self):
        """Build the clinical summary pipeline"""

        groq_llm = OpenAIGenerator(
            api_key=Secret.from_token(settings.GROQ_API_KEY),
            api_base_url=settings.GROQ_API_URL,
            model="llama-3.3-70b-versatile",
            generation_kwargs={
                "temperature": 0.1,
                "max_tokens": 4000,
                "top_p": 0.9
            }
        )

        ollama_llm = OllamaGenerator(
            model=self.model,
            url=self.ollama_url,
            generation_kwargs={
                "temperature": 0.1
            }
        )

        self.pipeline.add_component("prompt", PromptBuilder(template=summary_template))
        self.pipeline.add_component("llm", groq_llm)
        self.pipeline.connect("prompt", "llm")

    async def generate_summary(self, patient_id: str):
        """Generate clinical summary using the pipeline"""
        try:
            patient_service = PatientService()
            data = patient_service.get_comprehensive_patient_profile(patient_id)

            return self.pipeline.run({
                "prompt": {
                    "patient_info": data["patient_info"],
                    "conditions": data["conditions"],
                    "medications": data["medications"],
                    "observations": data["observations"],
                    "allergies": data["allergies"],
                    "encounters": data["encounters"],
                    "procedures": data["procedures"],
                    "summary_stats": data["summary_stats"]
                }
            })
        except Exception as e:
            msg = f"An error occurred while generating summary: {e}.\n{traceback.format_exc()}"
            logger.error(msg)