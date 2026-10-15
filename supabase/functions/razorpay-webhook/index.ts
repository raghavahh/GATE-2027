// Razorpay → this webhook. Backup in case the browser closed after paying, plus refunds.
// Events to enable in Razorpay: payment.captured, order.paid, refund.processed.
// Deploy with JWT verification OFF (Razorpay can't send a Supabase token); the signature check protects it.
import { admin, hmacHex, PRICE_PAISE, safeEqual, accessUntil } from '../_shared/razorpay.ts';

Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('method', { status: 405 });
  const raw = await req.text();
  const sig = req.headers.get('x-razorpay-signature') ?? '';
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
  if (!secret) { console.error('RAZORPAY_WEBHOOK_SECRET is not set'); return new Response('not configured', { status: 500 }); }
  if (!safeEqual(await hmacHex(secret, raw), sig)) return new Response('bad signature', { status: 400 });

  const db = admin();
  const eventId = req.headers.get('x-razorpay-event-id') ?? '';
  if (eventId) {
    const { data: seen } = await db.from('webhook_events').select('id').eq('id', eventId).maybeSingle();
    if (seen) return new Response('duplicate', { status: 200 }); // already processed
  }

  const evt = JSON.parse(raw);
  const pay = evt?.payload?.payment?.entity;
  try {
    if ((evt.event === 'payment.captured' || evt.event === 'order.paid') && pay?.order_id && pay.amount !== PRICE_PAISE) {
      // Money taken for an unexpected amount (e.g. an old price): never silent, so it can be granted or refunded by hand.
      console.error('PAID BUT NOT GRANTED: amount mismatch', { event: evt.event, order_id: pay.order_id, payment_id: pay.id, amount: pay.amount });
    } else if ((evt.event === 'payment.captured' || evt.event === 'order.paid') && pay?.order_id) {
      const { data, error } = await db.rpc('grant_paper', { p_order: pay.order_id, p_payment: pay.id, p_amount: pay.amount, p_expires: accessUntil() });
      if (error) throw error;
      if (data === false) console.error('PAID BUT NOT GRANTED: order not found or refunded', { event: evt.event, order_id: pay.order_id, payment_id: pay.id });
    } else if (evt.event === 'refund.processed' && pay?.id && pay.amount_refunded >= pay.amount) {
      // Fully refunded: take the paper back.
      const { error } = await db.from('entitlements').delete().eq('payment_id', pay.id);
      if (error) throw error;
      await db.from('orders').update({ status: 'refunded' }).eq('payment_id', pay.id);
    }
  } catch (e) {
    // Not recorded as processed, so Razorpay's automatic retry gets another chance.
    console.error(evt.event, e);
    return new Response('retry', { status: 500 });
  }

  if (eventId) await db.from('webhook_events').insert({ id: eventId });
  return new Response('ok', { status: 200 });
});
