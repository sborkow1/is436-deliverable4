import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

const DESIGNATED_TABLE = 5; // demo: user's assigned table

export function RecordPage() {
  const [tableInput, setTableInput] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableInput, 10);

    if (isNaN(num) || num < 1 || num > 12) {
      setError('Incorrect: please put in your designated table number');
      return;
    }
    if (num !== DESIGNATED_TABLE) {
      setError('Incorrect: please put in your designated table number');
      return;
    }

    setError('');
    setShowSuccess(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% 30%, #0d2212 0%, #080f08 100%)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            color: '#c9a84c',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            padding: 0,
          }}
        >
          ← Back
        </button>
        <div style={{ width: 1, height: 20, background: '#2a4a20' }} />
        <h1
          style={{
            color: '#c9a84c',
            fontFamily: 'Georgia, serif',
            margin: 0,
            fontSize: '1.4rem',
          }}
        >
          Record a Game
        </h1>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: '#0c2010',
            border: '1px solid #2a4a20',
            borderRadius: 20,
            padding: '2.5rem',
            width: '100%',
            maxWidth: 440,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎱</div>
          <h2 style={{ color: 'white', margin: '0 0 0.6rem', fontSize: '1.5rem' }}>
            Select Your Table
          </h2>
          <p style={{ color: '#6a8a6a', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Enter your designated table number (1–12) to connect to the overhead
            camera and begin recording.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(200,40,40,0.15)',
                  border: '1px solid #8b2020',
                  borderRadius: 8,
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  color: '#f87171',
                  fontSize: '0.88rem',
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {/* Table diagram */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setTableInput(String(n));
                    setError('');
                  }}
                  style={{
                    padding: '0.65rem 0',
                    background:
                      tableInput === String(n)
                        ? 'linear-gradient(135deg, #1a5c2e, #2d7a42)'
                        : '#071408',
                    border: `1px solid ${tableInput === String(n) ? '#4ade80' : '#2a4a20'}`,
                    borderRadius: 8,
                    color: tableInput === String(n) ? 'white' : '#5a8a5a',
                    fontSize: '0.95rem',
                    fontWeight: tableInput === String(n) ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <input
                type="number"
                value={tableInput}
                onChange={e => {
                  setTableInput(e.target.value);
                  setError('');
                }}
                placeholder="Or type table # here"
                min="1"
                max="12"
                style={{
                  flex: 1,
                  padding: '0.85rem 1rem',
                  background: '#071408',
                  border: '1px solid #2a4a20',
                  borderRadius: 8,
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.95rem',
                background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a42 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 16px rgba(26,92,46,0.4)',
              }}
            >
              Connect to Table
            </button>
          </form>

          <p style={{ color: '#3a5a3a', fontSize: '0.78rem', marginTop: '1.25rem' }}>
            Demo: Your designated table is Table {DESIGNATED_TABLE}
          </p>
        </motion.div>
      </main>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{
                background: '#0c2010',
                border: '2px solid #4ade80',
                borderRadius: 20,
                padding: '2.5rem',
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 0 60px rgba(74,222,128,0.25)',
              }}
            >
              {/* Pulsing dot */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  style={{
                    position: 'absolute',
                    inset: -8,
                    borderRadius: '50%',
                    background: '#4ade80',
                    opacity: 0.3,
                  }}
                />
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(74,222,128,0.15)',
                    border: '2px solid #4ade80',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                  }}
                >
                  ✅
                </div>
              </div>

              <h2
                style={{
                  color: '#4ade80',
                  margin: '0 0 0.75rem',
                  fontSize: '1.35rem',
                }}
              >
                Connected!
              </h2>
              <p
                style={{
                  color: '#ccc',
                  fontSize: '1.05rem',
                  margin: '0 0 0.5rem',
                  lineHeight: 1.6,
                }}
              >
                Connected to your table's camera: Have fun!
              </p>
              <p style={{ color: '#5a8a5a', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Table {DESIGNATED_TABLE} camera is now active and recording.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setTableInput('');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'transparent',
                    color: '#888',
                    border: '1px solid #444',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                  }}
                >
                  Stay Here
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'linear-gradient(135deg, #1a5c2e, #2d7a42)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
