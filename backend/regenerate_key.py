"""
Re-generate a fresh API key for the 'acem ccorp' (or any) tenant.
Run from the backend directory: python regenerate_key.py
"""
import asyncio, secrets, hashlib, sys
sys.path.insert(0, '.')

TENANT_NAME = 'acem'  # change if needed

async def main():
    from config.settings import settings
    from appwrite.client import Client
    from appwrite.services.databases import Databases
    from appwrite.query import Query
    from appwrite.id import ID

    client = Client()
    client.set_endpoint(settings.appwrite_endpoint)
    client.set_project(settings.appwrite_project_id)
    client.set_key(settings.appwrite_api_key)
    db = Databases(client)

    # Find the tenant
    result = db.list_documents(settings.appwrite_database_id, 'tenants')
    matches = [d for d in result['documents']
               if TENANT_NAME in d.get('company_name', '').lower()
               or TENANT_NAME in d['$id'].lower()]

    if not matches:
        print(f"❌ No tenant found matching '{TENANT_NAME}'")
        print("Available:", [(d.get('company_name', '?'), d['$id'][:16]) for d in result['documents']])
        return

    tenant = matches[0]
    tid = tenant['$id']
    company = tenant.get('company_name', tid)
    print(f"✅ Tenant: {company} (id: {tid[:16]}...)")

    # Revoke existing active keys
    existing = db.list_documents(settings.appwrite_database_id, 'api_keys',
                                  [Query.equal('tenant_id', tid)])
    for doc in existing.get('documents', []):
        db.update_document(settings.appwrite_database_id, 'api_keys', doc['$id'], {'status': 'revoked'})
    print(f"♻️  Revoked {existing.get('total', 0)} old key(s)")

    # Generate fresh key
    raw_key = f"sk_live_{secrets.token_hex(16)}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key_prefix = raw_key[:16]

    # _sid() logic from database_service.py: if len > 36 → md5
    import hashlib as hh
    did = hh.md5(key_hash.encode()).hexdigest()

    db.create_document(settings.appwrite_database_id, 'api_keys', did, {
        'tenant_id': tid,
        'key_prefix': key_prefix,
        'status': 'active',
        'tier': tenant.get('tier', 'free'),
        'created_at': '',
        'last_used': '',
    })
    print("✅ New key stored in database\n")

    print("=" * 60)
    print("YOUR NEW API KEY (copy the ENTIRE value below):")
    print(f"\n   {raw_key}\n")
    print("=" * 60)
    print(f"\nPaste this into company-demo/.env as:")
    print(f"   AUTHDNA_API_KEY={raw_key}")
    print(f"\nThen restart company-demo: node server.js")

asyncio.run(main())
