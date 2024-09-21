let dynamicUrl;
const urlSearchParams = new URLSearchParams(window.location.search);
const type = urlSearchParams.get('type');
function connectedCallback(event) {
    try {
        signincheck(() => {
            fetchUserData();
        });

    } catch (error) {
        createToast('error', 'Error while loading: ' + error.message);
    }
}

function setHrefs(event) {
    try {
        let module = event.target.id;

        if (type == 'dashboard') {
            dynamicUrl = '../IA_Dashboard/IA_Dashboard.html';
        } else if (type == 'data') {
            dynamicUrl = '../IA_Listview/IA_Listview.html';
        }
        if (module == 'Reading') {
            dynamicUrl = dynamicUrl + '?module=Reading';
        } else {
            dynamicUrl = dynamicUrl + '?module=Listening';
        }
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;

    } catch (error) {
        createToast('error', 'Error while redirecting : ' + error.message);
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