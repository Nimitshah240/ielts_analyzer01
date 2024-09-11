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

        setTimeout(function () {
            event.target.href = dynamicUrl;
            window.location.href = dynamicUrl;
        }, 500);
    } catch (error) {
        console.error(error);
    }
}