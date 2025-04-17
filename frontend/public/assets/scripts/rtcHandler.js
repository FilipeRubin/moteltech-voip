let peerConnection;
let isCaller = false;
let pendingCandidates = [];
let websocket;
let localStream;
let suiteIp;
let onCallAcceptedCallback;

export function initRTC(ws, localAudioElement, remoteAudioElement, ip, onCallReceived, onConnected) {
    websocket = ws;
    suiteIp = ip;
    peerConnection = new RTCPeerConnection();

    // Captura áudio local
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            localStream = stream;
            localAudioElement.srcObject = stream;
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        });

    // ICE Candidate
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            websocket.send(JSON.stringify({ candidate: event.candidate, target_ip: suiteIp }));
        }
    };

    // Recebendo stream remoto
    peerConnection.ontrack = event => {
        if (!remoteAudioElement.srcObject) {
            remoteAudioElement.srcObject = event.streams[0];
        }
    };

    // Recebe mensagens via WebSocket
    websocket.onmessage = async event => {
        const data = JSON.parse(event.data);

        if (data.sdp) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));

            for (const candidate of pendingCandidates) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidates = [];

            if (data.sdp.type === 'offer') {
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                websocket.send(JSON.stringify({ sdp: answer, target_ip: data.from_ip }));
            }
        } else if (data.candidate) {
            if (peerConnection.remoteDescription) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } else {
                pendingCandidates.push(data.candidate);
            }
        }

        if (data.type === "calling") {
            onCallReceived && onCallReceived(data);
        }

        if (data.type === "call-accepted") {
            onCallAcceptedCallback && onCallAcceptedCallback();
        }
    };

    websocket.addEventListener("open", () => {
        onConnected && onConnected();
    });
}

export function startCall(targetIp, callbackWhenReady) {
    isCaller = true;
    onCallAcceptedCallback = callbackWhenReady;

    peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(offer);
        websocket.send(JSON.stringify({ sdp: offer, target_ip: targetIp }));
    });
}
