try {
    window.addEventListener("spinner", (event) => {
        console.log(event.detail.message);
        
        if (event.detail.message == 'true') {
            document.getElementById("spinner").style.display = 'flex';
            document.getElementById("main").style.display = 'none';
            // setTimeout(function () {
            //     document.getElementById("spinner").style.display = 'none';
            //     document.getElementById("main").style.display = 'block';
            // }, 5000);
        } else if (event.detail.message == 'false') {
            document.getElementById("spinner").style.display = 'none';
            document.getElementById("main").style.display = 'block';
        }

    });
} catch (error) {
    console.log(error);

}
