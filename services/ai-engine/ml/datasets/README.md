# THREATATLAS AI - Dataset Documentation

## Initial ML Project
Malware Distribution URL Classification

## Data Sources

### URLhaus
- Purpose: Malware distribution URL examples
- Label: 1
- Category: Malware distribution

### Tranco
- Purpose: Popular domain reference examples
- Label: 0
- Category: Popular domain reference
- Important: Not verified benign

## Dataset Structure

raw/
    Original downloaded datasets

processed/
    Cleaned and transformed datasets

external/
    External benchmark datasets

## Data Quality
- Preserve original source records.
- Record collection timestamps.
- Remove duplicate URLs.
- Track source provenance.
- Avoid train/test data leakage.