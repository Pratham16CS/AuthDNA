"""
Quick script to verify an API key against the AuthDNA backend.
Run from the backend directory:
  python check_key.py sk_live_xxxxxxxx
"""
import asyncio, sys, hashlib
sys.path.insert(0, '.')
from services.database_service import db_service

async def main():
    if len(sys.argv) < 2:
        print("Usage: python check_key.py <api_key>")
        return

    raw = sys.argv[1].strip()
    print(f"Key:  {raw[:16]}...  (len={len(raw)})")

    h = hashlib.sha256(raw.encode()).hexdigest()
    print(f"Hash: {h[:16]}...  (len={len(h)})")

    doc = await db_service.get_api_key(h)
    if not doc:
        print("\n❌ NOT FOUND in database — wrong key or it was regenerated")
        
        # List all stored key prefixes for comparison
        from config.settings import settings
        from appwrite.client import Client
        from appwrite.services.databases import Databases
        client = Client()
        client.set_endpoint(settings.appwrite_endpoint)
        client.set_project(settings.appwrite_project_id)
        client.set_key(settings.appwrite_api_key)
        db = Databases(client)
        try:
            result = db.list_documents(settings.appwrite_database_id, 'api_keys')
            print(f"\nStored keys in DB ({result['total']} total):")
            for d in result['documents']:
                print(f"  prefix={d.get('key_prefix','?')}  status={d.get('status')}  tenant={d.get('tenant_id','?')[:12]}")
        except Exception as e:
            print(f"Could not list keys: {e}")
    else:
        print(f"\n✅ Key found! prefix={doc.get('key_prefix')} status={doc.get('status')} tenant={doc.get('tenant_id','?')[:12]}")

asyncio.run(main())
