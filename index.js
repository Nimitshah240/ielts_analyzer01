document.addEventListener("DOMContentLoaded", () => {
    const slideInDiv = document.querySelector(".second-box");

    const observerOptions = {
        threshold: 0.1 // Trigger when 50% of the div is visible
    };
    const observerCallback = (entries, observer) => {
        console.log(entries);
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // console.log('is');
                slideInDiv.classList.add("active");
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(slideInDiv);
});

document.addEventListener("DOMContentLoaded", () => {
    const slideInDiv1 = document.querySelector(".third-box");

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
});

async function connectedCallback(event) {
    try {
        signincheck(() => {
            fetchUserData();
        });
    } catch (error) {
        console.error('e', error);
    }
}

async function fetchUserData() {
    try {
        let today = new Date();
        let year = today.getFullYear();
        let month = ('0' + (today.getMonth() + 1)).slice(-2);
        let day = ('0' + today.getDate()).slice(-2);
        today = `${year}-${month}-${day}`;

        const data = JSON.parse(localStorage.getItem('user_data'));
        if (data) {
            data.fl_date = today;
            data.ll_date = today;
            data.email = undefined;    // remove if you get email from the first google login 
            data.location = undefined; // remove if you get location from the first google login

            delete data.family_name;
            delete data.given_name;

            fetch('http://localhost:3000/logindata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(responseData => {
                    document.getElementById('not-log').style.display = 'none';
                    document.getElementById('login-img').style.display = 'block';
                    document.getElementById('login-img').setAttribute('src', responseData.picture);
                    if (document.getElementById("listening-band")) {
                        console.log('fetch');
                        fetchExamData();
                    }
                })
                .catch(error => console.error('Error:', error.message));
        }

    } catch (error) {
        console.error(error);
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

        fetch(`http://localhost:3000/api/examdata?user_id=${user_id}&module=${module}`)
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
            .catch(error => console.error('Error:', error));

    } catch (error) {
        console.error(error);
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
        }

        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.error(error);
    }
}

function sendemail(params) {
    try {
        Email.send({
            SecureToken : "6ea86d2a-ad55-4617-9e3d-67b7521e104b",
            To : 'nimitshah240@gmail.com',
            From : "nimitshah240@gmail.com",
            Subject : "This is the subject",
            Body : "And this is the body"
        }).then(
          message => alert(message)
        );
        
        
    } catch (error) {
        console.error(error);
    }

}