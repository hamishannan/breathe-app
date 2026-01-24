'use client';

import React, { useState, useEffect, useRef } from 'react';

// Stylised Breathe Logo Component
const BreatheLogo = ({ size = 120 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 240 120" fill="none">
    {/* Flowing breath waves */}
    <defs>
      <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#C4857A" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#9B8AAD" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7C9885" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3d3a38" />
        <stop offset="100%" stopColor="#5a5550" />
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
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Exhale', duration: 4 }
    ],
    color: '#7C9885'  // Sage green - grounding
  },
  relaxing: {
    name: 'Sleep & Calm',
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
    name: 'Physiological Sigh',
    description: 'Double inhale for quick calm',
    cue: 'In through your nose, out through your mouth',
    phases: [
      { name: 'Inhale', duration: 2 },
      { name: 'Pause', duration: 0.5 },
      { name: 'Sip More!', duration: 1.5 },
      { name: 'Exhale', duration: 4 }
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

export default function BreathingExercise() {
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // 4-7-8 cycle target (4 = beginner, 8 = advanced)
  const [relaxingTargetCycles, setRelaxingTargetCycles] = useState(4);

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
                return newCount;
              });
            }

            return 0;
          }

          return newProgress;
        });

        setTotalSeconds(prev => prev + tickInterval / 1000);
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
      // For physiological sigh, first inhale goes to 80%
      const targetScale = selectedTechnique === 'sigh' ? 0.8 : 1;
      return 0.6 + ((targetScale - 0.6) * progress);
    } else if (currentPhase.name === 'Pause') {
      // Brief pause at 80% before the sip
      return 0.8;
    } else if (currentPhase.name === 'Sip More!') {
      // Soft ballooning expansion from 80% to 102%
      // Use easeOutBack for a gentle overshoot feeling
      const easeOutBack = (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };
      const easedProgress = easeOutBack(progress);
      return 0.8 + (0.22 * easedProgress);
    } else if (currentPhase.name === 'Exhale') {
      // Start from 1.05 if coming from sigh, otherwise 1
      const startScale = selectedTechnique === 'sigh' ? 1.05 : 1;
      return startScale - ((startScale - 0.6) * progress);
    }
    return currentPhase.name === 'Hold' && currentPhaseIndex > 0 ? 1 : 0.6;
  };

  // Check if we're in the energetic "Sip More!" phase
  const isSipPhase = currentPhase?.name === 'Sip More!';

  // Anxiety Mode Screen - TAP BASED breathing tracker
  if (anxietyMode) {
    const anxietyColor = '#B8860B'; // Warm goldenrod color

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf7f5 0%, #f5ebe4 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        {/* Back Button */}
        <button
          onClick={resetToSelection}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#7a7067',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          ← Back
        </button>

        {anxietyPhase === 'results' ? (
          // Results view
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '360px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#3d3a38',
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
                color: '#3d3a38',
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
                  background: 'white',
                  border: '2px solid #e5e0d8',
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
              fontSize: '24px',
              fontWeight: '600',
              color: '#3d3a38',
              margin: '0 0 8px',
              textAlign: 'center'
            }}>
              Breathe into Anxiety
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#a39a8f',
              margin: '0 0 48px',
              textAlign: 'center',
              maxWidth: '300px',
              lineHeight: '1.5'
            }}>
              Identify where you feel stress or anxiety in your body, breathe into that
            </p>

            {/* Animated Breathing Circle */}
            <div
              onClick={handleAnxietyTap}
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                cursor: 'pointer',
                marginBottom: '32px'
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
              minHeight: '80px'
            }}>
              {(anxietyPhase === 'intro' || anxietyBreathPhase === 'exhale') ? (
                <p style={{
                  fontSize: '14px',
                  color: '#7a7067',
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  Tap when you breathe in
                </p>
              ) : (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '2',
                  fontStyle: 'italic',
                  color: '#7a7067'
                }}>
                  <div>Breathe in</div>
                  <div>Hold breath in area of anxiety</div>
                  <div>Tap when you breathe out</div>
                </div>
              )}
            </div>

            {/* Done button container - always present to prevent layout shift */}
            <div style={{
              marginTop: '32px',
              height: '48px',
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
                    background: 'white',
                    border: '2px solid #e5e0d8',
                    borderRadius: '12px',
                    padding: '14px 32px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#7a7067',
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
        background: 'linear-gradient(135deg, #f5f8fa 0%, #e8f0f5 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative'
      }}>
        {/* Back Button */}
        <button
          onClick={resetToSelection}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#7a7067',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          ← Back
        </button>

        {wimHofPhase !== 'setup' && wimHofPhase !== 'complete' && (
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'white',
            borderRadius: '12px',
            padding: '12px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <span style={{ color: '#7a7067', fontSize: '14px' }}>
              Round {wimHofRound} of {wimHofTotalRounds}
            </span>
          </div>
        )}

        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#3d3a38',
          margin: '0 0 8px',
          textAlign: 'center'
        }}>
          Wim Hof Method
        </h2>

        {/* Setup Screen */}
        {wimHofPhase === 'setup' && (
          <>
            <p style={{
              fontSize: '14px',
              color: '#a39a8f',
              margin: '0 0 24px',
              textAlign: 'center',
              maxWidth: '320px',
              lineHeight: '1.5'
            }}>
              30 deep breaths, then hold as long as comfortable.
            </p>
            <p style={{
              fontSize: '14px',
              color: '#7a7067',
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
                    background: wimHofTargetHold === time ? WIM_HOF_COLOR : 'white',
                    color: wimHofTargetHold === time ? 'white' : '#3d3a38',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
                    background: wimHofTotalRounds === rounds ? WIM_HOF_COLOR : 'white',
                    color: wimHofTotalRounds === rounds ? 'white' : '#3d3a38',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
              color: '#a39a8f',
              margin: '0 0 48px',
              textAlign: 'center'
            }}>
              Deep breaths - fully in, let go
            </p>

            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              marginBottom: '32px'
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
              fontSize: '14px',
              color: '#7a7067',
              margin: '0',
              textAlign: 'center',
              minHeight: '20px',
              fontStyle: 'italic'
            }}>
              {wimHofBreathCount <= 10
                ? 'Into the belly, into the chest, let it go'
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
              color: '#a39a8f',
              margin: '0 0 48px',
              textAlign: 'center'
            }}>
              Hold - tap when you need to breathe
            </p>

            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              marginBottom: '32px',
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
                  <div style={{ fontSize: '16px', fontWeight: '400', marginBottom: '4px', opacity: 0.9 }}>
                    Hold
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: '300' }}>
                    {wimHofHoldTime}
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#a39a8f' }}>
              Target: {wimHofTargetHold}s
            </p>
          </>
        )}

        {/* Recovery Inhale Phase - breath IN first */}
        {wimHofPhase === 'recoveryInhale' && (
          <>
            <p style={{
              fontSize: '14px',
              color: '#a39a8f',
              margin: '0 0 48px',
              textAlign: 'center'
            }}>
              Deep breath in
            </p>

            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              marginBottom: '32px'
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

          </>
        )}

        {/* Recovery Phase - circle stays BIG for 15 second countdown */}
        {wimHofPhase === 'recovery' && (
          <>
            <p style={{
              fontSize: '14px',
              color: '#a39a8f',
              margin: '0 0 48px',
              textAlign: 'center'
            }}>
              Hold it in
            </p>

            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              marginBottom: '32px'
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
                  <div style={{ fontSize: '16px', fontWeight: '400', marginBottom: '4px', opacity: 0.9 }}>
                    Hold
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: '300' }}>
                    {WIM_HOF_RECOVERY_HOLD - wimHofHoldTime}
                  </div>
                </div>
              </div>
            </div>

          </>
        )}

        {/* Recovery Exhale Phase - circle shrinks ready for next round */}
        {wimHofPhase === 'recoveryExhale' && (
          <>
            <div style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              marginBottom: '32px'
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
              color: '#a39a8f',
              margin: '0 0 32px',
              textAlign: 'center'
            }}>
              Session complete! Here are your hold times:
            </p>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px 48px',
              marginBottom: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              minWidth: '280px'
            }}>
              {wimHofResults.map((time, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: i < wimHofResults.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}>
                  <span style={{ color: '#7a7067', fontSize: '16px' }}>Round {i + 1}</span>
                  <span style={{ fontWeight: '600', color: '#3d3a38', fontSize: '20px' }}>
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
        background: 'linear-gradient(135deg, #faf7f5 0%, #f5ebe4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
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
            fontSize: '36px'
          }}>
            ✓
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#3d3a38',
            margin: '0 0 8px'
          }}>
            Well done
          </h2>

          <p style={{
            fontSize: '16px',
            color: '#7a7067',
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
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#3d3a38' }}>
                {formatTime(totalSeconds)}
              </div>
              <div style={{ fontSize: '14px', color: '#a39a8f' }}>Duration</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#3d3a38' }}>
                {cycleCount}
              </div>
              <div style={{ fontSize: '14px', color: '#a39a8f' }}>Cycles</div>
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
        background: 'linear-gradient(135deg, #faf7f5 0%, #f5ebe4 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <BreatheLogo size={200} />
            </div>
            <p style={{
              fontSize: '18px',
              color: '#7a7067',
              margin: 0
            }}>
              Choose a breathing technique
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {Object.entries(breathingTechniques).map(([key, tech]) => (
              <button
                key={key}
                onClick={() => setSelectedTechnique(key)}
                style={{
                  background: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: `${tech.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: tech.color,
                    opacity: 0.8
                  }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#3d3a38',
                    margin: '0 0 4px'
                  }}>
                    {tech.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#a39a8f',
                    margin: '0 0 8px'
                  }}>
                    {tech.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {tech.phases.map((phase, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '12px',
                          color: '#7a7067',
                          background: '#f5efe8',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {phase.name} {phase.duration}s
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  color: '#c9c0b5',
                  fontSize: '20px'
                }}>
                  →
                </div>
              </button>
            ))}

            {/* Wim Hof Method */}
            <button
              onClick={startWimHofMode}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `${WIM_HOF_COLOR}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: WIM_HOF_COLOR,
                  opacity: 0.8
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#3d3a38',
                  margin: '0 0 4px'
                }}>
                  Wim Hof Method
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#a39a8f',
                  margin: '0 0 8px'
                }}>
                  Energise & build resilience
                </p>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#7a7067',
                    background: '#f5efe8',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>
                    30 breaths + retention
                  </span>
                </div>
              </div>

              <div style={{
                color: '#c9c0b5',
                fontSize: '20px'
              }}>
                →
              </div>
            </button>

            {/* Breathe into Anxiety - Same style as other cards */}
            <button
              onClick={startAnxietyMode}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: '#B8860B15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#B8860B',
                  opacity: 0.8
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#3d3a38',
                  margin: '0 0 4px'
                }}>
                  Anxiety Release
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#a39a8f',
                  margin: '0 0 8px'
                }}>
                  Breathe into tension at your own pace
                </p>
                <span style={{
                  fontSize: '12px',
                  color: '#7a7067',
                  background: '#f5efe8',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  Tap to signal breaths
                </span>
              </div>

              <div style={{
                color: '#c9c0b5',
                fontSize: '20px'
              }}>
                →
              </div>
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
      background: `linear-gradient(135deg, ${technique.color}15 0%, ${technique.color}08 100%)`,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Back Button */}
      <button
        onClick={resetToSelection}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          background: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#7a7067',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Back
      </button>

      {/* Stats Display */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        background: 'white',
        borderRadius: '12px',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        gap: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#3d3a38' }}>
            {formatTime(totalSeconds)}
          </div>
          <div style={{ fontSize: '12px', color: '#a39a8f' }}>Time</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#3d3a38' }}>
            {cycleCount}
          </div>
          <div style={{ fontSize: '12px', color: '#a39a8f' }}>Cycles</div>
        </div>
      </div>

      {/* Technique Name */}
      <div style={{
        textAlign: 'center',
        marginBottom: '48px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#3d3a38',
          margin: 0
        }}>
          {technique.name}
        </h2>
        {technique.cue && (
          <p style={{
            fontSize: '14px',
            color: '#a39a8f',
            margin: '8px 0 0',
            fontStyle: 'italic'
          }}>
            {technique.cue}
          </p>
        )}
      </div>

      {/* Breathing Circle */}
      <div style={{
        position: 'relative',
        width: '280px',
        height: '280px',
        marginBottom: '48px'
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
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              {isActive ? (isPaused ? 'Paused' : currentPhase?.name) : 'Ready'}
            </div>
            {isActive && !isPaused && (
              <>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '300'
                }}>
                  {(() => {
                    // For 4-7-8: count UP to 4, 7, 8 respectively (at 2 counts per second)
                    if (selectedTechnique === 'relaxing') {
                      const elapsed = (phaseProgress / 100) * currentPhase.duration;
                      const count = Math.floor(elapsed * 2) + 1; // 2 counts per second
                      const maxCount = currentPhase.name === 'Inhale' ? 4 :
                                       currentPhase.name === 'Hold' ? 7 : 8;
                      return Math.min(count, maxCount);
                    }
                    // For other techniques, show countdown
                    return Math.ceil(currentPhase.duration - (phaseProgress / 100) * currentPhase.duration);
                  })()}
                </div>
                {currentPhase?.name === 'Exhale' && selectedTechnique === 'relaxing' && (
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
          </div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '48px'
      }}>
        {technique.phases.map((phase, i) => (
          <div
            key={i}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              background: currentPhaseIndex === i && isActive && !isPaused
                ? technique.color
                : 'white',
              color: currentPhaseIndex === i && isActive && !isPaused
                ? 'white'
                : '#6b7280',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease'
            }}
          >
            {phase.name}
          </div>
        ))}
      </div>

      {/* 4-7-8 Cycle Selector */}
      {selectedTechnique === 'relaxing' && !isActive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '14px', color: '#7a7067' }}>Cycles:</span>
          {[4, 8].map((cycles) => (
            <button
              key={cycles}
              onClick={() => setRelaxingTargetCycles(cycles)}
              style={{
                background: relaxingTargetCycles === cycles ? technique.color : 'white',
                color: relaxingTargetCycles === cycles ? 'white' : '#3d3a38',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
        gap: '16px'
      }}>
        {!isActive ? (
          <button
            onClick={startExercise}
            style={{
              background: technique.color,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 48px',
              fontSize: '18px',
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
                background: 'white',
                color: '#3d3a38',
                border: 'none',
                borderRadius: '16px',
                padding: '18px 36px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
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
                borderRadius: '16px',
                padding: '18px 36px',
                fontSize: '16px',
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
