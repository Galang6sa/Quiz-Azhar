let currentQuestion = 0;
let userAnswers = [];
let questions = [];
let score = 0;
let selectedOption = null;

// DOM
const quizScreen = document.getElementById("quizScreen");
const resultsScreen = document.getElementById("resultsScreen");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const submitBtn = document.getElementById("submitBtn");
const finalScore = document.getElementById("finalScore");
const scoreText = document.getElementById("scoreText");
const feedback = document.getElementById("feedback");
const restartBtn = document.getElementById("restartBtn");
const resultIcon = document.getElementById("resultIcon");
const quizTitle = document.getElementById("quizTitle");
const quizSubtitle = document.getElementById("quizSubtitle");

// 🔹 Pop-up elemen (buat manual di JS agar tidak butuh HTML tambahan)
const popup = document.createElement("div");
popup.classList.add("popup");
popup.innerHTML = `
  <div class="popup-content">
    <h3>Jawaban Salah ❌</h3>
    <p id="popupExplanation"></p>
    <button id="popupCloseBtn" class="btn btn-primary">Lanjut</button>
  </div>
`;
document.body.appendChild(popup);
const popupExplanation = document.getElementById("popupExplanation");
const popupCloseBtn = document.getElementById("popupCloseBtn");

// Tema warna random
const themes = [
  { primary: "#2563eb", background: "#f8fafc" },
  { primary: "#16a34a", background: "#f0fdf4" },
  { primary: "#7c3aed", background: "#f5f3ff" },
  { primary: "#f59e0b", background: "#fff7ed" },
];

function applyRandomTheme() {
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  document.documentElement.style.setProperty("--primary", randomTheme.primary);
  document.body.style.background = randomTheme.background;
}

// Load quiz
async function loadQuizData() {
  try {
    const res = await fetch("questions.json");
    const data = await res.json();
    return data;
  } catch {
    return {
      title: "Kuis Pengetahuan Umum",
      subtitle: "Uji wawasan Anda seputar Indonesia 🇮🇩",
      questions: [
        {
          question: "Apa ibu kota Indonesia?",
          options: ["Jakarta", "Surabaya", "Bandung", "Medan"],
          correct: 0,
          explanation: "Jakarta adalah ibu kota Indonesia sejak tahun 1945."
        }
      ],
    };
  }
}

// Inisialisasi kuis
async function initQuiz() {
  applyRandomTheme();
  const quizData = await loadQuizData();
  quizTitle.textContent = quizData.title;
  quizSubtitle.textContent = quizData.subtitle;
  questions = shuffleArray(quizData.questions);
  userAnswers = new Array(questions.length).fill(null);
  showQuestion();
}

// Fungsi acak array
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Tampilkan pertanyaan
function showQuestion() {
  const q = questions[currentQuestion];
  questionNumber.textContent = `Pertanyaan ${currentQuestion + 1}`;
  questionText.textContent = q.question;

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${currentQuestion + 1}/${questions.length}`;

  optionsContainer.innerHTML = "";
  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = opt;
    div.onclick = () => selectOption(i);
    optionsContainer.appendChild(div);
  });

  selectedOption = null;
  submitBtn.disabled = true;
}

// Pilih jawaban
function selectOption(index) {
  document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
  document.querySelectorAll(".option")[index].classList.add("selected");
  selectedOption = index;
  submitBtn.disabled = false;
}

// Kirim jawaban
function submitAnswer() {
  if (selectedOption === null) return;
  const q = questions[currentQuestion];
  const isCorrect = selectedOption === q.correct;

  userAnswers[currentQuestion] = selectedOption;
  if (isCorrect) {
    score++;
    nextOrEnd();
  } else {
    popupExplanation.textContent = q.explanation || "Pelajari kembali materi ini ya!";
    showPopup();
  }
}

// Tampilkan popup penjelasan jika salah
function showPopup() {
  popup.classList.add("show");
  popup.querySelector(".popup-content").classList.add("show");
}

function hidePopup() {
  popup.classList.remove("show");
  popup.querySelector(".popup-content").classList.remove("show");
  nextOrEnd();
}

// Lanjut ke pertanyaan berikut atau hasil akhir
function nextOrEnd() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResults();
  }
}

// Hasil akhir
function showResults() {
  quizScreen.style.display = "none";
  resultsScreen.style.display = "block";
  finalScore.textContent = `${score}/${questions.length}`;

  const percent = (score / questions.length) * 100;
  let msg = "", icon = "";
  if (percent >= 90) { msg = "Luar biasa! 🌟"; icon = "🎉"; }
  else if (percent >= 70) { msg = "Bagus sekali! 👍"; icon = "👏"; }
  else if (percent >= 50) { msg = "Cukup baik, terus belajar! 💪"; icon = "💡"; }
  else { msg = "Tetap semangat belajar! 📚"; icon = "📖"; }

  scoreText.textContent = msg;
  resultIcon.textContent = icon;
  feedback.innerHTML = `
    <p><strong>Skor Akhir:</strong> ${score} / ${questions.length}</p>
    <p><strong>Persentase:</strong> ${percent.toFixed(1)}%</p>
    <p><strong>Status:</strong> ${percent >= 70 ? "Lulus ✅" : "Belum Lulus ❌"}</p>
  `;
}

// Ulang kuis
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers.fill(null);
  resultsScreen.style.display = "none";
  quizScreen.style.display = "block";
  showQuestion();
}

// Event listener
submitBtn.onclick = submitAnswer;
popupCloseBtn.onclick = hidePopup;
restartBtn.onclick = restartQuiz;

// Start
initQuiz();
