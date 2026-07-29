// ===============================
// Load Results
// ===============================

let results =
JSON.parse(localStorage.getItem("results")) || [];


if(results.length === 0){

    document.querySelector(".container").innerHTML = `

        <h1>No Results Found</h1>

    `;

}
else{

    // آخر طالب أنهى الامتحان

    const student =
    results[results.length - 1];


    // ===============================
    // Student Info
    // ===============================

    document.getElementById("studentName").innerHTML =
    student.name;


    document.getElementById("studentStage").innerHTML =
    student.stage;


    document.getElementById("score").innerHTML =
    `Score : ${student.score}/${student.total}`;


    // ===============================
    // Wrong Answers
    // ===============================

    let wrongDiv =
    document.getElementById("wrongAnswers");


    // ===============================
    // PERFECT SCORE
    // ===============================

    if(student.wrongAnswers.length === 0){

        wrongDiv.innerHTML = `

        <h2 style="color:lime;">

        🎉 Perfect! All answers are correct.

        </h2>

        `;

    }


    // ===============================
    // SHOW WRONG ANSWERS
    // ===============================

    else{

        wrongDiv.innerHTML =

        "<h2>Wrong Answers</h2>";


        student.wrongAnswers.forEach(

        (item,index)=>{

            wrongDiv.innerHTML += `

            <div class="wrong">


                <!-- QUESTION -->

                <h3 class="question-text">

                    ${index + 1}.

                    ${item.question}

                </h3>


                <!-- WRONG ANSWER -->

                <p class="wrong-answer">

                    <strong>

                    Your Answer:

                    </strong>

                    ${item.yourAnswer}

                </p>


                <!-- CORRECT ANSWER -->

                <p class="correct-answer">

                    <strong>

                    Correct Answer:

                    </strong>

                    ${item.correctAnswer}

                </p>


            </div>

            `;

        });

    }

}