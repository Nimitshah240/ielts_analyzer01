const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
var question_type;
var at_question = 0;

async function connectedCallbackTrick(event) {
    try {
        let button = document.getElementById("left");
        button.style.background = "Grey";
        button.style.pointerEvents = "none";
        question_type = question(module);
        question_change();
        
        signincheck(() => {
            fetchUserData();
        });

    } catch (error) {
        console.error(error);
    }
}

function arrow(event) {
    try {
        console.log(event.target.id);

        let button

        // TO CHANGE COLOR OF BUTTONS FROM GREY TO ORIGINAL
        if (at_question == 0 && (event.target.id == 'right-button' || event.target.id == 'right')) {
            button = document.getElementById("left");
            button.style.background = "linear-gradient(144deg, #AF40FF, #42a5f3 50%, #00DDEB)";
            button.style.pointerEvents = "all";
        } else if (at_question + 1 == question_type.length && (event.target.id == 'left-button' || event.target.id == "left")) {
            button = document.getElementById("right");
            button.style.background = "linear-gradient(144deg, #AF40FF, #42a5f3 50%, #00DDEB)";
            button.style.pointerEvents = "all";
        }

        // TO CHANGE POSITION OF POINTER IN QUESTION TYPE
        if ((event.target.id == 'left-button' || event.target.id == "left") && at_question > 0) {
            at_question--;
            question_change();
        } else if ((event.target.id == 'right-button' || event.target.id == "right") && at_question + 1 < question_type.length) {
            at_question++;
            question_change();
        }

        // TO CHANGE COLOR OF BUTTONS TO GREY
        if (at_question + 1 == question_type.length) {
            button = document.getElementById("right");
            button.style.background = "Grey";
            button.style.pointerEvents = "none";

        } else if (at_question == 0) {
            button = document.getElementById("left");
            button.style.background = "Grey";
            button.style.pointerEvents = "none";

        }
    } catch (error) {
        console.error(error);
    }
}

function question_change() {
    try {
        let fact_html = "";
        let approach_html = "";

        question_type[at_question].Fact.forEach(element => {
            fact_html += '<li>' +
                element +
                '</li>';
        });

        question_type[at_question].Approach.forEach(element => {
            approach_html += '<li>' +
                element +
                '</li>';
        });

        let q = document.getElementById("question-type");
        html =
            `<div class="question-type">${question_type[at_question].Title}</div>` +
            '<div class="trick">' +
            '<div class="fact">' +
            '<h4>FACTS</h4>' +
            '<ul class="ul-class">' +
            fact_html +
            '</ul>' +
            '</div>' +
            '<div class="approach">' +
            '<h4>APPROACH</h4>' +
            '<ul class="ul-class">' +
            approach_html +
            '</ul>' +
            '</div>' +
            '</div>';

        q.innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}