import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';

type LoginStep = 'initial' | 'faceScanning' | 'loginForm' | 'locked';

// demo credentials and settings
const VALID_USERNAME = 'demo';
const VALID_PASSWORD = 'pool123';
const MAX_ATTEMPTS = 3;
const LOCK_DURATION_MS = 5 * 60 * 1000;

export function LoginPage() {
  const [step, setStep] = useState<LoginStep>('initial');
  const [faceDialogOpen, setFaceDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  //countdown timer
  //when user hits the max attempts, a lockout time (lockedUntil) is set for 5 minutes in the future. This effect runs every 500ms to check the remaining time until lockedUntil. If the time is up, it resets the lockout state and returns the user to the login form. Otherwise, it updates the timeLeft state to show the countdown timer in seconds.
  //returns the user to the login form when the timer hits zero
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = lockedUntil - Date.now();
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setTimeLeft(0);
        setStep('loginForm');
        clearInterval(interval);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  //opens the face-auth dialog when the Log In? button is tapped
  const handleLogInClick = () => {
    setFaceDialogOpen(true);
  };

  //if user chose Face ID → show scan animation → navigate to dashboard
  const handleFaceYes = () => {
    setFaceDialogOpen(false);
    setStep('faceScanning');
    setTimeout(() => navigate('/dashboard'), 3000);
  };

  //if user declined Face ID → fall back to username/password form
  const handleFaceNo = () => {
    setFaceDialogOpen(false);
    setStep('loginForm');
  };

  //validates credentials; tracks failed attempts and locks on MAX_ATTEMPTS
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      navigate('/dashboard');
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCK_DURATION_MS;
        setLockedUntil(until);
        setTimeLeft(LOCK_DURATION_MS / 1000);
        setStep('locked');
      } else {
        setLoginError(
          `Incorrect username or password. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next !== 1 ? 's' : ''} remaining.`
        );
      }
    }
  };

  //formats seconds into M:SS for the lockout countdown display
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a1208', position: 'relative', overflow: 'hidden' }}>

      {/* ─── BACK NAV — fixed top-left, always visible across all steps ─── */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          color: '#c9a84c',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 8,
          padding: '0.4rem 0.85rem',
          cursor: 'pointer',
          fontSize: '0.88rem',
          zIndex: 100,
          backdropFilter: 'blur(6px)',
        }}
      >
        ← CueVision
      </button>

      <AnimatePresence mode="wait">

        {/* Log In button overlay */}
        {step === 'initial' && (
          <motion.div
            key="initial"
            style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >

            {/* background image */}
                                  
            <div style={{ position: 'absolute', inset: 0 }}>
              <img
                src="/poolreturninguser.jpg" 
                alt="Player lining up a shot"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>

            {/* gradient─ */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
              }}
            />

            {/* login button */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
              <motion.button
                onClick={handleLogInClick}
                style={{
                  padding: '1.1rem 3.5rem',
                  background: 'rgba(14,50,24,0.85)',
                  color: 'white',
                  border: '2px solid #c9a84c',
                  borderRadius: 12,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  letterSpacing: '0.08em',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(201,168,76,0.2)',
                }}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 36px rgba(0,0,0,0.7), 0 0 32px rgba(201,168,76,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                Log In?
              </motion.button>
              <p
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  marginTop: '0.75rem',
                }}
              >
                Tap to sign in to your account
              </p>
            </div>

          </motion.div>
        )}

        {/* face scanning — animated scan line over */}
        {step === 'faceScanning' && (
          <motion.div
            key="faceScan"
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a1208',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* ─scan circle placeholder ─ */}
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                border: '3px solid #c9a84c',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                background: 'rgba(26,92,46,0.1)',
              }}
            >
              {/* scan line (maybe take out) */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 4,
                  background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6), #c9a84c, rgba(201,168,76,0.6), transparent)',
                }}
                animate={{ top: [0, 216, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
              <span style={{ fontSize: '5.5rem', filter: 'grayscale(0.3)' }}>👤</span>
            </div>

            {/* status lalbels: gold text */}
            <motion.p
              style={{ color: '#c9a84c', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              Scanning face…
            </motion.p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Hold still for face authentication
            </p>
            <p style={{ color: '#3a5a3a', fontSize: '0.8rem', marginTop: '1.5rem' }}>
              Signing you in automatically…
            </p>
          </motion.div>
        )}

        {/* login form */}
        {step === 'loginForm' && (
          <motion.div
            key="loginForm"
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              background: '#0a1208',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                background: '#0c2010',
                border: '1px solid #2a4a20',
                borderRadius: 20,
                padding: '2.5rem',
                width: '100%',
                maxWidth: 420,
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              {/* ─── LOGO ─── */}
              <h1
                style={{
                  color: '#c9a84c',
                  fontFamily: 'Georgia, serif',
                  textAlign: 'center',
                  margin: '0 0 0.35rem',
                  fontSize: '2rem',
                }}
              >
                CueVision
              </h1>
              <p style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem' }}>
                Sign in to your account
              </p>

              {/* error banner — only visible after a failed attempt */}
              {loginError && (
                <div
                  style={{
                    background: 'rgba(200,40,40,0.15)',
                    border: '1px solid #b42828',
                    borderRadius: 8,
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    color: '#f87171',
                    fontSize: '0.88rem',
                  }}
                >
                  {loginError}
                </div>
              )}

              {/* credentials */}
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', color: '#8aab8a', fontSize: '0.82rem', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                    USERNAME
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      background: '#071408',
                      border: '1px solid #2a4a20',
                      borderRadius: 8,
                      color: 'white',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', color: '#8aab8a', fontSize: '0.82rem', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      background: '#071408',
                      border: '1px solid #2a4a20',
                      borderRadius: 8,
                      color: 'white',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
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
                  Sign In
                </button>
              </form>

              {/* ─── DEMO CREDENTIALS HINT ─── */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '0.85rem',
                  background: 'rgba(201,168,76,0.07)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#887755', fontSize: '0.78rem', margin: 0 }}>
                  Demo credentials: <span style={{ color: '#c9a84c' }}>demo</span> / <span style={{ color: '#c9a84c' }}>pool123</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* shows MAX_ATTEMPTS reached */}
        {step === 'locked' && (
          <motion.div
            key="locked"
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              background: '#0a1208',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                background: '#1a0808',
                border: '1px solid #7a1a1a',
                borderRadius: 20,
                padding: '2.5rem',
                width: '100%',
                maxWidth: 420,
                textAlign: 'center',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
              <h2 style={{ color: '#f87171', margin: '0 0 0.75rem', fontSize: '1.4rem' }}>
                Account Temporarily Locked
              </h2>
              <p style={{ color: '#aaa', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Too many failed login attempts. Your account has been temporarily
                suspended for security purposes.
              </p>

              {/* countdown timer */}
              <div
                style={{
                  background: '#100505',
                  border: '1px solid #4a1a1a',
                  borderRadius: 12,
                  padding: '1.25rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ color: '#f87171', fontSize: '2.5rem', fontWeight: 800 }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  until account is unlocked
                </div>
              </div>

              <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Need immediate access? Contact our help desk.
              </p>

              {/* help button */}
              <button
                onClick={() => alert('Redirecting to Help Desk: helpdesk@cuevision.com\n\nFor demo purposes only.')}
                style={{
                  padding: '0.8rem 2.5rem',
                  background: 'transparent',
                  color: '#c9a84c',
                  border: '1px solid #c9a84c',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                }}
              >
                Contact Help Desk
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* FACE ID boolean */}
      <Dialog open={faceDialogOpen} onOpenChange={setFaceDialogOpen}>
        <DialogContent
          style={{
            background: '#0c2010',
            border: '1px solid #c9a84c',
            color: 'white',
            borderRadius: 16,
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#c9a84c', fontSize: '1.2rem' }}>
              Face Authentication
            </DialogTitle>
            <DialogDescription style={{ color: '#bbb', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Would you like to use face authentication to sign in? This uses your
              device camera for a quick, secure login.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter style={{ gap: '0.75rem', flexDirection: 'row' }}>
            {/* ─── Decline Face ID → password form ─── */}
            <button
              onClick={handleFaceNo}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'transparent',
                color: '#999',
                border: '1px solid #444',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              No, use password
            </button>
            {/* ─── Accept Face ID → scan animation ─── */}
            <button
              onClick={handleFaceYes}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #1a5c2e, #2d7a42)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
              }}
            >
              Yes, use Face ID
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}