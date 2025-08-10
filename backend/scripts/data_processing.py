import traceback
import pandas as pd
from pathlib import Path


ROOT_DIR = Path(__file__).parent.parent
REFERENCE_DIR = ROOT_DIR / "scripts" / "reference"
CSV_DATA_DIR = ROOT_DIR / "synthea" / "output" / "csv"
DATA_DIR = ROOT_DIR / "data"

relevant_files = [
    "allergies",
    "conditions",
    "encounters",
    "immunizations",
    "medications",
    "observations",
    "organizations",
    "patients",
    "payers",
    "procedures",
    "providers",
    "careplans"
]

csv_files = {i.stem:i for i in CSV_DATA_DIR.glob("*.csv") if i.stem in relevant_files}


def get_patient_ids(csv_files: dict[str, str]) -> list[str]:
    """
    Process conditions CSV file to get a filtered list of patient IDs based on the prevalent condition list.
    """
    try:
        # Load filtered pravelent conditions found in Malaysia
        FILTERED_CONDITIONS_PATH = REFERENCE_DIR / "prevalent_conditions.txt"
        with open(FILTERED_CONDITIONS_PATH, "r") as f:
            condition_ids = [int(i) for i in f.read().splitlines()]

        # Load EHR Conditions CSV file
        conditions_df = pd.read_csv(csv_files["conditions"])

        # Filter and remove duplicates
        filtered_df = conditions_df[
            conditions_df["CODE"].isin(condition_ids)
        ].drop_duplicates(subset=["PATIENT", "CODE", "DESCRIPTION"])

        # Group by patient by condition id to check condition counts per patient
        condition_counts_df = (
            filtered_df.groupby("PATIENT")["CODE"]
            .agg([lambda x: list(set(x)), pd.Series.nunique])
            .reset_index()
        )
        condition_counts_df.columns = ["PATIENT", "CODES", "COUNT"]

        # Filter for patients with more than 2 conditions
        # Sanity check to examine if the filtered list of conditions and prevalent condition ids are aligned
        filter_threshold = 2
        final_df = condition_counts_df[condition_counts_df["COUNT"] > filter_threshold]
        sanity_check = set(final_df["CODES"].explode().unique()) == set(condition_ids)

        if sanity_check:
            return list(final_df["PATIENT"])
        else:
            msg = f"""
            The filter threshold may be too high, the current list of conditions are not aligned with the prevalent condition list.
            Current threshold: {filter_threshold}
            """
            print(msg)

    except Exception as e:
        print(f"An error occurred when processing data: {e}.\n{traceback.format_exc()}")


def filter_convert_to_parquet(csv_files: dict[str, str], patient_ids: list[str]) -> None:
    """
    Filter the relevant CSV files based on the filtered patient IDs, convert to parquet for optimized storage.
    """
    PROCESSED_DIR = DATA_DIR / "processed_v2"

    try:
        standalone_files = ["payers", "providers", "organizations"]

        for filename, filepath in csv_files.items():

            print(f"Started Processing {filename}")
            df = pd.read_csv(filepath)
            print(f"DF Shape BEFORE filtering: {df.shape}")

            if filename in standalone_files:
                df.to_parquet(path=(PROCESSED_DIR / f"{filename}.parquet"), compression="brotli")

            if filename == "patients":
                df = df[df["Id"].isin(patient_ids)]
                print(f"DF Shape AFTER filtering: {df.shape}")
                df.to_parquet(path=(PROCESSED_DIR / f"{filename}.parquet"), compression="brotli")
            
            if filename not in ["patients"] + standalone_files:
                df = df[df["PATIENT"].isin(patient_ids)]
                print(f"DF Shape AFTER filtering: {df.shape}")
                df.to_parquet(path=(PROCESSED_DIR / f"{filename}.parquet"), compression="brotli")

            print(f"Finished Processing {filename}")

        return None
    
    except Exception as e:
        msg = f"An error occurred when filtering and converting to parquet format: {e}.\n{traceback.format_exc()}"
        print(msg)


def main():

    # Process conditions CSV file to filter for prevalent conditions in Malaysia
    patient_ids = get_patient_ids(csv_files)

    # Filter the relevant CSV files and convert them into parquet for efficient storage
    filter_convert_to_parquet(csv_files, patient_ids)


if __name__ == "__main__":
    main()
