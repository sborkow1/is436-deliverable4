import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { EightBall } from '../components/EightBall';

const stats = [
  { label: 'Games Played', value: '47' },
  { label: 'Win Rate', value: '63%' },
  { label: 'Best Streak', value: '8' },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(ellipse at 50% 30%, #0d2212 0%, #080f08 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background felt texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 30px,
            rgba(255,255,255,0.015) 30px, rgba(255,255,255,0.015) 31px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 30px,
            rgba(255,255,255,0.015) 30px, rgba(255,255,255,0.015) 31px
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Decorative 8-ball */}
      <div
        style={{
          position: 'absolute',
          bottom: '14%',
          right: '5%',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
      >
        <EightBall size={180} />
      </div>

      {/* Header */}
      <header
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            color: '#c9a84c',
            fontFamily: 'Georgia, serif',
            margin: 0,
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
            textShadow: '0 0 20px rgba(201,168,76,0.4)',
          }}
        >
          CueVision
        </h1>
        <button
          onClick={() => navigate('/')}
          style={{
            color: '#666',
            background: 'none',
            border: '1px solid #333',
            borderRadius: 8,
            padding: '0.35rem 0.85rem',
            cursor: 'pointer',
            fontSize: '0.82rem',
          }}
        >
          Log out
        </button>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <h2
            style={{
              color: 'white',
              margin: '0 0 0.5rem',
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            }}
          >
            Welcome back, Player!
          </h2>
          <p style={{ color: '#6a8a6a', fontSize: '0.92rem', margin: 0 }}>
            Table 5 is reserved for you. Choose your action below.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {stats.map(s => (
            <div
              key={s.label}
              style={{
                background: '#0c2010',
                border: '1px solid #1e3e1e',
                borderRadius: 14,
                padding: '1.25rem 1.75rem',
                textAlign: 'center',
                minWidth: 110,
              }}
            >
              <div
                style={{
                  color: '#c9a84c',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </div>
              <div style={{ color: '#5a7a5a', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            width: '100%',
            maxWidth: 480,
            background: '#0c2010',
            border: '1px solid #1e3e1e',
            borderRadius: 16,
            padding: '1.25rem 1.5rem',
          }}
        >
          <p
            style={{
              color: '#5a7a5a',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              margin: '0 0 1rem',
            }}
          >
            RECENT ACTIVITY
          </p>
          {[
            { label: 'Last game', value: 'Win vs Marcus J. — 23 min', date: 'Yesterday' },
            { label: 'Last week', value: '4 games played (3W / 1L)', date: '7 days ago' },
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div>
                <div style={{ color: '#ccc', fontSize: '0.88rem' }}>{item.value}</div>
                <div style={{ color: '#555', fontSize: '0.75rem' }}>{item.date}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Bottom action buttons */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        style={{
          padding: '1.25rem 1.5rem 2rem',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          display: 'flex',
          gap: '1rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate('/record')}
          style={{
            flex: 1,
            padding: '1.2rem',
            background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a42 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 'clamp(1rem, 3vw, 1.15rem)',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            boxShadow: '0 4px 20px rgba(26,92,46,0.5)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.transform = 'translateY(-2px)';
            (e.currentTarget).style.boxShadow = '0 8px 28px rgba(26,92,46,0.65)';
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.transform = 'translateY(0)';
            (e.currentTarget).style.boxShadow = '0 4px 20px rgba(26,92,46,0.5)';
          }}
        >
          🎱 Record
        </button>

        <button
          onClick={() => navigate('/retrieve')}
          style={{
            flex: 1,
            padding: '1.2rem',
            background: 'transparent',
            color: '#c9a84c',
            border: '2px solid #c9a84c',
            borderRadius: 14,
            fontSize: 'clamp(1rem, 3vw, 1.15rem)',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            boxShadow: '0 4px 16px rgba(201,168,76,0.12)',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.background = 'rgba(201,168,76,0.1)';
            (e.currentTarget).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.background = 'transparent';
            (e.currentTarget).style.transform = 'translateY(0)';
          }}
        >
          📼 Retrieve
        </button>
      </motion.footer>
    </div>
  );
}
