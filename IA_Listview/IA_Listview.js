const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
var savedexam = urlSearchParams.get('savedexam')
var question;
var exam;
let data = [];

function connectedCallback() {
    if (savedexam == 'yes') {
        createToast('success', 'Exam has been saved');
        window.history.pushState({}, document.title, `/IA_Listview/IA_Listview.html?module=${module}`);
    }
    signincheck(() => {
        examData();
        fetchUserData();
    });

}
function setHref(event) {
    try {
        var dynamicUrl = '../IA_DataEntry/IA_DataEntry.html?module=' + module;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
    }

}

function openexam(event) {
    try {
        let questions = [];
        question.forEach(element => {
            if (element.exam_id == event.target.id) {
                questions.push(element);
            }
        });

        localStorage.setItem("question" + event.target.id, JSON.stringify(questions));

        var dynamicUrl = '../IA_DataEntry/IA_DataEntry.html?module=' + module + '&tdExam=' + event.target.id;
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        createToast('error', 'Error while fetching exam : ' + error.message);
    }
}

function examData() {
    try {
        const user_id = JSON.parse(localStorage.getItem('user_data')).user_id;
        fetch(`https://ieltsanalyzer.up.railway.app/api/examdata?user_id=${user_id}&module=${module}`)
            .then(response => response.json())
            .then(responseData => {
                question = responseData;
                if (question.length > 0) {
                    const Section1 = new Map();
                    const Section2 = new Map();
                    const Section3 = new Map();
                    const Section4 = new Map();
                    const Exammap = new Map();
                    let htmldata = "";

                    // Setting map for examid and date
                    responseData.forEach(element => {
                        Exammap.set(element.exam_id, {
                            'Name': element.exam_name,
                            'Date': element.date
                        });
                    });


                    // Calculating section wise marks for exach exam
                    question.forEach(element => {
                        if (element.section == 1) {
                            if (Section1.has(element.exam_id)) {
                                Section1.set(element.exam_id, Section1.get(element.exam_id) + element.correct);
                            } else {
                                Section1.set(element.exam_id, element.correct);
                            }
                        } else if (element.section == 2) {
                            if (Section2.has(element.exam_id)) {
                                Section2.set(element.exam_id, Section2.get(element.exam_id) + element.correct);
                            } else {
                                Section2.set(element.exam_id, element.correct);
                            }
                        } else if (element.section == 3) {
                            if (Section3.has(element.exam_id)) {
                                Section3.set(element.exam_id, Section3.get(element.exam_id) + element.correct);
                            } else {
                                Section3.set(element.exam_id, element.correct);
                            }
                        } else if (element.section == 4) {
                            if (Section4.has(element.exam_id)) {
                                Section4.set(element.exam_id, Section4.get(element.exam_id) + element.correct);
                            } else {
                                Section4.set(element.exam_id, element.correct);
                            }
                        }
                    });

                    // Arranging Data in Variable
                    for (const key of Exammap.keys()) {
                        data.push({
                            'exam_id': key,
                            'exam_name': Exammap.get(key).Name,
                            'date': new Date(Exammap.get(key).Date).toISOString().split('T')[0],
                            'Section 1': (Section1.get(key) == undefined ? 0 : Section1.get(key)),
                            'Section 2': (Section2.get(key) == undefined ? 0 : Section2.get(key)),
                            'Section 3': (Section3.get(key) == undefined ? 0 : Section3.get(key)),
                            'Section 4': (Section4.get(key) == undefined ? 0 : Section4.get(key)),
                            'total': (Section1.get(key) == undefined ? 0 : Section1.get(key)) +
                                (Section2.get(key) == undefined ? 0 : Section2.get(key)) +
                                (Section3.get(key) == undefined ? 0 : Section3.get(key)) +
                                (Section4.get(key) == undefined ? 0 : Section4.get(key)),
                        })
                    }

                    //Setting data to html
                    data.forEach((element, index) => {
                        htmldata +=
                            '<div class="data" id=' + element.exam_id + '>' +
                            '<div class="column index" onclick="openexam(event)" id=' + element.exam_id + '>' + (index + 1) + '</div>' +
                            '<div class="column examname" onclick="openexam(event)" id=' + element.exam_id + '>' + element.exam_name + '</div>' +
                            '<div class="column date" onclick="openexam(event)" id=' + element.exam_id + '>' + element.date + '</div>' +
                            '<div class="column total" onclick="openexam(event)" id=' + element.exam_id + '>' + element.total + '</div>' +
                            '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 1"] + '</div>' +
                            '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 2"] + '</div>' +
                            '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 3"] + '</div>' +
                            '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 4"] + '</div>' +
                            '<div class="column delete" onclick="deleteexam(event)" id=' + element.exam_id + `> <i class="fa fa-trash" id="${element.exam_id}" aria-hidden="true"></i>` +
                            '</div>' +
                            '</div>'
                    });

                    document.getElementById("table").innerHTML = htmldata;
                } else {
                    createToast('error', 'No Data Found');
                }
            })
            .catch(error => createToast('error', 'Error while fetching exams : ' + error.message));
    } catch (error) {
        createToast('error', 'Error while fetching exams : ' + error.message);
    }
}

function deleteexam(event) {
    try {
        let exam_id = event.target.id;

        fetch(`https://ieltsanalyzer.up.railway.app/api/deleteExam?exam_id=${exam_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(datas => {
                const divToRemove = document.getElementById(exam_id);
                divToRemove.remove();
                data.forEach((element, i) => {
                    if (element.exam_id == exam_id) {
                        data.splice(i, 1);
                    }
                });

                let htmldata = '';
                data.forEach((element, index) => {
                    htmldata +=
                        '<div class="data" id=' + element.exam_id + '>' +
                        '<div class="column index" onclick="openexam(event)" id=' + element.exam_id + '>' + (index + 1) + '</div>' +
                        '<div class="column examname" onclick="openexam(event)" id=' + element.exam_id + '>' + element.exam_name + '</div>' +
                        '<div class="column date" onclick="openexam(event)" id=' + element.exam_id + '>' + element.date + '</div>' +
                        '<div class="column total" onclick="openexam(event)" id=' + element.exam_id + '>' + element.total + '</div>' +
                        '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 1"] + '</div>' +
                        '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 2"] + '</div>' +
                        '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 3"] + '</div>' +
                        '<div class="column section" onclick="openexam(event)" id=' + element.exam_id + '>' + element["Section 4"] + '</div>' +
                        '<div class="column delete" onclick="deleteexam(event)" id=' + element.exam_id + `> <i class="fa fa-trash" id="${element.exam_id}" aria-hidden="true"></i>` +
                        '</div>' +
                        '</div>'
                });

                document.getElementById("table").innerHTML = htmldata;
            }).catch(error => {
                createToast('error', 'Error while deleting exam : ' + error.message);
            });

    } catch (error) {
        createToast('error', 'Error while deleting exam : ' + error.message);
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