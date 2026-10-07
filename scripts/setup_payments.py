"""One-shot Razorpay setup: logs in to Supabase, stores the Razorpay keys as
server secrets, deploys the 3 payment functions and tells you what to paste into Razorpay.

Run yourself:             python scripts\\setup_payments.py
New webhook secret only:  python scripts\\setup_payments.py --webhook-only
Secrets are typed hidden or copied to the clipboard — never printed, never saved in this repo.
"""
import getpass, os, secrets, subprocess, sys, tempfile

REF = "ddrnwwbtlyayvgoloion"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(cmd):
    print(f"\n> {cmd}")
    if subprocess.run(cmd, shell=True, cwd=ROOT).returncode != 0:
        sys.exit(f"\nStopped: '{cmd}' failed. Copy the error above and send it.")


def set_secrets(pairs):
    fd, env_path = tempfile.mkstemp(suffix=".env")
    try:
        with os.fdopen(fd, "w") as f:
            f.write("".join(f"{k}={v}\n" for k, v in pairs.items()))
        run(f'npx --yes supabase secrets set --env-file "{env_path}" --project-ref {REF}')
    finally:
        os.remove(env_path)


def finish(webhook_secret):
    subprocess.run("clip", input=webhook_secret, text=True, shell=True)
    print(f"""
==============================================================
 DONE. In Razorpay, in the same mode as your keys (Live for rzp_live_):
 Account & Settings -> Webhooks -> Add New Webhook (or Edit the existing one)

   Webhook URL:    https://{REF}.supabase.co/functions/v1/razorpay-webhook
   Secret:         already COPIED - just press Ctrl+V in the Secret box
   Active events:  payment.captured  and  order.paid

 Save it. Don't paste the secret anywhere else (not in chat).
==============================================================
""")


if "--webhook-only" in sys.argv:
    secret = secrets.token_urlsafe(24)
    print("Saving a new webhook secret on Supabase")
    set_secrets({"RAZORPAY_WEBHOOK_SECRET": secret})
    finish(secret)
    sys.exit(0)

print("Step 1/4  Supabase login (a browser tab opens - click Authorize)")
run("npx --yes supabase login")

print("\nStep 2/4  Razorpay keys (Dashboard -> Account & Settings -> API Keys)")
key_id = input("Paste Key ID (rzp_live_... or rzp_test_...): ").strip()
if not key_id.startswith("rzp_"):
    sys.exit("That doesn't look like a Key ID - it starts with rzp_live_ or rzp_test_.")
key_secret = getpass.getpass("Paste Key Secret (hidden while typing, press Enter): ").strip()
if not key_secret:
    sys.exit("Key Secret is empty.")
webhook_secret = secrets.token_urlsafe(24)

print("\nStep 3/4  Saving secrets on Supabase")
set_secrets({"RAZORPAY_KEY_ID": key_id, "RAZORPAY_KEY_SECRET": key_secret, "RAZORPAY_WEBHOOK_SECRET": webhook_secret})

print("\nStep 4/4  Deploying payment functions")
run(f"npx --yes supabase functions deploy create-order --project-ref {REF} --use-api")
run(f"npx --yes supabase functions deploy verify-payment --project-ref {REF} --use-api")
run(f"npx --yes supabase functions deploy razorpay-webhook --project-ref {REF} --use-api --no-verify-jwt")

finish(webhook_secret)
