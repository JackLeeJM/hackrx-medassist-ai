# Backend

## Project Folder Structure

```
backend/
├── Dockerfile
├── README.md
├── app
│   ├── __init__.py
│   ├── api
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1
│   │       ├── __init__.py
│   │       ├── api.py
│   │       └── endpoints
│   │           ├── __init__.py
│   │           ├── health.py
│   │           ├── patients.py
│   │           └── services.py
│   ├── config
│   │   ├── __init__.py
│   │   ├── logging_setup.py
│   │   └── settings.py
│   ├── core
│   │   ├── __init__.py
│   │   └── security.py
│   ├── main.py
│   ├── models
│   │   ├── __init__.py
│   │   ├── health.py
│   │   ├── ollama.py
│   │   ├── patient.py
│   │   └── services.py
│   ├── services
│   │   ├── __init__.py
│   │   ├── data
│   │   │   ├── __init__.py
│   │   │   ├── patient_service.py
│   │   │   └── summary_service.py
│   │   └── llm
│   │       ├── __init__.py
│   │       ├── ollama_client.py
│   │       ├── pipelines
│   │       │   ├── __init__.py
│   │       │   └── clinical_summary.py
│   │       └── prompt_manager.py
│   └── utils
│       ├── __init__.py
│       └── file_locator.py
├── data
│   ├── processed
│   │   ├── allergies.parquet
│   │   ├── careplans.parquet
│   │   ├── conditions.parquet
│   │   ├── encounters.parquet
│   │   ├── immunizations.parquet
│   │   ├── medications.parquet
│   │   ├── observations.parquet
│   │   ├── organizations.parquet
│   │   ├── patients.parquet
│   │   ├── payers.parquet
│   │   ├── procedures.parquet
│   │   └── providers.parquet
│   ├── raw
│   └── summaries
│       ├── generated_summaries.json
│       └── generated_summaries_optimized.json
├── docker-compose.yml
├── prompts
│   └── clinical_summary.py
├── pyproject.toml
├── scripts
│   ├── data_processing.py
│   └── reference
│       ├── prevalent_conditions.py
│       ├── prevalent_conditions.txt
│       └── unique_patients.txt
└── uv.lock
```
