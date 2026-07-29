// ======================================================
// USER DATA
// ======================================================

let autoSubmit = false;

const username =
localStorage.getItem("username");

const stage =
localStorage.getItem("stage");


// ======================================================
// STUDENT NAME
// ======================================================

document.getElementById("studentName").innerHTML =
`${username} - ${stage}`;


// ======================================================
// GET QUESTION BANK
// ======================================================

const questionBank =

JSON.parse(

localStorage.getItem("questionBank")

) || [];


// ======================================================
// GET PUBLISHED EXAM
// ======================================================

const currentExam =

JSON.parse(

localStorage.getItem("currentExam")

) || [];


// ======================================================
// GET ACTIVE STAGE
// ======================================================

const activeStage =

localStorage.getItem("activeStage");


// ======================================================
// CHECK RETAKE PERMISSION
// ======================================================

const allowRetake =

localStorage.getItem("allowRetake") === "true";


// ======================================================
// GET PREVIOUS RESULTS
// ======================================================

const allResults =

JSON.parse(

    localStorage.getItem("results")

) || [];


// ======================================================
// CHECK IF STUDENT ALREADY TOOK EXAM
// ======================================================

const alreadyTookExam =

allResults.some(

    result =>

    result.name.toLowerCase() ===

    username.toLowerCase()

    &&

    result.stage === stage

);


// ======================================================
// GET EXAM ELEMENTS
// ======================================================

const examForm =
document.getElementById("examForm");

const examMessage =
document.getElementById("examMessage");


// ======================================================
// CHECK ACTIVE EXAM
// ======================================================

if(

    !activeStage ||

    stage !== activeStage ||

    currentExam.length === 0

){

    examMessage.innerHTML = `

    <h2>

    There are no exams available
    for your stage.

    </h2>

    `;

    examForm.style.display = "none";

}


// ======================================================
// CHECK RETAKE
// ======================================================

else if(

    alreadyTookExam &&

    !allowRetake

){

    examMessage.innerHTML = `

    <h2>

    You have already taken this exam.

    </h2>

    <p>

    Retaking the exam is not allowed.

    </p>

    `;

    examForm.style.display = "none";

}


// ======================================================
// LOAD EXAM
// ======================================================

else{

    loadQuestions();

}

// ======================================================
// LOAD QUESTIONS FUNCTION
// ======================================================

function loadQuestions(){

    // =========================
    // GET PUBLISHED QUESTIONS
    // =========================

    const questions =

    questionBank.filter(

        question =>

        question.stage === stage &&

        currentExam.includes(question.id)

    );


    // =========================
    // CHECK QUESTIONS
    // =========================

    if(questions.length === 0){

        examMessage.innerHTML = `

        <h2>

        There are no exams available
        for your stage.

        </h2>

        `;

        examForm.style.display = "none";

        return;

    }


    // =========================
    // QUESTIONS CONTAINER
    // =========================

    const container =

    document.getElementById(
        "questionsContainer"
    );


    container.innerHTML = "";


    // =========================
    // CREATE QUESTIONS
    // =========================

    questions.forEach(

    (question,index)=>{

        let html = `

        <div class="question-card">

        <h2>

        ${index + 1}.
        ${question.question}

        </h2>

        `;


        // =========================
        // RADIO QUESTION
        // =========================

        if(question.type === "radio"){

            question.options.forEach(

            (option,optionIndex)=>{

               html += `

<label class="quantum-radio">

    <input
        type="radio"
        name="question_${question.id}"
        value="${optionIndex}"
    >

    <span class="radio-control"></span>

    <span class="radio-label">
        ${option}
    </span>

</label>

`;

            });

        }


        // =========================
        // CHECKBOX QUESTION
        // =========================

        if(question.type === "checkbox"){

            question.options.forEach(

            (option,optionIndex)=>{

               html += `

<label class="neon-checkbox">

    <input
        type="checkbox"
        name="question_${question.id}"
        value="${optionIndex}"
    >

    <div class="neon-checkbox__frame">

        <div class="neon-checkbox__box">

            <div class="neon-checkbox__check-container">

                <svg viewBox="0 0 24 24" class="neon-checkbox__check">

                    <path d="M3,12.5l7,7L21,5"></path>

                </svg>

            </div>

            <div class="neon-checkbox__glow"></div>

            <div class="neon-checkbox__borders">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

        <div class="neon-checkbox__effects">

            <div class="neon-checkbox__particles">

                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span>

            </div>

            <div class="neon-checkbox__rings">

                <div class="ring"></div>
                <div class="ring"></div>
                <div class="ring"></div>

            </div>

            <div class="neon-checkbox__sparks">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    </div>

    <span class="checkbox-label">
        ${option}
    </span>

</label>

`;

            });

        }


        html += `

        </div>

        <hr>

        `;


        container.innerHTML += html;

    });

}


// ======================================================
// TIMER
// ======================================================

const timeElement =
document.getElementById("time");

let examMinutes =

Number(

localStorage.getItem("examTime")

) || 15;


let timeLeft =

examMinutes * 60;


const timer =

setInterval(

function(){

    let minutes =

    Math.floor(

        timeLeft / 60

    );


    let seconds =

    timeLeft % 60;


    timeElement.innerHTML =

    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;


    // =========================
    // TIME OVER
    // =========================

    if(timeLeft <= 0){

        clearInterval(timer);


        alert(

        "Time is over. Your exam will be submitted automatically."

        );


        autoSubmit = true;


        examForm.requestSubmit();


        return;

    }


    timeLeft--;

},

1000

);
// ======================================================
// SUBMIT EXAM
// ======================================================

examForm.addEventListener("submit", function(e){

    e.preventDefault();

    // =========================
    // STOP TIMER
    // =========================

    clearInterval(timer);


    // =========================
    // GET EXAM QUESTIONS
    // =========================

    const questions =

    questionBank.filter(

        question =>

        question.stage === stage &&

        currentExam.includes(question.id)

    );


    // =========================
    // SCORE
    // =========================

    let score = 0;


    // =========================
    // WRONG ANSWERS
    // =========================

    let wrongAnswers = [];


    // =========================
    // EMPTY QUESTIONS
    // =========================

    let emptyQuestions = [];


    // =========================
    // CHECK EACH QUESTION
    // =========================

    questions.forEach(

    (question,index)=>{


        // =========================
        // RADIO
        // =========================

        if(question.type === "radio"){

            const selected =

            document.querySelector(

                `input[name="question_${question.id}"]:checked`

            );


            // =========================
            // EMPTY
            // =========================

            if(!selected){

                emptyQuestions.push(index + 1);

                return;

            }


            // =========================
            // CORRECT
            // =========================

            if(

                Number(selected.value) ===

                question.answer

            ){

                score += 1;

            }


            // =========================
            // WRONG
            // =========================

            else{

                wrongAnswers.push({

                    question:
                    question.question,

                    yourAnswer:
                    question.options[
                        Number(selected.value)
                    ],

                    correctAnswer:
                    question.options[
                        question.answer
                    ]

                });

            }

        }


        // =========================
        // CHECKBOX
        // =========================

        if(question.type === "checkbox"){

            const selected =

            document.querySelectorAll(

                `input[name="question_${question.id}"]:checked`

            );


            // =========================
            // LESS THAN TWO
            // =========================

            if(selected.length < 2){

                emptyQuestions.push(index + 1);

                return;

            }


            // =========================
            // SELECTED ANSWERS
            // =========================

            const selectedAnswers =

            Array.from(selected)

            .map(

                answer =>

                Number(answer.value)

            );


            // =========================
            // CHECK ANSWERS
            // =========================

            const correctAnswers =

            question.answers;


            const isCorrect =

            selectedAnswers.length ===

            correctAnswers.length &&

            selectedAnswers.every(

                answer =>

                correctAnswers.includes(answer)

            );


            // =========================
            // CORRECT
            // =========================

            if(isCorrect){

                score += 1;

            }


            // =========================
            // WRONG
            // =========================

            else{

                wrongAnswers.push({

                    question:
                    question.question,

                    yourAnswer:

                    selectedAnswers

                    .map(

                        answer =>

                        question.options[answer]

                    )

                    .join(", "),

                    correctAnswer:

                    correctAnswers

                    .map(

                        answer =>

                        question.options[answer]

                    )

                    .join(", ")

                });

            }

        }

    });


    // ==================================================
    // CHECK EMPTY QUESTIONS
    // ==================================================

    if(

        emptyQuestions.length > 0 &&

        !autoSubmit

    ){

        alert(

            "Please answer questions: " +

            emptyQuestions.join(", ")

        );

        return;

    }


    // ==================================================
    // SAVE RESULT
    // ==================================================

    let results =

    JSON.parse(

        localStorage.getItem("results")

    ) || [];


    // =========================
    // FIND STUDENT
    // =========================

    const existingIndex =

    results.findIndex(

        student =>

        student.name.toLowerCase() ===

        username.toLowerCase()

        &&

        student.stage === stage

    );


    // =========================
    // RESULT OBJECT
    // =========================

    const resultData = {

        name:
        username,

        stage:
        stage,

        score:
        score,

        total:
        questions.length,

        wrongAnswers:
        wrongAnswers,

        date:
        new Date().toLocaleString()

    };


    // =========================
    // UPDATE RESULT
    // =========================

    if(existingIndex !== -1){

        results[existingIndex] =

        resultData;

    }


    // =========================
    // NEW RESULT
    // =========================

    else{

        results.push(

            resultData

        );

    }


    // =========================
    // SAVE
    // =========================

    localStorage.setItem(

        "results",

        JSON.stringify(results)

    );


    // =========================
    // GO TO RESULTS
    // =========================

    localStorage.setItem(

        "lastExamResult",

        JSON.stringify(resultData)

    );


    window.location.href =

    "results.html";

});
