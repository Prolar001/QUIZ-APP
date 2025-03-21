document.addEventListener("DOMContentLoaded", () => {
    const questionElement = document.getElementById("question");
    const choicesContainer = document.getElementById("choices-container");
    const nextButton = document.getElementById("next-button");
    const timerElement = document.getElementById("time");
    const questionNumberElement = document.getElementById("question-number");

    let questions = [
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

    let currentQuestionIndex = 0;
    let score = 0;
    let totalTime = 60; 
    let timerInterval;

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
        if (currentQuestionIndex >= questions.length) {
            setTimeout(saveScore, 1000);
            return;
        }

        let currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;
        questionNumberElement.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

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
        choicesContainer.innerHTML = ""; 
    }

    function selectAnswer(event) {
        const selectedChoice = event.target;
        const correct = selectedChoice.dataset.correct === "true";

        if (correct) {
            score++;
            selectedChoice.classList.add("correct");
        } else {
            selectedChoice.classList.add("incorrect");
            document.querySelector(`[data-correct="true"]`).classList.add("correct");
        }

        disableChoices();
        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 800);
    }

    function disableChoices() {
        Array.from(choicesContainer.children).forEach(button => {
            button.disabled = true;
        });
    }

    function saveScore() {
        clearInterval(timerInterval);
        let playerName = localStorage.getItem("playerName");

        if (!playerName || playerName.trim() === "") {
            playerName = prompt("Enter your name:").trim();
            if (!playerName) {
                alert("Name cannot be empty!");
                return;
            }
            localStorage.setItem("playerName", playerName);
        }

        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        let newEntry = { name: playerName, score: score };


        if (!isNaN(score)) {
            leaderboard.push(newEntry);
        } else {
            console.error("⚠️ Invalid Score:", score);
            return;
        }

        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5); // Keep only top 5 scores

        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        console.log("✅ Score Saved:", leaderboard);

        window.location.href = "leaderboard.html";
    }

    startQuiz();
});
