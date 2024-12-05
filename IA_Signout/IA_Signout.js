function signout(event) {
    var dynamicUrl;
    dynamicUrl = '../index.html';
    event.target.href = dynamicUrl;
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
            window.location.href = dynamicUrl;
        })
    } else {
        window.location.href = dynamicUrl;
    }
}