const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
const teachermode = urlSearchParams.get('teacher');
let user_id;
if (teachermode == 'true') {
    user_id = JSON.parse(localStorage.getItem('student_id'));
} else {
    user_id = JSON.parse(localStorage.getItem('user_data')).user_id;
}

const exammap = new Map();
const sectionscorrect = new Map();
sectionscorrect.set('section1', 0);
sectionscorrect.set('section2', 0);
sectionscorrect.set('section3', 0);
sectionscorrect.set('section4', 0);

const sectionsincorrect = new Map();
sectionsincorrect.set('section1', 0);
sectionsincorrect.set('section2', 0);
sectionsincorrect.set('section3', 0);
sectionsincorrect.set('section4', 0);

const sectiontotal = new Map();
sectiontotal.set('section1', 0);
sectiontotal.set('section2', 0);
sectiontotal.set('section3', 0);
sectiontotal.set('section4', 0);

let question_correct = new Map();
let question_incorrect = new Map();
let question_total = new Map();
let responseData = [];
let bandtotal = new Map();
let setcolor = [];

async function connectedCallback() {
    try {

        signincheck(() => {
            fetchUserData();

            fetch(`https://ieltsanalyzer.up.railway.app/api/examdata?user_id=${user_id}&module=${module}`)
                .then(response => response.json())
                .then(responsedata => {

                    if (responsedata.length != 0) {
                        Array.from(document.getElementsByClassName('graph')).forEach(element => {
                            element.style.display = "block";
                        });
                        Array.from(document.getElementsByClassName('no_graph')).forEach(element => {
                            element.style.display = "none";
                        });
                    } else {
                        createToast('error', 'No data found');
                    }

                    responseData = responsedata;
                    responseData.forEach(element => {
                        // FOR CHART 2 and 5
                        if (exammap.has(element.exam_id)) {
                            exammap.set(element.exam_id, { 'exam_name': element.exam_name, 'date': element.date, 'score': exammap.get(element.exam_id).score + element.correct });
                        } else {
                            bandtotal.set(element.exam_id, element.band)
                            exammap.set(element.exam_id, { 'exam_name': element.exam_name, 'date': element.date, 'score': element.correct });
                        }

                        // FOR CHART 1 and 3
                        if (element.section == 1) {
                            sectionscorrect.set('section1', sectionscorrect.get('section1') + element.correct);
                            sectionsincorrect.set('section1', sectionsincorrect.get('section1') + element.incorrect);
                            sectiontotal.set('section1', sectiontotal.get('section1') + element.total);
                        } else if (element.section == 2) {
                            sectionscorrect.set('section2', sectionscorrect.get('section2') + element.correct);
                            sectionsincorrect.set('section2', sectionsincorrect.get('section2') + element.incorrect);
                            sectiontotal.set('section2', sectiontotal.get('section2') + element.total);
                        } else if (element.section == 3) {
                            sectionscorrect.set('section3', sectionscorrect.get('section3') + element.correct);
                            sectionsincorrect.set('section3', sectionsincorrect.get('section3') + element.incorrect);
                            sectiontotal.set('section3', sectiontotal.get('section3') + element.total);
                        } else if (element.section == 4) {
                            sectionscorrect.set('section4', sectionscorrect.get('section4') + element.correct);
                            sectionsincorrect.set('section4', sectionsincorrect.get('section4') + element.incorrect);
                            sectiontotal.set('section4', sectiontotal.get('section4') + element.total);
                        }

                        //  FOR CHART 4 || Question wise correct map
                        if (question_correct.has(element.question_type)) {
                            question_correct.set(element.question_type, question_correct.get(element.question_type) + element.correct)
                        } else {
                            question_correct.set(element.question_type, element.correct);
                        }

                        // FOR CHART 6 || Question wise incorrect map
                        if (question_incorrect.has(element.question_type)) {
                            question_incorrect.set(element.question_type, question_incorrect.get(element.question_type) + element.incorrect)
                        } else {
                            question_incorrect.set(element.question_type, element.incorrect);
                        }

                        // FOR TIP || Question wise total map
                        if (question_total.has(element.question_type)) {
                            question_total.set(element.question_type, question_total.get(element.question_type) + element.total)
                        } else {
                            question_total.set(element.question_type, element.total);
                        }
                    });

                    drawChart();
                }).catch(error => createToast('error', error));
        });

        function drawChart() {
            try {
                countbox();
                chart1();
                chart3();
                chart5();
                chart4();
                chart6();
                chart7();
                chart8();
                chart9();
            } catch (error) {
                createToast('error', 'Error while loading chart : ' + error.message)
            }
        }
    } catch (error) {
        createToast('error', 'Error while loading chart : ' + error.message)
    }
}

function chart1() {
    try {
        // 1st Chart ------------------------------------------------------

        let setlabel = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
        let setdata = [parseInt(sectionscorrect.get('section1')), parseInt(sectionscorrect.get('section2')), parseInt(sectionscorrect.get('section3')), parseInt(sectionscorrect.get('section4'))];

        const ctx = document.getElementById('chart1');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Count of correct/question type',
                    data: setdata,
                }]
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 1 : ' + error.message)
    }
}

function countbox() {
    try {
        let avg = 0;
        bandtotal.forEach(element => {
            avg += element;
        });
        avg = avg / bandtotal.size;
        document.getElementById('examcount').innerHTML = exammap.size
        document.getElementById('totalquestion').innerHTML = responseData.length
        document.getElementById('avg-band').innerHTML = avg
    } catch (error) {
        console.log(error);
    }
}

function chart3() {
    try {
        // 3rd Chart ------------------------------------------------------

        let setlabel = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
        let setdata = [parseInt(sectionsincorrect.get('section1')), parseInt(sectionsincorrect.get('section2')), parseInt(sectionsincorrect.get('section3')), parseInt(sectionsincorrect.get('section4'))];

        const ctx = document.getElementById('chart3');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Count of correct/question type',
                    data: setdata,
                }]
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 3 : ' + error.message)
    }
}

function chart4() {
    try {
        // 4th Chart ----------------------------------------------------

        let setdata = [];
        let setlabel = [];

        for (let key of question_correct.keys()) {
            setlabel.push(key);
            setdata.push(question_correct.get(key));
            setcolor.push(generateRandomHSLColor());
        }

        const ctx = document.getElementById('chart4');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Count of correct/question type',
                    data: setdata,
                    borderWidth: 1,
                    borderColor: 'white',
                    fill: 'black',
                    backgroundColor: setcolor,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        createToast('error', 'Error while loading chart 4 : ' + error.message)
    }
}

function chart5() {
    try {
        // 5th Chart ---------------------------------------------- 

        let setdata = [];
        let setlabel = [];

        for (const key of exammap.keys()) {
            setlabel.push(exammap.get(key).exam_name);
            setdata.push(exammap.get(key).score);
        }
        const ctx = document.getElementById('chart5');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'My First Dataset',
                    data: setdata,
                    fill: false,
                    borderColor: 'white',
                    tension: 0.1
                }]
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 5 : ' + error.message)
    }
}

function chart6() {
    try {

        // 6th Chart ---------------------------------------------

        let setdata = [];
        let setlabel = [];

        for (let key of question_incorrect.keys()) {
            setlabel.push(key);
            setdata.push(question_incorrect.get(key));
        }

        const ctx = document.getElementById('chart6');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: setlabel,
                datasets: [{
                    label: 'Count of incorrect/question type',
                    data: setdata,
                    borderWidth: 1,
                    backgroundColor: setcolor
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 6 : ' + error.message)
    }
}

function chart7() {
    // 7th chart -----------------------------------------------
    try {

        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let question_type = [];

        responseData.forEach(element => {
            if (!question_type.includes(element.question_type) && element.correct != '') {
                question_type.push(element.question_type);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.question_type)) {
                    quest_score1.set(element.question_type, quest_score1.get(element.question_type) + element.correct);
                } else {
                    quest_score1.set(element.question_type, element.correct);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.question_type)) {
                    quest_score2.set(element.question_type, quest_score2.get(element.question_type) + element.correct);
                } else {
                    quest_score2.set(element.question_type, element.correct);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.question_type)) {
                    quest_score3.set(element.question_type, quest_score3.get(element.question_type) + element.correct);
                } else {
                    quest_score3.set(element.question_type, element.correct);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.question_type)) {
                    quest_score4.set(element.question_type, quest_score4.get(element.question_type) + element.correct);
                } else {
                    quest_score4.set(element.question_type, element.correct);
                }
            }
        });

        let dataset = [];
        question_type.forEach(element => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)]
            })
        });
        const ctx = document.getElementById('chart7');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 7 : ' + error.message)
    }
}

function chart8() {
    try {
        // 8th Chart -----------------------------------------------
        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let question_type = [];

        responseData.forEach(element => {
            if (!question_type.includes(element.question_type) && element.incorrect != '') {
                question_type.push(element.question_type);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.question_type)) {
                    quest_score1.set(element.question_type, quest_score1.get(element.question_type) + element.incorrect);
                } else {
                    quest_score1.set(element.question_type, element.incorrect);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.question_type)) {
                    quest_score2.set(element.question_type, quest_score2.get(element.question_type) + element.incorrect);
                } else {
                    quest_score2.set(element.question_type, element.incorrect);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.question_type)) {
                    quest_score3.set(element.question_type, quest_score3.get(element.question_type) + element.incorrect);
                } else {
                    quest_score3.set(element.question_type, element.incorrect);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.question_type)) {
                    quest_score4.set(element.question_type, quest_score4.get(element.question_type) + element.incorrect);
                } else {
                    quest_score4.set(element.question_type, element.incorrect);
                }
            }
        });

        let dataset = [];
        question_type.forEach(element => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)]
            })
        });
        const ctx = document.getElementById('chart8');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 8 : ' + error.message)
    }
}

function chart9() {
    try {
        // 9th Chart --------------------------------------------
        let quest_score1 = new Map();
        let quest_score2 = new Map();
        let quest_score3 = new Map();
        let quest_score4 = new Map();
        let question_type = [];

        responseData.forEach(element => {
            if (!question_type.includes(element.question_type) && element.miss != '') {
                question_type.push(element.question_type);
            }
            if (element.section == 1) {
                if (quest_score1.has(element.question_type)) {
                    quest_score1.set(element.question_type, quest_score1.get(element.question_type) + element.miss);
                } else {
                    quest_score1.set(element.question_type, element.miss);
                }
            } else if (element.section == 2) {
                if (quest_score2.has(element.question_type)) {
                    quest_score2.set(element.question_type, quest_score2.get(element.question_type) + element.miss);
                } else {
                    quest_score2.set(element.question_type, element.miss);
                }
            } else if (element.section == 3) {
                if (quest_score3.has(element.question_type)) {
                    quest_score3.set(element.question_type, quest_score3.get(element.question_type) + element.miss);
                } else {
                    quest_score3.set(element.question_type, element.miss);
                }
            } else if (element.section == 4) {
                if (quest_score4.has(element.question_type)) {
                    quest_score4.set(element.question_type, quest_score4.get(element.question_type) + element.miss);
                } else {
                    quest_score4.set(element.question_type, element.miss);
                }
            }
        });

        let dataset = [];
        question_type.forEach(element => {
            dataset.push({
                'label': element,
                'data': [quest_score1.get(element) == undefined ? 0 : quest_score1.get(element),
                quest_score2.get(element) == undefined ? 0 : quest_score2.get(element),
                quest_score3.get(element) == undefined ? 0 : quest_score3.get(element),
                quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)]
            })
        });
        const ctx = document.getElementById('chart9');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });

    } catch (error) {
        createToast('error', 'Error while loading chart 9 : ' + error.message)
    }
}

function tipopen(event) {
    try {

        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "none";
        });

        // This portion is used to check question wise details
        var correctquest = 0;
        let excellentlist = [];
        let goodlist = [];
        let avglist = [];
        let poorlist = [];
        for (let key of question_total.keys()) {
            correctquest = question_correct.get(key) * 100 / question_total.get(key);

            if (correctquest >= 80) {
                excellentlist.push(key);
            } else if (correctquest < 80 && correctquest >= 70) {
                goodlist.push(key);
            } else if (correctquest < 70 && correctquest >= 60) {
                avglist.push(key);
            } else {
                poorlist.push(key);
            }
        }
        // ----------------------------------------------------------------------------------

        // This portion is used to check section wise details
        correctquest = 0;
        let goodlistsect = [];
        let poorlistsect = [];
        for (let key of sectiontotal.keys()) {
            correctquest = sectionscorrect.get(key) * 100 / sectiontotal.get(key);

            if (correctquest >= 75) {
                goodlistsect.push(key.charAt(0).toUpperCase() + key.slice(1));
            } else if (correctquest < 75) {
                poorlistsect.push(key.charAt(0).toUpperCase() + key.slice(1));
            }
        }
        // ----------------------------------------------------------------------------------


        // This portion is used to set Tip popup
        var tip_popup = document.getElementById('tip-popup');
        tip_popup.style.display = "flex"

        // Excellent question type
        if (excellentlist.length > 0) {
            document.getElementById('excellent').innerHTML = ` You have performed exceptionally 
            well in<span class="list"> ${excellentlist}</span>. Keep up the great work!`;
        } else {
            document.getElementById('excellent').innerHTML = ' - ';
        }

        // Good question type
        if (goodlist.length > 0) {
            document.getElementById('good').innerHTML = ` You are doing well in<span class="list">
             ${goodlist}</span>. With a little more practice, you can excel further.`;
        } else {
            document.getElementById('good').innerHTML = ' - ';
        }

        // Average question type
        if (avglist.length > 0) {
            document.getElementById('average').innerHTML = ` Your performance in<span class="list"> 
            ${avglist}</span> is moderate.Focus on improving this area to achieve better results.`;
        } else {
            document.getElementById('average').innerHTML = ' - ';
        }

        // Poor question type
        if (poorlist.length > 0) {
            document.getElementById('poor').innerHTML = ` There is room for growth in<span class="list"> 
            ${poorlist}</span>. Consider dedicating more time and effort to enhance your skills here.`;
        } else {
            document.getElementById('poor').innerHTML = ' - ';
        }

        let sectiontext = '';

        // Mixture of performance in all section
        if (goodlistsect.length > 0 && poorlistsect.length > 0) {
            sectiontext += `It is evident that your performance in <span class="list"> ${goodlistsect}</span> is excellent, while there is significant room for improvement in<span class="list"> ${poorlistsect}</span>.`
        }
        // Bad perfomance in all section
        if (poorlistsect.length > 0 && goodlistsect.length == 0) {
            sectiontext += `It is evident that your performance in <span class="list"> ${poorlistsect}</span> is very poor, with no strong performance in any section.`
        }
        // Good performance in all section
        if (goodlistsect.length > 0 && poorlistsect.length == 0) {
            sectiontext = 'It is evident that your performance is outstanding across all sections, with no weak areas to note.'
        }

        // Set Section wise tip
        document.getElementById('section-summary').innerHTML = sectiontext

        // Setting href for Trick anchor tag
        let href = "../IA_Trick/IA_Trick.html?module=";
        if (module == 'Listening') {
            href += 'Listening';
        } else {
            href += 'Reading';
        }
        document.getElementById('trick').href = href

    } catch (error) {
        createToast('error', 'Failed to open Tip. Try refreshing page.');
    }
}

function tipclose(event) {
    try {
        Array.from(document.getElementsByClassName('glass')).forEach(element => {
            element.style.backdropFilter = "blur(7.4px)";
        });
        var tip_popup = document.getElementById('tip-popup');
        tip_popup.style.display = "none"
    } catch (error) {
        console.error(error);
    }
}

window.addEventListener("beforeunload", function (event) {
    document.getElementById("spinner").style.display = 'flex';
    document.getElementById("main").style.display = 'none';
});

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
        document.getElementById("spinner").style.display = 'none';
        document.getElementById("main").style.display = 'block';
    }
});

let hues = [];
function generateRandomHSLColor() {
    try {
        const hue = huemethod();
        const hslColor = `hsl(${hue}, 83%,54%)`;

        if (!setcolor.includes(hslColor)) {
            return hslColor;
        } else {
            generateRandomHSLColor();
        }
    } catch (error) {
        createToast('error', 'Number problem');
    }
}

function huemethod() {
    try {
        let number = Math.random() * 360;
        var check = false;

        for (let index = number - 20; index < number + 20; index++) {
            if (hues.includes(index)) {
                check = true;
                break;
            } else {

                check = false;
            }
        }
        if (!check) {
            hues.push(number);
            return Math.random() * 360;
        } else {
            huemethod()
        }
    } catch (error) {
        createToast('error', 'Number problem');
    }
}