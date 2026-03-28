import { Message } from "./Message.js";

let scanner = null;
let currentCamera = 0;

let cameras = [];

export function OpenScanner() {

    document.getElementById('preview').classList.add('active');

    if (scanner) {
        scanner.stop();
        scanner = null;
        document.getElementById('preview').classList.remove('active');
        return;
    }

    // scanner options
    var opts= {
        continuous: true,
        video: document.getElementById('preview'),
        mirror: true,
        captureImage: false,
        backgroundScan: true,
        refractoryPeriod: 5000,
        scanPeriod: 1
    };

    scanner = new Instascan.Scanner(opts);


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


    scanner.addListener('scan', function(Code){
        document.getElementById("camera-scan-result").innerHTML = Code;
    });
}

export function ChangeCamera() {
    if(scanner) {
        scanner.stop();

        // move to next camera
        currentCamera = (currentCamera + 1) % cameras.length;

        // start new camera
        scanner.start(cameras[currentCamera]).catch(e => {
            console.error("Camera switch failed:", e);
        });

        scanner.addListener('scan',function(Code){
        console.log(Code);
        const MessageTMP = new Message(Code);
        MessageTMP.Display();
    });
    }
}

export function CloseScanner() {
    if (scanner) {
        scanner.stop();
        scanner = null;
        document.getElementById('preview').classList.remove('active');
        return;
    }
}