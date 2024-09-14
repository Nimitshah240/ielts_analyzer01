try {
    window.addEventListener("spinner", (event) => {
        if (event.detail.message == 'true') {
            document.getElementById("spinner").style.display = 'flex';
            document.getElementById("main").style.display = 'none';
        } else if (event.detail.message == 'false') {
            document.getElementById("spinner").style.display = 'none';
            document.getElementById("main").style.display = 'block';
        }

    });
} catch (error) {
    console.log(error);

}
