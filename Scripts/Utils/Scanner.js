import { Message } from "./Message.js";

let scanner = null;

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
        const cameras= allcams;

        if(cameras.length === 0){
            alert("No cameras found");
            return;
        }

        // activates first camera
        scanner.start(cameras[0]);

    }).catch(function(e){
        console.error(e);
    });


    scanner.addListener('scan',function(Code){
        console.log(Code);
        document.getElementById("Code").innerHTML= Code;
        const MessageTMP = new Message(Code);
        MessageTMP.Display();
    });
}

export function CloseScanner() {
    if (scanner) {
        scanner.stop();
        scanner = null;
        document.getElementById('preview').classList.remove('active');
        return;
    }
}