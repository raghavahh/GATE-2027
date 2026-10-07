// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature } after checkout succeeds.
// 1) checks the signature with the secret key, 2) re-reads the payment from Razorpay,
// 3) grants the paper once (idempotent).
import { admin, cors, hmacHex, json, PRICE_PAISE, rzp, safeEqual, SEASON_END, userFrom } from '../_shared/razorpay.ts';

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) });
  if (req.method !== 'POST') return json(req, { error: 'method' }, 405);
  try {
    const user = await userFrom(req);
    if (!user) return json(req, { error: 'Please sign in first.' }, 401);

    const b = await req.json().catch(() => ({}));
    const orderId = String(b.razorpay_order_id ?? ''), paymentId = String(b.razorpay_payment_id ?? ''), sig = String(b.razorpay_signature ?? '');
    if (!orderId || !paymentId || !sig) return json(req, { error: 'Missing payment details.' }, 400);

    const expected = await hmacHex(Deno.env.get('RAZORPAY_KEY_SECRET')!, `${orderId}|${paymentId}`);
    if (!safeEqual(expected, sig)) return json(req, { error: 'Payment could not be verified.' }, 400);

    const db = admin();
    const { data: order } = await db.from('orders').select('user_id').eq('id', orderId).maybeSingle();
    if (!order || order.user_id !== user.id) return json(req, { error: 'Order not found.' }, 404);

    const pay = await rzp(`/payments/${paymentId}`);
    if (pay.order_id !== orderId || pay.amount !== PRICE_PAISE || !['captured', 'authorized'].includes(pay.status)) {
      return json(req, { error: 'Payment not completed yet.' }, 402);
    }
    if (pay.status === 'authorized') {
      await rzp(`/payments/${paymentId}/capture`, { method: 'POST', body: JSON.stringify({ amount: PRICE_PAISE, currency: 'INR' }) });
    }

    const { data: ok, error } = await db.rpc('grant_paper', { p_order: orderId, p_payment: paymentId, p_amount: PRICE_PAISE, p_expires: SEASON_END });
    if (error || !ok) throw error ?? new Error('grant failed');
    return json(req, { ok: true });
  } catch (e) {
    console.error(e);
    return json(req, { error: 'If money was deducted, your paper will unlock automatically within a few minutes.' }, 500);
  }
});
