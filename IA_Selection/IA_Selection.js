let dynamicUrl;
const urlSearchParams = new URLSearchParams(window.location.search);
const type = urlSearchParams.get('type');
function connectedCallback(event) {
    try {

        signincheck(() => {
            fetchUserData();

            const myEvent = new CustomEvent("spinner", {
                detail: { message: "false" },
            });
            window.dispatchEvent(myEvent);
        });

    } catch (error) {
        console.error(error);
    }
}

function setHrefs(event) {
    try {
        let module = event.target.id;

        const myEvent = new CustomEvent("spinner", {
            detail: { message: "true" },
        });
        window.dispatchEvent(myEvent);


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

    } catch (error) {
        console.error(error);
    }
}