import json
from app.utils.file_locator import ROOT_DIR


def load_generated_summary():
    FILE_PATH = ROOT_DIR / "data" / "summaries" / "generated_summaries_optimized.json"
    
    with open(FILE_PATH, mode="r", encoding="utf-8") as f:
        return json.load(f)
