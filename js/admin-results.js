// ======================================================
// ADMIN RESULTS SYSTEM
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const resultsTableBody =
document.getElementById("resultsTableBody");

const searchResults =
document.getElementById("searchResults");

const noResults =
document.getElementById("noResults");

const backToAdmin =
document.getElementById("backToAdmin");


const deleteAllResults =
document.getElementById("deleteAllResults");

// ======================================================
// LOAD RESULTS FROM LOCAL STORAGE
// ======================================================

let results =
JSON.parse(
    localStorage.getItem("results")
) || [];


// ======================================================
// SORT RESULTS
// Highest Score → Lowest Score
// If Same Score → Newest First
// ======================================================

function sortResults(data){

    return [...data].sort(
        (a,b)=>{

            // النسبة المئوية للدرجة
            const scoreA =
            a.total > 0
            ?
            a.score / a.total
            :
            0;


            const scoreB =
            b.total > 0
            ?
            b.score / b.total
            :
            0;


            // أعلى نسبة أولًا
            if(scoreB !== scoreA){

                return scoreB - scoreA;

            }


            // لو نفس الدرجة
            // الأحدث أولًا

            const dateA =
            new Date(a.date || 0);

            const dateB =
            new Date(b.date || 0);


            return dateB - dateA;

        }
    );

}


// ======================================================
// DISPLAY RESULTS
// ======================================================

function displayResults(data){

    resultsTableBody.innerHTML =
    "";


    // =========================
    // NO RESULTS
    // =========================

    if(data.length === 0){

        noResults.style.display =
        "block";

        return;

    }


    noResults.style.display =
    "none";


    // =========================
    // SORT
    // =========================

    const sortedResults =
    sortResults(data);


    // =========================
    // CREATE TABLE ROWS
    // =========================

    sortedResults.forEach(
        (student,index)=>{

            const row =
            document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        student.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        student.stage
                    )}
                </td>

                <td>
                    <strong>

                        ${student.score}

                        /

                        ${student.total}

                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        student.date ||
                        "N/A"
                    )}
                </td>

                <td>

    <button
    class="view-button"
    type="button">

        View

    </button>

    <button
    class="delete-button"
    type="button">

        Delete

    </button>

</td>

            `;


            // =========================
            // VIEW BUTTON
            // =========================

            const viewButton =
            row.querySelector(
                ".view-button"
            );


const deleteButton =
row.querySelector(
    ".delete-button"
);

            viewButton.addEventListener(
                "click",
                function(){

                    viewStudentResult(
                        student
                    );

                }
            );


            deleteButton.addEventListener(
    "click",
    function(){

        if(!confirm(
            "Delete this result?"
        )) return;

        results = results.filter(item =>

            !(

                item.name === student.name &&
                item.stage === student.stage &&
                item.date === student.date

            )

        );

        localStorage.setItem(
            "results",
            JSON.stringify(results)
        );

        displayResults(results);

    }
);


            viewButton.addEventListener(
    "click",
    function(){

        viewStudentResult(
            student
        );

    }
);

            resultsTableBody.appendChild(
                row
            );

        }
    );

}


// ======================================================
// SEARCH RESULTS
// ======================================================

searchResults.addEventListener(
    "input",
    function(){

        const searchValue =

        searchResults.value
        .trim()
        .toLowerCase();


        if(searchValue === ""){

            displayResults(
                results
            );

            return;

        }


        const filteredResults =

        results.filter(
            student =>

            student.name
            .toLowerCase()
            .includes(
                searchValue
            )

        );


        displayResults(
            filteredResults
        );

    }
);


// ======================================================
// RESULT MODAL
// ======================================================

const resultModal =
document.getElementById("resultModal");

const closeModal =
document.getElementById("closeModal");

const modalStudentName =
document.getElementById("modalStudentName");

const modalStudentInfo =
document.getElementById("modalStudentInfo");

const modalWrongAnswers =
document.getElementById("modalWrongAnswers");


// ======================================================
// VIEW STUDENT RESULT
// ======================================================

function viewStudentResult(student){

    modalStudentName.textContent =
    student.name;


    modalStudentInfo.innerHTML = `

        <div class="student-info">

            <div>

                <span>Stage</span>

                <strong>
                    ${escapeHTML(student.stage)}
                </strong>

            </div>


            <div>

                <span>Score</span>

                <strong>
                    ${student.score}/${student.total}
                </strong>

            </div>


            <div>

                <span>Date</span>

                <strong>
                    ${escapeHTML(
                        student.date || "N/A"
                    )}
                </strong>

            </div>

        </div>

    `;


    // ==================================================
    // PERFECT SCORE
    // ==================================================

    if(

        !student.wrongAnswers ||

        student.wrongAnswers.length === 0

    ){

        modalWrongAnswers.innerHTML = `

            <div class="perfect-result">

                🎉 Perfect!

                <br>

                All answers are correct.

            </div>

        `;

    }


    // ==================================================
    // WRONG ANSWERS
    // ==================================================

    else{

        modalWrongAnswers.innerHTML = `

            <h3>
                Wrong Answers
            </h3>

        `;


        student.wrongAnswers.forEach(
            (item,index)=>{

                modalWrongAnswers.innerHTML += `

                    <div class="wrong-answer">

                        <h4>

                            ${index + 1}.

                            ${escapeHTML(
                                item.question
                            )}

                        </h4>


                        <p>

                            <span>
                                Your Answer:
                            </span>

                            ${escapeHTML(
                                item.yourAnswer
                            )}

                        </p>


                        <p>

                            <span>
                                Correct Answer:
                            </span>

                            ${escapeHTML(
                                item.correctAnswer
                            )}

                        </p>

                    </div>

                `;

            }
        );

    }


    // ==================================================
    // SHOW MODAL
    // ==================================================

    resultModal.classList.add(
        "show"
    );

}


// ======================================================
// CLOSE MODAL
// ======================================================

closeModal.addEventListener(
    "click",
    function(){

        resultModal.classList.remove(
            "show"
        );

    }
);


// ======================================================
// CLOSE WHEN CLICK OUTSIDE
// ======================================================

resultModal.addEventListener(
    "click",
    function(e){

        if(e.target === resultModal){

            resultModal.classList.remove(
                "show"
            );

        }

    }
);


// ======================================================
// BACK TO ADMIN PANEL
// ======================================================

backToAdmin.addEventListener(
    "click",
    function(){

        window.location.href =
        "admin.html";

    }
);


// ======================================================
// ESCAPE HTML
// Prevent HTML Injection
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


// ======================================================
// DELETE ALL RESULTS
// ======================================================

deleteAllResults.addEventListener(
    "click",
    function(){

        if(!confirm(
            "Delete ALL results?"
        )){

            return;

        }

        results = [];

        localStorage.setItem(

            "results",

            JSON.stringify(results)

        );

        displayResults(results);

        alert(
            "All results deleted successfully."
        );

    }
);


displayResults(
    results
);