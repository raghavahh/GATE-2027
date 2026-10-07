"""One-shot Razorpay setup: logs in to Supabase, stores the Razorpay keys as
server secrets, deploys the 3 payment functions and prints what to paste into Razorpay.

Run yourself:  python scripts\\setup_payments.py
Your Key Secret is typed hidden and goes straight to Supabase — it is never saved in this repo.
"""
import getpass, os, secrets, subprocess, sys, tempfile

REF = "ddrnwwbtlyayvgoloion"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(cmd):
    print(f"\n> {cmd}")
    if subprocess.run(cmd, shell=True, cwd=ROOT).returncode != 0:
        sys.exit(f"\nStopped: '{cmd}' failed. Copy the error above and send it.")


print("Step 1/4  Supabase login (a browser tab opens — click Authorize)")
run("npx --yes supabase login")

print("\nStep 2/4  Razorpay test keys (Dashboard → Test Mode → Account & Settings → API Keys)")
key_id = input("Paste Key ID (rzp_test_...): ").strip()
if not key_id.startswith("rzp_"):
    sys.exit("That doesn't look like a Key ID — it starts with rzp_test_ or rzp_live_.")
key_secret = getpass.getpass("Paste Key Secret (hidden while typing, press Enter): ").strip()
if not key_secret:
    sys.exit("Key Secret is empty.")
webhook_secret = secrets.token_urlsafe(24)

print("\nStep 3/4  Saving secrets on Supabase")
fd, env_path = tempfile.mkstemp(suffix=".env")
try:
    with os.fdopen(fd, "w") as f:
        f.write(f"RAZORPAY_KEY_ID={key_id}\nRAZORPAY_KEY_SECRET={key_secret}\nRAZORPAY_WEBHOOK_SECRET={webhook_secret}\n")
    run(f'npx --yes supabase secrets set --env-file "{env_path}" --project-ref {REF}')
finally:
    os.remove(env_path)

print("\nStep 4/4  Deploying payment functions")
run(f"npx --yes supabase functions deploy create-order --project-ref {REF} --use-api")
run(f"npx --yes supabase functions deploy verify-payment --project-ref {REF} --use-api")
run(f"npx --yes supabase functions deploy razorpay-webhook --project-ref {REF} --use-api --no-verify-jwt")

print(f"""
==============================================================
 DONE. Last thing — in Razorpay (Test Mode):
 Account & Settings → Webhooks → + Add New Webhook

   Webhook URL:    https://{REF}.supabase.co/functions/v1/razorpay-webhook
   Secret:         {webhook_secret}
   Active events:  tick  payment.captured  and  order.paid

 Click Create Webhook. Then tell Claude "payments done".
==============================================================
""")
