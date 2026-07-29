// ======================================================
// ADMIN SYSTEM
// Version 3.0 - Clean Dynamic Options Version
// ======================================================
// ======================================================
// ADMIN PROTECTION
// ======================================================

if(

    localStorage.getItem(

        "adminLogged"

    ) !== "true"

){

    window.location.href =

    "login.html";

}

// ======================================================
// ELEMENTS
// ======================================================

const settingsForm =
document.getElementById("settingsForm");

const resultsContainer =
document.getElementById("resultsContainer");

const questionContainer =
document.getElementById("questionsTable");

const publishContainer =
document.getElementById("examBuilder");

const examTimeInput =
document.getElementById("examTime");

const allowRetakeInput =
document.getElementById("allowRetake");

const questionStage =
document.getElementById("questionStage");

const questionText =
document.getElementById("questionText");

const optionsContainer =
document.getElementById("optionsContainer");

const addOptionButton =
document.getElementById("addOption");

const saveQuestion =
document.getElementById("saveQuestion");

const correctAnswers =
document.getElementById("correctAnswers");

const publishExamButton =
document.getElementById("publishExam");


// ======================================================
// ACCOUNT MANAGER
// ======================================================

const accountSelect =
document.getElementById(
    "accountSelect"
);

const newAdminUsername =
document.getElementById(
    "newAdminUsername"
);

const newAdminPassword =
document.getElementById(
    "newAdminPassword"
);

const addAdmin =
document.getElementById(
    "addAdmin"
);

const editAdmin =
document.getElementById(
    "editAdmin"
);

const deleteAdmin =
document.getElementById(
    "deleteAdmin"
);

const logoutAdmin =
document.getElementById(
    "logoutAdmin"
);


// ======================================================
// ADMIN ACCOUNTS
// ======================================================

// ======================================================
// DEFAULT ADMIN
// ======================================================

if(!localStorage.getItem("adminAccounts")){

    localStorage.setItem(

        "adminAccounts",

        JSON.stringify([

            {
                username:"admin",
                password:"123456"
            }

        ])

    );

}


// ======================================================
// ADMIN ACCOUNTS
// ======================================================

let adminAccounts =

JSON.parse(

    localStorage.getItem(

        "adminAccounts"

    )

) || [];

// ======================================================
// SAVE ACCOUNTS
// ======================================================

function saveAdminAccounts(){

    localStorage.setItem(

        "adminAccounts",

        JSON.stringify(

            adminAccounts

        )

    );

}


// ======================================================
// LOAD ACCOUNTS
// ======================================================

function loadAccounts(){

    accountSelect.innerHTML = "";

    adminAccounts.forEach(

        account=>{

            const option =

            document.createElement(

                "option"

            );

            option.value =

            account.username;

            option.textContent =

            account.username;

            accountSelect.appendChild(

                option

            );

        }

    );

}


loadAccounts();

// ======================================================
// ADD ADMIN
// ======================================================

addAdmin.addEventListener(

    "click",

    function(){

        const username =

        newAdminUsername.value.trim();

        const password =

        newAdminPassword.value.trim();


        if(

            username === "" ||

            password === ""

        ){

            alert(

                "Please enter username and password."

            );

            return;

        }


        if(

            adminAccounts.some(

                account =>

                account.username === username

            )

        ){

            alert(

                "Username already exists."

            );

            return;

        }


        adminAccounts.push({

            username,

            password

        });

        saveAdminAccounts();

        loadAccounts();

        newAdminUsername.value = "";

        newAdminPassword.value = "";

    }

);


// ======================================================
// EDIT ADMIN
// ======================================================

editAdmin.addEventListener(

    "click",

    function(){

        const selected =

        accountSelect.value;

        const account =

        adminAccounts.find(

            a =>

            a.username === selected

        );


        if(!account){

            return;

        }


        if(

            newAdminUsername.value.trim() !== ""

        ){

           if(account.username === "admin"){

    alert("The default admin username cannot be changed.");

    return;

}

account.username =
newAdminUsername.value.trim();
        }


        if(

            newAdminPassword.value.trim() !== ""

        ){

            account.password =

            newAdminPassword.value.trim();

        }


        saveAdminAccounts();

        loadAccounts();

        newAdminUsername.value = "";

        newAdminPassword.value = "";

    }

);


// ======================================================
// DELETE ADMIN
// ======================================================
deleteAdmin.addEventListener(

    "click",

    function(){

        if(accountSelect.value === "admin"){

            alert("The default admin account cannot be deleted.");

            return;

        }

        if(

            !confirm(

                "Delete this account?"

            )

        ){

            return;

        }


        adminAccounts =

        adminAccounts.filter(

            account =>

            account.username !==

            accountSelect.value

        );


        saveAdminAccounts();

        loadAccounts();

    }

);


// ======================================================
// LOGOUT
// ======================================================

logoutAdmin.addEventListener(

    "click",

    function(){

        localStorage.removeItem(

            "adminLogged"

        );

        window.location.href =

        "login.html";

    }

);


// ======================================================
// START
// ======================================================


let questionBank =
JSON.parse(
    localStorage.getItem("questionBank")
) || [];

let currentExam =
JSON.parse(
    localStorage.getItem("currentExam")
) || [];

let results =
JSON.parse(
    localStorage.getItem("results")
) || [];

let editingQuestionId = null;


// ======================================================
// DEFAULT SETTINGS
// ======================================================

if(
    localStorage.getItem("allowRetake") === null
){

    localStorage.setItem(
        "allowRetake",
        "true"
    );

}

if(
    localStorage.getItem("examTime") === null
){

    localStorage.setItem(
        "examTime",
        "15"
    );

}


// ======================================================
// DYNAMIC OPTIONS
// ======================================================

function addOption(value = ""){

    const count =
    optionsContainer.querySelectorAll(
        ".option-input"
    ).length;


    if(count >= 5){

        alert(
            "Maximum 5 options allowed."
        );

        return;

    }


    const input =
    document.createElement("input");


    input.type =
    "text";


    input.className =
    "option-input";


    input.placeholder =
    `Option ${count + 1}`;


    input.value =
    value;


    input.addEventListener(
        "input",
        renderCorrectAnswers
    );


    optionsContainer.appendChild(
        input
    );


    renderCorrectAnswers();

}


// ======================================================
// ADD OPTION BUTTON
// ======================================================

addOptionButton.addEventListener(
    "click",
    function(){

        addOption();

    }
);


// ======================================================
// RENDER CORRECT ANSWERS
// ======================================================

function renderCorrectAnswers(){

    if(!correctAnswers){

        return;

    }


    const selectedType =
    document.querySelector(
        'input[name="questionType"]:checked'
    );


    if(!selectedType){

        correctAnswers.innerHTML =
        "";

        return;

    }


    const type =
    selectedType.value;


    const options =
    Array.from(

        optionsContainer.querySelectorAll(
            ".option-input"
        )

    );


    correctAnswers.innerHTML =
    "";


    if(options.length === 0){

        return;

    }


    const title =
    document.createElement("h3");


    title.textContent =

    type === "radio"

    ?

    "Correct Answer"

    :

    "Choose TWO Correct Answers";


    correctAnswers.appendChild(
        title
    );


    options.forEach(
        (option,index)=>{

            const label =
            document.createElement("label");


            const input =
            document.createElement("input");


            input.type =

            type === "radio"

            ?

            "radio"

            :

            "checkbox";


            input.name =
            "correct";


            input.value =
            index;


            label.appendChild(
                input
            );


            label.appendChild(

                document.createTextNode(

                    ` Option ${index + 1}: ${
                        option.value || "(empty)"
                    }`

                )

            );


            correctAnswers.appendChild(
                label
            );


            correctAnswers.appendChild(
                document.createElement("br")
            );

        }

    );

}


// ======================================================
// QUESTION TYPE CHANGE
// ======================================================

document
.querySelectorAll(
    'input[name="questionType"]'
)
.forEach(
    input=>{

        input.addEventListener(
            "change",
            renderCorrectAnswers
        );

    }
);


// ======================================================
// SAVE SETTINGS
// ======================================================

settingsForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();


        const selectedStage =
        document.querySelector(
            'input[name="stage"]:checked'
        );


        if(!selectedStage){

            alert(
                "Choose Active Stage"
            );

            return;

        }


        localStorage.setItem(
            "activeStage",
            selectedStage.value
        );


        localStorage.setItem(
            "examTime",
            examTimeInput.value
        );


        localStorage.setItem(
            "allowRetake",
            allowRetakeInput.checked
        );


        alert(
            "Settings Saved Successfully ✔"
        );


        loadExamBuilder();

    }
);


// ======================================================
// SAVE / UPDATE QUESTION
// ======================================================

saveQuestion.addEventListener(
    "click",
    function(){

        const stage =
        questionStage.value;


        const selectedType =
        document.querySelector(
            'input[name="questionType"]:checked'
        );


        if(!selectedType){

            alert(
                "Choose question type."
            );

            return;

        }


        const type =
        selectedType.value;


        const question =
        questionText.value.trim();


        const options =

        Array.from(

            optionsContainer.querySelectorAll(
                ".option-input"
            )

        )

        .map(
            input =>
            input.value.trim()
        )

        .filter(
            option =>
            option !== ""
        );


        // =========================
        // VALIDATE QUESTION
        // =========================

        if(question === ""){

            alert(
                "Write the question."
            );

            return;

        }


        // =========================
        // VALIDATE OPTIONS
        // =========================

        if(options.length < 2){

            alert(
                "Question must have at least 2 options."
            );

            return;

        }


        // =========================
        // RADIO QUESTION
        // =========================

        if(type === "radio"){

            const correct =
            document.querySelector(
                'input[name="correct"]:checked'
            );


            if(!correct){

                alert(
                    "Choose the correct answer."
                );

                return;

            }


            const newQuestion = {

                id:

                editingQuestionId !== null

                ?

                editingQuestionId

                :

                Date.now(),

                stage,

                type,

                question,

                options,

                answer:
                Number(correct.value)

            };


            saveQuestionToBank(
                newQuestion
            );

        }


        // =========================
        // CHECKBOX QUESTION
        // =========================

        else{

            const checked =
            document.querySelectorAll(
                'input[name="correct"]:checked'
            );


            if(checked.length !== 2){

                alert(
                    "Choose TWO correct answers."
                );

                return;

            }


            const answers =

            Array.from(
                checked
            )

            .map(
                item =>
                Number(item.value)
            );


            const newQuestion = {

                id:

                editingQuestionId !== null

                ?

                editingQuestionId

                :

                Date.now(),

                stage,

                type,

                question,

                options,

                answers

            };


            saveQuestionToBank(
                newQuestion
            );

        }

    }
);


// ======================================================
// SAVE QUESTION TO BANK
// ======================================================

function saveQuestionToBank(
    question
){

    if(
        editingQuestionId !== null
    ){

        const index =
        questionBank.findIndex(
            q =>
            q.id ===
            editingQuestionId
        );


        if(index !== -1){

            questionBank[index] =
            question;

        }

    }

    else{

        questionBank.push(
            question
        );

    }


    localStorage.setItem(

        "questionBank",

        JSON.stringify(
            questionBank
        )

    );


    alert(

        editingQuestionId !== null

        ?

        "Question Updated Successfully ✔"

        :

        "Question Saved Successfully ✔"

    );


    clearQuestionForm();


    loadQuestionBank();


    loadExamBuilder();

}


// ======================================================
// CLEAR QUESTION FORM
// ======================================================

function clearQuestionForm(){

    editingQuestionId =
    null;


    questionText.value =
    "";


    optionsContainer.innerHTML =
    "";


    addOption();


    addOption();


    correctAnswers.innerHTML =
    "";


    saveQuestion.innerHTML =
    "Save Question";


    renderCorrectAnswers();

}


// ======================================================
// LOAD QUESTION BANK
// ======================================================

function loadQuestionBank(){

    questionContainer.innerHTML =
    "";


    if(
        questionBank.length === 0
    ){

        questionContainer.innerHTML = `

            <h3>
                No Questions Yet
            </h3>

        `;

        return;

    }


    questionBank.forEach(
        question=>{

            let html = `

                <div class="question-card">

                    <h3>
                        ${escapeHTML(
                            question.stage
                        )}
                    </h3>

                    <p>

                        <b>Type:</b>

                        ${
                            question.type === "radio"

                            ?

                            "Choose the Correct Answer"

                            :

                            "Choose TWO Correct Answers"
                        }

                    </p>

                    <h2>

                        ${escapeHTML(
                            question.question
                        )}

                    </h2>

            `;


            question.options.forEach(
                (option,index)=>{

                    let correct =
                    false;


                    if(
                        question.type ===
                        "radio"
                    ){

                        correct =
                        index ===
                        question.answer;

                    }

                    else{

                        correct =

                        Array.isArray(
                            question.answers
                        )

                        &&

                        question.answers.includes(
                            index
                        );

                    }


                    html += `

                        <p
                        style="color:${
                            correct
                            ? "lime"
                            : "white"
                        }">

                            ${index + 1}.

                            ${escapeHTML(
                                option
                            )}

                            ${
                                correct
                                ? " ✔ Correct"
                                : ""
                            }

                        </p>

                    `;

                }
            );


            html += `

                    <br>

                    <button
                        type="button"
                        onclick="editQuestion(
                            ${question.id}
                        )">

                        ✏ Edit

                    </button>


                    <button
                        type="button"
                        onclick="deleteQuestion(
                            ${question.id}
                        )">

                        🗑 Delete

                    </button>

                </div>

                <hr>

            `;


            questionContainer.innerHTML +=
            html;

        }
    );

}


// ======================================================
// EDIT QUESTION
// ======================================================

function editQuestion(id){

    const question =
    questionBank.find(
        q =>
        q.id === id
    );


    if(!question){

        return;

    }


    editingQuestionId =
    id;


    // =========================
    // STAGE
    // =========================

    questionStage.value =
    question.stage;


    // =========================
    // TYPE
    // =========================

    const typeInput =
    document.querySelector(

        `input[name="questionType"][value="${question.type}"]`

    );


    if(typeInput){

        typeInput.checked =
        true;

    }


    // =========================
    // QUESTION
    // =========================

    questionText.value =
    question.question;


    // =========================
    // OPTIONS
    // =========================

    optionsContainer.innerHTML =
    "";


    question.options.forEach(
        option=>{

            addOption(
                option
            );

        }
    );


    // =========================
    // RENDER ANSWERS
    // =========================

    renderCorrectAnswers();


    // =========================
    // SELECT CORRECT ANSWER
    // =========================

    if(
        question.type ===
        "radio"
    ){

        const correct =
        document.querySelector(

            `input[name="correct"][value="${question.answer}"]`

        );


        if(correct){

            correct.checked =
            true;

        }

    }


    else{

        if(
            Array.isArray(
                question.answers
            )
        ){

            question.answers.forEach(
                answer=>{

                    const correct =
                    document.querySelector(

                        `input[name="correct"][value="${answer}"]`

                    );


                    if(correct){

                        correct.checked =
                        true;

                    }

                }
            );

        }

    }


    saveQuestion.innerHTML =
    "Update Question";


    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


// ======================================================
// DELETE QUESTION
// ======================================================

function deleteQuestion(id){

    const confirmDelete =
    confirm(
        "Delete this question?"
    );


    if(!confirmDelete){

        return;

    }


    questionBank =

    questionBank.filter(
        q =>
        q.id !== id
    );


    currentExam =

    currentExam.filter(
        questionId =>
        questionId !== id
    );


    localStorage.setItem(

        "questionBank",

        JSON.stringify(
            questionBank
        )

    );


    localStorage.setItem(

        "currentExam",

        JSON.stringify(
            currentExam
        )

    );


    loadQuestionBank();


    loadExamBuilder();

}


// ======================================================
// LOAD RESULTS
// ======================================================

function loadResults(){

    resultsContainer.innerHTML =
    "";


    if(
        results.length === 0
    ){

        resultsContainer.innerHTML = `

            <h3>
                No Results Yet
            </h3>

        `;

        return;

    }


    results.forEach(
        (student,index)=>{

            resultsContainer.innerHTML += `

                <div class="result-card">

                    <h3>

                        ${escapeHTML(
                            student.name
                        )}

                    </h3>


                    <p>

                        <strong>
                            Stage:
                        </strong>

                        ${escapeHTML(
                            student.stage
                        )}

                    </p>


                    <p>

                        <strong>
                            Score:
                        </strong>

                        ${student.score}/
                        ${student.total}

                    </p>


                    <p>

                        <strong>
                            Date:
                        </strong>

                        ${escapeHTML(
                            student.date ||
                            "N/A"
                        )}

                    </p>


                    <button
                        type="button"
                        onclick="viewResult(
                            ${index}
                        )">

                        View Result

                    </button>

                </div>

            `;

        }
    );

}


// ======================================================
// VIEW RESULT
// ======================================================

function viewResult(index){

    const student =
    results[index];


    if(!student){

        return;

    }


    let message =

    `Student: ${student.name}\n` +

    `Stage: ${student.stage}\n` +

    `Score: ${student.score}/${student.total}\n\n`;


    if(

        !student.wrongAnswers

        ||

        student.wrongAnswers.length === 0

    ){

        message +=

        "Perfect! All answers are correct.";

    }

    else{

        message +=
        "Wrong Answers:\n\n";


        student.wrongAnswers.forEach(
            (item,i)=>{

                message +=

                `${i + 1}. ${
                    item.question
                }\n` +

                `Your Answer: ${
                    item.yourAnswer
                }\n` +

                `Correct Answer: ${
                    item.correctAnswer
                }\n\n`;

            }
        );

    }


    alert(
        message
    );

}


// ======================================================
// LOAD EXAM BUILDER
// ======================================================

function loadExamBuilder(){

    publishContainer.innerHTML =
    "";


    const activeStage =
    localStorage.getItem(
        "activeStage"
    );


    if(!activeStage){

        publishContainer.innerHTML = `

            <h3>

                Please choose the active
                stage first.

            </h3>

        `;

        return;

    }


    const stageQuestions =

    questionBank.filter(
        q =>
        q.stage ===
        activeStage
    );


    if(
        stageQuestions.length === 0
    ){

        publishContainer.innerHTML = `

            <h3>
                No Questions Available
            </h3>

        `;

        return;

    }


    stageQuestions.forEach(
        question=>{

            publishContainer.innerHTML += `

                <label
                style="
                display:block;
                margin:12px 0;
                ">

                    <input

                        type="checkbox"

                        class="publish-question"

                        value="${
                            question.id
                        }"

                        ${
                            currentExam.includes(
                                question.id
                            )

                            ?

                            "checked"

                            :

                            ""
                        }

                    >

                    ${escapeHTML(
                        question.question
                    )}

                </label>

            `;

        }
    );

}


// ======================================================
// PUBLISH EXAM
// ======================================================

publishExamButton.addEventListener(
    "click",
    function(){

        const selectedQuestions =
        document.querySelectorAll(
            ".publish-question:checked"
        );


        if(
            selectedQuestions.length ===
            0
        ){

            alert(

                "Please select at least one question."

            );

            return;

        }


        currentExam =

        Array.from(
            selectedQuestions
        )

        .map(
            item =>
            Number(
                item.value
            )
        );


        localStorage.setItem(

            "currentExam",

            JSON.stringify(
                currentExam
            )

        );


        const stage =
        document.querySelector(
            'input[name="stage"]:checked'
        );


        if(stage){

            localStorage.setItem(

                "activeStage",

                stage.value

            );

        }


        alert(

            "Exam Published Successfully ✔"

        );

    }
);


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value){

    const div =
    document.createElement(
        "div"
    );


    div.textContent =
    value ?? "";


    return div.innerHTML;

}


// ======================================================
// INITIAL LOAD
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    function(){

        // =========================
        // LOAD SETTINGS
        // =========================

        examTimeInput.value =

        localStorage.getItem(
            "examTime"
        )

        ||

        15;


        allowRetakeInput.checked =

        localStorage.getItem(
            "allowRetake"
        )

        ===

        "true";


        // =========================
        // LOAD ACTIVE STAGE
        // =========================

        const savedStage =

        localStorage.getItem(
            "activeStage"
        );


        if(savedStage){

            const stageRadio =

            document.querySelector(

                `input[name="stage"][value="${savedStage}"]`

            );


            if(stageRadio){

                stageRadio.checked =
                true;

            }

        }


        // =========================
        // CREATE DEFAULT OPTIONS
        // =========================

        optionsContainer.innerHTML =
        "";


        addOption();


        addOption();


        // =========================
        // LOAD DATA
        // =========================

        loadQuestionBank();


        loadResults();


        loadExamBuilder();


        renderCorrectAnswers();

    }
);
// ======================================================
// OPEN RESULTS PAGE
// ======================================================

const viewResults =
document.getElementById("viewResults");

if(viewResults){

    viewResults.addEventListener(
        "click",
        function(){

            window.location.href =
            "admin-results.html";

        }
    );

}
