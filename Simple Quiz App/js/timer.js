document.addEventListener("DOMContentLoaded", () => {
    const questionElement = document.getElementById("question");
    const choicesContainer = document.getElementById("choices-container");
    const nextButton = document.getElementById("next-button");
    const timerElement = document.getElementById("time");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let totalTime = 60;
    let timerInterval;

    questions = [
        {
            question: "What is the chemical symbol for water?",
            choices: ["H2O", "O2", "CO2", "NaCl"],
            correct: 0,
        },
        {
            question: "What planet is known as the Red Planet?",
            choices: ["Mars", "Venus", "Jupiter", "Saturn"],
            correct: 0,
        },
        {
            question: "What gas do plants absorb from the atmosphere?",
            choices: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            correct: 1,
        }
    ];

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        totalTime = 60;
        startTimer();
        showQuestion();
    }

    function startTimer() {
        timerElement.innerText = totalTime;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            totalTime--;
            timerElement.innerText = totalTime;
            if (totalTime <= 0) {
                clearInterval(timerInterval);
                saveScore();
            }
        }, 1000);
    }

    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;

        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.innerText = choice;
            button.classList.add("choice-button");
            button.dataset.correct = index === currentQuestion.correct;
            button.addEventListener("click", selectAnswer);
            choicesContainer.appendChild(button);
        });

        nextButton.style.display = "none";
    }

    function resetState() {
        while (choicesContainer.firstChild) {
            choicesContainer.removeChild(choicesContainer.firstChild);
        }
    }

    function selectAnswer(event) {
        const selectedChoice = event.target;
        const correct = selectedChoice.dataset.correct === "true";

        if (correct) {
            score++;
        }

        disableChoices();

        setTimeout(() => {
            nextQuestion();
        }, 500);
    }

    function disableChoices() {
        Array.from(choicesContainer.children).forEach(button => {
            button.disabled = true;
        });
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            saveScore();
        }
    }

    function saveScore() {
        clearInterval(timerInterval);
        const playerName = localStorage.getItem("playerName") || "Guest";
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        window.location.href = "leaderboard.html";
    }

    startQuiz();
});
