import time
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.exception import AppwriteException
from config.settings import settings

DB = settings.appwrite_database_id

def run():
    c = Client(); c.set_endpoint(settings.appwrite_endpoint); c.set_project(settings.appwrite_project_id); c.set_key(settings.appwrite_api_key)
    db = Databases(c)
    try: db.create(DB, "AuthDNA Database"); print("✅ DB created")
    except AppwriteException: print("ℹ️ DB exists")
    
    def col(cid, name):
        try: db.create_collection(DB, cid, name, document_security=False); print(f"  ✅ {cid}")
        except AppwriteException: print(f"  ℹ️ {cid} exists")
    def s(col_id, key, size, req=False):
        try: db.create_string_attribute(DB, col_id, key, size, req)
        except: pass
    def i(col_id, key, req=False):
        try: db.create_integer_attribute(DB, col_id, key, req)
        except: pass
    def f(col_id, key, req=False):
        try: db.create_float_attribute(DB, col_id, key, req)
        except: pass
    def b(col_id, key, req=False):
        try: db.create_boolean_attribute(DB, col_id, key, req)
        except: pass
    def idx(col_id, key, attrs):
        try: db.create_index(DB, col_id, key, "key", attrs)
        except: pass

    col("tenants","Tenants"); s("tenants","company_name",255,True); s("tenants","email",255,True)
    s("tenants","tier",20,True); i("tenants","total_api_calls"); s("tenants","webhook_url",500)
    b("tenants","is_active"); s("tenants","created_at",30)

    col("api_keys","API Keys"); s("api_keys","tenant_id",255,True); s("api_keys","tier",20,True)
    s("api_keys","status",20,True); s("api_keys","key_prefix",20); s("api_keys","last_used",30); s("api_keys","created_at",30)

    col("login_logs","Login Logs"); s("login_logs","tenant_id",255,True); s("login_logs","user_id",255,True)
    s("login_logs","ip",50); s("login_logs","device_fp",500); s("login_logs","country",100); s("login_logs","city",100)
    f("login_logs","score"); s("login_logs","decision",10); s("login_logs","explanation",1000); s("login_logs","resource",100)
    s("login_logs","risk_factors_json",5000); f("login_logs","dna_match"); b("login_logs","is_new_user")
    f("login_logs","processing_time_ms"); s("login_logs","request_id",50); s("login_logs","timestamp",30)

    col("dna_profiles","DNA Profiles"); s("dna_profiles","tenant_id",255,True); s("dna_profiles","user_id",255,True)
    s("dna_profiles","known_devices_json",2000); s("dna_profiles","known_countries_json",1000)
    s("dna_profiles","known_cities_json",2000); f("dna_profiles","avg_login_hour"); i("dna_profiles","login_count")
    i("dna_profiles","days_active"); s("dna_profiles","common_resources_json",1000); s("dna_profiles","last_login_ip",50)
    s("dna_profiles","last_login_country",100); s("dna_profiles","last_login_timestamp",30); s("dna_profiles","first_seen",30)
    s("dna_profiles","known_ips_json",2000); s("dna_profiles","login_hours_json",2000)
    f("dna_profiles","hour_min"); f("dna_profiles","hour_max"); s("dna_profiles","weekday_login_counts_json",1000)
    b("dna_profiles","typical_weekend"); i("dna_profiles","session_count_today"); s("dna_profiles","last_login_date",30)


    col("usage","Usage"); s("usage","tenant_id",255,True); s("usage","period",10,True); i("usage","total_calls")
    i("usage","allow_count"); i("usage","block_count"); i("usage","otp_count"); i("usage","stepup_count")
    f("usage","avg_latency_ms"); f("usage","avg_score")

    col("rate_tracking","Rate Tracking"); s("rate_tracking","tenant_id",255,True); s("rate_tracking","hour_key",20,True); i("rate_tracking","count")
    
    print("\nWaiting..."); time.sleep(3)
    idx("api_keys","idx_t",["tenant_id"]); idx("api_keys","idx_s",["status"])
    idx("login_logs","idx_t",["tenant_id"]); idx("dna_profiles","idx_t",["tenant_id"])
    idx("usage","idx_t",["tenant_id"]); idx("rate_tracking","idx_t",["tenant_id"])
    print("🎉 Done!")

if __name__ == "__main__": run()