function sigin() {
    try {
        let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

        let form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        let params = {
            "client_id": "960583894295-h50j910bdioqrmlrargqs6hust6in4ap.apps.googleusercontent.com",
            "redirect_uri": "https://ieltsanalyzer.netlify.app",
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
        console.error(error);
    }
}

async function signincheck(callback) {
    try {
        if (localStorage.getItem('user_data') == null) {
            let access_token = '';
            if (window.location.href.includes('#')) {
                console.log("#");
                let params = {}
                let regex = /([^&=]+)=([^&]*)/g, m
                
                while (m = regex.exec(location.href)) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }
                
                let info = JSON.parse(JSON.stringify(params));
                access_token = info['access_token'];
                localStorage.setItem("authInfo", info['access_token']);
                window.history.pushState({}, document.title, "/");
            }

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
                        localStorage.setItem('user_data', JSON.stringify(info));

                        const data = JSON.parse(localStorage.getItem('user_data'));
                        console.log(JSON.stringify(data));
                        
                        if (data) {
                            data.fl_date = today;
                            data.ll_date = today;
                            data.email = undefined;    // remove if you get email from the first google login 
                            data.location = undefined; // remove if you get location from the first google login

                            delete data.family_name;
                            delete data.given_name;
                            console.log('post login data');

                            fetch('https://ieltsanalyzer.up.railway.app/logindata', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            })
                                .then(response => response.json())
                                .then(responseData => { })
                                .catch(error => console.error('Error:', error.message));
                        }

                        callback();
                    });
            }
        } else {
            callback();
        }
    } catch (error) {
        console.error('e', error);
    }
}

function signout() {
    try {

        let access_token = localStorage.getItem('authInfo');
        fetch("https://oauth2.googleapis.com/revoke?token=" + access_token, {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        })
            .then(() => {
                localStorage.removeItem('authInfo');
                localStorage.removeItem('user_data');
                document.getElementById('not-log').style.display = 'block';
                document.getElementById('login-img').style.display = 'none';
            })
    } catch (error) {
        console.error(error);
    }
}