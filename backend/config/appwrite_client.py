from appwrite.client import Client
from appwrite.services.databases import Databases
from .settings import settings

_client = None
_databases = None


def get_appwrite_client():
    """Create a fresh client instance to avoid threading issues"""
    client = Client()
    client.set_endpoint(settings.appwrite_endpoint)
    client.set_project(settings.appwrite_project_id)
    client.set_key(settings.appwrite_api_key)
    return client


def get_databases():
    """Create a fresh Databases instance with a new client to avoid threading issues"""
    return Databases(get_appwrite_client())