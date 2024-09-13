window.addEventListener("spinner", (event) => {
    console.log("Received message:", event.detail.message);
    document.getElementById("spinner").style.display = 'none';

});