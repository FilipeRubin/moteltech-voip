import { socket } from './websocket-connection.js';

function listenEvents() {
  const callToReceptionButton = document.querySelector("#btn--call-to-reception");

  callToReceptionButton.addEventListener("click",() => {
    callHandler();
  });
}

function callHandler(){
  openModal("modalteste");
  socket.send(JSON.stringify({type: "call-request", data: null}));
  // check other peer status
  //await getUserMedia();
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

document.addEventListener("DOMContentLoaded", listenEvents);

