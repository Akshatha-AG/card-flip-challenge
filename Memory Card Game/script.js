let boxes = document.querySelectorAll(".classBox");
let userScoreEl = document.getElementById("userScore");
let compScoreEl = document.getElementById("compScore>");
let player1Score = 0;
let player2Score = 0;
let body=document.querySelector("body");
let images = [1, 2, 3, 4, 5, 6]; // 6 unique images
let arr = [...images, ...images]; // duplicate for pairs

// Shuffle array (Fisher-Yates)
for (let i = arr.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

// Assign images to boxes (hidden initially)
boxes.forEach((box, idx) => {
  box.dataset.img = `${arr[idx]}.jpg`;
  box.dataset.open = "false"; // not revealed
});

// Game state
let turn = "player1"; // Player1 starts
let selected = [];
let lockBoard = false;

// Reveal image
function revealImage(box) {
  box.style.backgroundImage = `url('${box.dataset.img}')`;
}

// Hide image
function hideImage(box) {
  box.style.backgroundImage = "none";
}

// Lock matched pair
function lockOpen(b1, b2) {
  b1.dataset.open = "true";
  b2.dataset.open = "true";
}

// Flip handling
function flipCard(e) {
  if (lockBoard) return;
  let box = e.currentTarget;

  if (box.dataset.open === "true" || selected.includes(box)) return;

  revealImage(box);
  selected.push(box);

  if (selected.length === 2) {
    lockBoard = true;

    setTimeout(() => {
      if (selected[0].dataset.img === selected[1].dataset.img) {
        // Match found
        lockOpen(selected[0], selected[1]);
        if (turn === "player1") {
        
          player1Score++;
          userScoreEl.textContent = player1Score;
          
        } else {
          player2Score++;
          compScoreEl.textContent = player2Score;
        }
      } else {
        // Not matched -> switch turn
        hideImage(selected[0]);
        hideImage(selected[1]);
        turn = turn === "player1" ? "player2" : "player1";
      }

      selected = [];
      lockBoard = false;

      // Check end
      if ([...boxes].every(b => b.dataset.open === "true")) {
        setTimeout(() => {
          if (player1Score > player2Score) {
            alert(`🎉 Player 1 Wins! Final Score - P1: ${player1Score}, P2: ${player2Score}`);
          } else if (player2Score > player1Score) {
            alert(`🎉 Player 2 Wins! Final Score - P1: ${player1Score}, P2: ${player2Score}`);
          } else {
            alert(`🤝 It's a Draw! Final Score - P1: ${player1Score}, P2: ${player2Score}`);
          }
        }, 500);
      }
    }, 1000);
  }
}

// Add event listeners
boxes.forEach(box => {
  box.addEventListener("click", flipCard);
});


let resetBtn = document.getElementById("resetBtn");

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  userScoreEl.textContent = player1Score;
  compScoreEl.textContent = player2Score;
  turn = "player1";
  selected = [];
  lockBoard = false;

  // Reshuffle
  arr = [...images, ...images];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Reset all boxes
  boxes.forEach((box, idx) => {
    box.dataset.img = `${arr[idx]}.jpg`;
    box.dataset.open = "false";
    box.style.backgroundImage = "none";
  });
}

resetBtn.addEventListener("click", resetGame);
