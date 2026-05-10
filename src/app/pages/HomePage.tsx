import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { EightBall } from '../components/EightBall';

/* ── Simple colored ball SVG ── */
function PoolBall({ color, size = 48 }: { color: string; size?: number }) {
  const gid = `pb${color.replace('#', '')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gid} cx="36%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.6)" />
          <stop offset="40%"  stopColor={color} />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#${gid})`} />
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
      <ellipse cx="32" cy="32" rx="15" ry="9" fill="rgba(255,255,255,0.25)" transform="rotate(-20 32 32)" />
    </svg>
  );
}

/*
  Balls should start in triangle formation before cue stick strikes them all outwards
  Cue stick should strike from the 8-ball's position, sending it straight at the camera
  Pool balls should zip past user POV
*/
const BALLS = [
  { id:1, color:'#f5c518', sl:47, st:50, ex:-80, ey:-120, delay:0.00, sz:52 },
  { id:2, color:'#1a4fc4', sl:53, st:49, ex: 90, ey:-110, delay:0.06, sz:52 },
  { id:3, color:'#d42020', sl:44, st:52, ex:-110,ey: -80, delay:0.10, sz:52 },
  { id:4, color:'#7020b0', sl:56, st:52, ex: 120,ey: -70, delay:0.04, sz:52 },
  { id:5, color:'#f07820', sl:50, st:54, ex: -30, ey: 120, delay:0.14, sz:52 },
  { id:6, color:'#1a8a30', sl:42, st:50, ex:-130, ey:-40, delay:0.08, sz:52 },
  { id:7, color:'#8b1c1c', sl:58, st:50, ex: 130,ey: -40, delay:0.12, sz:52 },
];

const POCKETS = [
  { l:8,  t:31, sz:30 },
  { l:92, t:31, sz:30 },
  { l:2,  t:60, sz:36 },
  { l:98, t:60, sz:36 },
  { l:8,  t:96, sz:38 },
  { l:92, t:96, sz:38 },
];

export function HomePage() {
  const [phase,         setPhase]         = useState<'intro' | 'home'>('intro');
  const [ballsClearing, setBallsClearing] = useState(false);
  const [cueStrike,     setCueStrike]     = useState(false);
  const [ballZoom,      setBallZoom]      = useState(false);
  const [shake,         setShake]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (phase !== 'intro') return;
    /*
      Timeline (should only be around 3.0 seconds total):
      0.25 s: colored balls start rolling into pockets / scattering
      1.20 s: cue strikes (camera shake, balls scatter)
      1.35 s: 8-ball charges at viewer from distance
      ~3.00s: done → home screen
    */
    const t = [
      setTimeout(() => setBallsClearing(true), 250),
      setTimeout(() => { setCueStrike(true); setShake(true); }, 1200),
      setTimeout(() => setShake(false),        1400),
      setTimeout(() => setBallZoom(true),      1350),
    ];
    return () => t.forEach(clearTimeout);
  }, [phase]);

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">

        {/* ideally would have it as a flat animation where user POV is on the table itself but that is proving to take too long */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            style={{ position: 'fixed', inset: 0 }}
            /* dramatic camera shake on cue strike */
            animate={shake ? { x: [0, -8, 12, -6, 4, 0], y: [0, 2, -3, 2, 0] } : { x: 0, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            exit={{ opacity: 0 }}
          >

            {/* top down view */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '30%',
              background: 'linear-gradient(to bottom, #050505 0%, #0a0a0a 70%, #0f130f 100%)',
              zIndex: 2,
            }} />

            {/* lighting */}
            {[30, 52, 74].map((x, i) => (
              <div key={i}>
                <div style={{
                  position: 'absolute', top: 0, left: `${x}%`,
                  transform: 'translateX(-50%)',
                  width: 56, height: 14,
                  background: 'linear-gradient(to bottom, #2a2a2a, #4a4a4a)',
                  borderRadius: '0 0 8px 8px',
                  zIndex: 3,
                }} />
                <div style={{
                  position: 'absolute', top: 0, left: `${x}%`,
                  transform: 'translateX(-50%)',
                  width: '30%', height: '50%',
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(255,235,160,0.14) 0%, transparent 70%)',
                  pointerEvents: 'none', zIndex: 2,
                }} />
              </div>
            ))}

            {/* rail */}
            <div style={{
              position: 'absolute',
              top: '29%', left: 0, right: 0,
              height: 26, zIndex: 8,
              background: 'linear-gradient(to bottom, #6a3010 0%, #3d1a07 55%, #220e04 100%)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.95)',
            }}>
              {/* Rail inlay strip */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: '#9a7020',
              }} />
            </div>

            {/* ─── left side rail ─── */}
            <div style={{
              position: 'absolute',
              top: '29%', left: 0, bottom: 0,
              width: '5%', zIndex: 7,
              background: 'linear-gradient(to right, #220e04 0%, #3d1a07 80%, #4a2008 100%)',
              boxShadow: 'inset -6px 0 16px rgba(0,0,0,0.6)',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: 3,
                background: '#8a6015',
              }} />
            </div>

            {/* ─── right side rail ─── */}
            <div style={{
              position: 'absolute',
              top: '29%', right: 0, bottom: 0,
              width: '5%', zIndex: 7,
              background: 'linear-gradient(to left, #220e04 0%, #3d1a07 80%, #4a2008 100%)',
              boxShadow: 'inset 6px 0 16px rgba(0,0,0,0.6)',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
                background: '#8a6015',
              }} />
            </div>

            {/* the table*/}
            {/* Darker near the far rail (distance), brighter near the viewer */}
            <div style={{
              position: 'absolute',
              top: '31%', left: '5%', right: '5%', bottom: 0,
              zIndex: 1,
              background: `linear-gradient(
                to bottom,
                #0c3418 0%,
                #114422 12%,
                #165228 28%,
                #1a6030 50%,
                #1e6c35 72%,
                #226838 100%
              )`,
            }}>
              {/* Felt direction lines */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `repeating-linear-gradient(
                  87deg,
                  transparent, transparent 20px,
                  rgba(0,0,0,0.045) 20px, rgba(0,0,0,0.045) 21px
                )`,
              }} />
            </div>

            {/* ─── POCKET HOLES ─── */}
            {POCKETS.map((p, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${p.l}%`, top: `${p.t}%`,
                width: p.sz, height: p.sz,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #000 50%, #120802 100%)',
                border: `${i < 2 ? 2 : 3}px solid #4a2808`,
                transform: 'translate(-50%, -50%)',
                boxShadow: 'inset 0 0 16px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)',
                zIndex: 6,
              }} />
            ))}

            {/* balls rolling towards the pockets */}
            {BALLS.map(ball => (
              <motion.div
                key={ball.id}
                style={{
                  position: 'absolute',
                  left: `${ball.sl}%`,
                  top:  `${ball.st}%`,
                  /* center the SVG on the anchor point */
                  transform: 'translate(-50%, -50%)',
                  zIndex: 15,
                  filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.85))',
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
                /*when ballsClearing is true, ex/ey should be used for POV scatter and scale-up should be added for depth*/
                animate={ballsClearing ? {
                  x: `${ball.ex}vw`,
                  y: `${ball.ey}vh`,
                  scale: ball.ey > 0 ? 2.8 : 0.05,  // balls coming AT camera get big
                  opacity: 0,
                  rotate: 600,
                } : { x:0, y:0, scale:1, opacity:1, rotate:0 }}
                transition={{
                  delay: ballsClearing ? ball.delay : 0,
                  duration: 0.55,
                  ease: [0.2, 0, 1, 0.6],
    }}
              >
                <PoolBall color={ball.color} size={ball.sz} />
              </motion.div>
            ))}

            {/* charging 8 ball once animation is over */}
            <motion.div
              style={{
                position: 'absolute',
                top:  '15%',   /* starts far away on the table */
                left: '50%',
                marginLeft: -90,
                marginTop:  -90,
                zIndex: 20,
                filter: 'drop-shadow(0 10px 32px rgba(0,0,0,1))',
              }}
              initial={{ scale: 0.08, y: 0, rotate: 0, opacity: 1 }}
              animate={ballZoom
                ? { scale: 38, y: '35vh', rotate: 900, opacity: 0.8 }
                : { scale: 0.08, y: 0, rotate: 0, opacity: 1 }}
              transition={ballZoom ? {
                duration: 1.50,
                ease: [0.10, 0, 0.90, 1],   /* very fast acceleration */
              } : { duration: 0 }}
              onAnimationComplete={() => {
                if (ballZoom) setPhase('home');
              }}
            >
              <EightBall size={180} />
            </motion.div>

            {/* impact flash (maybe add a sound effect?) */}
            <AnimatePresence>
              {cueStrike && !ballZoom && (
                <motion.div
                  key="flash"
                  initial={{ opacity: 1, scale: 0.15 }}
                  animate={{ opacity: 0, scale: 3.5 }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top:  '48%', left: '50%',
                    width: 100, height: 100,
                    marginLeft: -50, marginTop: -50,
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(255,255,220,1) 0%, rgba(255,210,80,0.65) 40%, transparent 70%)',
                    zIndex: 30,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* home screen */}
        {phase === 'home' && (
          <motion.div
            key="home"
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              background: 'radial-gradient(ellipse at 50% 40%, #0d2410 0%, #080f08 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1 }}
          >
            {/* Decorative balls */}
            <div style={{ position: 'absolute', top: '8%', right: '6%', opacity: 0.18 }}>
              <EightBall size={120} />
            </div>
            <div style={{ position: 'absolute', bottom: '10%', left: '4%', opacity: 0.12 }}>
              <EightBall size={90} />
            </div>

            {/* Felt texture */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `
                repeating-linear-gradient(0deg,  transparent, transparent 28px, rgba(255,255,255,0.018) 28px, rgba(255,255,255,0.018) 29px),
                repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(255,255,255,0.018) 28px, rgba(255,255,255,0.018) 29px)
              `,
            }} />

            {/* Logo */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.9, ease: 'easeOut' }}
              style={{ textAlign: 'center' }}
            >
              <h1 style={{
                color: '#c9a84c',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(3rem, 9vw, 6.5rem)',
                textShadow: '0 0 40px rgba(201,168,76,0.55), 0 0 80px rgba(201,168,76,0.25), 0 2px 6px rgba(0,0,0,0.8)',
                letterSpacing: '0.06em',
                margin: 0, lineHeight: 1.1,
              }}>
                CueVision
              </h1>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                width: 'clamp(160px, 40vw, 320px)', height: 1,
                background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
                margin: '1.5rem auto',
              }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.85 }}
              style={{
                color: '#e8e3d8', fontSize: 'clamp(1rem, 2.8vw, 1.35rem)',
                textAlign: 'center', letterSpacing: '0.04em',
                margin: '0 0 2.5rem', fontStyle: 'italic', opacity: 0.92,
              }}
            >
              Relive Your Biggest Wins (or Losses)
            </motion.p>

            {/* Auth cards */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.85 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 380 }}
            >
              {/* Returning user */}
              <div style={{
                background: 'rgba(26,92,46,0.15)',
                border: '1px solid rgba(45,122,66,0.4)',
                borderRadius: 16, padding: '1.5rem', textAlign: 'center',
              }}>
                <p style={{ color: '#a0a890', fontSize: '0.88rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                  Returning player? Welcome back.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%', padding: '0.9rem 2rem',
                    background: 'linear-gradient(135deg, #1a5c2e 0%, #2d7a42 100%)',
                    color: 'white', border: '1px solid rgba(74,174,100,0.3)',
                    borderRadius: 10, fontSize: '1.05rem', fontWeight: 700,
                    cursor: 'pointer', letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(26,92,46,0.4)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 22px rgba(26,92,46,0.55)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,92,46,0.4)';
                  }}
                >
                  Log In
                </button>
              </div>

              <div style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem' }}>— or —</div>

              {/* New user */}
              <div style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 16, padding: '1.5rem', textAlign: 'center',
              }}>
                <p style={{ color: '#a0a890', fontSize: '0.88rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>
                  New to CueVision? Join the game.
                </p>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    width: '100%', padding: '0.9rem 2rem',
                    background: 'transparent', color: '#c9a84c',
                    border: '2px solid #c9a84c', borderRadius: 10,
                    fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(201,168,76,0.12)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
