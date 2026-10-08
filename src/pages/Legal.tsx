import type { ReactNode } from 'react';
import { CONTACT_EMAIL } from '../lib/supabase';
import { PRICE_INR } from '../catalog';

const UPDATED = '7 October 2026';

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-read px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-mute">Last updated {UPDATED}</p>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-sub [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">{children}</div>
    </article>
  );
}

const Mail = () => <a className="text-brand underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export const TermsPage = () => (
  <Page title="Terms of use">
    <p>By creating an account or buying a paper on GATE A–Z ("we", "the platform") you agree to these terms.</p>
    <h2>What you buy</h2>
    <p>Each GATE paper (for example CS or EC) is sold separately for ₹{PRICE_INR}. A purchase gives one person access to that paper's sheet, video playlists and topic notes (added through the season) for the current exam season: from the date of purchase until 30 days after that year's GATE exam. A new edition is published for each GATE year.</p>
    <h2>One person, one login</h2>
    <ul>
      <li>An account is for a single person. Sharing your account or reselling access is not allowed.</li>
      <li>Only one active login is allowed at a time. Signing in on another device signs out the previous one.</li>
      <li>Accounts found sharing access may be suspended without refund.</li>
    </ul>
    <h2>Videos and content</h2>
    <p>Videos are third-party YouTube videos shown through YouTube's official player and remain the property of their creators. Syllabus structure follows the official GATE syllabus. We work hard on accuracy but cannot guarantee that all content is free of errors; please report mistakes to <Mail />.</p>
    <h2>Not affiliated</h2>
    <p>GATE A–Z is an independent platform and is not affiliated with IISc, the IITs or the GATE organising committee.</p>
    <h2>Payments, refunds and cancellations</h2>
    <p>Payments are processed by Razorpay. All purchases are final. See our <a className="text-brand underline" href="#/refund">Refund and cancellation policy</a>.</p>
    <h2>Changes and law</h2>
    <p>We may update these terms; the latest version is always on this page. These terms are governed by the laws of India.</p>
  </Page>
);

export const PrivacyPage = () => (
  <Page title="Privacy policy">
    <p>We collect only what we need to run the platform, in line with India's Digital Personal Data Protection Act, 2023.</p>
    <h2>What we collect</h2>
    <ul>
      <li>Your email address (from Google sign-in or the email code).</li>
      <li>Your purchases (paper, amount, Razorpay payment ID, date).</li>
      <li>Your study progress and basic usage events (pages and topics opened) to improve the product.</li>
      <li>A session identifier, used to enforce one active login.</li>
    </ul>
    <p>We never see or store your card, UPI or bank details; Razorpay handles payments.</p>
    <h2>Who processes it</h2>
    <p>Supabase (database and login), Razorpay (payments), Google (sign-in), and our hosting provider. We do not sell your data.</p>
    <h2>Your rights</h2>
    <p>You can ask us to show, correct or delete your data at any time by writing to <Mail />. Purchase records may be kept as required by law.</p>
  </Page>
);

export const RefundPage = () => (
  <Page title="Refund and cancellation policy">
    <p className="rounded-lg border border-line bg-surface p-4 text-ink">All purchases are final. <strong>We do not offer refunds or cancellations once a paper has been purchased.</strong></p>
    <p>Before buying, every paper shows its full subject list, part of its topics and a free sample topic in each subject, so you can judge it first.</p>
    <h2>Payment problems</h2>
    <ul>
      <li>If money was deducted but the paper did not unlock, it usually unlocks automatically within a few minutes.</li>
      <li>If you were charged twice for the same paper, the duplicate charge will be returned to your original payment method.</li>
    </ul>
    <p>For any payment issue, write to <Mail /> with your Razorpay payment ID.</p>
  </Page>
);

export const DeliveryPage = () => (
  <Page title="Shipping and delivery policy">
    <p>GATE A–Z sells digital access only. Nothing is shipped to a physical address.</p>
    <h2>When you get access</h2>
    <ul>
      <li>Your paper unlocks on your account right after the payment succeeds, usually within a few seconds.</li>
      <li>If it hasn't unlocked within 30 minutes of a successful payment, email <Mail /> with your Razorpay payment ID and we will unlock it within 24 hours.</li>
    </ul>
    <h2>How long access lasts</h2>
    <p>Access to a purchased paper lasts until 30 days after that year's GATE exam, as shown on the paper page before you buy.</p>
  </Page>
);

export const ContactPage = () => (
  <Page title="Contact">
    <p>GATE A–Z is run by Pithani Raghavendra, India.</p>
    <p>For support, payment issues or content corrections, email <Mail />. We usually reply within 24 hours.</p>
    <p>Include your registered email and, for payments, your Razorpay payment ID.</p>
  </Page>
);
