// Load quiz data from JSON file
fetch('index.json')
    .then(response => response.json())
    .then(data => initializeQuiz(data))
    .catch(error => console.error("Error loading quiz data:", error));

function initializeQuiz(data) {
    const quizContainer = document.getElementById("quiz-container");
    const submitBtn = document.getElementById("submit-btn");
    const resultContainer = document.getElementById("result");

    // console.log(Object.keys(data));

    function shuffleQuestions(obj) {
        const keys = Object.keys(obj);
        for (let i = keys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [keys[i], keys[j]] = [keys[j], keys[i]];
        }
        return keys.map(key => ({ key, value: obj[key] }));
    }

    const randomizedQuestions = shuffleQuestions(data);




    // Render quiz questions
    randomizedQuestions.forEach(({ key, value }, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.setAttribute("data-question", index);

        const questionHTML = `
            <h3>${index + 1}. ${value.question}</h3>
            ${value.image ? `<img src="./images/question-${value.image}.png" alt="Question ${index + 1}" style="max-width: 100%; margin: 10px 0;">` : ""}
            <div class="options">
                ${Object.entries(value.options).map(([optionKey, optionText]) => `
                    <label>
                        <input type="radio" name="question${index}" value="${optionKey}"> ${optionKey}: ${optionText}
                    </label>
                `).join("")}
            </div>
            <br>
            <hr>
            <br>
        `;

        questionDiv.innerHTML = questionHTML;
        quizContainer.appendChild(questionDiv);
    });


    // Handle submission
    submitBtn.addEventListener("click", () => {
        let correctCount = 0;

        randomizedQuestions.forEach(({ key, value }, index) => {
            const questionDiv = document.querySelector(`[data-question="${index}"]`);
            const selectedOption = questionDiv.querySelector(`input[name="question${index}"]:checked`);
            const correctAnswer = value.answer;

            // Xóa highlight cũ
            questionDiv.classList.remove("highlight-wrong", "highlight-unanswered", "highlight-correct");

            if (selectedOption) {
                if (selectedOption.value === correctAnswer) {
                    correctCount++;
                    questionDiv.classList.add("highlight-correct");
                } else {
                    questionDiv.classList.add("highlight-wrong");
                }
            } else {
                questionDiv.classList.add("highlight-unanswered");
            }
        });

        // Hiển thị kết quả
        resultContainer.textContent = `You answered ${correctCount} out of ${randomizedQuestions.length} questions correctly.`;
    });

}
