const urlSearchParams = new URLSearchParams(window.location.search);
const module = urlSearchParams.get('module');
const user_id = JSON.parse(localStorage.getItem('user_data')).user_id;
let screenwidth = screen.width;
let width = 0;
let height = 0;

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

async function connectedCallback() {
    try {
        // createToast('warning', 'Page is currently underdevelop');

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

                    google.charts.load('current', { 'packages': ['corechart'] });
                    google.charts.load('current', { packages: ['gauge'] });
                    google.charts.setOnLoadCallback(drawChart);
                }).catch(error => createToast('error 1', error));
        });

        function drawChart() {
            try {

                if (screenwidth >= 768) {
                    height = 500;
                    width = 500;
                } else if (screenwidth <= 640) {
                    height = 300;
                    width = 300;
                }
                chart1();
                chart2();
                chart3();
                chart4();
                chart5();
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
        var data = google.visualization.arrayToDataTable([
            ['Section', 'Correct'],
            ['SECTION 1', parseInt(sectionscorrect.get('section1'))],
            ['SECTION 2', parseInt(sectionscorrect.get('section2'))],
            ['SECTION 3', parseInt(sectionscorrect.get('section3'))],
            ['SECTION 4', parseInt(sectionscorrect.get('section4'))],
        ]);

        var options = {
            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'black',
            },
            slices: {
                0: { color: 'lightblue' },
                1: { color: 'blue' }
            },
            legend: { position: 'bottom' },
            backgroundColor: 'transparent',
            height: height,
            width: width,
            title: 'Section wise correct'

        };
        var chart = new google.visualization.PieChart(document.getElementById('chart1'));
        chart.draw(data, options);

    } catch (error) {
        createToast('error', 'Error while loading chart 1 : ' + error.message)
    }
}

function chart2() {
    try {
        // 2nd Chart ------------------------------------------------------

        var data2 = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Total Exam', exammap.size]
        ]);

        var options2 = {
            redFrom: 0, redTo: 5,
            yellowFrom: 6, yellowTo: 14,
            greenFrom: 15, greenTo: 20,
            height: height,
            width: width
        };

        var chart2 = new google.visualization.Gauge(document.getElementById('chart2'));
    } catch (error) {
        createToast('error', 'Error while loading chart 2 : ' + error.message)
    }

    chart2.draw(data2, options2);
}

function chart3() {
    try {
        // 3rd Chart ------------------------------------------------------
        var data = google.visualization.arrayToDataTable([
            ['Section', 'Incorrect'],
            ['SECTION 1', parseInt(sectionsincorrect.get('section1'))],
            ['SECTION 2', parseInt(sectionsincorrect.get('section2'))],
            ['SECTION 3', parseInt(sectionsincorrect.get('section3'))],
            ['SECTION 4', parseInt(sectionsincorrect.get('section4'))],
        ]);

        var options = {
            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'black',
            },
            slices: {
                0: { color: 'lightblue' },
                1: { color: 'blue' }
            },
            legend: { position: 'bottom' },
            backgroundColor: 'transparent',
            height: height,
            width: width,
            title: 'Section wise incorrect'
        };
        var chart = new google.visualization.PieChart(document.getElementById('chart3'));
        chart.draw(data, options);

    } catch (error) {
        createToast('error', 'Error while loading chart 3 : ' + error.message)
    }


}

function chart4() {
    try {
        // 4th Chart ----------------------------------------------------

        let setdata = [];
        setdata.push(["Question Type", "Incorrect", { role: "style" }]);

        for (let key of question_correct.keys()) {
            setdata.push([key, question_correct.get(key), "black"])
        }

        var data = google.visualization.arrayToDataTable(setdata);

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Total Correct / Question Type",
            bar: { groupWidth: "75%" },
            legend: { position: "none" },
            backgroundColor: 'transparent',
            height: height,
            width: width,
            bars: 'vertical'
        };
        var chart = new google.visualization.BarChart(document.getElementById("chart4"));
        chart.draw(view, options);

    } catch (error) {
        createToast('error', 'Error while loading chart 4 : ' + error.message)
    }
}

function chart5() {
    try {
        // 5th Chart ---------------------------------------------- 

        let setdata = [];
        setdata.push(['Exam', 'Score']);

        for (const key of exammap.keys()) {
            setdata.push([exammap.get(key).exam_name, exammap.get(key).score])
        }

        var data = google.visualization.arrayToDataTable(setdata);
        var options = {
            title: 'Exam Performance',
            legend: { position: 'bottom' },
            height: height,
            width: width,
            backgroundColor: 'transparent'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart5'));

        chart.draw(data, options);

    } catch (error) {
        createToast('error', 'Error while loading chart 5 : ' + error.message)
    }
}

function chart6() {
    try {
        // 6th Chart ---------------------------------------------

        let setdata = [];
        setdata.push(["Question Type", "Incorrect", { role: "style" }]);

        for (let key of question_incorrect.keys()) {
            setdata.push([key, question_incorrect.get(key), "black"])
        }

        var data = google.visualization.arrayToDataTable(setdata);
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Total Incorrect / Question Type",
            bar: { groupWidth: "75%" },
            legend: { position: "none" },
            bars: 'vertical',
            height: height,
            width: width,
            backgroundColor: 'transparent'
        };
        var chart = new google.visualization.BarChart(document.getElementById("chart6"));
        chart.draw(view, options);
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
        let sec1 = [];
        let sec2 = [];
        let sec3 = [];
        let sec4 = [];


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


        question_type.forEach(element => {
            sec1.push((quest_score1.get(element) == undefined ? 0 : quest_score1.get(element)))
            sec2.push((quest_score2.get(element) == undefined ? 0 : quest_score2.get(element)))
            sec3.push((quest_score3.get(element) == undefined ? 0 : quest_score3.get(element)))
            sec4.push((quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)))
        });

        question_type = ['Section', ...question_type, { role: 'annotation' }];
        sec1 = ['Section 1', ...sec1, ''];
        sec2 = ['Section 2', ...sec2, ''];
        sec3 = ['Section 3', ...sec3, ''];
        sec4 = ['Section 4', ...sec4, ''];

        var data = google.visualization.arrayToDataTable([
            question_type,
            sec1,
            sec2,
            sec3,
            sec4
        ]);

        var options = {
            legend: { position: 'bottom', maxLines: 10 },
            bar: { groupWidth: '75%' },
            isStacked: true,
            height: height,
            width: width,
            backgroundColor: 'transparent',
            title: 'Correct Question / Section'

        };

        var chart = new google.visualization.BarChart(document.getElementById("chart7"));
        chart.draw(data, options);

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
        let sec1 = [];
        let sec2 = [];
        let sec3 = [];
        let sec4 = [];

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


        question_type.forEach(element => {
            sec1.push((quest_score1.get(element) == undefined ? 0 : quest_score1.get(element)))
            sec2.push((quest_score2.get(element) == undefined ? 0 : quest_score2.get(element)))
            sec3.push((quest_score3.get(element) == undefined ? 0 : quest_score3.get(element)))
            sec4.push((quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)))
        });

        question_type = ['Section', ...question_type, { role: 'annotation' }];
        sec1 = ['Section 1', ...sec1, ''];
        sec2 = ['Section 2', ...sec2, ''];
        sec3 = ['Section 3', ...sec3, ''];
        sec4 = ['Section 4', ...sec4, ''];

        var data = google.visualization.arrayToDataTable([
            question_type,
            sec1,
            sec2,
            sec3,
            sec4
        ]);

        var options = {
            legend: { position: 'bottom', maxLines: 10 },
            bar: { groupWidth: '75%' },
            isStacked: true,
            height: height,
            width: width,
            backgroundColor: 'transparent',
            title: 'Incorrect Question / Section'

        };

        var chart = new google.visualization.BarChart(document.getElementById("chart8"));
        chart.draw(data, options);


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
        let sec1 = [];
        let sec2 = [];
        let sec3 = [];
        let sec4 = [];

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

        question_type.forEach(element => {
            sec1.push((quest_score1.get(element) == undefined ? 0 : quest_score1.get(element)))
            sec2.push((quest_score2.get(element) == undefined ? 0 : quest_score2.get(element)))
            sec3.push((quest_score3.get(element) == undefined ? 0 : quest_score3.get(element)))
            sec4.push((quest_score4.get(element) == undefined ? 0 : quest_score4.get(element)))
        });

        question_type = ['Section', ...question_type, { role: 'annotation' }];
        sec1 = ['Section 1', ...sec1, ''];
        sec2 = ['Section 2', ...sec2, ''];
        sec3 = ['Section 3', ...sec3, ''];
        sec4 = ['Section 4', ...sec4, ''];

        var data = google.visualization.arrayToDataTable([
            question_type,
            sec1,
            sec2,
            sec3,
            sec4
        ]);

        var options = {
            legend: { position: 'bottom', maxLines: 10 },
            bar: { groupWidth: '75%' },
            isStacked: true,
            height: height,
            width: width,
            backgroundColor: 'transparent',
            bars: 'vertical',
            title: 'Miss Question / Section'
        };

        var chart = new google.visualization.BarChart(document.getElementById("chart9"));
        chart.draw(data, options);


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




        
        // // This portion is used to identify maximum miss and wrong question
        // let incorrectquestionlist = [];
        // let incorrectquestionmarkslist = [];
        // let missquestionlist = [];
        // let missquestionmarkslist = [];
        // let index0;
        // let index1;

        // for (let key of question_total.keys()) {
        //     incorrectquest = question_incorrect.get(key) * 100 / question_total.get(key);
        //     missquest = question_missed.get(key) * 100 / question_total.get(key);

        //     if (incorrectquestionlist.length < 2) {
        //         if (incorrectquest != 0) {
        //             incorrectquestionlist.push(key)
        //             incorrectquestionmarkslist.push(incorrectquest);
        //         }
        //     } else {
        //         index0 = incorrectquestionmarkslist.at(0);
        //         index1 = incorrectquestionmarkslist.at(1);
        //         if (index0 < incorrectquest && index0 <= index1) {
        //             incorrectquestionmarkslist.splice(0, 1);
        //             incorrectquestionlist.splice(0, 1);
        //             incorrectquestionlist.push(key);
        //             incorrectquestionmarkslist.push(incorrectquest);
        //         } else if (index1 < incorrectquest && index1 <= index0) {
        //             incorrectquestionmarkslist.splice(1, 1);
        //             incorrectquestionlist.splice(1, 1);
        //             incorrectquestionlist.push(key);
        //             incorrectquestionmarkslist.push(incorrectquest);
        //         }
        //     }

        //     if (missquestionlist.length < 2) {
        //         if (missquest != 0) {
        //             missquestionlist.push(key)
        //             missquestionmarkslist.push(missquest);
        //         }
        //     } else {
        //         index0 = missquestionmarkslist.at(0);
        //         index1 = missquestionmarkslist.at(1);
        //         if (index0 < missquest && index0 <= index1) {
        //             missquestionmarkslist.splice(0, 1);
        //             missquestionlist.splice(0, 1);
        //             missquestionlist.push(key);
        //             missquestionmarkslist.push(missquest);
        //         } else if (index1 < missquest && index1 <= index0) {
        //             missquestionmarkslist.splice(1, 1);
        //             missquestionlist.splice(1, 1);
        //             missquestionlist.push(key);
        //             missquestionmarkslist.push(missquest);
        //         }
        //     }
        // }
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