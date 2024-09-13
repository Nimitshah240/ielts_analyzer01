let dynamicUrl;
const urlSearchParams = new URLSearchParams(window.location.search);
const type = urlSearchParams.get('type');
function connectedCallback(event) {
    try {

        signincheck(() => {
            fetchUserData();
        });

    } catch (error) {
        console.error(error);
    }
}

function setHrefs(event) {
    try {

        document.getElementById("main").style.display = 'none';
        document.getElementById("spinner").style.display = 'flex';

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

        // setTimeout(function () {
        // }, 500);
        event.target.href = dynamicUrl;
        window.location.href = dynamicUrl;

        document.getElementById("spinner").style.display = 'none';
        document.getElementById("main").style.display = 'block';
    } catch (error) {
        console.error(error);
    }
}