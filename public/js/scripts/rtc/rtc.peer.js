const rtcStreamMain = async () => {
  //join call with video and audio
  const socket = io('/');
  let myUserId = null;
  const videoGrid = document.getElementById('video-grid')
  const myPeerId = sessionStorage.getItem('peerId') || undefined
  const myPeer = new Peer(myPeerId, {
    host: '/',
    port: '3001'
  })
  if (!sessionStorage.getItem('peerId')) {
    myPeer.on('open', id => {
      sessionStorage.setItem('peerId', id)
      socket.emit('join-room', ROOM_ID, id)
    })
  } else {
    socket.emit('join-room', ROOM_ID, myPeerId)
  }

  const myVideo = document.createElement('video')
  myVideo.muted = true
  myVideo.style.transform = "scaleX(-1)";
  myVideo.setAttribute("data-userType", userData.user);
  const peers = {}
  let myStream

  console.log("is true?", userData.user === "lecturer");
  const stream = await navigator.mediaDevices.getUserMedia({ video: userData.user === "lecturer", audio: true });

  myStream = stream;
  console.log(myStream)

  addVideoStream(myVideo, stream);

  myPeer.on('call', call => {
    console.log("incoming call", call)
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log("answer call: ", userVideoStream);
      // addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    console.log("new user connected", userId)
    connectToNewUser(userId, stream)
  })

  socket.on('user-disconnected', userId => {
    console.log("user disconnected", userId);
    // if (peers[userId]) peers[userId].close()
  })

  // navigator.mediaDevices.getUserMedia({
  //   video: userData.user === "lecturer",
  //   audio: true
  // }).then(stream => {
  //   myStream = stream
  //   addVideoStream(myVideo, stream)

  //   myPeer.on('call', call => {
  //     call.answer(stream)
  //     const video = document.createElement('video')
  //     call.on('stream', userVideoStream => {
  //       addVideoStream(video, userVideoStream)
  //     })
  //   })

  //   socket.on('user-connected', userId => {
  //     connectToNewUser(userId, stream)
  //   })
  // })

  // socket.on('user-disconnected', userId => {
  //   if (peers[userId]) peers[userId].close()
  // })

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    console.log("Call in connect is:", call)
    console.log("calling:", userId, userData.user);

    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      // addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call;
    console.log("peers object is: ", peers);
  }

  function addVideoStream(video, stream) {
    console.log(
      "video: ", video,
      "stream: ", stream
    )
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }

  // Mute/Unmute Audio
  const muteButton = document.getElementById('muteButton')
  muteButton.addEventListener('click', () => {
    const enabled = myStream.getAudioTracks()[0].enabled
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false
      muteButton.textContent = 'Unmute'
    } else {
      myStream.getAudioTracks()[0].enabled = true
      muteButton.textContent = 'Mute'
    }
  })

  // Turn Video On/Off
  const videoButton = document.getElementById('videoButton')
  videoButton.addEventListener('click', () => {
    const enabled = myStream.getVideoTracks()[0].enabled
    if (enabled) {
      myStream.getVideoTracks()[0].enabled = false
      videoButton.textContent = 'Turn Video On'
    } else {
      myStream.getVideoTracks()[0].enabled = true
      videoButton.textContent = 'Turn Video Off'
    }
  })


}


document.addEventListener("DOMContentLoaded", rtcStreamMain);