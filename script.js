
document.addEventListener("DOMContentLoaded", () => {
  // PERSONALIZE THESE VALUES BEFORE SHARING.
  const sisterName = "Akka";
  const senderName = "Your Sibling";

  const byId = (id) => document.getElementById(id);
  const scenes = Array.from(document.querySelectorAll(".scene"));
  const progressLabel = byId("progressLabel");
  const backgroundMusic = byId("backgroundMusic");
  const musicToggle = byId("musicToggle");
  const toast = byId("toast");
  const envelopeButton = byId("envelopeButton");
  const letterCard = byId("letterCard");
  const typedLetter = byId("typedLetter");
  const photoModal = byId("photoModal");
  const modalPhoto = byId("modalPhoto");
  const modalMessage = byId("modalMessage");
  const candles = Array.from(document.querySelectorAll(".candle"));

  let toastTimer = null;
  let musicWasManuallyStopped = false;
  let wishMade = false;

  const birthdayLetter = [
    "Happy Birthday to the person who has been my constant through everything. ❤️",

    "You’ve always stood by me, celebrated my little victories like they were your own, and been there through every high and low. ❤️",

    "Behind all the teasing and silly fights, I hope you know how much you mean to me. You’ve been my support system, my cheerleader, and one of the people I can always count on.",

    "Life will change, we’ll grow, and we’ll probably keep annoying each other forever — but one thing won’t change: I’ll always have your back, just like you’ve always had mine.",
    "Happy Birthday, Akka. ❤️",

    "Forever grateful that I get to call you my sister."
  ];

  // Personalize names throughout the website.
  ["friendName", "letterName", "finalName"].forEach((id) => {
    const element = byId(id);
    if (element) element.textContent = sisterName;
  });

  ["senderName", "finalSender"].forEach((id) => {
    const element = byId(id);
    if (element) element.textContent = senderName;
  });

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  // Background music.
  // Browsers may block autoplay until the visitor interacts.
  async function startMusic() {
    if (!backgroundMusic || musicWasManuallyStopped) return;

    backgroundMusic.volume = 0.4;

    try {
      await backgroundMusic.play();

      if (musicToggle) {
        musicToggle.setAttribute("aria-pressed", "true");

        const label = musicToggle.querySelector("span");
        if (label) label.textContent = "Sound on";
      }
    } catch (error) {
      // Playback can be retried after the visitor interacts.
    }
  }

  startMusic();

  document.addEventListener(
    "pointerdown",
    () => {
      if (backgroundMusic?.paused && !musicWasManuallyStopped) {
        startMusic();
      }
    },
    { once: true }
  );

  musicToggle?.addEventListener("click", async () => {
    if (!backgroundMusic) return;

    if (backgroundMusic.paused) {
      musicWasManuallyStopped = false;
      await startMusic();
    } else {
      backgroundMusic.pause();
      musicWasManuallyStopped = true;
      musicToggle.setAttribute("aria-pressed", "false");

      const label = musicToggle.querySelector("span");
      if (label) label.textContent = "Sound off";
    }
  });

  // Floating hearts and sparkles.
  const floatingSymbols = ["💕", "💖", "✨", "🌸", "💗", "🎀"];
  const sparkleContainer = byId("sparkleField") || document.body;

  function createFloatingSymbol() {
    if (document.querySelectorAll(".floating-symbol").length > 18) {
      return;
    }

    const symbol = document.createElement("span");

    symbol.className = "floating-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent =
      floatingSymbols[Math.floor(Math.random() * floatingSymbols.length)];

    Object.assign(symbol.style, {
      position: "fixed",
      left: `${Math.random() * 100}vw`,
      bottom: "-30px",
      fontSize: `${14 + Math.random() * 18}px`,
      opacity: "0.8",
      pointerEvents: "none",
      zIndex: "1",
      transition: "transform 5s linear, opacity 5s linear"
    });

    sparkleContainer.appendChild(symbol);

    requestAnimationFrame(() => {
      symbol.style.transform =
        `translateY(-${window.innerHeight + 80}px) ` +
        `rotate(${Math.random() * 360}deg)`;

      symbol.style.opacity = "0";
    });

    window.setTimeout(() => symbol.remove(), 5200);
  }

  window.setInterval(createFloatingSymbol, 1200);

  // Navigate between scenes.
  function showScene(sceneId) {
    const target = document.getElementById(
      String(sceneId).replace(/^#/, "")
    );

    if (!target || !target.classList.contains("scene")) return;

    scenes.forEach((scene, index) => {
      const isActive = scene === target;

      scene.classList.toggle("active", isActive);

      if (isActive && progressLabel) {
        progressLabel.textContent =
          `Surprise ${index + 1} of ${scenes.length}`;
      }
    });

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start"
    });
  }

  byId("startButton")?.addEventListener("click", () => {
    showScene("memories");
  });

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      showScene(button.dataset.next);
    });
  });

  byId("brandLink")?.addEventListener("click", (event) => {
    event.preventDefault();
    showScene("home");
  });

  // Photo gallery modal.
  function openPhotoModal(card) {
    const image = card.querySelector("img");

    if (image && modalPhoto) {
      modalPhoto.src = image.currentSrc || image.getAttribute("src") || "";
      modalPhoto.alt = image.alt || "A happy memory";
    }

    if (modalMessage) {
      modalMessage.textContent =
        card.dataset.message ||
        "No matter what, you will always be my favourite sister. 💖";
    }

    if (photoModal) {
      photoModal.hidden = false;
      photoModal.setAttribute("aria-hidden", "false");
      byId("modalClose")?.focus();
    }
  }

  function closePhotoModal() {
    if (!photoModal) return;

    photoModal.hidden = true;
    photoModal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".polaroid").forEach((card) => {
    card.addEventListener("click", () => openPhotoModal(card));
  });

  byId("modalClose")?.addEventListener("click", closePhotoModal);

  photoModal?.addEventListener("click", (event) => {
    if (event.target === photoModal) closePhotoModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePhotoModal();
  });

  // IMPORTANT FIX:
  // Render each letter paragraph as its own HTML element.
  // This guarantees paragraph breaks and spacing.
  function revealLetter() {
    if (!typedLetter) return;

    typedLetter.replaceChildren();

    birthdayLetter.forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      typedLetter.appendChild(paragraph);
    });
  }

  // Open and close the envelope.
  envelopeButton?.addEventListener("click", () => {
    const opened = envelopeButton.classList.toggle("opened");

    envelopeButton.setAttribute("aria-expanded", String(opened));

    const hint = byId("envelopeHint");

    if (hint) {
      hint.textContent = opened
        ? "YOUR BIRTHDAY LETTER IS OPEN 💗"
        : "TAP TO OPEN YOUR BIRTHDAY LETTER 💌";
    }

    letterCard?.classList.toggle("visible", opened);

    if (opened) revealLetter();
  });

  byId("retypeButton")?.addEventListener("click", revealLetter);

  // Birthday celebration.
  function createCelebration(amount = 70) {
    const emojis = ["🎉", "🎊", "💖", "💕", "✨", "🎂", "🌸", "🥳"];

    for (let i = 0; i < amount; i++) {
      const particle = document.createElement("span");

      particle.className = "celebration-particle";
      particle.setAttribute("aria-hidden", "true");
      particle.textContent =
        emojis[Math.floor(Math.random() * emojis.length)];

      Object.assign(particle.style, {
        position: "fixed",
        left: `${Math.random() * 100}vw`,
        top: "-40px",
        fontSize: `${16 + Math.random() * 20}px`,
        pointerEvents: "none",
        zIndex: "9999",
        transition:
          `transform ${1.8 + Math.random() * 1.4}s ease-in, opacity 2.5s`
      });

      document.body.appendChild(particle);

      const horizontal = (Math.random() - 0.5) * 240;

      requestAnimationFrame(() => {
        particle.style.transform =
          `translate(${horizontal}px, ${window.innerHeight + 100}px) ` +
          `rotate(${Math.random() * 720}deg)`;

        particle.style.opacity = "0";
      });

      window.setTimeout(() => particle.remove(), 3600);
    }
  }

  function makeWish() {
    if (wishMade) return;

    wishMade = true;

    candles.forEach((candle) => {
      candle.classList.add("out");
      candle.setAttribute("aria-pressed", "true");
    });

    const hint = byId("wishHint");

    if (hint) {
      hint.textContent =
        "Wish made, sis! May your heart’s wishes come true. 💫";
    }

    byId("finalMessage")?.classList.add("visible");
    byId("wishButton")?.setAttribute("disabled", "disabled");

    createCelebration(85);
    showToast("Happy Birthday, sis! Sending you all my love! 💖");
  }

  candles.forEach((candle) => {
    candle.addEventListener("click", () => {
      candle.classList.add("out");
      candle.setAttribute("aria-pressed", "true");

      if (candles.every((item) => item.classList.contains("out"))) {
        makeWish();
      }
    });
  });

  byId("wishButton")?.addEventListener("click", makeWish);

  // Replay the complete birthday experience.
  byId("replayButton")?.addEventListener("click", () => {
    showScene("home");
    closePhotoModal();

    letterCard?.classList.remove("visible");
    envelopeButton?.classList.remove("opened");
    envelopeButton?.setAttribute("aria-expanded", "false");

    if (byId("envelopeHint")) {
      byId("envelopeHint").textContent =
        "TAP TO OPEN YOUR SISTER’S BIRTHDAY LETTER 💌";
    }

    if (typedLetter) typedLetter.replaceChildren();

    byId("finalMessage")?.classList.remove("visible");

    candles.forEach((candle) => {
      candle.classList.remove("out");
      candle.setAttribute("aria-pressed", "false");
    });

    byId("wishButton")?.removeAttribute("disabled");

    wishMade = false;

    if (byId("wishHint")) {
      byId("wishHint").textContent =
        "Make a wish, sis! Tap the candles or the button below. 💫";
    }

    showToast("One more round of birthday magic! 💕");
  });
});
