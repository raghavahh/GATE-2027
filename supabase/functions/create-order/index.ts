// POST { paper } with the user's Supabase token → creates a Razorpay order for ₹49.
// The amount is set here on the server; the browser never chooses the price.
import { admin, cors, EDITION, json, PAPERS, PRICE_PAISE, rzp, userFrom } from '../_shared/razorpay.ts';

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) });
  if (req.method !== 'POST') return json(req, { error: 'method' }, 405);
  try {
    const user = await userFrom(req);
    if (!user) return json(req, { error: 'Please sign in first.' }, 401);

    const { paper } = await req.json().catch(() => ({}));
    if (typeof paper !== 'string' || !PAPERS.has(paper)) return json(req, { error: 'This paper is not on sale yet.' }, 400);


    const db = admin();
    const { data: owned, error: ownErr } = await db.from('entitlements').select('id')
      .eq('user_id', user.id).eq('paper', paper).eq('edition', EDITION).gt('expires_at', new Date().toISOString()).maybeSingle();
    if (ownErr) throw ownErr;
    if (owned) return json(req, { error: 'You already own this paper.' }, 409);

    const reply = (orderId: string) =>
      json(req, { orderId, amount: PRICE_PAISE, currency: 'INR', keyId: Deno.env.get('RAZORPAY_KEY_ID'), email: user.email });
    const openOrder = () => db.from('orders').select('id')
      .eq('user_id', user.id).eq('paper', paper).eq('edition', EDITION).eq('status', 'created').maybeSingle();

    // One open order per person and paper (unique index), so repeated clicks or two tabs share it:
    // Razorpay accepts only one successful payment per order. Orders older than 30 minutes are retired first.
    await db.from('orders').update({ status: 'expired' })
      .eq('user_id', user.id).eq('paper', paper).eq('edition', EDITION).eq('status', 'created')
      .or(`created_at.lt.${new Date(Date.now() - 30 * 60_000).toISOString()},amount_paise.neq.${PRICE_PAISE}`);
    const { data: open } = await openOrder();
    if (open) return reply(open.id);

    const order = await rzp('/orders', {
      method: 'POST',
      body: JSON.stringify({ amount: PRICE_PAISE, currency: 'INR', receipt: `${paper}-${user.id.slice(0, 8)}-${Date.now()}`, notes: { user_id: user.id, paper, edition: EDITION } }),
    });
    const { error } = await db.from('orders').insert({ id: order.id, user_id: user.id, paper, edition: EDITION, amount_paise: PRICE_PAISE });
    if (error?.code === '23505') {
      // A parallel request created the open order first; use that one (this Razorpay order is never shown, so never paid).
      const { data: won } = await openOrder();
      if (won) return reply(won.id);
    }
    if (error) throw error;
    return reply(order.id);
  } catch (e) {
    console.error(e);
    return json(req, { error: 'Could not start payment. Try again.' }, 500);
  }
});
