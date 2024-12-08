var firstname = '';
var lastname = '';
var email = '';
var number = '';
var type = '';
var privacy = false;
var picture;
var fl_date;
var user_location;
var user_id;
var data = [];
var maindata;

function authentication(event) {
    let domain = new URL(window.location.href).origin;
    domain += '/IA_Code/IA_Authentication/IA_Authentication.html';
    event.target.href = domain;
    window.location.href = domain;
}

function connectedCallback() {

    if (localStorage.getItem('user_data') == 'undefined' || localStorage.getItem('user_data') == null) {
        if (document.getElementById('firstname')) {
            document.getElementById('google-button').style.display = 'block';
            document.getElementById("firstname").disabled = true;
            document.getElementById("lastname").disabled = true;
            document.getElementById("email").disabled = true;
            document.getElementById("number").disabled = true;
        }
    } else {
        data = JSON.parse(localStorage.getItem('user_data'));
        firstname = data.firstname;
        lastname = data.lastname;
        email = data.email;
        number = data.number;
        privacy = data.privacy;
        type = data.type;
        if (document.getElementById("firstname")) {
            document.getElementById('continue').style.display = 'block';
            document.getElementById('signout').style.display = 'block';
            document.getElementById("firstname").disabled = false;
            document.getElementById("lastname").disabled = false;
            document.getElementById("email").disabled = true;
            document.getElementById("number").disabled = false;
            firstname = document.getElementById("firstname").value = data.firstname;
            lastname = document.getElementById("lastname").value = data.lastname;
            email = document.getElementById("email").value = data.email;
            number = document.getElementById("number").value = data.number;
            if (type == 'academic') {
                document.getElementById("Academic").checked = true;
            } else if (type == 'general') {
                document.getElementById("General").checked = true;
            }
            privacy = document.getElementById("privacy").checked = privacy;
        }
    }

    if (window.location.href.includes('#')) {
        SignedIn();
    }
}

function googleSignin(params) {
    try {
        let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
            "redirect_uri": "http://localhost/IA_Code/IA_Authentication/IA_Authentication.html",
            "response_type": "token",
            "scope": "https://www.googleapis.com/auth/userinfo.profile",
            "include_granted_scope": 'true',
            'state': 'pass-through-value'
        }

        for (var p in params) {
            let input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    } catch (error) {
        createToast('error', 'Error while signin : ' + error.message);
    }
}

function SignedIn() {
    try {
        let access_token = '';
        let params = {}
        let regex = /([^&=]+)=([^&]*)/g, m

        while (m = regex.exec(location.href)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        let info = JSON.parse(JSON.stringify(params));
        access_token = info['access_token'];
        localStorage.setItem("authInfo", info['access_token']);
        window.history.pushState({}, document.title, "/IA_Code/IA_Authentication/IA_Authentication.html");

        if (access_token != '') {
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
                .then((data) => {
                    if (!data.ok) {
                        localStorage.removeItem('authInfo');
                        localStorage.removeItem('user_data');
                        throw new Error(data.status + ' ' + data.statusText);
                    }
                    return data.json();
                })
                .then((info) => {
                    info.user_id = info.sub;
                    delete info.sub;
                    maindata = info;
                    picture = info.picture;
                    if (info) {
                        let today = new Date();
                        let year = today.getFullYear();
                        let month = ('0' + (today.getMonth() + 1)).slice(-2);
                        let day = ('0' + today.getDate()).slice(-2);
                        today = `${year}-${month}-${day}`;
                        fl_date = today;
                        fetchUser(info.user_id);
                    }
                });
        }
    } catch (error) {
        console.error(error);

    }
}

function Signout(event) {
    try {
        var dynamicUrl;
        if (event.target.id == 'yes') {
            let access_token = localStorage.getItem('authInfo');
            fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }).then(() => {
                localStorage.removeItem('authInfo');
                localStorage.removeItem('user_data');
                dynamicUrl = '../index.html';
                window.location.href = dynamicUrl;
            })
        } else {
            dynamicUrl = './IA_Authentication.html';
            window.location.href = dynamicUrl;
        }
    } catch (error) {
        console.error(error);
    }
}

function showSignout() {
    try {
        document.getElementById('validation-box-signin').style.display = 'none';
        document.getElementById('validation-box-signout').style.display = 'block';
        Array.from(document.getElementsByClassName('button')).forEach(element => {
            element.style.display = "block";
        });
    } catch (error) {
        console.error(error);
    }
}
function fetchUser(user_id) {
    try {

        fetch(`http://localhost:3000/api/checkUser?user_id=${user_id}`)
            .then(response => response.json())
            .then(responsedata => {
                document.getElementById('continue').style.display = 'block';
                document.getElementById('google-button').style.display = 'none';
                document.getElementById("firstname").disabled = false;
                document.getElementById("lastname").disabled = false;
                document.getElementById("number").disabled = false;
                if (responsedata.length > 0) {
                    // User is already availabe in DB
                    // Setting data in fields
                    let tempdata = responsedata[0];
                    user_id = tempdata.id;
                    firstname = document.getElementById("firstname").value = tempdata.name;
                    lastname = document.getElementById("lastname").value = tempdata.lastname;
                    email = document.getElementById("email").value = tempdata.email;
                    number = document.getElementById("number").value = tempdata.number;
                    picture = tempdata.picture;
                    fl_date = tempdata.fl_date;
                    user_location = tempdata.location;
                    type = tempdata.type
                    if (type == 'academic') {
                        document.getElementById("Academic").checked = true;
                    } else if (type == 'general') {
                        document.getElementById("General").checked = true;
                    }
                    if (tempdata.privacy == 'true') {
                        privacy = document.getElementById("privacy").checked = true;
                    }
                    data = { 'new': false, 'user_id': user_id, 'firstname': firstname, 'lastname': lastname, 'email': email, 'number': number, 'type': type, 'privacy': privacy, 'location': user_location, 'fl_date': fl_date, 'picture': picture };
                } else {
                    // New user is sign in
                    user_id = maindata.user_id;
                    firstname = document.getElementById("firstname").value = maindata.given_name;
                    lastname = document.getElementById("lastname").value = maindata.family_name;
                    email = document.getElementById("email").value = maindata.email;
                    // number = document.getElementById("number").value = maindata.number;
                    picture = maindata.picture;
                    user_location = '';
                    data = { 'new': true, 'user_id': maindata.user_id, 'firstname': maindata.given_name, 'lastname': maindata.family_name, 'email': maindata.email, 'number': 'number', 'type': 'academic', 'privacy': '', 'location': '', 'fl_date': fl_date, 'picture': maindata.picture };
                }

            }).catch(error => createToast('error', error));
    } catch (error) {
        createToast('error', error)
    }
}

function continueClick(event) {
    try {
        let temptype;
        let dynamicUrl = '../index.html';
        let tempfirstname = document.getElementById("firstname").value;
        let templastname = document.getElementById("lastname").value;
        let tempemail = document.getElementById("email").value;
        let tempnumber = document.getElementById("number").value;
        if (document.getElementById("Academic").checked == true) { // Change here
            temptype = 'academic';
        } else if (document.getElementById("General").checked == true) { // Change here
            temptype = 'general';
        }
        let tempprivacy = document.getElementById("privacy").checked;

        // Checking for changes in data
        if (firstname != tempfirstname || lastname != templastname || email != tempemail || number != tempnumber || temptype != type) {
            if (tempprivacy) {

                data.firstname = tempfirstname;
                data.lastname = templastname;
                data.email = tempemail;
                data.number = tempnumber;
                data.type = temptype;
                data.privacy = tempprivacy;

                fetch('http://localhost:3000/api/updateUserData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then(response => {
                    data.new = false
                    localStorage.setItem('user_data', JSON.stringify(data));
                    window.location.href = dynamicUrl;
                }).catch(error => console.error('Error:', error.message));
            }
        } else {
            localStorage.setItem('user_data', JSON.stringify(data));
            window.location.href = dynamicUrl;
        }
    } catch (error) {
        console.error(error);

    }
}

function Userlogo() {
    try {

        if (localStorage.getItem('user_data') != null && document.getElementById("not-log")) {
            document.getElementById('not-log').style.display = 'none';
            document.getElementById('login-img').style.display = 'block';
            document.getElementById('login-img').setAttribute('src', data.picture);
        }
    } catch (error) {
        createToast('error', 'Error while fetching user data : ' + error.message);
    }
}