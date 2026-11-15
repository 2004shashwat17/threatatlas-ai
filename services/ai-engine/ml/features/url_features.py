
import re
import ipaddress
from urllib.parse import urlsplit


def extract_url_features(url: str) -> dict:
    """
    Extract lexical features from a URL.
    Does not visit or access the URL.
    """

    url = str(url).strip()

    parsed_url = urlsplit(
        url if "://" in url else "//" + url
    )

    hostname = parsed_url.hostname or ""
    path = parsed_url.path or ""
    query = parsed_url.query or ""

    try:
        ipaddress.ip_address(hostname)
        has_ip = 1
    except ValueError:
        has_ip = 0

    features = {
        "url_length": len(url),
        "hostname_length": len(hostname),
        "path_length": len(path),
        "query_length": len(query),

        "count_dots": url.count("."),
        "count_hyphens": url.count("-"),
        "count_underscores": url.count("_"),
        "count_slashes": url.count("/"),
        "count_digits": sum(c.isdigit() for c in url),
        "count_letters": sum(c.isalpha() for c in url),

        "count_special_chars": len(
            re.findall(r"[^a-zA-Z0-9]", url)
        ),

        "has_https": int(parsed_url.scheme.lower() == "https"),
        "has_ip": has_ip,
        "has_at_symbol": int("@" in url),
        "has_query": int(bool(query)),
        "has_fragment": int(bool(parsed_url.fragment)),
    }

    return features
