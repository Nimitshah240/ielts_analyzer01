let dynamicUrl;
const urlSearchParams = new URLSearchParams(window.location.search);
const selectionType = urlSearchParams.get('type');

function selectionconnectedCallback(params) {
    try {
        Userlogo();
    } catch (error) {
        console.log(error);
    }
}

function setHrefs(event) {
    try {
        let module = event.target.id;

        if (selectionType == 'dashboard') {
            dynamicUrl = '../IA_Dashboard/IA_Dashboard.html';
        } else if (selectionType == 'data') {
            dynamicUrl = '../IA_Listview/IA_Listview.html';
        } else if (selectionType == 'trick') {
            dynamicUrl = '../IA_Trick/IA_Trick.html';
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