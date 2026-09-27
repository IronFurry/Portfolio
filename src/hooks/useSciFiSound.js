import { useState, useCallback, useEffect, useRef } from 'react';

// ============================================================
// GLOBAL AUDIO STATE
// ============================================================

let globalAudioCtx = null;
let globalAmbientNodes = null;
let globalScheduler = null;
let globalSoundEnabled = true;

// Used to invalidate old async audio operations
let globalAudioGeneration = 0;


// ============================================================
// HARD STOP
// ============================================================

const stopAllAudio = () => {
  // Invalidate anything from the previous audio session
  globalAudioGeneration += 1;

  // Stop future score scheduling
  if (globalScheduler) {
    clearInterval(globalScheduler);
    globalScheduler = null;
  }

  // Close the entire Web Audio graph.
  // This kills:
  // - scheduled melody
  // - bass
  // - pads
  // - ambient oscillators
  // - reverb
  // - SFX
  if (globalAudioCtx) {
    try {
      globalAudioCtx.close();
    } catch (error) {
      console.warn('AudioContext close error:', error);
    }
  }

  globalAudioCtx = null;
  globalAmbientNodes = null;
};


// ============================================================
// HOOK
// ============================================================

export function useSciFiSound() {

  const [soundEnabled, setSoundEnabled] =
    useState(globalSoundEnabled);

  const soundEnabledRef =
    useRef(soundEnabled);


  // Keep refs/global state synchronized
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    globalSoundEnabled = soundEnabled;
  }, [soundEnabled]);


  // ==========================================================
  // MUSICAL DATA
  // ==========================================================

  const MELODY = [
    { f: 220.0, t: 0.0, d: 1.6, v: 0.10 },
    { f: 261.6, t: 1.8, d: 1.2, v: 0.08 },
    { f: 293.7, t: 3.2, d: 2.0, v: 0.10 },

    { f: 329.6, t: 5.4, d: 1.2, v: 0.09 },
    { f: 392.0, t: 6.8, d: 1.6, v: 0.11 },
    { f: 440.0, t: 8.5, d: 2.4, v: 0.12 },

    { f: 392.0, t: 11.2, d: 1.0, v: 0.09 },
    { f: 329.6, t: 12.4, d: 1.2, v: 0.08 },
    { f: 261.6, t: 13.8, d: 1.8, v: 0.10 },

    { f: 220.0, t: 15.8, d: 3.0, v: 0.11 },
  ];

  const MOTIF_LEN = 20.0;

  const BASS = [
    { f: 55.0, t: 0.0, d: 3.5, v: 0.28 },
    { f: 55.0, t: 4.0, d: 3.5, v: 0.24 },
    { f: 65.4, t: 8.0, d: 3.5, v: 0.22 },
    { f: 55.0, t: 12.0, d: 3.5, v: 0.26 },
    { f: 49.0, t: 16.0, d: 3.5, v: 0.20 },
  ];

  const PULSE_INTERVAL = 2.4;


  // ==========================================================
  // START CINEMATIC SCORE
  // ==========================================================

  const startCinematicScore = useCallback(() => {

    if (
      !globalAudioCtx ||
      globalAmbientNodes ||
      !globalSoundEnabled
    ) {
      return;
    }

    const ctx = globalAudioCtx;

    if (ctx.state !== 'running') {
      return;
    }

    try {

      // ------------------------------------------------------
      // MASTER BUS
      // ------------------------------------------------------

      const master = ctx.createGain();

      master.gain.setValueAtTime(
        0.0001,
        ctx.currentTime
      );

      master.gain.linearRampToValueAtTime(
        0.72,
        ctx.currentTime + 4
      );

      master.connect(ctx.destination);


      // ------------------------------------------------------
      // REVERB NETWORK
      // ------------------------------------------------------

      const reverbDelay1 = ctx.createDelay(2.0);
      const reverbDelay2 = ctx.createDelay(2.5);

      const reverbGain = ctx.createGain();
      const reverbFeed = ctx.createGain();

      reverbDelay1.delayTime.value = 0.22;
      reverbDelay2.delayTime.value = 0.38;

      reverbGain.gain.value = 0.28;
      reverbFeed.gain.value = 0.35;

      reverbDelay1.connect(reverbDelay2);
      reverbDelay2.connect(reverbFeed);

      reverbFeed.connect(reverbDelay1);
      reverbFeed.connect(reverbGain);

      reverbGain.connect(master);


      // ------------------------------------------------------
      // MELODY NOTE
      // ------------------------------------------------------

      const playNote = (
        freq,
        startTime,
        duration,
        volume,
        type = 'sine'
      ) => {

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(
          0,
          startTime
        );

        gain.gain.linearRampToValueAtTime(
          volume,
          startTime + Math.min(0.4, duration * 0.25)
        );

        gain.gain.setValueAtTime(
          volume,
          startTime +
          duration -
          Math.min(0.6, duration * 0.35)
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + duration
        );

        osc.connect(gain);

        gain.connect(master);
        gain.connect(reverbDelay1);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      };


      // ------------------------------------------------------
      // PAD
      // ------------------------------------------------------

      const playPad = (
        freq,
        startTime,
        duration,
        volume
      ) => {

        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();

        const carrier = ctx.createOscillator();
        const carGain = ctx.createGain();

        mod.frequency.value = freq * 2.01;
        modGain.gain.value = freq * 1.4;

        mod.connect(modGain);
        modGain.connect(carrier.frequency);

        carrier.type = 'sine';
        carrier.frequency.value = freq;

        carGain.gain.setValueAtTime(
          0,
          startTime
        );

        carGain.gain.linearRampToValueAtTime(
          volume,
          startTime + 1.2
        );

        carGain.gain.setValueAtTime(
          volume,
          startTime + duration - 1.5
        );

        carGain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + duration
        );

        carrier.connect(carGain);

        carGain.connect(master);
        carGain.connect(reverbDelay1);

        mod.start(startTime);
        mod.stop(startTime + duration + 0.1);

        carrier.start(startTime);
        carrier.stop(startTime + duration + 0.1);
      };


      // ------------------------------------------------------
      // BASS
      // ------------------------------------------------------

      const playBass = (
        freq,
        startTime,
        duration,
        volume
      ) => {

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const filter =
          ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 180;
        filter.Q.value = 1.8;

        gain.gain.setValueAtTime(
          0,
          startTime
        );

        gain.gain.linearRampToValueAtTime(
          volume,
          startTime + 0.5
        );

        gain.gain.setValueAtTime(
          volume,
          startTime + duration - 0.8
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + duration
        );

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      };


      // ------------------------------------------------------
      // PULSE
      // ------------------------------------------------------

      const playPulse = (startTime) => {

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';

        osc.frequency.setValueAtTime(
          90,
          startTime
        );

        osc.frequency.exponentialRampToValueAtTime(
          30,
          startTime + 0.18
        );

        gain.gain.setValueAtTime(
          0.07,
          startTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + 0.22
        );

        osc.connect(gain);
        gain.connect(master);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      };


      // ------------------------------------------------------
      // AMBIENT PAD
      // ------------------------------------------------------

      const ambPad1 = ctx.createOscillator();
      const ambPad2 = ctx.createOscillator();

      const ambFilter =
        ctx.createBiquadFilter();

      const ambGain =
        ctx.createGain();

      const lfo =
        ctx.createOscillator();

      const lfoGain =
        ctx.createGain();

      ambPad1.type = 'triangle';
      ambPad1.frequency.value = 110;

      ambPad2.type = 'sine';
      ambPad2.frequency.value = 164.8;

      ambFilter.type = 'lowpass';
      ambFilter.frequency.value = 380;
      ambFilter.Q.value = 1.4;

      ambGain.gain.setValueAtTime(
        0,
        ctx.currentTime
      );

      ambGain.gain.linearRampToValueAtTime(
        0.18,
        ctx.currentTime + 5
      );

      lfo.frequency.value = 0.06;
      lfoGain.gain.value = 120;

      lfo.connect(lfoGain);
      lfoGain.connect(ambFilter.frequency);

      ambPad1.connect(ambFilter);
      ambPad2.connect(ambFilter);

      ambFilter.connect(ambGain);

      ambGain.connect(master);
      ambGain.connect(reverbDelay1);

      ambPad1.start();
      ambPad2.start();
      lfo.start();


      // ------------------------------------------------------
      // LOOPING SCORE
      // ------------------------------------------------------

      const cycleStart =
        ctx.currentTime + 1.0;


      const scheduleCycle = (offset) => {

        MELODY.forEach(
          ({ f, t, d, v }) => {
            playNote(
              f,
              offset + t,
              d,
              v,
              'sine'
            );
          }
        );


        BASS.forEach(
          ({ f, t, d, v }) => {
            playBass(
              f,
              offset + t,
              d,
              v
            );
          }
        );


        const chords = [
          [220, 261.6, 329.6],
          [196, 261.6, 329.6],
          [174.6, 261.6, 329.6],
          [220, 261.6, 329.6],
        ];


        chords.forEach(
          (chord, i) => {

            chord.forEach(f => {

              playPad(
                f,
                offset +
                i * (MOTIF_LEN / 4),

                MOTIF_LEN / 4 - 0.5,

                0.022
              );

            });

          }
        );


        for (
          let p = 0;
          p < Math.floor(
            MOTIF_LEN / PULSE_INTERVAL
          );
          p++
        ) {

          playPulse(
            offset +
            p * PULSE_INTERVAL +
            0.2
          );

        }
      };


      // Schedule only 2 cycles initially.
      // This keeps mute/restart much cleaner.
      for (let i = 0; i < 2; i++) {
        scheduleCycle(
          cycleStart +
          i * MOTIF_LEN
        );
      }


      let nextCycle =
        cycleStart +
        2 * MOTIF_LEN;


      const scheduleAhead = () => {

        if (
          !globalAudioCtx ||
          !globalSoundEnabled ||
          globalAudioCtx.state !== 'running'
        ) {
          return;
        }

        while (
          nextCycle <
          globalAudioCtx.currentTime + 25
        ) {

          scheduleCycle(nextCycle);

          nextCycle += MOTIF_LEN;
        }
      };


      globalScheduler =
        setInterval(
          scheduleAhead,
          10000
        );


      globalAmbientNodes = {
        master,
        oscillators: [
          ambPad1,
          ambPad2,
          lfo
        ]
      };

    } catch (error) {

      console.warn(
        'Cinematic score init error:',
        error
      );

    }

  }, []);


  // ==========================================================
  // INITIALIZE AUDIO
  // ==========================================================

  const initAudio = useCallback(
    async () => {

      if (!soundEnabledRef.current) {
        return;
      }

      const generation =
        globalAudioGeneration;


      try {

        if (!globalAudioCtx) {

          const AudioCtx =
            window.AudioContext ||
            window.webkitAudioContext;

          if (!AudioCtx) {
            console.warn(
              'Web Audio API is not supported.'
            );

            return;
          }

          globalAudioCtx =
            new AudioCtx();
        }


        if (
          globalAudioCtx.state !==
          'running'
        ) {

          await globalAudioCtx.resume();
        }


        // User could have muted while
        // resume() was waiting.
        if (
          generation !==
          globalAudioGeneration
        ) {
          return;
        }

        if (
          !soundEnabledRef.current ||
          !globalSoundEnabled
        ) {
          return;
        }


        startCinematicScore();

      } catch (error) {

        console.warn(
          'Audio initialization error:',
          error
        );

      }

    },
    [startCinematicScore]
  );


  // ==========================================================
  // SOUND TOGGLE
  // ==========================================================

  const toggleSound = useCallback(
    () => {

      setSoundEnabled(prev => {

        const next = !prev;

        soundEnabledRef.current =
          next;

        globalSoundEnabled =
          next;


        if (!next) {

          // 🔇 HARD STOP
          stopAllAudio();

        } else {

          // 🔊 Restart on the user's
          // button interaction.
          initAudio();

        }


        return next;

      });

    },
    [initAudio]
  );


  // ==========================================================
  // SFX
  // ==========================================================

  const playSound = useCallback(
    (type) => {

      if (
        !soundEnabledRef.current ||
        !globalSoundEnabled ||
        !globalAudioCtx ||
        globalAudioCtx.state !== 'running'
      ) {
        return;
      }


      const ctx =
        globalAudioCtx;

      const now =
        ctx.currentTime;


      try {

        switch (type) {

          // ----------------------------------------------
          // TYPING
          // ----------------------------------------------

          case 'type_char': {

            const o =
              ctx.createOscillator();

            const g =
              ctx.createGain();

            o.type = 'sine';

            o.frequency.setValueAtTime(
              750 +
              Math.random() * 250,
              now
            );

            o.frequency.exponentialRampToValueAtTime(
              200,
              now + 0.035
            );

            g.gain.setValueAtTime(
              0.05,
              now
            );

            g.gain.exponentialRampToValueAtTime(
              0.001,
              now + 0.035
            );

            o.connect(g);

            // Direct connection is okay because
            // close() kills the entire context.
            g.connect(ctx.destination);

            o.start(now);
            o.stop(now + 0.04);

            break;
          }


          // ----------------------------------------------
          // BOOT OK
          // ----------------------------------------------

          case 'boot_ok': {

            [960, 1920].forEach(
              (f, i) => {

                const o =
                  ctx.createOscillator();

                const g =
                  ctx.createGain();

                const start =
                  now + i * 0.08;

                o.type = 'triangle';
                o.frequency.value = f;

                g.gain.setValueAtTime(
                  0.1,
                  start
                );

                g.gain.exponentialRampToValueAtTime(
                  0.001,
                  start + 0.12
                );

                o.connect(g);
                g.connect(ctx.destination);

                o.start(start);
                o.stop(start + 0.14);

              }
            );

            break;
          }


          // ----------------------------------------------
          // IDENTITY FOUND
          // ----------------------------------------------

          case 'identity_found': {

            [220, 329.6, 440, 659.3, 880]
              .forEach((f, i) => {

                const o =
                  ctx.createOscillator();

                const g =
                  ctx.createGain();

                const start =
                  now + i * 0.04;

                o.type = 'sine';
                o.frequency.value = f;

                g.gain.setValueAtTime(
                  0,
                  start
                );

                g.gain.linearRampToValueAtTime(
                  0.07,
                  start + 0.06
                );

                g.gain.exponentialRampToValueAtTime(
                  0.0001,
                  start + 1.4
                );

                o.connect(g);
                g.connect(ctx.destination);

                o.start(start);
                o.stop(start + 1.5);

              });

            break;
          }


          // ----------------------------------------------
          // ACCESS GRANTED
          // ----------------------------------------------

          case 'access_granted': {

            [
              146.8,
              220,
              293.7,
              440,
              587.3,
              880
            ].forEach((f, i) => {

              const o =
                ctx.createOscillator();

              const g =
                ctx.createGain();

              const start =
                now + i * 0.05;

              o.type =
                i % 2 === 0
                  ? 'sine'
                  : 'triangle';

              o.frequency.value = f;

              g.gain.setValueAtTime(
                0,
                start
              );

              g.gain.linearRampToValueAtTime(
                0.1,
                start + 0.08
              );

              g.gain.exponentialRampToValueAtTime(
                0.0001,
                start + 1.4
              );

              o.connect(g);
              g.connect(ctx.destination);

              o.start(start);
              o.stop(start + 1.5);

            });

            break;
          }


          // ----------------------------------------------
          // ARCHIVE ENTER
          // ----------------------------------------------

          case 'archive_enter': {

            const o =
              ctx.createOscillator();

            const g =
              ctx.createGain();

            o.type = 'sine';

            o.frequency.setValueAtTime(
              200,
              now
            );

            o.frequency.exponentialRampToValueAtTime(
              30,
              now + 1.4
            );

            g.gain.setValueAtTime(
              0.18,
              now
            );

            g.gain.exponentialRampToValueAtTime(
              0.0001,
              now + 1.45
            );

            o.connect(g);
            g.connect(ctx.destination);

            o.start(now);
            o.stop(now + 1.5);

            break;
          }

          default:
            break;
        }

      } catch (error) {

        console.warn(
          'SFX error:',
          error
        );

      }

    },
    []
  );


  // ==========================================================
  // AUTO START & GESTURE UNLOCK
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    // Immediately try starting audio from the very beginning
    if (soundEnabledRef.current) {
      initAudio();
    }

    const handleUnlock = () => {
      if (mounted && soundEnabledRef.current) {
        initAudio();
      }
    };

    window.addEventListener('pointerdown', handleUnlock, { once: true });
    window.addEventListener('keydown', handleUnlock, { once: true });
    window.addEventListener('click', handleUnlock, { once: true });
    window.addEventListener('mousemove', handleUnlock, { once: true });
    window.addEventListener('touchstart', handleUnlock, { once: true });

    return () => {
      mounted = false;
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
      window.removeEventListener('click', handleUnlock);
      window.removeEventListener('mousemove', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
    };
  }, [initAudio]);


  // ==========================================================
  // RETURN API
  // ==========================================================

  return {
    soundEnabled,
    toggleSound,
    playSound,
    initAudio
  };
}