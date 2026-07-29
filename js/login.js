// ======================================================
// LOGIN SYSTEM
// Version 4.0
// ======================================================


// ======================================================
// STUDENT ELEMENTS
// ======================================================

const loginForm =
document.getElementById(
    "loginForm"
);

const usernameInput =
document.getElementById(
    "username"
);

const stageInputs =
document.querySelectorAll(
    'input[name="stage"]'
);


// ======================================================
// ADMIN ELEMENTS
// ======================================================

const adminLoginForm =
document.getElementById(
    "adminLoginForm"
);

const adminUsernameInput =
document.getElementById(
    "adminUsername"
);

const adminPasswordInput =
document.getElementById(
    "adminPassword"
);


// ======================================================
// USER TYPE SWITCH
// ======================================================

const studentMode =
document.getElementById(
    "studentMode"
);

const adminMode =
document.getElementById(
    "adminMode"
);

const studentCard =
document.getElementById(
    "loginForm"
);

const adminCard =
document.getElementById(
    "adminLoginForm"
);


// ======================================================
// CREATE DEFAULT ADMIN ACCOUNT
// ======================================================

let adminAccounts =

JSON.parse(

    localStorage.getItem(
        "adminAccounts"
    )

) || [];


if(

    adminAccounts.length === 0

){

    adminAccounts.push({

        username:"admin",

        password:"1234"

    });

    localStorage.setItem(

        "adminAccounts",

        JSON.stringify(
            adminAccounts
        )

    );

}


// ======================================================
// GET SETTINGS
// ======================================================

function getActiveStage(){

    return localStorage.getItem(

        "activeStage"

    );

}


function getAllowRetake(){

    return localStorage.getItem(

        "allowRetake"

    ) === "true";

}


function getResults(){

    return JSON.parse(

        localStorage.getItem(
            "results"
        )

    ) || [];

}
// ======================================================
// USERNAME VALIDATION
// ======================================================

function validateName(name){

    // =========================
    // REMOVE EXTRA SPACES
    // =========================

    name =

    name
    .trim()
    .replace(/\s+/g," ");


    // =========================
    // EMPTY
    // =========================

    if(name === ""){

        alert(

            "Please enter your full name."

        );

        return false;

    }


    // =========================
    // ENGLISH ONLY
    // =========================

    const englishLettersOnly =

    /^[A-Za-z]+(?: [A-Za-z]+)*$/;


    if(

        !englishLettersOnly.test(name)

    ){

        alert(

            "Please use English letters only."

        );

        return false;

    }


    // =========================
    // FOUR NAMES
    // =========================

    const words =

    name.split(" ");


    if(words.length !== 4){

        alert(

            "Please enter your full name using exactly 4 names."

        );

        return false;

    }


    // =========================
    // EACH NAME >=2 LETTERS
    // =========================

    for(const word of words){

        if(word.length < 2){

            alert(

                "Each name must contain at least 2 letters."

            );

            return false;

        }

    }


    return true;

}


// ======================================================
// GET SELECTED STAGE
// ======================================================

function getSelectedStage(){

    const selectedStage =

    document.querySelector(

        'input[name="stage"]:checked'

    );


    if(!selectedStage){

        return "";

    }


    return selectedStage.value;

}


// ======================================================
// CHECK ACTIVE STAGE
// ======================================================

function checkStage(studentStage){

    const activeStage =

    getActiveStage();


    if(!activeStage){

        alert(

            "There is no published exam."

        );

        return false;

    }


    if(studentStage !== activeStage){

        alert(

            "There are no exams available for your stage."

        );

        return false;

    }


    return true;

}


// ======================================================
// CHECK RETAKE
// ======================================================

function checkRetake(

    name,

    stage

){

    if(

        getAllowRetake()

    ){

        return true;

    }


    const results =

    getResults();


    const foundStudent =

    results.find(

        student =>

        student.name &&
        student.stage &&

        student.name
        .trim()
        .toLowerCase()

        ===

        name
        .trim()
        .toLowerCase()

        &&

        student.stage === stage

    );


    if(foundStudent){

        alert(

            "You have already taken this exam."

        );

        return false;

    }


    return true;

}
// ======================================================
// STUDENT LOGIN
// ======================================================

loginForm.addEventListener(

    "submit",

    function(e){

        e.preventDefault();


        // =========================
        // USERNAME
        // =========================

        const username =

        usernameInput.value

        .trim()

        .replace(/\s+/g," ");


        // =========================
        // STAGE
        // =========================

        const stage =

        getSelectedStage();


        // =========================
        // VALIDATE NAME
        // =========================

        if(

            !validateName(

                username

            )

        ){

            return;

        }


        // =========================
        // CHECK STAGE
        // =========================

        if(stage === ""){

            alert(

                "Please choose your stage."

            );

            return;

        }


        // =========================
        // ACTIVE STAGE
        // =========================

        if(

            !checkStage(

                stage

            )

        ){

            return;

        }


        // =========================
        // RETAKE
        // =========================

        if(

            !checkRetake(

                username,

                stage

            )

        ){

            return;

        }


        // =========================
        // SAVE DATA
        // =========================

        localStorage.setItem(

            "username",

            username

        );


        localStorage.setItem(

            "stage",

            stage

        );


        // =========================
        // OPEN EXAM
        // =========================

        window.location.href =

        "exam.html";

    }

);
// ======================================================
// USER TYPE SWITCH
// ======================================================

function showStudent(){

    studentCard.classList.remove(
        "hidden"
    );

    studentCard.classList.add(
        "active"
    );


    adminCard.classList.remove(
        "active"
    );

    adminCard.classList.add(
        "hidden"
    );


    usernameInput.focus();

}


function showAdmin(){

    adminCard.classList.remove(
        "hidden"
    );

    adminCard.classList.add(
        "active"
    );


    studentCard.classList.remove(
        "active"
    );

    studentCard.classList.add(
        "hidden"
    );


    adminUsernameInput.focus();

}


// ======================================================
// DEFAULT MODE
// ======================================================

showStudent();

studentMode.addEventListener(

    "change",

    showStudent

);

adminMode.addEventListener(

    "change",

    showAdmin

);


// ======================================================
// AUTO FOCUS
// ======================================================

window.addEventListener(

    "load",

    function(){

        usernameInput.focus();

    }

);

// ======================================================
// ADMIN LOGIN
// ======================================================

adminLoginForm.addEventListener(

    "submit",

    function(e){

        e.preventDefault();


        const username =

        adminUsernameInput.value

        .trim();


        const password =

        adminPasswordInput.value;


        const account =

        adminAccounts.find(

            admin =>

            admin.username === username

            &&

            admin.password === password

        );


        if(!account){

            alert(

                "Wrong username or password."

            );

            return;

        }


        // =========================
        // LOGIN SUCCESS
        // =========================

        localStorage.setItem(

            "adminLogged",

            "true"

        );


        window.location.href =

        "admin.html";

    }

);


// ======================================================
// LOGOUT FUNCTION
// ======================================================

function adminLogout(){

    localStorage.removeItem(

        "adminLogged"

    );

}


// ======================================================
// SAVE ADMIN ACCOUNTS
// ======================================================

function saveAdminAccounts(){

    localStorage.setItem(

        "adminAccounts",

        JSON.stringify(

            adminAccounts

        )

    );

}