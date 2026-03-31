import { Message } from "./Message.js";
let scanner = null;

//currently active camera
let currentCamera = 0;

// array for cameras
let cameras = [];


//opens the scanner or closes it if its already ative
export function OpenScanner() {

//video preview
    document.getElementById('preview').classList.add('active');

// if its already active it closes it
    if (scanner) {
        scanner.stop();
        scanner = null;
        document.getElementById('preview').classList.remove('active');
        return;
    }

    //scanner options
    var opts= {
        continuous: true,
        video: document.getElementById('preview'),
        mirror: true,
        captureImage: false,
        backgroundScan: true,
        refractoryPeriod: 5000,
        scanPeriod: 1
    };

    
//new instance scanner
    scanner = new Instascan.Scanner(opts);

//all available cameras
    Instascan.Camera.getCameras().then(function(allcams){
    cameras = allcams;

    if(cameras.length === 0){
        alert("No cameras found");
        return;
    }

    // activates first camera
    scanner.start(cameras[currentCamera]);

    }).catch(function(e){
        console.error(e);
    });

//event listener whenthe camera scans the qr code
    scanner.addListener('scan', function(Code){
        // if we saw some qr code put the data into scan resely
        document.getElementById("camera-scan-result").innerHTML = Code;
    });
}

// change the camera
export function ChangeCamera() {
    // check if scanner exists
    if(scanner) {
        scanner.stop();

        //move to next camera
        currentCamera = (currentCamera + 1) % cameras.length;

        //start new camera
        scanner.start(cameras[currentCamera]).catch(e => {
            console.error("Camera switch failed:", e);
        });

    // scan listener
        scanner.addListener('scan',function(Code){
            document.getElementById("camera-scan-result").innerHTML = Code;
    });
    }
}

//closes the scanner and hides the preview
export function CloseScanner() {
    // if scanner exists close it
    if (scanner) {
        scanner.stop();
        scanner = null;
        document.getElementById('preview').classList.remove('active');
        return;
    }
}
