import { socket } from './webrtc-connection.js';
const localAudio = document.getElementById("localAudio");
const peerConnection = new RTCPeerConnection();

export async function callHandler(){
    openModal("modalteste");
    // check other peer status
    await getUserMedia();
    //createAndsendOffer();
}
  
function openModal(modalId){
    if(document.getElementById(modalId)){
        let modal = document.getElementById(modalId);
        modal.style.display = "block";
    }
}
  
async function createAndsendOffer(){
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendMessageToServer(JSON.stringify({ sdp: offer }));
}

async function getUserMedia(){
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localAudio.srcObject = stream;
        stream.getTracks()
        .forEach(track => peerConnection.addTrack(track, stream));
    } catch (error) {
        console.error("Erro ao acessar o microfone:", error);
    }
    }

    function sendMessageToServer(message){
    socket.send(message);
}