// Preload dice roll sound
const diceAudio = new Audio("diceRoll.mp3");
diceAudio.preload = "auto";
diceAudio.load();

const ROLL_ANIM_MS = 400;             // Duration of CSS roll animation
const IMAGE_UPDATE_DELAY = 120;       // Delay before updating dice images (sync with sound)
const VIBRATE_DURATION = 70;          // Duration for mobile vibration

let gameStarted = false; // Flag to track if first roll has happened

// Main function to roll dice
function rollDice(playSound = true) {
  const img1 = document.querySelector(".img1");
  const img2 = document.querySelector(".img2");
  const title = document.getElementById("title");

  if (!img1 || !img2 || !title) {
    console.warn("Missing .img1, .img2, or #title element in DOM");
    return;
  }

  // On first roll, mark the game as started
  if (!gameStarted) {
    gameStarted = true;
  }

  // Play sound on user gesture
  if (playSound) {
    try {
      diceAudio.currentTime = 0;
      diceAudio.play().catch((err) => {
        console.debug("Dice audio blocked until user gesture:", err);
      });
    } catch (err) {
      console.debug("Audio play error:", err);
    }
  }

  // Add roll animation
  img1.classList.add("roll");
  img2.classList.add("roll");

  // Vibrate on mobile
  if (navigator.vibrate) {
    navigator.vibrate(VIBRATE_DURATION);
  }

  // Generate random numbers
  const randomNumber1 = Math.floor(Math.random() * 6) + 1;
  const randomNumber2 = Math.floor(Math.random() * 6) + 1;
  const randomImage1 = "images/dice" + randomNumber1 + ".png";
  const randomImage2 = "images/dice" + randomNumber2 + ".png";

  // Update dice images after small delay for smoother roll effect
  setTimeout(() => {
    img1.setAttribute("src", randomImage1);
    img2.setAttribute("src", randomImage2);
  }, IMAGE_UPDATE_DELAY);

  // Remove roll class after animation duration
  setTimeout(() => {
    img1.classList.remove("roll");
    img2.classList.remove("roll");
  }, ROLL_ANIM_MS);

  // Update winner text only if game has started
  if (gameStarted) {
    if (randomNumber1 > randomNumber2) {
      title.textContent = "🚩 Player 1 Wins!";
    } else if (randomNumber2 > randomNumber1) {
      title.textContent = "Player 2 Wins! 🚩";
    } else {
      title.textContent = "Draw!";
    }
  }
}

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  if (title) {
    title.textContent = "🎲 Roll Dice to Play!";
  }

  const rollBtn = document.getElementById("roll-btn");
  if (rollBtn) {
    rollBtn.addEventListener("click", () => rollDice(true));
    rollBtn.addEventListener("touchstart", (e) => {
      e.preventDefault(); // prevent double trigger on mobile
      rollDice(true);
    }, { passive: false });
  } else {
    console.warn("#roll-btn not found in DOM");
  }
});

let audioUnlocked = false;

function unlockAudio() {
  if (!audioUnlocked) {
    diceAudio.volume = 0;
    diceAudio.play().then(() => {
      diceAudio.pause();
      diceAudio.currentTime = 0;
      diceAudio.volume = 1;
      audioUnlocked = true;
    }).catch(() => {
      // ignore errors
    });
  }
}

// On button click/touch
rollBtn.addEventListener("click", () => {
  unlockAudio();
  rollDice(true);
});

rollBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  unlockAudio();
  rollDice(true);
}, { passive: false });