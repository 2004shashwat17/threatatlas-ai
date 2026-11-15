
from ml.features.url_features import extract_url_features


test_urls = [
    "https://www.google.com",
    "https://example.com/login?id=123",
    "http://192.168.1.1/admin",
    "example.com/path/file.php"
]

for url in test_urls:
    print("\nURL:", url)

    features = extract_url_features(url)

    for feature, value in features.items():
        print(f"{feature}: {value}")
