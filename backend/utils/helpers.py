import hashlib
import secrets


def generate_api_key() -> str:
    return f"sk_live_{secrets.token_hex(24)}"


def hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()