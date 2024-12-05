function connectedCallback() {
    try {
        if (sessionStorage.getItem('Check')) {
            document.getElementById('validation-box').style.display = 'none';
            document.getElementById('body-section').style.display = 'block';
            document.getElementById('dataheader').style.display = 'block';
            setdata(JSON.parse(sessionStorage.getItem('Data')));
        }
    } catch (error) {
        createToast('error', error)
    }

}

function checkuser() {
    try {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        fetch(`http://localhost:3000/api/studentdata?username=${username}&password=${password}`)
            .then(response => response.json())
            .then(responsedata => {

                if (responsedata == 'Invalid User') {
                    createToast('error', 'Invalid User');
                } else {
                    sessionStorage.setItem('Check', true)
                    createToast('success', 'Valid User');
                    document.getElementById('validation-box').style.display = 'none';
                    document.getElementById('body-section').style.display = 'block';
                    document.getElementById('dataheader').style.display = 'block';
                }
                if (responsedata.length != 0 && responsedata != 'Invalid User') {
                    sessionStorage.setItem('Data', JSON.stringify(responsedata))
                    setdata(responsedata);
                }

                if (responsedata.length == 0) {
                    document.getElementById('no_data').style.display = 'flex';
                    createToast('error', 'No data found');
                }

            }).catch(error => createToast('error', error));
    } catch (error) {
        console.error(error);
    }
}

function setdata(responsedata) {
    try {
        let htmldata = ''
        responsedata.forEach((element, index) => {
            let date = new Date(element.fl_date);
            let year = date.getFullYear();
            let month = ('0' + (date.getMonth() + 1)).slice(-2);
            let day = ('0' + date.getDate()).slice(-2);
            date = `${year}-${month}-${day}`;
            htmldata +=
                '<div class="data" id=' + element.id + '>' +
                '<div class="column index"  id=' + element.id + '>' + (index + 1) + '</div>' +
                '<div class="column studentname"  id=' + element.id + '>' + element.name + '</div>' +
                '<div class="column date"  id=' + element.id + '>' + date + '</div>' +
                '<div class="column total"  id=' + element.id + '>' + element.reading_count + '</div>' +
                '<div class="column dashboard dash" onclick="opendashboard(event)" id=' + element.id + '> <button class="button-63 dashboard-button" name="Reading" id=' + element.id + '>Dashboard</button>' + '</div>' +
                '<div class="column total"  id=' + element.id + '>' + element.listening_count + '</div>' +
                '<div class="column dashboard dash" onclick="opendashboard(event)" id=' + element.id + '>' + '<button class="button-63 dashboard-button" name="Listening" id=' + element.id + '>Dashboard</button>' + '</div>' +
                '</div>'
        });

        document.getElementById("table").innerHTML = htmldata;
    } catch (error) {
        createToast('error', error)
    }
}

function opendashboard(event) {
    try {
        let module = event.target.name;
        let user_id = event.target.id;
        localStorage.setItem('student_id', user_id);
        let dynamicUrl = '../IA_Dashboard/IA_Dashboard.html';
        if (module == 'Reading') {
            dynamicUrl += '?module=Reading&teacher=true';
        } else {
            dynamicUrl += '?module=Listening&teacher=true';
        }
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;
    } catch (error) {
        console.log(error);
    }
}