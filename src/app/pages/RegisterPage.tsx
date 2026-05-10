import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'form' | 'sms' | 'payment' | 'processing';

interface FormData {
  name: string;
  age: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface PaymentData {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  billingZip: string;
}

const TAKEN_USERNAMES = ['admin', 'john', 'sarah', 'demo', 'cuevision', 'player1'];

const PLAN_FEATURES = [
  'Unlimited game recording sessions',
  'Up to 15 days of cloud video storage',
  'Overhead table camera access',
  'SMS & email game alerts',
  'Stats tracking & win/loss history',
  'Cancel anytime',
];

/* ── Card number formatter: groups into XXXX XXXX XXXX XXXX ── */
function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/* ── Expiry formatter: MM/YY ── */
function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

/* ── Detect card brand from first digit ── */
function cardBrand(num: string): string {
  const d = num.replace(/\s/g, '');
  if (d.startsWith('4')) return 'VISA';
  if (['51','52','53','54','55'].some(p => d.startsWith(p))) return 'MC';
  if (d.startsWith('34') || d.startsWith('37')) return 'AMEX';
  if (d.startsWith('6011') || d.startsWith('65')) return 'DISC';
  return '';
}

export function RegisterPage() {
  const [step, setStep] = useState<Step>('form');
  const [smsOptIn, setSmsOptIn] = useState<boolean | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '', age: '', email: '', phone: '',
    username: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [payment, setPayment] = useState<PaymentData>({
    cardholderName: '', cardNumber: '', expiry: '', cvv: '', billingZip: '',
  });
  const [payErrors, setPayErrors] = useState<Partial<PaymentData>>({});
  const navigate = useNavigate();

  // Step 1: form validation
  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validateForm = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    const age = parseInt(form.age);
    if (!form.age || isNaN(age) || age < 1 || age > 120)
      e.age = 'Please enter a valid age';
    if (!form.email.includes('@') || !form.email.includes('.'))
      e.email = 'Please enter a valid email address';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) e.phone = 'Please enter a valid 10-digit phone number';
    if (form.username.trim().length < 3)
      e.username = 'Username must be at least 3 characters';
    else if (TAKEN_USERNAMES.includes(form.username.toLowerCase()))
      e.username = `"${form.username}" is already taken — please choose another`;
    if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) setStep('sms');
  };

  //step 2: SMS opt-in
  const handleSms = (opt: boolean) => {
    setSmsOptIn(opt);
    setStep('payment');
  };

  //step 3: payment validation
  const setPayField = (key: keyof PaymentData, value: string) =>
    setPayment(prev => ({ ...prev, [key]: value }));

  const validatePayment = (): boolean => {
    const e: Partial<PaymentData> = {};
    if (!payment.cardholderName.trim()) e.cardholderName = 'Name on card is required';
    const rawCard = payment.cardNumber.replace(/\s/g, '');
    if (rawCard.length < 13 || rawCard.length > 16)
      e.cardNumber = 'Please enter a valid card number';
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/))
      e.expiry = 'Use MM/YY format';
    else {
      const [mm, yy] = payment.expiry.split('/').map(Number);
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1, 1);
      if (mm < 1 || mm > 12 || expDate < now)
        e.expiry = 'Card appears to be expired';
    }
    if (payment.cvv.length < 3 || payment.cvv.length > 4)
      e.cvv = 'CVV must be 3–4 digits';
    if (!payment.billingZip.match(/^\d{5}(-\d{4})?$/))
      e.billingZip = 'Please enter a valid ZIP code';
    setPayErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep('processing');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  };

  // Shared styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.78rem 1rem',
    background: '#071408',
    border: '1px solid #2a4a20',
    borderRadius: 8,
    color: 'white',
    fontSize: '0.97rem',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const cardInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.78rem 1rem',
    background: '#07090f',
    border: '1px solid #1e2a40',
    borderRadius: 8,
    color: 'white',
    fontSize: '0.97rem',
    boxSizing: 'border-box',
    outline: 'none',
  };

  /* ── Step indicator ── */
  const steps = ['Account', 'Alerts', 'Subscribe'];
  const stepIndex = step === 'form' ? 0 : step === 'sms' ? 1 : 2;

  return (
    <div style={{ minHeight: '100vh', background: '#0a1208' }}>
      // Back nav
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: 16, left: 16,
          color: '#c9a84c', background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8,
          padding: '0.4rem 0.85rem', cursor: 'pointer',
          fontSize: '0.88rem', zIndex: 100, backdropFilter: 'blur(6px)',
        }}
      >
        ← CueVision
      </button>

      {/* Step progress */}
      {(step === 'sms' || step === 'payment' || step === 'processing') && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            padding: '0.75rem 1.5rem',
            background: 'rgba(10,18,8,0.9)', backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', zIndex: 90,
          }}
        >
          {steps.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: i <= stepIndex ? '#c9a84c' : '#1a2a1a',
                    border: `2px solid ${i <= stepIndex ? '#c9a84c' : '#2a4a20'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: i <= stepIndex ? '#0a0800' : '#4a6a4a',
                    fontSize: '0.72rem', fontWeight: 700,
                    transition: 'all 0.3s',
                  }}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: i <= stepIndex ? '#c9a84c' : '#4a6a4a',
                    fontWeight: i === stepIndex ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 32, height: 1,
                    background: i < stepIndex ? '#c9a84c' : '#2a4a20',
                    transition: 'background 0.3s',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ══════════════════ STEP 1: Registration form ══════════════════ */}
        {step === 'form' && (
          <motion.div
            key="form"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', padding: '5rem 1rem 3rem',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}
          >
            <motion.h1
              initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              style={{
                color: '#c9a84c', fontFamily: 'Georgia, serif',
                fontSize: 'clamp(2.2rem, 6vw, 4rem)', margin: '0 0 1.5rem',
                textAlign: 'center', textShadow: '0 0 30px rgba(201,168,76,0.4)',
              }}
            >
              Welcome!
            </motion.h1>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{
                width: '100%', maxWidth: 560, height: 200,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '2rem', flexShrink: 0, overflow: 'hidden',
              }}
            >
              <img
                src="/poolnewuser.jpg"
                alt="New players gathering around a pool table"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </motion.div>

            {/* Form card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                background: '#0c2010', border: '1px solid #2a4a20',
                borderRadius: 20, padding: '2rem', width: '100%',
                maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <h2 style={{
                color: 'white', textAlign: 'center', margin: '0 0 1.75rem',
                fontSize: '1.15rem', fontWeight: 500, letterSpacing: '0.02em',
              }}>
                Create Your Account
              </h2>

              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <Field label="Full Name" error={errors.name} style={{ flex: 2 }}>
                    <input type="text" value={form.name} onChange={set('name')}
                      placeholder="Your full name" style={inputStyle} />
                  </Field>
                  <Field label="Age" error={errors.age} style={{ flex: 1 }}>
                    <input type="number" value={form.age} onChange={set('age')}
                      placeholder="Age" min="1" max="120" style={inputStyle} />
                  </Field>
                </div>
                <Field label="Email Address" error={errors.email}>
                  <input type="email" value={form.email} onChange={set('email')}
                    placeholder="your@email.com" style={inputStyle} />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <input type="tel" value={form.phone} onChange={set('phone')}
                    placeholder="10-digit number" style={inputStyle} />
                </Field>
                <Field label="Username" error={errors.username}>
                  <input type="text" value={form.username} onChange={set('username')}
                    placeholder="Choose a unique username"
                    autoComplete="username" style={inputStyle} />
                </Field>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <Field label="Password" error={errors.password} style={{ flex: 1 }}>
                    <input type="password" value={form.password} onChange={set('password')}
                      placeholder="Min. 8 characters"
                      autoComplete="new-password" style={inputStyle} />
                  </Field>
                  <Field label="Confirm Password" error={errors.confirmPassword} style={{ flex: 1 }}>
                    <input type="password" value={form.confirmPassword}
                      onChange={set('confirmPassword')} placeholder="Re-enter password"
                      autoComplete="new-password" style={inputStyle} />
                  </Field>
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '0.9rem', marginTop: '0.5rem',
                  background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a42 100%)',
                  color: 'white', border: 'none', borderRadius: 10,
                  fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
                  letterSpacing: '0.04em', boxShadow: '0 4px 16px rgba(26,92,46,0.4)',
                }}>
                  Continue →
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════ STEP 2: SMS opt-in ══════════════════ */}
        {step === 'sms' && (
          <motion.div
            key="sms"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '5rem 1rem 2rem', background: '#0a1208',
            }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45 }}
          >
            <div style={{
              background: '#0c2010', border: '1px solid #2a4a20',
              borderRadius: 20, padding: '3rem 2.5rem', width: '100%',
              maxWidth: 420, textAlign: 'center',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>📱</div>
              <h2 style={{
                color: '#c9a84c', fontFamily: 'Georgia, serif',
                margin: '0 0 1rem', fontSize: '1.6rem',
              }}>
                Stay in the Know
              </h2>
              <p style={{ color: '#bbb', fontSize: '0.97rem', marginBottom: '2rem', lineHeight: 1.65 }}>
                Would you like to opt in to SMS messaging? We'll notify you when
                recordings are ready and alert you before they expire.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleSms(true)} style={{
                  flex: 1, padding: '1rem',
                  background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a42 100%)',
                  color: 'white', border: 'none', borderRadius: 10,
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(26,92,46,0.4)',
                }}>
                  ✅ Yes, sign me up!
                </button>
                <button onClick={() => handleSms(false)} style={{
                  flex: 1, padding: '1rem', background: 'transparent',
                  color: '#888', border: '1px solid #3a4a3a',
                  borderRadius: 10, fontSize: '1rem', cursor: 'pointer',
                }}>
                  No thanks
                </button>
              </div>
              <p style={{ color: '#444', fontSize: '0.75rem', marginTop: '1.5rem', lineHeight: 1.5 }}>
                Standard message & data rates may apply. You can opt out at any time.
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════════════════ STEP 3: Payment ══════════════════ */}
        {step === 'payment' && (
          <motion.div
            key="payment"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', padding: '5rem 1rem 3rem',
              background: '#070b12',
            }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45 }}
          >
            {/* Plan summary card */}
            <motion.div
              initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{
                width: '100%', maxWidth: 520, marginBottom: '1.25rem',
                background: 'linear-gradient(135deg, #0d1a2e 0%, #0a1520 100%)',
                border: '1px solid rgba(201,168,76,0.35)',
                borderRadius: 20, padding: '1.75rem 2rem',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(201,168,76,0.06)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>🎱</span>
                    <span style={{
                      color: '#c9a84c', fontFamily: 'Georgia, serif',
                      fontSize: '1.3rem', fontWeight: 700,
                    }}>
                      CueVision Pro
                    </span>
                  </div>
                  <p style={{ color: '#6a8aaa', fontSize: '0.82rem', margin: 0 }}>
                    Monthly subscription · Billed every 30 days
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: 'white', fontSize: '2rem', fontWeight: 800, lineHeight: 1,
                  }}>
                    $10
                  </div>
                  <div style={{ color: '#5a7a9a', fontSize: '0.78rem' }}>/month</div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', marginBottom: '1.1rem' }} />

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
                {PLAN_FEATURES.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ color: '#4ade80', fontSize: '0.75rem', marginTop: '0.1rem', flexShrink: 0 }}>✓</span>
                    <span style={{ color: '#9ab0c0', fontSize: '0.78rem', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Trial badge */}
              <div style={{
                marginTop: '1.1rem',
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: 8, padding: '0.6rem 0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ fontSize: '0.9rem' }}>🎉</span>
                <span style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 600 }}>
                  First month free · No charge today
                </span>
              </div>
            </motion.div>

            {/* Payment form card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                background: '#0a0f1a', border: '1px solid #1e2a40',
                borderRadius: 20, padding: '2rem', width: '100%',
                maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Heading + security badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                  Payment Details
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem' }}>🔒</span>
                  <span style={{ color: '#4a6a8a', fontSize: '0.75rem' }}>SSL Secured</span>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                {/* Cardholder name */}
                <PayField label="Name on Card" error={payErrors.cardholderName}>
                  <input
                    type="text"
                    value={payment.cardholderName}
                    onChange={e => setPayField('cardholderName', e.target.value)}
                    placeholder="Full name as it appears on card"
                    autoComplete="cc-name"
                    style={cardInputStyle}
                  />
                </PayField>

                {/* Card number */}
                <PayField label="Card Number" error={payErrors.cardNumber}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={payment.cardNumber}
                      onChange={e => setPayField('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      maxLength={19}
                      style={{ ...cardInputStyle, paddingRight: '4rem', letterSpacing: '0.12em' }}
                    />
                    {/* Card brand badge */}
                    <div style={{
                      position: 'absolute', right: '0.85rem', top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#c9a84c', fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}>
                      {cardBrand(payment.cardNumber) || (
                        <span style={{ display: 'flex', gap: '0.3rem' }}>
                          {['💳'].map(i => <span key={i}>{i}</span>)}
                        </span>
                      )}
                    </div>
                  </div>
                </PayField>

                {/* Expiry + CVV + ZIP */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <PayField label="Expiry" error={payErrors.expiry} style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={payment.expiry}
                      onChange={e => setPayField('expiry', formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      maxLength={5}
                      style={cardInputStyle}
                    />
                  </PayField>
                  <PayField label="CVV" error={payErrors.cvv} style={{ flex: 1 }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        value={payment.cvv}
                        onChange={e => setPayField('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••"
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        maxLength={4}
                        style={cardInputStyle}
                      />
                    </div>
                  </PayField>
                  <PayField label="Billing ZIP" error={payErrors.billingZip} style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={payment.billingZip}
                      onChange={e => setPayField('billingZip', e.target.value.replace(/[^0-9-]/g, '').slice(0, 10))}
                      placeholder="00000"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      style={cardInputStyle}
                    />
                  </PayField>
                </div>

                {/* Accepted cards row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '1.5rem', flexWrap: 'wrap',
                }}>
                  <span style={{ color: '#3a4a5a', fontSize: '0.75rem' }}>Accepted:</span>
                  {[
                    { label: 'VISA', bg: '#1a3a8a', color: '#a0b8ff' },
                    { label: 'MC', bg: '#6a1a0a', color: '#ffb09a' },
                    { label: 'AMEX', bg: '#0a4a6a', color: '#90d0f0' },
                    { label: 'DISC', bg: '#4a3a0a', color: '#f0c060' },
                  ].map(c => (
                    <span key={c.label} style={{
                      padding: '0.2rem 0.55rem', borderRadius: 4,
                      background: c.bg, color: c.color,
                      fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.05em',
                    }}>
                      {c.label}
                    </span>
                  ))}
                </div>

                {/* Price summary */}
                <div style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  borderRadius: 10, padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#8a9aaa', fontSize: '0.85rem' }}>CueVision Pro (Month 1)</span>
                    <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#8a9aaa', fontSize: '0.85rem' }}>Starting Month 2</span>
                    <span style={{ color: '#ccc', fontSize: '0.85rem' }}>$10.00/mo</span>
                  </div>
                  <div style={{ height: 1, background: 'rgba(201,168,76,0.15)', margin: '0.6rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>Due today</span>
                    <span style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 800 }}>$0.00</span>
                  </div>
                </div>

                {/* Subscribe button */}
                <button type="submit" style={{
                  width: '100%', padding: '1rem',
                  background: 'linear-gradient(135deg, #c9a84c 0%, #e8c870 100%)',
                  color: '#060a04', border: 'none', borderRadius: 12,
                  fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
                }}>
                  🎱 Start Free · Subscribe at $10/mo
                </button>

                <p style={{
                  color: '#3a4a5a', fontSize: '0.72rem',
                  textAlign: 'center', marginTop: '0.9rem', lineHeight: 1.6,
                }}>
                  By subscribing you agree to our Terms of Service and Privacy Policy.
                  Cancel anytime from your account settings. Your card will not be charged
                  until after the free trial period ends.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* ══════════════════ STEP 4: Processing ══════════════════ */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem 1rem', background: '#070b12',
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
          >
            <div style={{
              background: '#0a0f1a', border: '1px solid #1e2a40',
              borderRadius: 24, padding: '3rem 2.5rem', width: '100%',
              maxWidth: 380, textAlign: 'center',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}>
              {/* Spinning ring */}
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1.75rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    border: '3px solid transparent',
                    borderTopColor: '#c9a84c',
                    borderRightColor: 'rgba(201,168,76,0.3)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 8,
                  borderRadius: '50%',
                  background: 'rgba(201,168,76,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem',
                }}>
                  💳
                </div>
              </div>

              <motion.p
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                style={{ color: '#c9a84c', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}
              >
                Processing Payment…
              </motion.p>
              <p style={{ color: '#5a7a9a', fontSize: '0.88rem', margin: 0 }}>
                Setting up your CueVision Pro account
              </p>

              {/* Progress steps */}
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left' }}>
                {[
                  { label: 'Verifying payment details', done: true },
                  { label: 'Activating subscription', done: true },
                  { label: 'Creating your player profile', done: false },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: s.done ? 'rgba(74,222,128,0.15)' : 'rgba(201,168,76,0.1)',
                      border: `1.5px solid ${s.done ? '#4ade80' : 'rgba(201,168,76,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', color: s.done ? '#4ade80' : '#c9a84c',
                    }}>
                      {s.done ? '✓' : '…'}
                    </div>
                    <span style={{ color: s.done ? '#7aaa7a' : '#5a6a7a', fontSize: '0.82rem' }}>
                      {s.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

/* ── Helper: registration field wrapper ── */
function Field({
  label, error, children, style,
}: {
  label: string; error?: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      <label style={{
        display: 'block', color: '#7aaa7a', fontSize: '0.78rem',
        letterSpacing: '0.05em', marginBottom: '0.35rem',
      }}>
        {label.toUpperCase()}
      </label>
      {children}
      {error && (
        <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0' }}>{error}</p>
      )}
    </div>
  );
}

/* ── Helper: payment field wrapper ── */
function PayField({
  label, error, children, style,
}: {
  label: string; error?: string; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: '1rem', ...style }}>
      <label style={{
        display: 'block', color: '#4a6a8a', fontSize: '0.78rem',
        letterSpacing: '0.05em', marginBottom: '0.35rem',
      }}>
        {label.toUpperCase()}
      </label>
      {children}
      {error && (
        <p style={{ color: '#f87171', fontSize: '0.78rem', margin: '0.3rem 0 0' }}>{error}</p>
      )}
    </div>
  );
}
