// Razorpay → this webhook (payment.captured / order.paid). Backup in case the browser closed after paying.
// Deploy with JWT verification OFF (Razorpay can't send a Supabase token); the signature check protects it.
import { admin, hmacHex, PRICE_PAISE, safeEqual, SEASON_END } from '../_shared/razorpay.ts';

Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('method', { status: 405 });
  const raw = await req.text();
  const sig = req.headers.get('x-razorpay-signature') ?? '';
  const expected = await hmacHex(Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!, raw);
  if (!safeEqual(expected, sig)) return new Response('bad signature', { status: 400 });

  const db = admin();
  const eventId = req.headers.get('x-razorpay-event-id') ?? '';
  if (eventId) {
    const { error } = await db.from('webhook_events').insert({ id: eventId });
    if (error) return new Response('duplicate', { status: 200 }); // already processed
  }

  const evt = JSON.parse(raw);
  const pay = evt?.payload?.payment?.entity;
  if ((evt.event === 'payment.captured' || evt.event === 'order.paid') && pay?.order_id && pay.amount === PRICE_PAISE) {
    const { error } = await db.rpc('grant_paper', { p_order: pay.order_id, p_payment: pay.id, p_amount: pay.amount, p_expires: SEASON_END });
    if (error) console.error(error);
  }
  return new Response('ok', { status: 200 });
});
