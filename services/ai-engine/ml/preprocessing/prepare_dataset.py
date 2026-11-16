
import pandas as pd
from pathlib import Path

from ml.features.url_features import extract_url_features


RAW_DATASET = Path("ml/datasets/raw/malicious_urls.csv")
OUTPUT_DATASET = Path("ml/datasets/processed/url_features.csv")


def prepare_dataset():

    print("Loading raw dataset...")

    df = pd.read_csv(RAW_DATASET)

    print(f"Loaded {len(df)} URLs")

    print("Extracting URL features...")

    features = df["url"].apply(extract_url_features)
    feature_df = pd.DataFrame(features.tolist())

    print("Extracting domains...")

    domains = []

    for url in df["url"]:
        from urllib.parse import urlsplit

        url = str(url).strip()
        parsed = urlsplit(url if "://" in url else "//" + url)
        domains.append(parsed.hostname)

    print("Combining data...")

    processed_df = pd.concat(
        [
            df[["url"]].reset_index(drop=True),
            pd.Series(domains, name="domain"),
            feature_df.reset_index(drop=True),
            df[["label", "result"]].reset_index(drop=True)
        ],
        axis=1
    )

    OUTPUT_DATASET.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    processed_df.to_csv(OUTPUT_DATASET, index=False)

    print("\nDataset preparation completed!")
    print("Total records:", len(processed_df))
    print("Total columns:", len(processed_df.columns))
    print("Missing domains:", processed_df["domain"].isna().sum())
    print("Saved to:", OUTPUT_DATASET)


if __name__ == "__main__":
    prepare_dataset()
