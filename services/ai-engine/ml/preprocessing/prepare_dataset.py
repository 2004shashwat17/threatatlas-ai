
import pandas as pd
from pathlib import Path

from ml.features.url_features import extract_url_features


# File paths
RAW_DATASET = Path("ml/datasets/raw/malicious_urls.csv")
OUTPUT_DATASET = Path("ml/datasets/processed/url_features.csv")


def prepare_dataset():

    print("Loading raw dataset...")

    df = pd.read_csv(RAW_DATASET)

    print(f"Loaded {len(df)} URLs")

    print("Extracting URL features...")

    features = df["url"].apply(extract_url_features)

    feature_df = pd.DataFrame(features.tolist())

    print("Combining features and labels...")

    processed_df = pd.concat(
        [
            feature_df,
            df[["label", "result"]]
        ],
        axis=1
    )

    OUTPUT_DATASET.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    processed_df.to_csv(
        OUTPUT_DATASET,
        index=False
    )

    print("\nDataset preparation completed!")

    print("Total records:", len(processed_df))
    print("Total features:", len(feature_df.columns))

    print("\nProcessed dataset shape:")
    print(processed_df.shape)

    print("\nFirst five records:")
    print(processed_df.head())

    print("\nSaved to:", OUTPUT_DATASET)


if __name__ == "__main__":
    prepare_dataset()
