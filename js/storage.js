// ==========================================
// STORAGE MANAGER
// ==========================================

const STORAGE_KEY = "EnglishExamSystem";

function getSystem() {

    let system =
    JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!system) {

        system = {

            settings: {

                activeStage: "",

                examTime: 15,

                allowRetake: true

            },

            questionBank: [],

            currentExam: [],

            results: []

        };

        saveSystem(system);

    }

    return system;

}

function saveSystem(system) {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(system)

    );

}