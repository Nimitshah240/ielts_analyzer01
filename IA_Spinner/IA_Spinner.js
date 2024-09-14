try {
    window.addEventListener("spinner", (event) => {
        if (event.detail.message == 'true') {
            console.log(event.detail.message);

            document.getElementById("spinner").style.display = 'flex';
            document.getElementById("main").style.display = 'none';
        } else if (event.detail.message == 'false') {
            console.log(event.detail.message);

            document.getElementById("spinner").style.display = 'none';
            document.getElementById("main").style.display = 'block';
        }

    });
} catch (error) {
    console.log(error);

}
