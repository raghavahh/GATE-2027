// POST { paper } with the user's Supabase token → creates a Razorpay order for ₹310.
// The amount is set here on the server; the browser never chooses the price.
import { admin, cors, EDITION, json, PAPERS, PRICE_PAISE, rzp, userFrom } from '../_shared/razorpay.ts';

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) });
  if (req.method !== 'POST') return json(req, { error: 'method' }, 405);
  try {
    const user = await userFrom(req);
    if (!user) return json(req, { error: 'Please sign in first.' }, 401);

    const { paper } = await req.json().catch(() => ({}));
    if (typeof paper !== 'string' || !PAPERS.has(paper)) return json(req, { error: 'Unknown paper.' }, 400);

    const db = admin();
    const { data: owned } = await db.from('entitlements').select('id')
      .eq('user_id', user.id).eq('paper', paper).eq('edition', EDITION).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (owned) return json(req, { error: 'You already own this paper.' }, 409);

    const order = await rzp('/orders', {
      method: 'POST',
      body: JSON.stringify({ amount: PRICE_PAISE, currency: 'INR', receipt: `${paper}-${user.id.slice(0, 8)}-${Date.now()}`, notes: { user_id: user.id, paper, edition: EDITION } }),
    });
    const { error } = await db.from('orders').insert({ id: order.id, user_id: user.id, paper, edition: EDITION, amount_paise: PRICE_PAISE });
    if (error) throw error;

    return json(req, { orderId: order.id, amount: PRICE_PAISE, currency: 'INR', keyId: Deno.env.get('RAZORPAY_KEY_ID'), email: user.email });
  } catch (e) {
    console.error(e);
    return json(req, { error: 'Could not start payment. Try again.' }, 500);
  }
});
