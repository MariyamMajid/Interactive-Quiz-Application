

const questions = [
{
question: "Which language is used to structure a webpage?",
options: ["CSS", "HTML", "Python", "Java"],
answer: 1
},
{
question: "Which language is used to style a webpage?",
options: ["HTML", "C++", "CSS", "Java"],
answer: 2
},
{
question: "Which language makes a webpage interactive?",
options: ["JavaScript", "HTML", "CSS", "SQL"],
answer: 0
},
{
question: "Which HTML tag creates a hyperlink?",
options: ["<img>", "<p>", "<a>", "<h1>"],
answer: 2
},
{
question: "Which CSS property changes text color?",
options: ["font-size", "color", "margin", "padding"],
answer: 1
}
];



let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let timeLeft = 60;
let timerInterval;
let quizQuestions = [];


const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");
const downloadBtn = document.getElementById("downloadBtn");

const questionText = document.getElementById("questionText");
const questionCounter = document.getElementById("questionCounter");
const optionsContainer = document.getElementById("optionsContainer");
const timerDisplay = document.getElementById("timer");

const segments = document.querySelectorAll(".progress-segment");



function shuffleQuestions() {
const shuffled = [...questions];


for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

return shuffled;


}



startBtn.addEventListener("click", startQuiz);


function startQuiz() {
currentQuestion = 0;
score = 0;
selectedAnswer = null;
timeLeft = 60;


quizQuestions = shuffleQuestions();

startScreen.hidden = true;
resultScreen.hidden = true;
quizScreen.hidden = false;

nextBtn.textContent = "Next Question ➜";

showQuestion();
startTimer();


}



function showQuestion() {
selectedAnswer = null;

const question = quizQuestions[currentQuestion];

questionText.textContent = question.question;

questionCounter.textContent =
    `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

nextBtn.disabled = true;

if (currentQuestion === quizQuestions.length - 1) {
    nextBtn.textContent = "Finish Quiz 🏆";
} else {
    nextBtn.textContent = "Next Question ➜";
}

segments.forEach((segment, index) => {
    segment.classList.toggle("active", index <= currentQuestion);
});

optionsContainer.innerHTML = "";

question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "option-btn";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => selectAnswer(index));

    optionsContainer.appendChild(button);
});


}


function selectAnswer(index) {
if (selectedAnswer !== null) {
return;
}

selectedAnswer = index;

const correctAnswer = quizQuestions[currentQuestion].answer;
const buttons = optionsContainer.querySelectorAll(".option-btn");

buttons.forEach((button, buttonIndex) => {
    button.disabled = true;

    if (buttonIndex === correctAnswer) {
        button.classList.add("correct");
    }

    if (buttonIndex === index && index !== correctAnswer) {
        button.classList.add("incorrect");
    }
});

if (index === correctAnswer) {
    score++;
}

nextBtn.disabled = false;


}



nextBtn.addEventListener("click", () => {
if (selectedAnswer === null) {
return;
}

currentQuestion++;

if (currentQuestion < quizQuestions.length) {
    showQuestion();
} else {
    finishQuiz();
}


});



function startTimer() {
clearInterval(timerInterval);


updateTimer();

timerInterval = setInterval(() => {
    timeLeft--;

    updateTimer();

    if (timeLeft <= 0) {
        finishQuiz();
    }
}, 1000);


}

function updateTimer() {
timerDisplay.textContent = `⏰ ${timeLeft}s`;


if (timeLeft <= 10) {
    timerDisplay.style.color = "#ef4444";
} else {
    timerDisplay.style.color = "";
}


}



function finishQuiz() {
clearInterval(timerInterval);


quizScreen.hidden = true;
startScreen.hidden = true;
resultScreen.hidden = false;

const total = quizQuestions.length;
const incorrect = total - score;
const percentage = Math.round((score / total) * 100);

document.getElementById("score").textContent = `${score}/${total}`;

document.getElementById("correctCount").textContent = score;

document.getElementById("incorrectCount").textContent = incorrect;

document.getElementById("percentage").textContent = `${percentage}%`;

document.getElementById("resultMessage").textContent =
    percentage >= 80
        ? "Amazing! You did a fantastic job! 🎉"
        : percentage >= 50
            ? "Good effort! Keep learning! 💗"
            : "Keep practising! You can do better! 🌟";


}


restartBtn.addEventListener("click", () => {
clearInterval(timerInterval);

resultScreen.hidden = true;
startScreen.hidden = false;
quizScreen.hidden = true;

});


themeBtn.addEventListener("click", () => {
document.body.classList.toggle("dark-mode");

const darkMode = document.body.classList.contains("dark-mode");

themeBtn.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";


});



downloadBtn.addEventListener("click", () => {
if (!window.jspdf) {
alert("PDF library did not load. Please check your internet connection.");
return;
}

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

const total = quizQuestions.length;
const incorrect = total - score;
const percentage = Math.round((score / total) * 100);

pdf.setFontSize(22);
pdf.text("Quizzy - Quiz Results", 20, 25);

pdf.setFontSize(14);
pdf.text(`Total Questions: ${total}`, 20, 45);
pdf.text(`Correct Answers: ${score}`, 20, 58);
pdf.text(`Incorrect Answers: ${incorrect}`, 20, 71);
pdf.text(`Final Score: ${percentage}%`, 20, 84);

pdf.save("Quizzy-Results.pdf");


});
