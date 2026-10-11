# Go-live checklist: logins and Razorpay

Site: https://gate-az.pages.dev (Cloudflare Pages, deploys from `main`) · Supabase project `ddrnwwbtlyayvgoloion`.
Do the steps in order. Anything marked **you** happens in a dashboard and can't be done from code.

## 0. After the overnight content update (you, about 10 minutes)

1. **Re-run the 4 SQL files** (section 1 below). They add progress sync, the one-open-order rule, the safer
   session check, view throttling and notes access. All are safe to re-run.
2. **Redeploy the order function** (it now shares one open order between tabs):
   `npx supabase functions deploy create-order --project-ref ddrnwwbtlyayvgoloion --use-api`
3. **Upload the new videos and notes** (secret key: Supabase → Settings → API Keys; never paste it anywhere else):
   PowerShell: `$env:SUPABASE_SERVICE_ROLE_KEY="..." ; python scripts/upload_videos.py`
   Until this runs, renamed topics fall back to their old video lists and notes stay "being written".
4. **Email template**: links no longer need `#/` (old ones still work). Use the template in section 3.
5. **Google Search Console** (optional, free): add `https://gate-az.pages.dev`, submit `/sitemap.xml`.

## 1. Database (you, 2 minutes)

Supabase → SQL Editor → paste each file → Run, in this order. All four are safe to re-run.

1. `supabase/schema.sql`
2. `supabase/payments.sql`
3. `supabase/content.sql`. **Required**: fixes paid videos failing for every buyer.
4. `supabase/notes.sql`. Creates the notes table and function. Notes content still has to be written.

Make yourself admin (once): `insert into public.admins select id from auth.users where email = 'YOUR_EMAIL';`

## 2. Deploy the payment functions (you, 1 command)

```
python scripts\setup_payments.py
```

It sets the Razorpay secrets, deploys `create-order`, `verify-payment` and `razorpay-webhook` (the webhook without JWT;
`supabase/config.toml` now enforces that too), and copies a new webhook secret to the clipboard.
Running it again makes a new webhook secret, so re-paste it into Razorpay every time.

## 3. Supabase Auth settings (you)

- **Authentication → URL Configuration**
  - Site URL: `https://gate-az.pages.dev`
  - Redirect URLs: `https://gate-az.pages.dev/**`, `http://localhost:5173/**`
- **Authentication → SMTP: blocker.** The built-in mailer only sends to your own team's addresses and about 2 emails per hour,
  so real students never get their code. Set up custom SMTP (Brevo or Resend free tier) on a domain you own, with SPF and DKIM
  verified, then raise the email rate limit.
- **Authentication → Email Templates.** Set both **Magic link** and **Confirm signup** to:

  ```html
  <p>Your GATE A–Z sign-in code: <strong>{{ .Token }}</strong></p>
  <p><a href="{{ .SiteURL }}/auth?token_hash={{ .TokenHash }}&type=email">Or tap here to sign in</a></p>
  ```
- **Reviewer account** for Razorpay: Authentication → Users → Add user, with a strong password and **Auto Confirm** ticked.
  Delete it after approval.
- Don't click "disable legacy API keys". The payment functions use the legacy service-role key.

## 4. Razorpay (you)

1. **Activation/KYC**: business details, PAN, bank account. Under Business website, give `https://gate-az.pages.dev` and the policy pages
   `/terms`, `/privacy`, `/refund`, `/delivery`, `/contact`. Answer "login required: yes" and give the reviewer account.
2. **Payment capture**: Automatic (the default).
3. **Webhook** (in the same mode as your keys, Test or Live):
   - URL: `https://ddrnwwbtlyayvgoloion.supabase.co/functions/v1/razorpay-webhook`
   - Secret: paste from the clipboard after step 2.
   - Events: `payment.captured`, `order.paid`, `refund.processed`.
4. After approval, switch to **Live**, generate keys, run `setup_payments.py` again with the `rzp_live_…` key, and add the
   webhook again in Live mode with the new secret.
5. Do one real ₹49 UPI payment. Check that the paper unlocks, that `/admin` shows the sale, and that the webhook shows 2xx in Razorpay.
   Refund it from the dashboard. Access is removed automatically, which also tests the refund path.

**Test-mode QR "technical issues" is expected.** A test QR can't be paid by a real UPI app. In test mode, pay with UPI ID
`success@razorpay` (if offered) or a Razorpay test card. Real QR and UPI work only with live keys.

## 5. Google sign-in (optional, hidden until set up)

1. In Google Cloud, create an OAuth client (Web).
   - JS origin: `https://gate-az.pages.dev`
   - Redirect URI: `https://ddrnwwbtlyayvgoloion.supabase.co/auth/v1/callback`
   - Publish the consent screen to production.
2. In Supabase → Providers → Google: enable it and paste the client ID and secret.
3. In Cloudflare Pages → Environment variables: set `VITE_GOOGLE_AUTH=on`, then redeploy.

## 6. Still open (needs owner info)

- Contact page: postal address and phone number. Razorpay reviewers usually expect both.
- Terms: city for legal jurisdiction.
- An "About us" page.
- Refunds page: timeline for returning duplicate charges (for example "5–7 working days").
- `SEASON_END` secret: set it once the official GATE 2027 dates are out. The default is 31 Mar 2027.
  Sales close automatically after this date.
