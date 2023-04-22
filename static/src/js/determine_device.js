    camera = document.getElementById("camera-field")
    scanner = document.getElementById("scanner-field")          
        
    if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) {
        // the user is on a mobile device
        //camera.style.display = "block";
        camera.style.display = "block";
        console.log("mobile")

    } else {
        // the user is on a desktop device
        scanner.style.display = "block";
        input = document.getElementById("moo_name").focus(); 
        console.log("pc")
    }
