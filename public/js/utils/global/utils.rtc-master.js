mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));


const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;
let roomRef = null;


function init() {
  document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

const createOffer = async () => {

}

async function createRoom() {

  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;
  getOrCreateRoom("classId", "hostId");

  socket.on("roomRef", async (roomref) => {
    roomRef = { ...roomref };
    console.log("Room created with roomref as: ", roomRef)

    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const callerCandidatesCollection = [];
    console.log("preparing to get candidates")
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log("Got final Candidate")
        return;
      }
      
      if (callerCandidatesCollection.length === 10) {
        console.log("Got all 10 candidates")
        updateCallerCandidates(roomRef);
      }
      callerCandidatesCollection.push(event.candidate.toJSON());
      roomRef['callerCandidates'] = callerCandidatesCollection;
    });
    // Code for collecting ICE candidates above

    //Save collected ICE Candidates to the database;
    socket.on('updatedRTCDocument', async (updatedDoc) => {
      roomRef = updatedDoc; // assign roomref to updated document with ice candidates

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('Created offer:', offer);

      const roomWithOffer = {
        'offer': {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      emitCreateNewRoom(roomWithOffer, roomRef);

      socket.on("createdRoom", (updatedRoomData) => {
        console.log("updated the room object: ", updatedRoomData);

        roomId = updatedRoomData._id;
        console.log(`New room created with SDP offer. Room ID: ${roomId}`);
        document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the caller!`;

        peerConnection.addEventListener('track', event => {
          console.log('Got remote track:', event.streams[0]);
          event.streams[0].getTracks().forEach(track => {
            console.log('Add a track to the remoteStream:', track);
            remoteStream.addTrack(track);
          });
        });
      });


      // Listening for remote session description below
      listenForRemoteSessionDescription(roomRef, "sdp");
      socket.on("changeEventOccured", async (responseObject) => {
        if (responseObject.propertyClass === "sdp") {
          const data = document;
          if (!peerConnection.currentRemoteDescription && data && data.answer) {
            console.log('Got remote description: ', data.answer);
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await peerConnection.setRemoteDescription(rtcSessionDescription);
          }
        }

        else if (responseObject.propertyClass === "remoteCandidates") {
          let data = document;
          console.log(`Got new remote ICE candidate: ${data}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      })
    })

  });
}

function joinRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').
    addEventListener('click', async () => {
      roomId = document.querySelector('#room-id').value;
      console.log('Join room: ', roomId);
      document.querySelector(
        '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
      await joinRoomById(roomId);
    }, { once: true });
  roomDialog.open();
}

async function joinRoomById(roomId) {
  getMeetingRoom(roomId, "hostId");
  socket.on('sendMeetingRoom', (room) => {
    console.log("Found a new meeting room", room);
  });
  // const roomRef = db.collection('rooms').doc(`${roomId}`);
  // const roomSnapshot = await roomRef.get();
  // console.log('Got room:', roomSnapshot.exists);

  // if (roomSnapshot.exists) {
  //   console.log('Create PeerConnection with configuration: ', configuration);
  //   peerConnection = new RTCPeerConnection(configuration);
  //   registerPeerConnectionListeners();
  //   localStream.getTracks().forEach(track => {
  //     peerConnection.addTrack(track, localStream);
  //   });

  //   // Code for collecting ICE candidates below
  //   const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
  //   peerConnection.addEventListener('icecandidate', event => {
  //     if (!event.candidate) {
  //       console.log('Got final candidate!');
  //       return;
  //     }
  //     console.log('Got candidate: ', event.candidate);
  //     calleeCandidatesCollection.add(event.candidate.toJSON());
  //   });
  //   // Code for collecting ICE candidates above

  //   peerConnection.addEventListener('track', event => {
  //     console.log('Got remote track:', event.streams[0]);
  //     event.streams[0].getTracks().forEach(track => {
  //       console.log('Add a track to the remoteStream:', track);
  //       remoteStream.addTrack(track);
  //     });
  //   });

  //   // Code for creating SDP answer below
  //   const offer = roomSnapshot.data().offer;
  //   console.log('Got offer:', offer);
  //   await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  //   const answer = await peerConnection.createAnswer();
  //   console.log('Created answer:', answer);
  //   await peerConnection.setLocalDescription(answer);

  //   const roomWithAnswer = {
  //     answer: {
  //       type: answer.type,
  //       sdp: answer.sdp,
  //     },
  //   };
  //   await roomRef.update(roomWithAnswer);
  //   // Code for creating SDP answer above

  //   // Listening for remote ICE candidates below
  //   roomRef.collection('callerCandidates').onSnapshot(snapshot => {
  //     snapshot.docChanges().forEach(async change => {
  //       if (change.type === 'added') {
  //         let data = change.doc.data();
  //         console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
  //         await peerConnection.addIceCandidate(new RTCIceCandidate(data));
  //       }
  //     });
  //   });
  // Listening for remote ICE candidates above
  // }
}

async function openUserMedia(e) {
  const stream = await navigator.mediaDevices.getUserMedia(
    { video: true, audio: true });
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);
  document.querySelector('#cameraBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;
}

async function hangUp(e) {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;
  document.querySelector('#cameraBtn').disabled = false;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  // Delete room on hangup
  if (roomId) {
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = await roomRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
  }

  document.location.reload(true);
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

init();
