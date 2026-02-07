'use client';

import React, { useState, useEffect, useRef } from 'react';

// Stylised Breathe Logo Component
const BreatheLogo = ({ size = 120, darkMode = false }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 240 120" fill="none">
    {/* Flowing breath waves */}
    <defs>
      <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C4857A" stopOpacity={darkMode ? "0.5" : "0.3"} />
        <stop offset="50%" stopColor="#9B8AAD" stopOpacity={darkMode ? "0.7" : "0.5"} />
        <stop offset="100%" stopColor="#7C9885" stopOpacity={darkMode ? "0.5" : "0.3"} />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={darkMode ? "#e8e8e8" : "#3d3a38"} />
        <stop offset="100%" stopColor={darkMode ? "#c0c0c0" : "#5a5550"} />
      </linearGradient>
    </defs>

    {/* Abstract breath flow behind text */}
    <path
      d="M20 70 Q60 40, 120 60 Q180 80, 220 50"
      stroke="url(#breathGradient)"
      strokeWidth="40"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M30 75 Q80 55, 130 70 Q180 85, 210 60"
      stroke="url(#breathGradient)"
      strokeWidth="25"
      strokeLinecap="round"
      fill="none"
      opacity="0.4"
    />

    {/* Breathe text */}
    <text
      x="120"
      y="72"
      textAnchor="middle"
      fontFamily="'Georgia', serif"
      fontSize="42"
      fontWeight="400"
      fontStyle="italic"
      fill="url(#textGradient)"
      letterSpacing="4"
    >
      breathe
    </text>

    {/* Small decorative dot */}
    <circle cx="120" cy="95" r="3" fill="#C4857A" opacity="0.6" />
  </svg>
);

const breathingTechniques = {
  balanced: {
    name: 'Balanced Breathing',
    description: 'Equal rhythm for calm & focus',
    cue: 'In and out through your nose',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale', duration: 4 }
    ],
    color: '#7C9885'  // Sage green - grounding
  },
  relaxing: {
    name: 'Sleep & Calm',
    displayName: '4-7-8',
    description: '4-7-8 technique by Dr. Weil',
    cue: 'Breathe in through your nose, out through your mouth making a whoosh sound',
    phases: [
      { name: 'Inhale', duration: 2 },
      { name: 'Hold', duration: 3.5 },
      { name: 'Exhale', duration: 4 }
    ],
    color: '#9B8AAD'  // Soft lavender - calming
  },
  sigh: {
    name: 'Quick Calm',
    displayName: 'Physiological Sigh',
    description: 'Physiological Sigh',
    cue: 'Double inhale through your nose',
    phases: [
      { name: 'Inhale', duration: 1.8 },
      { name: 'Pause', duration: 0.3 },
      { name: 'Sip More', duration: 1 },
      { name: 'Exhale', duration: 5 }
    ],
    color: '#C4857A'  // Terracotta rose - warm & soothing
  }
};

// Special modes that need custom UI
const WIM_HOF_COLOR = '#5B8FA8';  // Cool blue

// Gauge Component for Results
const BreathingGauge = ({ breathsPerMinute }) => {
  // Normal range is 12-20, anxious is >20, very calm is <12
  const minBPM = 6;
  const maxBPM = 30;
  const normalizedValue = Math.max(0, Math.min(1, (breathsPerMinute - minBPM) / (maxBPM - minBPM)));
  const angle = -90 + (normalizedValue * 180); // -90 to 90 degrees

  const getStatus = () => {
    if (breathsPerMinute < 12) return { label: 'Very Calm', color: '#7C9885' };
    if (breathsPerMinute <= 20) return { label: 'Normal Range', color: '#D4A574' };
    return { label: 'Elevated', color: '#C4857A' };
  };

  const status = getStatus();

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="200" height="120" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C9885" />
            <stop offset="35%" stopColor="#D4A574" />
            <stop offset="65%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#C4857A" />
          </linearGradient>
        </defs>

        {/* Gauge arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="#3d3a38"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="8" fill="#3d3a38" />
          <circle cx="100" cy="100" r="4" fill="white" />
        </g>
      </svg>

      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '18px', fontWeight: '600', color: status.color }}>
          {status.label}
        </div>
        <div style={{ fontSize: '24px', fontWeight: '600', color: '#3d3a38' }}>
          {Math.round(breathsPerMinute)} breaths/min
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Theme colors based on mode
  const theme = {
    bg: darkMode
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
      : 'linear-gradient(135deg, #faf7f5 0%, #f5ebe4 100%)',
    cardBg: darkMode ? '#252540' : 'white',
    text: darkMode ? '#e8e8e8' : '#3d3a38',
    textSecondary: darkMode ? '#a0a0b0' : '#7a7067',
    textMuted: darkMode ? '#808090' : '#a39a8f',
    tagBg: darkMode ? '#353550' : '#f5efe8',
    tagText: darkMode ? '#b0b0c0' : '#7a7067',
    border: darkMode ? '#353550' : '#e5e0d8',
    shadow: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
  };
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // 4-7-8 cycle target (4 = beginner, 8 = advanced)
  const [relaxingTargetCycles, setRelaxingTargetCycles] = useState(4);

  // Quick Calm (Physiological Sigh) mode - 'cycles' (3 cycles) or 'timer' (5 min)
  const [sighMode, setSighMode] = useState('cycles');
  const SIGH_TARGET_CYCLES = 3;
  const SIGH_TIMER_DURATION = 300; // 5 minutes in seconds

  // Anxiety mode state
  const [anxietyMode, setAnxietyMode] = useState(false);
  const [anxietyPhase, setAnxietyPhase] = useState('intro'); // intro, breathing, results
  const [anxietyBreathPhase, setAnxietyBreathPhase] = useState('inhale'); // inhale, hold, exhale
  const [anxietyProgress, setAnxietyProgress] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [anxietyResults, setAnxietyResults] = useState(null);
  const [breathTimestamps, setBreathTimestamps] = useState([]);

  // Wim Hof state
  const [wimHofMode, setWimHofMode] = useState(false);
  const [wimHofPhase, setWimHofPhase] = useState('setup'); // setup, powerBreathing, exhale, retention, recoveryInhale, recovery, complete
  const [wimHofBreathCount, setWimHofBreathCount] = useState(0);
  const [wimHofRound, setWimHofRound] = useState(1);
  const [wimHofHoldTime, setWimHofHoldTime] = useState(0);
  const [wimHofTargetHold, setWimHofTargetHold] = useState(60); // user selected: 30, 60, 90, 120
  const [wimHofTotalRounds, setWimHofTotalRounds] = useState(3);
  const [wimHofResults, setWimHofResults] = useState([]);
  const [wimHofExhaleProgress, setWimHofExhaleProgress] = useState(0); // 0 to 1 for exhale animation
  const [wimHofRecoveryProgress, setWimHofRecoveryProgress] = useState(0); // 0 to 1 for recovery shrink

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const anxietyStartRef = useRef(null);
  const anxietyIntervalRef = useRef(null);
  const wimHofIntervalRef = useRef(null);
  const wimHofHoldTimeRef = useRef(0); // Track hold time for closure capture

  const technique = selectedTechnique ? breathingTechniques[selectedTechnique] : null;
  const currentPhase = technique?.phases[currentPhaseIndex];

  useEffect(() => {
    if (isActive && !isPaused && technique) {
      const phaseDuration = currentPhase.duration * 1000;
      const tickInterval = 50;

      intervalRef.current = setInterval(() => {
        setPhaseProgress(prev => {
          const newProgress = prev + (tickInterval / phaseDuration) * 100;

          if (newProgress >= 100) {
            const nextPhaseIndex = (currentPhaseIndex + 1) % technique.phases.length;
            setCurrentPhaseIndex(nextPhaseIndex);

            if (nextPhaseIndex === 0) {
              setCycleCount(c => {
                const newCount = c + 1;
                // 4-7-8 method: auto-complete at target cycles
                if (selectedTechnique === 'relaxing' && newCount >= relaxingTargetCycles) {
                  setTimeout(() => stopExercise(), 100);
                }
                // Quick Calm (sigh): auto-complete after 3 cycles if in cycles mode
                if (selectedTechnique === 'sigh' && sighMode === 'cycles' && newCount >= SIGH_TARGET_CYCLES) {
                  setTimeout(() => stopExercise(), 100);
                }
                return newCount;
              });
            }

            return 0;
          }

          return newProgress;
        });

        setTotalSeconds(prev => {
          const newTime = prev + tickInterval / 1000;
          // Quick Calm timer mode: auto-complete after 5 minutes
          if (selectedTechnique === 'sigh' && sighMode === 'timer' && newTime >= SIGH_TIMER_DURATION) {
            setTimeout(() => stopExercise(), 100);
          }
          return newTime;
        });
      }, tickInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, currentPhaseIndex, technique, currentPhase]);

  const startExercise = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setCycleCount(0);
    setTotalSeconds(0);
    startTimeRef.current = Date.now();
  };

  const pauseExercise = () => {
    setIsPaused(true);
  };

  const resumeExercise = () => {
    setIsPaused(false);
  };

  const stopExercise = () => {
    setIsActive(false);
    setIsPaused(false);
    setShowCompletion(true);
  };

  const resetToSelection = () => {
    setSelectedTechnique(null);
    setIsActive(false);
    setIsPaused(false);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setCycleCount(0);
    setTotalSeconds(0);
    setShowCompletion(false);
    // Reset anxiety mode
    setAnxietyMode(false);
    setAnxietyPhase('intro');
    setAnxietyBreathPhase('inhale');
    setAnxietyProgress(0);
    setBreathCount(0);
    setBreathTimestamps([]);
    setAnxietyResults(null);
    // Reset Wim Hof mode
    setWimHofMode(false);
    setWimHofPhase('setup');
    setWimHofBreathCount(0);
    setWimHofRound(1);
    setWimHofHoldTime(0);
    setWimHofResults([]);
  };

  // Anxiety mode handlers - USER-PACED breathing tracker
  // User taps to cycle through: ready -> inhale -> hold -> exhale -> inhale...
  // Each complete cycle (back to inhale) counts as one breath
  const startAnxietyMode = () => {
    setAnxietyMode(true);
    setAnxietyPhase('intro');
    setAnxietyBreathPhase('ready');
    setBreathCount(0);
    setBreathTimestamps([]);
    setAnxietyResults(null);
    setAnxietyProgress(0);
  };

  const handleAnxietyTap = () => {
    const now = Date.now();

    if (anxietyPhase === 'intro') {
      // First tap: start with inhale
      anxietyStartRef.current = now;
      setBreathTimestamps([now]);
      setAnxietyPhase('breathing');
      setAnxietyBreathPhase('inhale');
      setAnxietyProgress(0);
    } else if (anxietyPhase === 'breathing') {
      // Tap cycles: inhale auto-transitions to hold, then tap for exhale, tap for next inhale
      if (anxietyBreathPhase === 'inhale') {
        // Skip to hold immediately if tapped during inhale
        setAnxietyBreathPhase('hold');
      } else if (anxietyBreathPhase === 'hold') {
        // Tap to start exhale
        setAnxietyBreathPhase('exhale');
      } else if (anxietyBreathPhase === 'exhale') {
        // Completed one breath cycle
        const newCount = breathCount + 1;
        setBreathCount(newCount);
        setBreathTimestamps(prev => [...prev, now]);
        setAnxietyBreathPhase('inhale');
        setAnxietyProgress(0);
      }
    }
  };

  const finishAnxietyTracking = () => {
    if (breathCount >= 1 && breathTimestamps.length >= 2) {
      const now = Date.now();
      const totalTime = (now - anxietyStartRef.current) / 1000 / 60; // minutes
      const breathsPerMinute = breathCount / totalTime;
      setAnxietyResults({ breathsPerMinute, totalBreaths: breathCount });
      setAnxietyPhase('results');
    }
  };

  // Auto-transition from inhale to hold after animation completes
  useEffect(() => {
    if (anxietyMode && anxietyPhase === 'breathing' && anxietyBreathPhase === 'inhale') {
      // Wait for CSS transition to complete, then switch to hold
      const timer = setTimeout(() => {
        setAnxietyBreathPhase('hold');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [anxietyMode, anxietyPhase, anxietyBreathPhase]);

  // Get target scale for CSS transition - no JavaScript animation needed
  const getAnxietyCircleScale = () => {
    if (anxietyBreathPhase === 'ready') {
      return 0.6;
    } else if (anxietyBreathPhase === 'inhale') {
      return 1.0; // CSS will animate to this
    } else if (anxietyBreathPhase === 'hold') {
      return 1.0;
    } else if (anxietyBreathPhase === 'exhale') {
      return 0.6; // CSS will animate to this
    }
    return 0.6;
  };

  const resetAnxietyMode = () => {
    setAnxietyPhase('intro');
    setBreathCount(0);
    setBreathTimestamps([]);
    setAnxietyResults(null);
  };

  // Get live breathing feedback based on recent breath rate
  const getAnxietyFeedback = () => {
    if (breathCount < 3) return null; // Need at least 3 breaths for meaningful feedback

    const now = Date.now();
    const totalTimeMinutes = (now - anxietyStartRef.current) / 1000 / 60;
    const currentBPM = breathCount / totalTimeMinutes;

    // Also check if slowing down by comparing recent breaths to earlier ones
    let trend = 'steady';
    if (breathTimestamps.length >= 4) {
      const recentGap = breathTimestamps[breathTimestamps.length - 1] - breathTimestamps[breathTimestamps.length - 2];
      const earlierGap = breathTimestamps[2] - breathTimestamps[1];
      if (recentGap > earlierGap * 1.15) trend = 'slowing';
      else if (recentGap < earlierGap * 0.85) trend = 'quickening';
    }

    return { bpm: currentBPM, trend };
  };

  // ============ WIM HOF METHOD ============
  const WIM_HOF_BREATHS = 30;
  // ~3s per breath cycle (1.5s in, 1.5s out)
  const WIM_HOF_BREATH_TIME = 1500;
  const WIM_HOF_RECOVERY_HOLD = 15;

  const startWimHofMode = () => {
    setWimHofMode(true);
    setWimHofPhase('setup');
    setWimHofRound(1);
    setWimHofResults([]);
  };

  // Wim Hof breath cycle state: 'ready', 'in' or 'out'
  // 'ready' = small circle waiting to start, 'in' = expanding (inhaling), 'out' = shrinking (exhaling)
  const [wimHofBreathCycle, setWimHofBreathCycle] = useState('ready');

  const beginWimHofRound = () => {
    setWimHofPhase('powerBreathing');
    setWimHofBreathCount(1);
    setWimHofBreathCycle('ready'); // Start small, will trigger inhale
    setWimHofExhaleProgress(0);
    // Brief delay then start first inhale
    setTimeout(() => setWimHofBreathCycle('in'), 50);
  };

  // Handle Wim Hof power breathing with useEffect
  // Each full cycle (in + out) = 1 breath
  useEffect(() => {
    if (wimHofMode && wimHofPhase === 'powerBreathing') {
      // Skip if in 'ready' state (waiting for initial trigger)
      if (wimHofBreathCycle === 'ready') return;

      // 1.5s each for inhale and exhale (3s total per breath)
      const timer = setTimeout(() => {
        if (wimHofBreathCycle === 'in') {
          // After inhale, release (no pause)
          setWimHofBreathCycle('out');
        } else {
          // After exhale completes...
          if (wimHofBreathCount >= WIM_HOF_BREATHS) {
            // Done with 30 breaths, go straight to retention (circle already small)
            setWimHofPhase('retention');
            setWimHofHoldTime(0);
          } else {
            // More breaths to go, increment and start next inhale
            setWimHofBreathCount(prev => prev + 1);
            setWimHofBreathCycle('in');
          }
        }
      }, WIM_HOF_BREATH_TIME);
      return () => clearTimeout(timer);
    }
  }, [wimHofMode, wimHofPhase, wimHofBreathCount, wimHofBreathCycle]);

  // Handle retention timer
  useEffect(() => {
    if (wimHofMode && wimHofPhase === 'retention') {
      wimHofHoldTimeRef.current = 0;
      const timer = setInterval(() => {
        wimHofHoldTimeRef.current += 1;
        setWimHofHoldTime(wimHofHoldTimeRef.current);

        if (wimHofHoldTimeRef.current >= wimHofTargetHold) {
          clearInterval(timer);
          // Record and transition
          setWimHofResults(prev => [...prev, wimHofHoldTimeRef.current]);
          setWimHofPhase('recoveryInhale');
          setWimHofRecoveryProgress(0);
          setTimeout(() => setWimHofRecoveryProgress(1), 50);
          setTimeout(() => {
            setWimHofPhase('recovery');
            setWimHofHoldTime(0);
            setWimHofRecoveryProgress(0);
          }, 2500);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [wimHofMode, wimHofPhase, wimHofTargetHold]);

  const endWimHofRetention = () => {
    // Record this round's hold time
    setWimHofResults(prev => [...prev, wimHofHoldTimeRef.current]);
    // Move to recovery inhale phase (breath IN - circle grows)
    setWimHofPhase('recoveryInhale');
    setWimHofRecoveryProgress(0);
    // Trigger inhale animation (circle grows)
    setTimeout(() => setWimHofRecoveryProgress(1), 50);

    // After 2.5 second inhale, start the 15 second recovery hold (circle stays big)
    setTimeout(() => {
      setWimHofPhase('recovery');
      setWimHofHoldTime(0);
    }, 2500);
  };

  // Track recovery exhale animation progress
  const [recoveryExhaleStarted, setRecoveryExhaleStarted] = useState(false);

  // Handle recovery phase timer - circle stays big, then shrinks at end
  useEffect(() => {
    if (wimHofMode && wimHofPhase === 'recovery') {
      const timer = setInterval(() => {
        setWimHofHoldTime(prev => {
          const newTime = prev + 1;

          if (newTime >= WIM_HOF_RECOVERY_HOLD) {
            clearInterval(timer);
            // Shrink the circle and pause before next round
            setWimHofPhase('recoveryExhale');
            setRecoveryExhaleStarted(false);
            // Trigger the shrink animation after a brief delay
            setTimeout(() => setRecoveryExhaleStarted(true), 50);
            // After circle shrinks (1.5s), pause briefly then start next round
            setTimeout(() => {
              if (wimHofRound < wimHofTotalRounds) {
                setWimHofRound(r => r + 1);
                setWimHofBreathCount(1);
                setWimHofBreathCycle('ready');
                setWimHofExhaleProgress(0);
                setWimHofPhase('powerBreathing');
                setTimeout(() => setWimHofBreathCycle('in'), 50);
              } else {
                setWimHofPhase('complete');
              }
            }, 2000); // 1.5s shrink + 0.5s pause
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [wimHofMode, wimHofPhase, wimHofRound, wimHofTotalRounds]);

  const resetWimHofMode = () => {
    setWimHofPhase('setup');
    setWimHofBreathCount(0);
    setWimHofBreathCycle('ready');
    setWimHofRound(1);
    setWimHofHoldTime(0);
    setWimHofResults([]);
    setWimHofExhaleProgress(0);
    setWimHofRecoveryProgress(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleScale = () => {
    if (!currentPhase) return 1;
    const progress = phaseProgress / 100;

    if (currentPhase.name === 'Inhale') {
      // For physiological sigh, strong inhale to 80%
      // Use easeOut for a quick start that settles
      if (selectedTechnique === 'sigh') {
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        return 0.6 + (0.2 * easeOut(progress));
      }
      return 0.6 + (0.4 * progress);
    } else if (currentPhase.name === 'Pause') {
      // Brief pause at 80% before sip more
      return 0.8;
    } else if (currentPhase.name === 'Sip More') {
      // Gentle top-up from 80% to full (with slight overshoot to 105%)
      // This is the "filling the air sacs" part - smoother, gentler
      const easeOutBack = (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
      const easedProgress = easeOutBack(progress);
      return 0.8 + (0.25 * easedProgress);
    } else if (currentPhase.name === 'Exhale') {
      // Start from 1.05 if coming from sigh, otherwise 1
      const startScale = selectedTechnique === 'sigh' ? 1.05 : 1;
      return startScale - ((startScale - 0.6) * progress);
    }
    return currentPhase.name === 'Hold' && currentPhaseIndex > 0 ? 1 : 0.6;
  };

  // Check if we're in the energetic "Sip More" phase
  const isSipPhase = currentPhase?.name === 'Sip More';

  // Anxiety Mode Screen - TAP BASED breathing tracker
  if (anxietyMode) {
    const anxietyColor = '#B8860B'; // Warm goldenrod color

    return (
      <div style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        background: theme.bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        paddingTop: '60px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Back Button */}
        <button
          onClick={resetToSelection}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: theme.cardBg,
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: theme.textSecondary,
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${theme.shadow}`
          }}
        >
          ← Back
        </button>

        {anxietyPhase === 'results' ? (
          // Results view
          <div style={{
            background: theme.cardBg,
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            boxShadow: `0 4px 24px ${theme.shadow}`
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.text,
              margin: '0 0 24px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Your Results
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: anxietyResults?.breathsPerMinute < 12 ? '#7C9885' :
                       anxietyResults?.breathsPerMinute <= 20 ? '#D4A574' : '#C4857A'
              }}>
                {anxietyResults?.breathsPerMinute < 12 ? 'Very Calm' :
                 anxietyResults?.breathsPerMinute <= 20 ? 'Normal Range' : 'Elevated'}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '600',
                color: theme.text,
                marginTop: '4px'
              }}>
                {Math.round(anxietyResults?.breathsPerMinute || 0)} breaths/min
              </div>
            </div>

            {anxietyResults?.breathsPerMinute > 20 && (
              <p style={{
                fontSize: '14px',
                color: '#C4857A',
                margin: '16px 0 0',
                fontStyle: 'italic'
              }}>
                Your breathing is a bit fast - try one of the calming techniques!
              </p>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={resetAnxietyMode}
                style={{
                  flex: 1,
                  background: theme.cardBg,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: anxietyColor,
                  cursor: 'pointer'
                }}
              >
                Try again
              </button>
              <button
                onClick={resetToSelection}
                style={{
                  flex: 1,
                  background: anxietyColor,
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          // Breathing tracking view - user-paced bubble with tap control
          <>
            {/* Title */}
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: theme.text,
              margin: '0 0 6px',
              textAlign: 'center'
            }}>
              Breathe into Anxiety
            </h2>
            <p style={{
              fontSize: '13px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center',
              maxWidth: '280px',
              lineHeight: '1.4'
            }}>
              Identify where you feel stress or anxiety in your body, breathe into that
            </p>

            {/* Animated Breathing Circle */}
            <div
              onClick={handleAnxietyTap}
              style={{
                position: 'relative',
                width: 'min(340px, 75vw)',
                height: 'min(340px, 75vw)',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              {/* Outer ring */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${anxietyColor}30`
              }} />

              {/* Main animated circle */}
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${anxietyColor} 0%, ${anxietyColor}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${anxietyColor}40`,
                transition: 'transform 3.5s ease-in-out',
                transform: `scale(${anxietyPhase === 'intro' ? 0.6 : getAnxietyCircleScale()})`
              }}>
                <div style={{
                  textAlign: 'center',
                  color: 'white'
                }}>
                  {anxietyPhase === 'intro' ? (
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>Tap to start</span>
                  ) : anxietyBreathPhase === 'inhale' ? (
                    null
                  ) : (
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {anxietyBreathPhase}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cues underneath - changes based on phase */}
            <div style={{
              textAlign: 'center',
              minHeight: '70px'
            }}>
              {(anxietyPhase === 'intro' || anxietyBreathPhase === 'exhale') ? (
                <p style={{
                  fontSize: '13px',
                  color: theme.textSecondary,
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  Tap when you breathe in
                </p>
              ) : (
                <div style={{
                  fontSize: '13px',
                  lineHeight: '1.8',
                  fontStyle: 'italic',
                  color: theme.textSecondary
                }}>
                  <div>Breathe in</div>
                  <div>Hold breath in area of anxiety</div>
                  <div>Tap when you breathe out</div>
                </div>
              )}
            </div>

            {/* Done button container - always present to prevent layout shift */}
            <div style={{
              marginTop: '20px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {breathCount >= 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    finishAnxietyTracking();
                  }}
                  style={{
                    background: theme.cardBg,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '12px',
                    padding: '14px 32px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.textSecondary,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ============ WIM HOF SCREEN ============
  if (wimHofMode) {
    return (
      <div style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        background: darkMode
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #f5f8fa 0%, #e8f0f5 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        paddingTop: '60px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Back Button */}
        <button
          onClick={resetToSelection}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: theme.cardBg,
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: theme.textSecondary,
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${theme.shadow}`
          }}
        >
          ← Back
        </button>

        {wimHofPhase !== 'setup' && wimHofPhase !== 'complete' && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: theme.cardBg,
            borderRadius: '10px',
            padding: '10px 16px',
            boxShadow: `0 2px 8px ${theme.shadow}`
          }}>
            <span style={{ color: theme.textSecondary, fontSize: '12px' }}>
              Round {wimHofRound} of {wimHofTotalRounds}
            </span>
          </div>
        )}

        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: theme.text,
          margin: '0 0 6px',
          textAlign: 'center'
        }}>
          Wim Hof Method
        </h2>

        {/* Setup Screen */}
        {wimHofPhase === 'setup' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center',
              maxWidth: '320px',
              lineHeight: '1.5'
            }}>
              30 deep breaths, then hold as long as comfortable.
            </p>
            <p style={{
              fontSize: '14px',
              color: theme.textSecondary,
              margin: '0 0 16px',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              Choose your target hold time:
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {[30, 60, 90, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => setWimHofTargetHold(time)}
                  style={{
                    background: wimHofTargetHold === time ? WIM_HOF_COLOR : theme.cardBg,
                    color: wimHofTargetHold === time ? 'white' : theme.text,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: `0 2px 8px ${theme.shadow}`
                  }}
                >
                  {time}s
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px'
            }}>
              {[2, 3, 4].map((rounds) => (
                <button
                  key={rounds}
                  onClick={() => setWimHofTotalRounds(rounds)}
                  style={{
                    background: wimHofTotalRounds === rounds ? WIM_HOF_COLOR : theme.cardBg,
                    color: wimHofTotalRounds === rounds ? 'white' : theme.text,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: `0 2px 8px ${theme.shadow}`
                  }}
                >
                  {rounds} rounds
                </button>
              ))}
            </div>

            <button
              onClick={beginWimHofRound}
              style={{
                background: WIM_HOF_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: `0 4px 16px ${WIM_HOF_COLOR}40`
              }}
            >
              Begin
            </button>
          </>
        )}

        {/* Power Breathing Phase */}
        {wimHofPhase === 'powerBreathing' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center'
            }}>
              Deep breaths - fully in, let go
            </p>

            <div style={{
              position: 'relative',
              width: 'min(340px, 75vw)',
              height: 'min(340px, 75vw)',
              marginBottom: '20px'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${WIM_HOF_COLOR}30`
              }} />
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${WIM_HOF_COLOR} 0%, ${WIM_HOF_COLOR}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${WIM_HOF_COLOR}40`,
                transform: `scale(${wimHofBreathCycle === 'in' ? 0.95 : 0.6})`,  /* ready/out = small, in = large */
                transition: 'transform 1.4s ease-in-out'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '48px', fontWeight: '300' }}>
                    {wimHofBreathCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic cue underneath */}
            <p style={{
              fontSize: '13px',
              color: theme.textSecondary,
              margin: '0',
              textAlign: 'center',
              minHeight: '20px',
              fontStyle: 'italic'
            }}>
              {wimHofBreathCount <= 10
                ? 'Into the belly, into the chest'
                : wimHofBreathCount <= 20
                  ? 'Fully in, let it all go'
                  : wimHofBreathCount > 25
                    ? "5 more to go, you've got this!"
                    : 'Deep and powerful'}
            </p>
          </>
        )}

        {/* Retention Phase - small circle from breath 30's exhale */}
        {wimHofPhase === 'retention' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center'
            }}>
              Deep breaths - fully in, let go
            </p>

            <div style={{
              position: 'relative',
              width: 'min(340px, 75vw)',
              height: 'min(340px, 75vw)',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
            onClick={endWimHofRetention}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${WIM_HOF_COLOR}30`
              }} />
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${WIM_HOF_COLOR} 0%, ${WIM_HOF_COLOR}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${WIM_HOF_COLOR}40`,
                transform: 'scale(0.6)'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '4px' }}>
                    Hold
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: '300' }}>
                    {wimHofHoldTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Cue underneath bubble */}
            <p style={{
              fontSize: '13px',
              color: theme.textSecondary,
              margin: '0',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Target: {wimHofTargetHold}s • Tap when you need to breathe
            </p>
          </>
        )}

        {/* Recovery Inhale Phase - breath IN first */}
        {wimHofPhase === 'recoveryInhale' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center'
            }}>
              Deep breaths - fully in, let go
            </p>

            <div style={{
              position: 'relative',
              width: 'min(340px, 75vw)',
              height: 'min(340px, 75vw)',
              marginBottom: '20px'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${WIM_HOF_COLOR}30`
              }} />
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${WIM_HOF_COLOR} 0%, ${WIM_HOF_COLOR}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${WIM_HOF_COLOR}40`,
                transform: `scale(${wimHofRecoveryProgress === 0 ? 0.5 : 1})`,
                transition: 'transform 2.5s ease-out'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '24px', fontWeight: '400' }}>
                    Breathe in
                  </div>
                </div>
              </div>
            </div>

            {/* Cue underneath bubble */}
            <p style={{
              fontSize: '13px',
              color: theme.textSecondary,
              margin: '0',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Deep recovery breath
            </p>
          </>
        )}

        {/* Recovery Phase - circle stays BIG for 15 second countdown */}
        {wimHofPhase === 'recovery' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center'
            }}>
              Deep breaths - fully in, let go
            </p>

            <div style={{
              position: 'relative',
              width: 'min(340px, 75vw)',
              height: 'min(340px, 75vw)',
              marginBottom: '20px'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${WIM_HOF_COLOR}30`
              }} />
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${WIM_HOF_COLOR} 0%, ${WIM_HOF_COLOR}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${WIM_HOF_COLOR}40`,
                transform: 'scale(1)'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '22px', fontWeight: '500', marginBottom: '4px' }}>
                    Hold
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: '300' }}>
                    {WIM_HOF_RECOVERY_HOLD - wimHofHoldTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Cue underneath bubble */}
            <p style={{
              fontSize: '13px',
              color: theme.textSecondary,
              margin: '0',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              Recovery hold: 15s
            </p>
          </>
        )}

        {/* Recovery Exhale Phase - circle shrinks ready for next round */}
        {wimHofPhase === 'recoveryExhale' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 24px',
              textAlign: 'center'
            }}>
              Deep breaths - fully in, let go
            </p>

            <div style={{
              position: 'relative',
              width: 'min(340px, 75vw)',
              height: 'min(340px, 75vw)',
              marginBottom: '20px'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${WIM_HOF_COLOR}30`
              }} />
              <div style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${WIM_HOF_COLOR} 0%, ${WIM_HOF_COLOR}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 32px ${WIM_HOF_COLOR}40`,
                transform: `scale(${recoveryExhaleStarted ? 0.6 : 1})`,
                transition: 'transform 1.5s ease-out'
              }}>
              </div>
            </div>
          </>
        )}

        {/* Complete Screen */}
        {wimHofPhase === 'complete' && (
          <>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              margin: '0 0 32px',
              textAlign: 'center'
            }}>
              Session complete! Here are your hold times:
            </p>

            <div style={{
              background: theme.cardBg,
              borderRadius: '16px',
              padding: '32px 48px',
              marginBottom: '32px',
              boxShadow: `0 2px 12px ${theme.shadow}`,
              minWidth: '280px'
            }}>
              {wimHofResults.map((time, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: i < wimHofResults.length - 1 ? `1px solid ${theme.border}` : 'none'
                }}>
                  <span style={{ color: theme.textSecondary, fontSize: '16px' }}>Round {i + 1}</span>
                  <span style={{ fontWeight: '600', color: theme.text, fontSize: '20px' }}>
                    {time}s
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={resetToSelection}
              style={{
                background: WIM_HOF_COLOR,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 48px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: `0 4px 16px ${WIM_HOF_COLOR}40`
              }}
            >
              Done
            </button>
          </>
        )}
      </div>
    );
  }


  // Completion Screen
  if (showCompletion) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '20px'
      }}>
        <div style={{
          background: theme.cardBg,
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: `0 4px 24px ${theme.shadow}`
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${technique?.color || '#6B9BD2'}, ${technique?.color || '#6B9BD2'}dd)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '36px',
            color: 'white'
          }}>
            ✓
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: theme.text,
            margin: '0 0 8px'
          }}>
            Well done
          </h2>

          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            margin: '0 0 16px'
          }}>
            You completed your breathing session
          </p>

          {/* 4-7-8 specific advice */}
          {selectedTechnique === 'relaxing' && (
            <p style={{
              fontSize: '14px',
              color: '#9B8AAD',
              margin: '0 0 24px',
              fontStyle: 'italic',
              lineHeight: '1.5'
            }}>
              Sit quietly and notice how you feel. Let the calm settle in.
            </p>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: theme.text }}>
                {formatTime(totalSeconds)}
              </div>
              <div style={{ fontSize: '14px', color: theme.textMuted }}>Duration</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: theme.text }}>
                {cycleCount}
              </div>
              <div style={{ fontSize: '14px', color: theme.textMuted }}>Cycles</div>
            </div>
          </div>

          <button
            onClick={resetToSelection}
            style={{
              background: technique?.color || '#6B9BD2',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              transition: 'transform 0.2s, opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  // Technique Selection Screen
  if (!selectedTechnique) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '24px 16px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: theme.cardBg,
            border: 'none',
            borderRadius: '10px',
            padding: '10px 14px',
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${theme.shadow}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#e8e8e8' : '#7a7067'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {darkMode ? (
              // Sun icon for switching to light mode
              <>
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </>
            ) : (
              // Moon icon for switching to dark mode
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            )}
          </svg>
        </button>

        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <BreatheLogo size={160} darkMode={darkMode} />
            </div>
            <p style={{
              fontSize: '16px',
              color: theme.textSecondary,
              margin: 0
            }}>
              Choose a breathing technique
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {/* 1. Quick Calm (Physiological Sigh) */}
            <button
              onClick={() => setSelectedTechnique('sigh')}
              className="technique-card"
              style={{
                background: theme.cardBg,
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: `0 2px 12px ${theme.shadow}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 12px ${theme.shadow}`;
              }}
            >
              <div className="card-icon" style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `${breathingTechniques.sigh.color}${darkMode ? '30' : '15'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: breathingTechniques.sigh.color,
                  opacity: 0.8
                }} />
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>
                  {breathingTechniques.sigh.name}
                </h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 6px' }}>
                  {breathingTechniques.sigh.description}
                </p>
                <div className="phase-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    Double Inhale
                  </span>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    Long Exhale
                  </span>
                </div>
              </div>
              <div className="card-arrow" style={{ color: darkMode ? '#606070' : '#c9c0b5', fontSize: '18px' }}>→</div>
            </button>

            {/* 2. Anxiety Release */}
            <button
              onClick={startAnxietyMode}
              className="technique-card"
              style={{
                background: theme.cardBg,
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: `0 2px 12px ${theme.shadow}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 12px ${theme.shadow}`;
              }}
            >
              <div className="card-icon" style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `#B8860B${darkMode ? '30' : '15'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#B8860B', opacity: 0.8 }} />
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>Anxiety Release</h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 6px' }}>Breathe into tension</p>
                <div className="phase-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>Self-Paced</span>
                </div>
              </div>
              <div className="card-arrow" style={{ color: darkMode ? '#606070' : '#c9c0b5', fontSize: '18px' }}>→</div>
            </button>

            {/* 3. Balanced Breathing */}
            <button
              onClick={() => setSelectedTechnique('balanced')}
              className="technique-card"
              style={{
                background: theme.cardBg,
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: `0 2px 12px ${theme.shadow}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 12px ${theme.shadow}`;
              }}
            >
              <div className="card-icon" style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `${breathingTechniques.balanced.color}${darkMode ? '30' : '15'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: breathingTechniques.balanced.color,
                  opacity: 0.8
                }} />
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>
                  {breathingTechniques.balanced.name}
                </h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 6px' }}>
                  {breathingTechniques.balanced.description}
                </p>
                <div className="phase-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    Inhale 4s
                  </span>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    Exhale 4s
                  </span>
                </div>
              </div>
              <div className="card-arrow" style={{ color: darkMode ? '#606070' : '#c9c0b5', fontSize: '18px' }}>→</div>
            </button>

            {/* 4. Sleep & Calm (4-7-8) */}
            <button
              onClick={() => setSelectedTechnique('relaxing')}
              className="technique-card"
              style={{
                background: theme.cardBg,
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: `0 2px 12px ${theme.shadow}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 12px ${theme.shadow}`;
              }}
            >
              <div className="card-icon" style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `${breathingTechniques.relaxing.color}${darkMode ? '30' : '15'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: breathingTechniques.relaxing.color,
                  opacity: 0.8
                }} />
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>
                  {breathingTechniques.relaxing.name}
                </h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 6px' }}>
                  {breathingTechniques.relaxing.description}
                </p>
                <div className="phase-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    In 4
                  </span>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    Hold 7
                  </span>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>
                    Out 8
                  </span>
                </div>
              </div>
              <div className="card-arrow" style={{ color: darkMode ? '#606070' : '#c9c0b5', fontSize: '18px' }}>→</div>
            </button>

            {/* 5. Energise (Wim Hof Method) */}
            <button
              onClick={startWimHofMode}
              className="technique-card"
              style={{
                background: theme.cardBg,
                border: 'none',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: `0 2px 12px ${theme.shadow}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 12px ${theme.shadow}`;
              }}
            >
              <div className="card-icon" style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `${WIM_HOF_COLOR}${darkMode ? '30' : '15'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: WIM_HOF_COLOR, opacity: 0.8 }} />
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: '0 0 2px' }}>Energise</h3>
                <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 6px' }}>Wim Hof Method</p>
                <div className="phase-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>30 Breaths</span>
                  <span style={{ fontSize: '11px', color: theme.tagText, background: theme.tagBg, padding: '3px 8px', borderRadius: '6px' }}>Hold</span>
                </div>
              </div>
              <div className="card-arrow" style={{ color: darkMode ? '#606070' : '#c9c0b5', fontSize: '18px' }}>→</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Breathing Screen
  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      background: darkMode
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        : `linear-gradient(135deg, ${technique.color}15 0%, ${technique.color}08 100%)`,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      paddingTop: '70px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Back Button */}
      <button
        onClick={resetToSelection}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: theme.cardBg,
          border: 'none',
          borderRadius: '10px',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: '500',
          color: theme.textSecondary,
          cursor: 'pointer',
          boxShadow: `0 2px 8px ${theme.shadow}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        ← Back
      </button>

      {/* Stats Display */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: theme.cardBg,
        borderRadius: '10px',
        padding: '10px 16px',
        boxShadow: `0 2px 8px ${theme.shadow}`,
        display: 'flex',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>
            {formatTime(totalSeconds)}
          </div>
          <div style={{ fontSize: '10px', color: theme.textMuted }}>Time</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>
            {cycleCount}
          </div>
          <div style={{ fontSize: '10px', color: theme.textMuted }}>Cycles</div>
        </div>
      </div>

      {/* Technique Name */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: theme.text,
          margin: 0
        }}>
          {technique.displayName || technique.name}
        </h2>
        {technique.cue && (
          <p style={{
            fontSize: '12px',
            color: theme.textMuted,
            margin: '6px 0 0',
            fontStyle: 'italic',
            maxWidth: '280px'
          }}>
            {technique.cue}
          </p>
        )}
      </div>

      {/* Breathing Circle */}
      <div style={{
        position: 'relative',
        width: 'min(280px, 70vw)',
        height: 'min(280px, 70vw)',
        marginBottom: '24px'
      }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `3px solid ${technique.color}30`
        }} />

        {/* Animated circle */}
        <div style={{
          position: 'absolute',
          inset: '20px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${technique.color} 0%, ${technique.color}cc 100%)`,
          transform: `scale(${getCircleScale()})`,
          transition: 'transform 0.05s linear',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSipPhase
            ? `0 0 40px ${technique.color}50, 0 0 80px ${technique.color}25, 0 8px 32px ${technique.color}40`
            : `0 8px 32px ${technique.color}40`,
          animation: isSipPhase ? 'gentleGlow 0.8s ease-in-out infinite' : 'none'
        }}>
          <style>{`
            @keyframes gentleGlow {
              0%, 100% { filter: brightness(1); }
              50% { filter: brightness(1.08); }
            }
          `}</style>
          <div style={{
            textAlign: 'center',
            color: 'white'
          }}>
            {(isActive || isPaused) && currentPhase?.name !== 'Pause' && (
              <div style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {isPaused ? 'Paused' : currentPhase?.name}
              </div>
            )}
            {isActive && !isPaused && (
              <>
                {/* For Quick Calm (sigh): only show countdown on exhale */}
                {selectedTechnique === 'sigh' && currentPhase?.name === 'Exhale' && (
                  <div style={{
                    fontSize: '42px',
                    fontWeight: '300'
                  }}>
                    {Math.ceil(currentPhase.duration - (phaseProgress / 100) * currentPhase.duration)}
                  </div>
                )}
                {/* For 4-7-8: count UP to 4, 7, 8 respectively */}
                {selectedTechnique === 'relaxing' && (
                  <>
                    <div style={{
                      fontSize: '42px',
                      fontWeight: '300'
                    }}>
                      {(() => {
                        const elapsed = (phaseProgress / 100) * currentPhase.duration;
                        const count = Math.floor(elapsed * 2) + 1; // 2 counts per second
                        const maxCount = currentPhase.name === 'Inhale' ? 4 :
                                         currentPhase.name === 'Hold' ? 7 : 8;
                        return Math.min(count, maxCount);
                      })()}
                    </div>
                    {currentPhase?.name === 'Exhale' && (
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '400',
                        opacity: 0.9,
                        marginTop: '4px',
                        letterSpacing: '2px'
                      }}>
                        whoooosh
                      </div>
                    )}
                  </>
                )}
                {/* For balanced breathing: show countdown */}
                {selectedTechnique === 'balanced' && (
                  <div style={{
                    fontSize: '42px',
                    fontWeight: '300'
                  }}>
                    {Math.ceil(currentPhase.duration - (phaseProgress / 100) * currentPhase.duration)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Phase Indicators - filter out Pause (it's behind the scenes) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {technique.phases.filter(p => p.name !== 'Pause').map((phase, i) => {
          // Find the actual index in the original phases array for highlighting
          const actualIndex = technique.phases.findIndex(p => p.name === phase.name);
          return (
            <div
              key={i}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                background: currentPhaseIndex === actualIndex && isActive && !isPaused
                  ? technique.color
                  : theme.cardBg,
                color: currentPhaseIndex === actualIndex && isActive && !isPaused
                  ? 'white'
                  : theme.textSecondary,
                boxShadow: `0 2px 8px ${theme.shadow}`,
                transition: 'all 0.3s ease'
              }}
            >
              {phase.name}
            </div>
          );
        })}
      </div>

      {/* Quick Calm Mode Selector */}
      {selectedTechnique === 'sigh' && !isActive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '12px', color: theme.textSecondary }}>Mode:</span>
          <button
            onClick={() => setSighMode('cycles')}
            style={{
              background: sighMode === 'cycles' ? technique.color : theme.cardBg,
              color: sighMode === 'cycles' ? 'white' : theme.text,
              border: 'none',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: `0 2px 8px ${theme.shadow}`
            }}
          >
            3 cycles
          </button>
          <button
            onClick={() => setSighMode('timer')}
            style={{
              background: sighMode === 'timer' ? technique.color : theme.cardBg,
              color: sighMode === 'timer' ? 'white' : theme.text,
              border: 'none',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: `0 2px 8px ${theme.shadow}`
            }}
          >
            5 min practice
          </button>
        </div>
      )}

      {/* 4-7-8 Cycle Selector */}
      {selectedTechnique === 'relaxing' && !isActive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '12px', color: theme.textSecondary }}>Cycles:</span>
          {[4, 8].map((cycles) => (
            <button
              key={cycles}
              onClick={() => setRelaxingTargetCycles(cycles)}
              style={{
                background: relaxingTargetCycles === cycles ? technique.color : theme.cardBg,
                color: relaxingTargetCycles === cycles ? 'white' : theme.text,
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: `0 2px 8px ${theme.shadow}`
              }}
            >
              {cycles} {cycles === 4 ? '(beginner)' : '(advanced)'}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        {!isActive ? (
          <button
            onClick={startExercise}
            style={{
              background: technique.color,
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 36px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${technique.color}40`,
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Begin
          </button>
        ) : (
          <>
            <button
              onClick={isPaused ? resumeExercise : pauseExercise}
              style={{
                background: theme.cardBg,
                color: theme.text,
                border: 'none',
                borderRadius: '14px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: `0 2px 12px ${theme.shadow}`
              }}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={stopExercise}
              style={{
                background: technique.color,
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: `0 4px 16px ${technique.color}40`
              }}
            >
              Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
}
