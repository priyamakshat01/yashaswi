/* ========================================================
   GIFT WEBSITE - FLOWER SURPRISE SCRIPT
   Supports realistic falling PNG rose petals with vector fallback
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFlowerSurprise();
  initPetalRain();
});

function initFlowerSurprise() {
  const rose = document.querySelector('.rose-blossom');
  const rainBtn = document.getElementById('rain-petals-btn');
  const letterBtn = document.getElementById('open-letter-btn');
  const letterModal = document.getElementById('flower-letter-modal');
  const closeModalBtn = document.getElementById('close-letter-modal');

  // Bloom slightly after page load
  setTimeout(() => {
    if (rose) rose.classList.add('bloomed');
  }, 400);

  // Click on rose to toggle bloom / pulse
  if (rose) {
    rose.addEventListener('click', () => {
      rose.classList.toggle('bloomed');
      spawnPetalBurst(window.innerWidth / 2, window.innerHeight * 0.45);
    });
  }

  // Rain more petals button
  if (rainBtn) {
    rainBtn.addEventListener('click', () => {
      spawnPetalShower(35);
    });
  }

  // Open Letter Modal
  if (letterBtn && letterModal) {
    letterBtn.addEventListener('click', () => {
      letterModal.classList.add('active');
    });
  }

  // Close Letter Modal
  if (closeModalBtn && letterModal) {
    closeModalBtn.addEventListener('click', () => {
      letterModal.classList.remove('active');
    });
  }

  // Close modal when clicking outside box
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        letterModal.classList.remove('active');
      }
    });
  }
}

/* ========================================================
   FALLING PETAL RAIN WITH HIGH-RES PNG SUPPORT
   ======================================================== */
const petals = [];
let petalCtx = null;
let petalCanvas = null;

// Realistic Petal PNG Texture Loader with multi-path detection
const petalImg = new Image();
let petalImgLoaded = false;
const candidatePetalPaths = [
  'images/petal.png',
  'petal.png',
  'Flower peta;.png',
  'images/Flower peta;.png',
  'Flower petal.png',
  'images/Flower petal.png'
];
let petalPathIndex = 0;

function tryLoadPetal() {
  if (petalPathIndex >= candidatePetalPaths.length) {
    petalImgLoaded = false;
    return;
  }
  petalImg.src = candidatePetalPaths[petalPathIndex++];
}

petalImg.onload = () => {
  petalImgLoaded = true;
};
petalImg.onerror = () => {
  tryLoadPetal();
};
tryLoadPetal();

function initPetalRain() {
  petalCanvas = document.createElement('canvas');
  petalCanvas.id = 'petal-canvas';
  petalCanvas.style.position = 'fixed';
  petalCanvas.style.top = '0';
  petalCanvas.style.left = '0';
  petalCanvas.style.width = '100vw';
  petalCanvas.style.height = '100vh';
  petalCanvas.style.pointerEvents = 'none';
  petalCanvas.style.zIndex = '3';
  document.body.appendChild(petalCanvas);

  petalCtx = petalCanvas.getContext('2d');
  let width = (petalCanvas.width = window.innerWidth);
  let height = (petalCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = petalCanvas.width = window.innerWidth;
    height = petalCanvas.height = window.innerHeight;
  });

  // Initial gentle drifting petals
  for (let i = 0; i < 24; i++) {
    petals.push(createPetal(width, height, true));
  }

  function loop() {
    petalCtx.clearRect(0, 0, width, height);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.sway) * 0.9;
      p.sway += p.swaySpeed;
      p.rotation += p.rotSpeed;

      petalCtx.save();
      petalCtx.translate(p.x, p.y);
      petalCtx.rotate(p.rotation);
      petalCtx.globalAlpha = p.alpha;

      if (petalImgLoaded) {
        // High-definition downloaded PNG petal
        const drawW = p.size * 2.2;
        const drawH = p.size * 2.2;
        petalCtx.drawImage(petalImg, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        // Fallback realistic vector petal
        petalCtx.scale(p.scaleX, p.scaleY);
        petalCtx.fillStyle = p.color;
        petalCtx.beginPath();
        petalCtx.moveTo(0, 0);
        petalCtx.bezierCurveTo(-p.size, -p.size * 0.5, -p.size * 1.2, p.size * 1.2, 0, p.size * 1.6);
        petalCtx.bezierCurveTo(p.size * 1.2, p.size * 1.2, p.size, -p.size * 0.5, 0, 0);
        petalCtx.fill();
      }

      petalCtx.restore();

      // Reset or remove
      if (p.y > height + 40) {
        if (p.isOneShot) {
          petals.splice(i, 1);
        } else {
          petals[i] = createPetal(width, height, false);
        }
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

function createPetal(width, height, randomStart = false) {
  const colors = [
    'rgba(255, 77, 109, 0.88)',
    'rgba(255, 117, 143, 0.88)',
    'rgba(255, 154, 162, 0.88)',
    'rgba(230, 57, 70, 0.88)',
    'rgba(255, 180, 190, 0.88)'
  ];

  return {
    x: Math.random() * width,
    y: randomStart ? Math.random() * height : -30,
    size: Math.random() * 9 + 12,
    speedY: Math.random() * 1.4 + 1.1,
    speedX: (Math.random() - 0.5) * 0.8,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.03 + 0.01,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    scaleX: 1,
    scaleY: Math.random() * 0.4 + 0.8,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.35 + 0.65,
    isOneShot: false
  };
}

function spawnPetalShower(amount) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  for (let i = 0; i < amount; i++) {
    const p = createPetal(width, height, false);
    p.y = -Math.random() * 100;
    p.speedY = Math.random() * 2.4 + 1.8;
    p.isOneShot = true;
    petals.push(p);
  }
}

function spawnPetalBurst(startX, startY) {
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const force = Math.random() * 7 + 2;
    const p = createPetal(window.innerWidth, window.innerHeight, false);
    p.x = startX;
    p.y = startY;
    p.speedX = Math.cos(angle) * force;
    p.speedY = Math.sin(angle) * force - 3;
    p.isOneShot = true;
    petals.push(p);
  }
}
