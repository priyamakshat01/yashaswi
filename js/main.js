/* ========================================================
   GIFT WEBSITE - MAIN JAVASCRIPT
   Ambient floating particles, interactive effects & navigation
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Ambient Floating Particle Canvas
  initAmbientCanvas();

  // Initialize Cake Cutting & Candle Blowing Interactions
  initCakeCuttingInteraction();

  // Initialize Clue Interactions if on clue page
  initClueInteractions();

  // Initialize Background Music Player
  initBackgroundMusic();
});

/* ========================================================
   BACKGROUND MUSIC PLAYER
   ======================================================== */
function initBackgroundMusic() {
  const musicBtn = document.createElement('button');
  musicBtn.className = 'floating-music-btn';
  musicBtn.id = 'floating-music-btn';
  musicBtn.setAttribute('title', 'Play Background Music');
  musicBtn.innerHTML = '🎵';
  document.body.appendChild(musicBtn);

  const audio = new Audio();
  // Checks for audio/song.mp3 or audio/birthday-song.mp3
  audio.src = 'audio/song.mp3';
  audio.loop = true;
  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.innerHTML = '🎶';
      }).catch(err => {
        // If file not found, try alternative or show tooltip
        audio.src = 'audio/birthday-song.mp3';
        audio.play().then(() => {
          isPlaying = true;
          musicBtn.classList.add('playing');
          musicBtn.innerHTML = '🎶';
        }).catch(() => {
          alert('💡 Tip: Place your favorite song as "song.mp3" inside the "audio" folder to play music!');
        });
      });
    } else {
      audio.pause();
      isPlaying = false;
      musicBtn.classList.remove('playing');
      musicBtn.innerHTML = '🎵';
    }
  });
}

/* ========================================================
   AMBIENT FLOATING HEARTS & SPARKLES CANVAS
   ======================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 28; // Subtle and lightweight
  const colors = ['#ff8fa3', '#ffb3c1', '#ffd166', '#ffccd5', '#ffffff'];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 12 + 6;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.4 + 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.isHeart = Math.random() > 0.4;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        const s = this.size / 14;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
        ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ========================================================
   CONFETTI CELEBRATION BURST (Zero dependencies)
   ======================================================== */
function triggerConfetti() {
  const count = 110;
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.top = '0';
  confettiCanvas.style.left = '0';
  confettiCanvas.style.width = '100vw';
  confettiCanvas.style.height = '100vh';
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex = '9999';
  document.body.appendChild(confettiCanvas);

  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#ff5277', '#ff758f', '#ffd166', '#06d6a0', '#118ab2', '#9d4edd', '#ffafbd'];

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.55,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 1.3) * 18 - 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      alpha: 1
    });
  }

  let startTime = Date.now();

  function render() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let p of confettiPieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      if (elapsed > 2000) {
        p.alpha -= 0.02;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();
    }

    if (elapsed < 3500) {
      requestAnimationFrame(render);
    } else {
      confettiCanvas.remove();
    }
  }

  requestAnimationFrame(render);
}

/* ========================================================
   CAKE CUTTING & CANDLE BLOWING SEQUENCE
   ======================================================== */
function initCakeCuttingInteraction() {
  const cutBtn = document.getElementById('cut-cake-btn');
  const confettiBtn = document.getElementById('celebrate-confetti-btn');
  const candleFlame = document.getElementById('candle-flame');
  const cakeStage = document.getElementById('cake-interactive-stage');
  const cakeKnife = document.getElementById('cake-knife');
  const seepBox = document.getElementById('seep-celebration-box');

  if (cutBtn && cakeStage) {
    cutBtn.addEventListener('click', () => {
      // Step 1: Knife glides in
      if (cakeKnife) {
        cakeKnife.classList.add('cutting');
      }

      // Step 2: Knife slices down & flame goes out
      setTimeout(() => {
        if (cakeKnife) {
          cakeKnife.classList.remove('cutting');
          cakeKnife.classList.add('slice-down');
        }
        if (candleFlame) {
          candleFlame.classList.add('out');
        }
      }, 500);

      // Step 3: Cake separates and sparkle shows
      setTimeout(() => {
        cakeStage.classList.add('cut');
        triggerConfetti();
      }, 900);

      // Step 4: Knife retracts away cleanly
      setTimeout(() => {
        if (cakeKnife) {
          cakeKnife.style.opacity = '0';
          cakeKnife.style.transform = 'translateY(-50px) scale(0.8)';
        }
      }, 1400);

      // Step 5: Beautiful celebration box seeps in with glowing animation
      setTimeout(() => {
        if (seepBox) {
          seepBox.classList.add('seep-in');
        }
        cutBtn.innerHTML = '✨ Cake Cut & Wish Made! ✨';
        cutBtn.disabled = true;
        cutBtn.style.opacity = '0.92';
      }, 1600);
    });
  }

  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      triggerConfetti();
    });
  }
}

/* ========================================================
   CLUE INTERACTIONS (PAGE 3)
   ======================================================== */
function initClueInteractions() {
  // Clue envelope open/flip
  const envelope = document.getElementById('secret-envelope');
  const clueHidden = document.getElementById('hidden-clue-card');
  const openPrompt = document.getElementById('envelope-prompt');

  if (envelope && clueHidden) {
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('opened');
      if (envelope.classList.contains('opened')) {
        clueHidden.classList.add('reveal');
        if (openPrompt) openPrompt.textContent = '✨ Clue Revealed! Read below ✨';
        triggerConfetti();
      } else {
        clueHidden.classList.remove('reveal');
        if (openPrompt) openPrompt.textContent = 'Click to Break The Seal & Reveal The Clue';
      }
    });
  }

  // Hint toggle
  const hintToggle = document.getElementById('hint-toggle-btn');
  const hintContent = document.getElementById('hint-box');
  if (hintToggle && hintContent) {
    hintToggle.addEventListener('click', () => {
      const isVisible = hintContent.style.display === 'block';
      hintContent.style.display = isVisible ? 'none' : 'block';
      hintToggle.textContent = isVisible ? '💡 Need a Hint?' : '🙈 Hide Hint';
    });
  }

  // Answer guess checker
  const guessBtn = document.getElementById('guess-submit-btn');
  const guessInput = document.getElementById('guess-input');
  const guessFeedback = document.getElementById('guess-feedback');

  if (guessBtn && guessInput && guessFeedback) {
    guessBtn.addEventListener('click', () => {
      const userGuess = guessInput.value.trim().toLowerCase();
      if (!userGuess) {
        guessFeedback.textContent = 'Please type a guess first! ✨';
        guessFeedback.className = 'feedback-msg text-warning';
        return;
      }

      const secretAnswer = (guessInput.getAttribute('data-answer') || '').toLowerCase();

      if (secretAnswer && userGuess.includes(secretAnswer)) {
        guessFeedback.textContent = '🎉 BINGO! You guessed it right! Go check that spot right now! 💖';
        guessFeedback.className = 'feedback-msg text-success';
        triggerConfetti();
      } else {
        guessFeedback.textContent = '🤔 Close, but not quite! Think carefully or follow the hint!';
        guessFeedback.className = 'feedback-msg text-hint';
      }
    });
  }
}
