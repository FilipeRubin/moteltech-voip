import { ws } from '../scripts/antigo.js';

function listenEvents(){
    const acceptedCallBtn = document.getElementById("btn--call-to-reception");

    acceptedCallBtn.addEventListener("click", () => {
        ws.send(JSON.stringify({ type: "call-request", data: null }))
        openModal("modalteste");
    })
}

document.addEventListener("DOMContentLoaded", listenEvents);

function openModal(modalId){
    if(document.getElementById(modalId)){
        let modal = document.getElementById(modalId);
        modal.style.display = "flex";
    }
}

/*const websocketIp = "ws://192.168.15.24:8080";
const localAudio = document.getElementById("localAudio");
const remoteAudio = document.getElementById("remoteAudio");

const peerConnection = new RTCPeerConnection();
let pendingCandidates = [];
let callingFrom = null;

const ws = new WebSocket(websocketIp);
ws.onopen = () => {
    console.log("WebSocket conectado [Suíte]");
    ws.send(JSON.stringify({ type: "registration", data: "suite" }));
};

peerConnection.onicecandidate = event => {
    if (event.candidate && callingFrom) {
        ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
    }
};

peerConnection.ontrack = event => {
    remoteAudio.srcObject = event.streams[0];
};

ws.onmessage = async event => {
    const data = JSON.parse(event.data);

    if (data.type === "sdp") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        for (const candidate of pendingCandidates) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidates = [];

        /*if (data.sdp.type === "answer") {
            getUserMedia();
        }*/
       /*
    }

    if(data.type === "call-accepted"){
        startCall();
        getUserMedia();
    }

    if (data.type === "ice") {
        if (peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
            pendingCandidates.push(data.candidate);
        }
    }
};

function getUserMedia(){
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        localAudio.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    });
}

function startCall() {
    console.log("chamada iniciada");
    peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: "sdp", sdp: offer }));
    });
}

function openModal(modalId){
    if(document.getElementById(modalId)){
        let modal = document.getElementById(modalId);
        modal.style.display = "flex";
    }
}

function listenEvents(){
    const btnCallReception = document.getElementById("btn--call-to-reception");

    btnCallReception.addEventListener("click", () => {
        openModal("modalteste");
        ws.send(JSON.stringify({ type: "call-request", data: null }))
    })
}

document.addEventListener("DOMContentLoaded", listenEvents);
*/
