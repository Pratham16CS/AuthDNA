import asyncio, sys
sys.path.insert(0, '.')
from config.appwrite_client import get_databases
from appwrite.query import Query
from config.settings import settings

def check():
    print("=== Checking api_keys collection ===")
    db = get_databases()
    try:
        result = db.list_documents(settings.appwrite_database_id, "api_keys", [Query.limit(10)])
        docs = result.get("documents", [])
        print(f"Found {len(docs)} API key(s) in Appwrite")
        for d in docs:
            print(f"  key_prefix={d.get('key_prefix')}  status={d.get('status')}  tenant={d.get('tenant_id')}  doc_id={d['$id']}")
    except Exception as e:
        print(f"ERROR listing api_keys: {e}")

    print()
    print("=== Checking tenants collection ===")
    try:
        result = db.list_documents(settings.appwrite_database_id, "tenants", [Query.limit(10)])
        docs = result.get("documents", [])
        print(f"Found {len(docs)} tenant(s) in Appwrite")
        for d in docs:
            print(f"  company={d.get('company_name')}  active={d.get('is_active')}  doc_id={d['$id']}")
    except Exception as e:
        print(f"ERROR listing tenants: {e}")

check()
