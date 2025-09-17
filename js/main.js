const BALLOON_COLORS = [
  "#ff69b4",
  "#ff1493",
  "#da70d6",
  "#ffc0cb",
  "#ffb6c1",
  "#dda0dd",
  "#ee82ee",
  "#ff91a4",
];

const SPARKLE_COLORS = [
  "rgba(255,105,180,",
  "rgba(255,20,147,",
  "rgba(218,112,214,",
  "rgba(255,182,193,",
];

const GIRLFRIEND_NAME = "Davina";

const TYPEWRITER_LINES = [
  `Happy Birthday, ${GIRLFRIEND_NAME}! `,
  "You make everyday better.",
  "Love of my life",
  "Pico, Kevin and I are lucky to have you",
];

const elements = {
  loginScreen: document.getElementById("loginScreen"),
  mainContent: document.getElementById("mainContent"),
  nameInput: document.getElementById("nameInput"),
  loginBtn: document.getElementById("loginBtn"),
  errorMessage: document.getElementById("errorMessage"),
  memoriesBtn: document.getElementById("memoriesBtn"),
  modal: document.getElementById("memoriesModal"),
  closeModal: document.getElementById("closeModal"),
  giftBtn: document.getElementById("giftBtn"),
  giftModal: document.getElementById("giftModal"),
  closeGiftModal: document.getElementById("closeGiftModal"),
  scratchCanvas: document.getElementById("scratchCanvas"),
  typeEl: document.getElementById("type"),
  sparkles: document.getElementById("sparkles"),
  name: document.getElementById("name"),
};

let typewriterState = { lineIdx: 0, charIdx: 0, deleting: false };
let sparkleState = { w: 0, h: 0, sparks: [] };
let scratchState = { isScratching: false, scratchedArea: 0 };

const celebrate = (burst = 120) => {
  const end = Date.now() + 350;
  (function frame() {
    confetti({
      particleCount: Math.max(6, Math.round(burst / 10)),
      startVelocity: 38,
      spread: 62,
      origin: { x: Math.random(), y: Math.random() * 0.35 + 0.1 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
};

const spawnBalloons = (count = 10) => {
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    const color =
      BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 10;

    balloon.style.left = `${left}vw`;
    balloon.style.background = `radial-gradient(120% 120% at 30% 30%, #fff6, ${color})`;
    balloon.style.animationDuration = `${duration}s`;

    const string = document.createElement("div");
    string.className = "string";
    balloon.appendChild(string);
    document.body.appendChild(balloon);

    balloon.addEventListener("animationend", () => balloon.remove());
  }
};

const checkLogin = () => {
  const inputName = elements.nameInput.value.trim().toLowerCase();
  if (inputName === "pico") {
    elements.loginScreen.style.display = "none";
    elements.mainContent.style.display = "block";
    setTimeout(() => {
      celebrate(300);
      spawnBalloons(20);
    }, 500);
  } else {
    elements.errorMessage.style.display = "block";
    elements.nameInput.value = "";
    elements.nameInput.focus();
    setTimeout(() => {
      elements.errorMessage.style.display = "none";
    }, 3000);
  }
};

const typeLoop = () => {
  const current = TYPEWRITER_LINES[typewriterState.lineIdx];
  if (!typewriterState.deleting) {
    elements.typeEl.textContent = current.slice(0, ++typewriterState.charIdx);
    if (typewriterState.charIdx === current.length) {
      typewriterState.deleting = true;
      setTimeout(typeLoop, 1100);
      return;
    }
  } else {
    elements.typeEl.textContent = current.slice(0, --typewriterState.charIdx);
    if (typewriterState.charIdx === 0) {
      typewriterState.deleting = false;
      typewriterState.lineIdx =
        (typewriterState.lineIdx + 1) % TYPEWRITER_LINES.length;
    }
  }
  const delay = typewriterState.deleting ? 35 : 55;
  setTimeout(typeLoop, delay);
};

const initSparkles = () => {
  const canvas = elements.sparkles;
  const ctx = canvas.getContext("2d");

  const resize = () => {
    sparkleState.w = canvas.width = canvas.offsetWidth;
    sparkleState.h = canvas.height = canvas.offsetHeight;
  };

  const addSpark = () => {
    sparkleState.sparks.push({
      x: Math.random() * sparkleState.w,
      y: Math.random() * sparkleState.h * 0.6 + 10,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.6 + 0.2,
      v: Math.random() * 0.6 + 0.2,
    });
    if (sparkleState.sparks.length > 120) sparkleState.sparks.shift();
  };

  const draw = () => {
    ctx.clearRect(0, 0, sparkleState.w, sparkleState.h);
    for (const spark of sparkleState.sparks) {
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
      const color =
        SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      ctx.fillStyle = `${color}${spark.a})`;
      ctx.fill();
      spark.y -= spark.v;
      spark.a -= 0.003;
      if (spark.a <= 0) {
        spark.y = sparkleState.h + 8;
        spark.a = Math.random() * 0.6 + 0.2;
      }
    }
    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  setInterval(addSpark, 120);
  draw();
};

const initScratchCard = () => {
  const canvas = elements.scratchCanvas;
  const ctx = canvas.getContext("2d");

  const setupCanvas = () => {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "24px Poppins";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.fillText(
      "🎁 Scratch Here! 🎁",
      canvas.width / 2,
      canvas.height / 2 - 10
    );
    ctx.fillText(
      "Your gift awaits...",
      canvas.width / 2,
      canvas.height / 2 + 20
    );

    scratchState.scratchedArea = 0;
  };

  const getMousePos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top,
    };
  };

  const scratch = (x, y) => {
    const radius = 20;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    scratchState.scratchedArea += Math.PI * radius * radius;

    const totalArea = canvas.width * canvas.height;
    const scratchPercentage = scratchState.scratchedArea / totalArea;

    if (scratchPercentage > 0.7) {
      canvas.style.opacity = "0";
      const giftReveal = canvas.parentElement.querySelector('.gift-reveal');
      giftReveal.classList.add('revealed');
    }
  };

  const startScratch = (e) => {
    e.preventDefault();
    scratchState.isScratching = true;
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  };

  const doScratch = (e) => {
    if (!scratchState.isScratching) return;
    e.preventDefault();
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  };

  const endScratch = () => {
    scratchState.isScratching = false;
  };

  canvas.addEventListener("mousedown", startScratch);
  canvas.addEventListener("mousemove", doScratch);
  canvas.addEventListener("mouseup", endScratch);
  canvas.addEventListener("touchstart", startScratch);
  canvas.addEventListener("touchmove", doScratch);
  canvas.addEventListener("touchend", endScratch);

  window.addEventListener("resize", setupCanvas);
  setupCanvas();
};

const resetScratchCard = () => {
  const canvas = elements.scratchCanvas;
  canvas.style.opacity = "1";
  scratchState.scratchedArea = 0;
  scratchState.isScratching = false;
  const giftReveal = canvas.parentElement.querySelector('.gift-reveal');
  giftReveal.classList.remove('revealed');
  initScratchCard();
};

const initEventListeners = () => {
  elements.loginBtn.addEventListener("click", checkLogin);
  elements.nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkLogin();
  });

  elements.memoriesBtn.addEventListener("click", () =>
    elements.modal.classList.add("show")
  );
  elements.closeModal.addEventListener("click", () =>
    elements.modal.classList.remove("show")
  );
  elements.modal.addEventListener("click", (e) => {
    if (e.target === elements.modal) elements.modal.classList.remove("show");
  });

  elements.giftBtn.addEventListener("click", () => {
    elements.giftModal.classList.add("show");
    setTimeout(() => initScratchCard(), 100);
  });
  elements.closeGiftModal.addEventListener("click", () => {
    elements.giftModal.classList.remove("show");
    resetScratchCard();
  });
  elements.giftModal.addEventListener("click", (e) => {
    if (e.target === elements.giftModal) {
      elements.giftModal.classList.remove("show");
      resetScratchCard();
    }
  });

  document.body.addEventListener("pointerdown", () => {
    if (elements.mainContent.style.display !== "none") celebrate(100);
  });

  window.addEventListener("keydown", (e) => {
    if (
      e.key.toLowerCase() === "o" &&
      elements.mainContent.style.display !== "none"
    ) {
      celebrate(160);
    }
  });
};

const init = () => {
  elements.name.textContent = GIRLFRIEND_NAME;
  elements.nameInput.focus();
  typeLoop();
  initSparkles();
  initEventListeners();
};

document.addEventListener("DOMContentLoaded", init);
