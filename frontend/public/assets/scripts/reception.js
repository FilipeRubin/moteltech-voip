import { ws } from '../scripts/antigo.js';

function listenEvents(){
    const acceptedCallBtn = document.getElementById("call__accepted--btn");

    acceptedCallBtn.addEventListener("click", () => {
        ws.send(JSON.stringify({ type: "call-accepted", data: null }))
    })
}

document.addEventListener("DOMContentLoaded", listenEvents);


/*
const websocketIp = "ws://192.168.15.24:8080";
const localAudio = document.getElementById("localAudio");
const remoteAudio = document.getElementById("remoteAudio");

const peerConnection = new RTCPeerConnection();
let pendingCandidates = [];

const ws = new WebSocket(websocketIp);

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    localAudio.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
});

ws.onopen = () => {
    console.log("WebSocket conectado [Recepção]");
    ws.send(JSON.stringify({ type: "registration", data: "reception" }));
};

peerConnection.onicecandidate = event => {
    if (event.candidate) {
        ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
    }
};

peerConnection.ontrack = event => {
    remoteAudio.srcObject = event.streams[0];
};

ws.onmessage = async event => {
    const data = JSON.parse(event.data);

    if (data.type === "call-request") {
        openModal('modalteste'); 
    }

    if (data.type === "sdp") {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        for (const candidate of pendingCandidates) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidates = [];

        if (data.sdp.type === "offer") {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            ws.send(JSON.stringify({ type: "answer", sdp: answer}));
        }
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

function openModal(modalId){
    if(document.getElementById(modalId)){
        let modal = document.getElementById(modalId);
        modal.style.display = "flex";
    }
}

*/
