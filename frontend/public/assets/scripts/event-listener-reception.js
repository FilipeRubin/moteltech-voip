let serverIp = '192.168.15.24';
let serverPort = '8080';
const address = `ws://${serverIp}:${serverPort}`;

const remoteAudio = document.getElementById("remoteAudio");
const localAudio = document.getElementById("localAudio");

const socket = new WebSocket(address);
const peerConnection = new RTCPeerConnection();

socket.onopen = function () {
    console.log('Conectado ao servidor WebSocket!');
    socket.send(JSON.stringify({ type: "registration", data: "reception" }));
};

socket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    if(data.type == "call-request"){
        openModal("modalteste");
    }
    else if(data.type == "offer"){
        createAndSendAnswerOffer(data.sdp);
    }
    else if(data.type == "ice-candidate"){
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
};

socket.onclose = function (event) {
    console.log('Conexão encerrada:', event);
};

socket.onerror = function (error) {
    console.error('Erro:', error);
};

peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.send(JSON.stringify({
        type: "ice-candidate",
        candidate: event.candidate
      }));
    }
};

peerConnection.ontrack = event => {
    if (!remoteAudio.srcObject) {
        console.log("Recebendo stream remoto:", event.streams[0]);
        remoteAudio.srcObject = event.streams[0];
    }
};

function openModal(modalId){
    if(document.getElementById(modalId)){
        let modal = document.getElementById(modalId);
        modal.style.display = "block";
    }
}

async function createAndSendAnswerOffer(sdp){
    const remoteOffer = new RTCSessionDescription(sdp);
    await peerConnection.setRemoteDescription(remoteOffer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: "offer-answer", sdp: answer }));
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

function listenEvents(){
    const acceptedCallBtn = document.getElementById("call__accepted--btn");

    acceptedCallBtn.addEventListener("click", () => {
        getUserMedia();
        socket.send(JSON.stringify({ type: "call-accepted", data: null }))
    })
}

document.addEventListener("DOMContentLoaded", listenEvents);