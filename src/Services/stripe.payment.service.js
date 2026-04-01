/**
 * Stripe Payment Service
 *
 * ⚠️  DEVELOPMENT / TESTING ONLY  ⚠️
 * The secret key is embedded here because no backend is available.
 * NEVER ship a secret key in a production app — move payment-intent
 * creation to your server before going live.
 */

const PUBLISHABLE_KEY =
  'pk_test_51TBsAk3Xqn2V4hcQEMxGbLC03XWdbOTeukHyy7dHQsZUp7QZNLZnj3JL9KirhbVdZBR3a5K5AnJPSL6l06SFY2LU00rfgs8qNw';

// ⚠️ MOVE THIS TO YOUR BACKEND BEFORE GOING LIVE
const SECRET_KEY =
  'REMOVED';

const BASE_URL = 'https://api.stripe.com/v1';

// ─── helpers ────────────────────────────────────────────────────────────────

const toFormBody = obj =>
  Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

const stripeRequest = async (endpoint, params, useSecretKey = false) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${useSecretKey ? SECRET_KEY : PUBLISHABLE_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: toFormBody(params),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Stripe request failed');
  }
  return data;
};

// ─── card formatting ────────────────────────────────────────────────────────

export const formatCardNumber = raw => {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

export const formatExpiry = raw => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
};

export const detectCardType = number => {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]|^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^6/.test(n)) return 'discover';
  return 'unknown';
};

export const validateCard = ({ number, expiry, cvc, name }) => {
  const digits = number.replace(/\s/g, '');
  if (digits.length < 13 || digits.length > 16) {
    return 'Invalid card number';
  }

  const parts = expiry.split('/');
  if (parts.length !== 2) return 'Invalid expiry (MM/YY)';
  const month = parseInt(parts[0], 10);
  const year = parseInt(`20${parts[1]}`, 10);
  const now = new Date();
  if (month < 1 || month > 12) return 'Invalid expiry month';
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return 'Card is expired';
  }

  const cvvLen = detectCardType(number) === 'amex' ? 4 : 3;
  if (cvc.length < cvvLen) return `CVC must be ${cvvLen} digits`;

  if (!name.trim()) return 'Cardholder name is required';

  return null; // valid
};

// ─── stripe API calls ───────────────────────────────────────────────────────

/**
 * Tokenize card details using the publishable key.
 * Returns a Stripe Token object.
 */
export const createCardToken = async ({ number, expiry, cvc, name }) => {
  const [expMonth, expYear] = expiry.split('/');
  return stripeRequest('/tokens', {
    'card[number]': number.replace(/\s/g, ''),
    'card[exp_month]': expMonth.trim(),
    'card[exp_year]': expYear.trim(),
    'card[cvc]': cvc,
    'card[name]': name,
  });
};

/**
 * Create a PaymentMethod using the publishable key.
 * Returns a Stripe PaymentMethod object.
 */
export const createPaymentMethod = async ({ number, expiry, cvc, name }) => {
  const [expMonth, expYear] = expiry.split('/');
  return stripeRequest('/payment_methods', {
    type: 'card',
    'card[number]': number.replace(/\s/g, ''),
    'card[exp_month]': expMonth.trim(),
    'card[exp_year]': expYear.trim(),
    'card[cvc]': cvc,
    'billing_details[name]': name,
  });
};

/**
 * Create a PaymentIntent.
 * ⚠️ Normally done on the server. Using secret key client-side for dev only.
 *
 * @param {number} amountInCents  e.g. 1999 for $19.99
 * @param {string} currency       e.g. 'usd'
 */
export const createPaymentIntent = async (amountInCents, currency = 'usd') => {
  return stripeRequest(
    '/payment_intents',
    {
      amount: String(amountInCents),
      currency,
      'payment_method_types[]': 'card',
    },
    true, // secret key
  );
};

/**
 * Attach a PaymentMethod to a PaymentIntent and confirm it.
 */
export const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  return stripeRequest(
    `/payment_intents/${paymentIntentId}/confirm`,
    { payment_method: paymentMethodId },
    true, // secret key
  );
};

/**
 * Full end-to-end payment flow.
 *
 * @param {object} cardDetails  { number, expiry, cvc, name }
 * @param {number} amountInCents
 * @param {string} currency
 * @returns {object} Confirmed PaymentIntent
 */
export const processPayment = async (cardDetails, amountInCents, currency = 'usd') => {
  const validationError = validateCard(cardDetails);
  if (validationError) throw new Error(validationError);

  const paymentMethod = await createPaymentMethod(cardDetails);
  const paymentIntent = await createPaymentIntent(amountInCents, currency);
  const confirmed = await confirmPaymentIntent(paymentIntent.id, paymentMethod.id);

  return confirmed;
};

const StripeService = {
  formatCardNumber,
  formatExpiry,
  detectCardType,
  validateCard,
  createCardToken,
  createPaymentMethod,
  createPaymentIntent,
  confirmPaymentIntent,
  processPayment,
};

export default StripeService;
