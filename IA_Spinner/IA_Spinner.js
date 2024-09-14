try {
    window.addEventListener("spinner", (event) => {

        if (event.detail.message == true) {

            document.getElementById("spinner").style.display = 'flex';
            document.getElementById("main").style.display = 'none';

        } else if (event.detail.message == false) {

            const myEvent = new CustomEvent('allpages', {
                detail: { message: false },
            });
            window.dispatchEvent(myEvent);

        }
    });
} catch (error) {
    console.log(error);

}
