document.addEventListener("DOMContentLoaded", () => {
    const slideInDiv = document.querySelector(".second-box");
    if (slideInDiv != null) {
        const observerOptions = {
            threshold: 0.1 // Trigger when 50% of the div is visible
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    slideInDiv.classList.add("active");
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(slideInDiv);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const slideInDiv1 = document.querySelector(".third-box");
    if (slideInDiv1 != null) {
        const observerOptions = {
            threshold: 0.27 // Trigger when 50% of the div is visible
        };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    slideInDiv1.classList.add("active");
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(slideInDiv1);
    }
});

var examdata;

function indexconnectedCallback(event) {
    try {
        Userlogo();
        if (JSON.parse(localStorage.getItem('user_data')) != null ) {
            fetchExamData();// Control api callout
        }
        
    } catch (error) {
        createToast('error', 'Error while loading : ' + error.message);
    }
}


async function fetchExamData() {
    try {
        const user_data = JSON.parse(localStorage.getItem('user_data'));
        const user_id = user_data.user_id;
        const module = undefined;
        let listening_exam_count = 0;
        let reading_exam_count = 0;
        let reading_question_count = 0;
        let listening_question_count = 0;
        let readingband = [];
        let listeningband = [];
        let exammap = new Map();

        fetch(`https://ieltsanalyzer.up.railway.app/api/examdata?user_id=${user_id}&module=${module}`)
            .then(response => response.json())
            .then(responseData => {
                responseData.forEach(element => {
                    exammap.set(element.exam_id, { 'band': element.band, 'module': element.module });
                    if (element.module == 'Reading' && element.id != null) {
                        reading_question_count++;
                    } else if (element.module == 'Listening' && element.id != null) {
                        listening_question_count++;
                    }
                });

                exammap.forEach(element => {
                    if (element.module == 'Reading') {
                        reading_exam_count++;
                        readingband.push(element.band);
                    } else {
                        listening_exam_count++;
                        listeningband.push(element.band);
                    }
                });

                document.getElementById("listening-band").innerHTML = calculateAverage(listeningband) + ' Band';
                document.getElementById("reading-band").innerHTML = calculateAverage(readingband) + ' Band';
                document.getElementById("question-count-listening").innerHTML = listening_question_count + ' Question';
                document.getElementById("question-count-reading").innerHTML = reading_question_count + ' Question';
                document.getElementById("count-listening").innerHTML = listening_exam_count + ' Exam';
                document.getElementById("count-reading").innerHTML = reading_exam_count + ' Exam';
            })
            .catch(error => createToast('error', 'Error while fetching exam data : ' + error));

    } catch (error) {
        createToast('error', 'Error while fetching exam data : ' + error);
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / numbers.length;
    const roundToNearestHalf = (num) => Math.round(num * 2) / 2;
    return roundToNearestHalf(average);
}

function setHref(event) {
    try {

        var dynamicUrl;
        let buttonId = event.target.id;

        if (buttonId == 'data') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=data';
        } else if (buttonId == 'dashboard') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=dashboard';
        } else if (buttonId == 'tips') {
            dynamicUrl = '../IA_Selection/IA_Selection.html?type=trick';
        }

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;

    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
    }
}

function sendemail() {
    try {
        let user_id = ((localStorage.getItem('user_data'))) == null ? "" : JSON.parse(localStorage.getItem('user_data')).user_id;
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;
        let data = { 'user_id': user_id, 'name': name, 'email': email, 'message': message };
        var re = /\S+@\S+\.\S+/;

        if (data.name != '' && data.email != '' && re.test(email)) {
            fetch('https://ieltsanalyzer.up.railway.app/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(() => {
                    name = document.getElementById('name').value = '';
                    email = document.getElementById('email').value = '';
                    message = document.getElementById('message').value = '';
                    createToast('success', 'Thank you for your feedback');
                })
                .catch(error => createToast('error', 'Error while sending email : ' + error.message));

        } else {
            createToast('error', 'Please fill required data');
        }

    } catch (error) {
        createToast('error', 'Error while sending email : ' + error.message);
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