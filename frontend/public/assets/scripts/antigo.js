let serverIp = '213.218.234.124';
let serverPort = '12501';
const address = `ws://${serverIp}:${serverPort}`;
export const ws = new WebSocket(address);
const localAudio = document.getElementById("localAudio");
const remoteAudio = document.getElementById("remoteAudio");
const peerConnection = new RTCPeerConnection();

let isCaller = false;
let pendingCandidates = [];

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        localAudio.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    });

ws.addEventListener("open", async () => {
    console.log("Conectado ao WebSocket.");
    const random = Math.random() < 0.5;
    ws.send(JSON.stringify({type: 'registration', data: random ? 'suite' : 'reception'}));
    console.log(random ? 'suite' : 'reception');
});

ws.onmessage = async event => {
    const data = JSON.parse(event.data);
    console.log("Mensagem recebida via WebSocket:", data);

    if (data.sdp) {
        console.log("Recebido SDP:", data.sdp);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));

        pendingCandidates.forEach(async candidate => {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        });
        pendingCandidates = [];

        if (data.sdp.type === 'offer') {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            ws.send(JSON.stringify({ sdp: answer }));
        }
    } else if (data.candidate) {
        console.log("Recebido ICE Candidate:", data.candidate);
        if (peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
            console.warn("Armazenando ICE Candidate antes do setRemoteDescription");
            pendingCandidates.push(data.candidate);
        }
    }

    if (data.type === "call-request") {
        openModal('modalteste');
    }

    else if (data.type === "call-accepted") {
        startCall();
    }
};

peerConnection.onicecandidate = event => {
    if (event.candidate) {
        console.log("Enviando ICE Candidate:", event.candidate);
        ws.send(JSON.stringify({ candidate: event.candidate}));
    }
};

peerConnection.ontrack = event => {
    if (!remoteAudio.srcObject) {
        console.log("Recebendo stream remoto:", event.streams[0]);
        remoteAudio.srcObject = event.streams[0];
    }
};

function startCall() {
    isCaller = true;
    peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(offer);
        ws.send(JSON.stringify({ sdp: offer }));
    });
}


function openModal(modalId){
    if(document.getElementById(modalId)){
        let modal = document.getElementById(modalId);
        modal.style.display = "flex";
    }
}