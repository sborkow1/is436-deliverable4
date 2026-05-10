import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface GameRecord {
  id: number;
  date: Date;
  opponent: string;
  result: 'Win' | 'Loss';
  table: number;
  duration: string;
  daysAgo: number;
}

const NOW = Date.now();
const DAY = 86400000;

const GAMES: GameRecord[] = [
  { id: 1, date: new Date(NOW - 1 * DAY), opponent: 'Marcus J.', result: 'Win', table: 4, duration: '23 min', daysAgo: 1 },
  { id: 2, date: new Date(NOW - 3 * DAY), opponent: 'Sarah K.', result: 'Loss', table: 7, duration: '31 min', daysAgo: 3 },
  { id: 3, date: new Date(NOW - 5 * DAY), opponent: 'Devon R.', result: 'Win', table: 2, duration: '18 min', daysAgo: 5 },
  { id: 4, date: new Date(NOW - 8 * DAY), opponent: 'Tia M.', result: 'Win', table: 9, duration: '27 min', daysAgo: 8 },
  { id: 5, date: new Date(NOW - 10 * DAY), opponent: 'Carlos B.', result: 'Loss', table: 3, duration: '42 min', daysAgo: 10 },
  { id: 6, date: new Date(NOW - 12 * DAY), opponent: 'Jordan L.', result: 'Win', table: 6, duration: '35 min', daysAgo: 12 },
  { id: 7, date: new Date(NOW - 13 * DAY), opponent: 'Alex W.', result: 'Win', table: 11, duration: '28 min', daysAgo: 13 },
];

export function RetrievePage() {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameRecord | null>(null);
  const navigate = useNavigate();

  const atRisk = GAMES.filter(g => g.daysAgo >= 10 && g.daysAgo <= 13);
  const showWarning = !warningDismissed && atRisk.length > 0;

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const daysLeft = (g: GameRecord) => 15 - g.daysAgo;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% 20%, #0d2212 0%, #080f08 100%)',
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
          Game Recordings
        </h1>
        <span
          style={{
            marginLeft: 'auto',
            background: '#1a3a1a',
            color: '#5a8a5a',
            border: '1px solid #2a4a20',
            borderRadius: 20,
            padding: '0.2rem 0.75rem',
            fontSize: '0.78rem',
          }}
        >
          Past 2 weeks
        </span>
      </header>

      {/* Game list */}
      <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem 1rem' }}>
        <p
          style={{
            color: '#4a6a4a',
            fontSize: '0.8rem',
            textAlign: 'center',
            marginBottom: '1.25rem',
            letterSpacing: '0.04em',
          }}
        >
          {GAMES.length} RECORDINGS FOUND · TAP TO WATCH
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {GAMES.map((game, i) => {
            const isAtRisk = game.daysAgo >= 10;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                onClick={() => setSelectedGame(game)}
                style={{
                  background: isAtRisk ? 'rgba(42,26,8,0.9)' : '#0c2010',
                  border: `1px solid ${isAtRisk ? 'rgba(201,140,40,0.5)' : '#1e3e1e'}`,
                  borderRadius: 14,
                  padding: '1.1rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.18s',
                  boxShadow: isAtRisk ? '0 0 12px rgba(201,140,40,0.1)' : 'none',
                }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginBottom: '0.35rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.18rem 0.55rem',
                        borderRadius: 5,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        background:
                          game.result === 'Win'
                            ? 'rgba(74,222,128,0.15)'
                            : 'rgba(248,113,113,0.15)',
                        color: game.result === 'Win' ? '#4ade80' : '#f87171',
                        border: `1px solid ${game.result === 'Win' ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
                      }}
                    >
                      {game.result}
                    </span>
                    <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: 500 }}>
                      vs {game.opponent}
                    </span>
                  </div>
                  <div style={{ color: '#5a7a5a', fontSize: '0.82rem' }}>
                    {fmt(game.date)} · Table {game.table} · {game.duration}
                  </div>
                  {isAtRisk && (
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '0.78rem',
                        marginTop: '0.35rem',
                        fontWeight: 600,
                      }}
                    >
                      ⚠️ Deletes in {daysLeft(game)} day{daysLeft(game) !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c9a84c',
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    marginLeft: '1rem',
                  }}
                >
                  ▶
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ── Warning overlay ── */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{
                background: '#1a1200',
                border: '2px solid #c9a84c',
                borderRadius: 20,
                padding: '2.25rem',
                maxWidth: 460,
                width: '100%',
                boxShadow: '0 0 60px rgba(201,168,76,0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ fontSize: '2rem' }}>⚠️</span>
                <h2 style={{ color: '#f59e0b', margin: 0, fontSize: '1.2rem' }}>
                  Recording Deletion Warning
                </h2>
              </div>

              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                The following recordings are approaching their 15-day deletion window:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {atRisk.map(g => (
                  <div
                    key={g.id}
                    style={{
                      background: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      borderRadius: 8,
                      padding: '0.65rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ color: '#ddd', fontSize: '0.88rem', fontWeight: 500 }}>
                        vs {g.opponent}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.78rem' }}>{fmt(g.date)}</div>
                    </div>
                    <div
                      style={{
                        color: '#f59e0b',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textAlign: 'right',
                      }}
                    >
                      {daysLeft(g)} day{daysLeft(g) !== 1 ? 's' : ''} left
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  borderRadius: 8,
                  padding: '0.85rem 1rem',
                  marginBottom: '1.75rem',
                }}
              >
                <p style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>
                  WARNING: Your games will be deleted in as few as{' '}
                  {Math.min(...atRisk.map(daysLeft))} day{Math.min(...atRisk.map(daysLeft)) !== 1 ? 's' : ''}!
                  Download or save them before they're gone.
                </p>
              </div>

              <button
                onClick={() => setWarningDismissed(true)}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  background: 'linear-gradient(135deg, #c9a84c, #e8c870)',
                  color: '#0a0800',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 16px rgba(201,168,76,0.35)',
                }}
              >
                Ok, Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Game viewer overlay ── */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 60,
              padding: '1.5rem',
            }}
            onClick={() => setSelectedGame(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#0c2010',
                border: '1px solid #2a4a20',
                borderRadius: 20,
                padding: '1.75rem',
                maxWidth: 560,
                width: '100%',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
              }}
            >
              {/* Title */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.35rem',
                  }}
                >
                  <h2 style={{ color: '#c9a84c', margin: 0, fontSize: '1.15rem', fontFamily: 'Georgia, serif' }}>
                    {fmt(selectedGame.date)} · vs {selectedGame.opponent}
                  </h2>
                  <button
                    onClick={() => setSelectedGame(null)}
                    style={{
                      color: '#666',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.3rem',
                      lineHeight: 1,
                      padding: '0 0.25rem',
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: 5,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background:
                        selectedGame.result === 'Win'
                          ? 'rgba(74,222,128,0.15)'
                          : 'rgba(248,113,113,0.15)',
                      color: selectedGame.result === 'Win' ? '#4ade80' : '#f87171',
                      border: `1px solid ${selectedGame.result === 'Win' ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`,
                    }}
                  >
                    {selectedGame.result}
                  </span>
                  <span style={{ color: '#5a8a5a', fontSize: '0.82rem' }}>
                    Table {selectedGame.table} · {selectedGame.duration}
                  </span>
                </div>
              </div>

              {/* Video placeholder */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: '#050d05',
                  borderRadius: 12,
                  border: '1px solid #1e3e1e',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Faux scanlines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(
                      0deg, transparent, transparent 2px,
                      rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px
                    )`,
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ fontSize: '3rem', marginBottom: '0.6rem', filter: 'grayscale(0.3)' }}>
                  📹
                </div>
                <p style={{ color: '#4a6a4a', fontSize: '0.88rem', margin: 0 }}>
                  [ Video Recording Placeholder ]
                </p>
                <p style={{ color: '#2a4a2a', fontSize: '0.78rem', marginTop: '0.35rem' }}>
                  Footage from Table {selectedGame.table} overhead camera
                </p>

                {/* Play button */}
                <div
                  style={{
                    marginTop: '1rem',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    border: '2px solid #c9a84c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c9a84c',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    background: 'rgba(201,168,76,0.08)',
                  }}
                >
                  ▶
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setSelectedGame(null)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'transparent',
                    color: '#888',
                    border: '1px solid #3a4a3a',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => alert('Download functionality coming soon!')}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    background: 'linear-gradient(135deg, #c9a84c, #e0ba64)',
                    color: '#0a0800',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  ⬇ Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
