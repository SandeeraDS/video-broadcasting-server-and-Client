
const mediaStreamConstraints = {
    video: true,
};


function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    document.querySelector('video').srcObject = mediaStream;
}


function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

function startGetUserMedia() {

    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}



