//import { socket } from './websocket-connection-suite.js';

let serverIp = '192.168.15.24';
let serverPort = '8080';
const address = `ws://${serverIp}:${serverPort}`;
const socket = new WebSocket(address);
const peerConnection = new RTCPeerConnection();

const remoteAudio = document.getElementById("remoteAudio");
const localAudio = document.getElementById("localAudio");

socket.onopen = function () {
  console.log('Conectado ao servidor WebSocket!');
  socket.send(JSON.stringify({ type: "registration", data: "suite" }));
};

socket.onmessage = async function (event) {
  let data = JSON.parse(event.data);

  if(data.type == "call-accepted"){
    callAcceptedHandler();
  }
  else if(data.type == "offer-answer"){
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
  }
};

socket.onclose = function (event) {
  console.log('Conexão encerrada:', event);
};

socket.onerror = function (error) {
  console.error('Erro:', error);
};

peerConnection.onicecandidate = event => {
  console.log("preparando pra mandar candidate");
  if (event.candidate) {
    socket.send(JSON.stringify({
      type: "ice-candidate",
      candidate: event.candidate
    }));
  }

  console.log("enviou candidates");
};

peerConnection.ontrack = event => {
  if (!remoteAudio.srcObject) {
      console.log("Recebendo stream remoto:", event.streams[0]);
      remoteAudio.srcObject = event.streams[0];
  }
};

// EVENTS //

function listenEvents() {
  const callToReceptionButton = document.querySelector("#btn--call-to-reception");

  callToReceptionButton.addEventListener("click",() => {
    callHandler();
  });
}

async function callAcceptedHandler(){
  getUserMedia();
  createAndsendOffer();
}

function callHandler(){
  openModal("modalteste");
  socket.send(JSON.stringify({type: "call-request", data: null}));
}

function openModal(modalId){
  if(document.getElementById(modalId)){
      let modal = document.getElementById(modalId);
      modal.style.display = "flex";
  }
}

async function createAndsendOffer(){
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.send(JSON.stringify({ type: "offer", sdp: offer }));
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

document.addEventListener("DOMContentLoaded", listenEvents);

