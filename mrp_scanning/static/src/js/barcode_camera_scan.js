var beepsound = new Audio(   
    'https://www.mediacollege.com/downloads/sound-effects/beep/beep-10.wav');   

var button = document.getElementById("button-scan");
var div = document.getElementById("interactive");
const popup = document.createElement("div");
const closeButton = document.createElement("button");
closeButton.innerText = "Close";
var currentMoId;// the mo_id of the scanned document
console.log(button);


button.addEventListener("click", function() {
  
  // Create a new elements element to use as the popup window
  popup.classList.add("popup");
  closeButton.classList.add("close-button");

  //show the popup
  div.classList.remove("hidden");
  div.classList.add("visible");
  popup.appendChild(div);
  popup.appendChild(closeButton);
  
  // Add the popup to the DOM
  document.body.appendChild(popup);

  // Add click event listener to close button
  closeButton.addEventListener("click", function() {
    Quagga.stop();
    popup.remove();
  });

  Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector('#interactive'),
      constraints: {
        width: 520,
        height: 400,
        facingMode: "environment"  //"environment" for back camera, "user" front camera
      }
    },
    locate: true,
    decoder : {
      readers : ["code_128_reader"]
    }
  }, function(err) {
    if (err) {
      console.log(err);
      return
    }
    console.log("Initialization finished. Ready to start");
    
    //start the scanning
    Quagga.start();
    
    Quagga.onDetected(function(result) {
      console.log(result.codeResult.code);
  
      scanned_mo = result.codeResult.code;
      check_scanned_mo(scanned_mo);

      beepsound.play();
      Quagga.offDetected();
      Quagga.stop();
      popup.remove();
    });
  
  });
  
});

