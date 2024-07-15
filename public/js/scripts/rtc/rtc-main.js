const socket = io();
const videoGrid = document.getElementById('video-grid'); //div where our video will be loaded

var myPeer = new Peer();
let count = 0;
let myVideoStream; //the video stram is stored in this variable

let currentPeer = null;
const peers = {};
const names = {};
const participants = [];

let userName = undefined;
let uid = undefined;
let permissionClass = undefined;
let studentId = undefined;

let userData = sessionStorage.getItem('auth-user');

if (!userData) {
    console.log("No data fetched")
    alert("session is invalid");
    window.location.replace('/login');
}
else {
    userData = JSON.parse(userData);
    const userType = userData.user;
    const data = userData.data;
    if (userType === "lecturer") {
        userName = `${data.firstname} ${data.lastname}`;
        uid = `${data.id}`;
        permissionClass = "lecturer";
        studentId = undefined;
    }
    else if (userType === "student") {
        userName = `${data.firstName} ${data.lastName}-${data.studentId}_${data.classId}`;
        uid = `${data.id}`;
        permissionClass = "student";
        studentId = data.studentId;
    }
    else {
        alert("session is invalid");
        window.location.replace('/login');
    }
}

const myVideo = document.createElement('video'); //div which contains the video
myVideo.id = `user-video_${uid}`
myVideo.muted = true;

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
document.getElementById('time').innerText = formatAMPM(new Date) + " | Meeting";
setInterval(setTime, 1000);
function setTime() {
    document.getElementById('time').innerText = formatAMPM(new Date) + " | Meeting";
}

document.getElementById('chat-box-btn').addEventListener('click', function () {
    if (document.getElementById('chat-box').style.display == "none") {
        document.getElementById('chat-box').style.display = "block"
    } else {
        document.getElementById('chat-box').style.display = "none"
    }
})

document.getElementById('close-chat-div').addEventListener('click', function () {
    document.getElementById('chat-box').style.display = "none";
})

navigator.mediaDevices.getUserMedia({
    video: true, //we want video
    audio: true //we want audio
}).then(async (stream) => {
    console.log("uid to be set: ", uid);
    const tempuid = uid
    myVideoStream = stream; //storing the video stream returned to the myVideoStream variable
    
    addVideoStream(myVideo, stream, userName, tempuid); //appended my stream to 'video-grid' div
    //add participant to list of participants
    const participant = {name: userName, permissionClass, studentId};
    addParticipant(participant)
    
    myPeer.on('call', call => {
        call.answer(stream);
        const { name, userId, cuiid } = call.metadata
        console.log("caller: ", { name, userId, cuiid })

        const video = document.createElement('video');
        let html = '<i class="fas fa-microphone"></i>'
        video.innerHTML = html;
        call.on('stream', userVideoStream => {
            console.log('video displayed');
            addVideoStream(video, userVideoStream, name, cuiid)
        })
        currentPeer = call;
    })
    socket.on('user-connected', ({ userId, name, cuid }) => {
        console.log(`new user connected: ${name}: ${userId}: ${cuid}`)
        setTimeout(connectToNewUser, 1000, userId, name, cuid, stream);
    });

})

socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
        const videoElement = document.getElementById(`video-${userId}`);
        console.log("disconnected user's video is: ", videoElement)
        if (videoElement) {
            videoElement.remove();
        }
        delete peers[userId];
    }
    cleanUpUI();
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id, userName, uid);
})

function connectToNewUser(userId, name, cuid, stream) {
    const call = myPeer.call(userId, stream, { metadata: { name: userName, userId: myPeer.id, cuiid: cuid } });
    const video = document.createElement('video');

    video.id = `video-${cuid}`; // Set the ID for the video element

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, name, cuid);
    });

    call.on('close', () => {
        console.log(`Call with ${name} (${userId}) closed`);
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        video.srcObject = null;
        video.remove();
    });

    peers[userId] = call;
    currentPeer = call;
}

function addVideoStream(video, stream, name, cuid) {
    console.log("Adding a new video for: ",
        { video, name, cuid }
    )
    if (stream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });

        let outerDiv = document.createElement('div');
        outerDiv.classList.add('user-video');
        outerDiv.id = `video-wrapper-${cuid}`;

        outerDiv.appendChild(video);

        let nameDiv = document.createElement('div');
        let pinDiv = document.createElement('div');
        nameDiv.classList.add('user-name');
        nameDiv.innerHTML = name;
        nameDiv.id = `${name}_${cuid}`;
        outerDiv.appendChild(nameDiv);

        videoGrid.appendChild(outerDiv); //appending to 'video-grid' div
    } else {
        console.log(`Stream for ${name} is undefined or null.`);
    }
}

function cleanUpUI() {
    const videoObjects = document.querySelectorAll('div[id^="video-wrapper-"]');
    console.log(videoObjects);
    for (let container of videoObjects) {
        const videoElement = container.querySelector("video");
        console.log("has video: ", videoElement);
        if (!videoElement || !hasActiveVideoFeed(videoElement)) {
            console.log("Removing container due to no active video feed.");
            videoGrid.removeChild(container);
        }
    }
}

function hasActiveVideoFeed(videoElement) {
    if (videoElement && videoElement.srcObject instanceof MediaStream) {
        const videoTracks = videoElement.srcObject.getVideoTracks();
        return videoTracks.some(track => track.readyState === 'live' && track.enabled);
    }
    return false;
}


function muteUnmuteUser() {
    let enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled == true) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteAudio();
    } else {
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteAudio();
    }
}

function turnUserVideoOnOff() {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled == true) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setStopVideo()
    } else {
        setPlayVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

function setPlayVideo() {
    const html = `<i class="fas fa-video"></i>`
    document.getElementById('video-off').innerHTML = html;
    document.getElementById('video-off').style.backgroundColor = '#434649';
}

function setStopVideo() {
    const html = `<i class="stop fas fa-video-slash"></i>`
    document.getElementById('video-off').innerHTML = html;
    document.getElementById('video-off').style.backgroundColor = 'tomato';
}

function setMuteAudio() {
    const html = `<i class="fas fa-microphone"></i>`
    document.getElementById('mute').innerHTML = html;
    document.getElementById('mute').style.backgroundColor = '#434649';
}

function setUnmuteAudio() {
    const html = `<i class="unmute fas fa-microphone-slash"></i>`
    document.getElementById('mute').innerHTML = html;
    document.getElementById('mute').style.backgroundColor = 'tomato';
}

document.getElementById('video-off').addEventListener('click', turnUserVideoOnOff);
document.getElementById('mute').addEventListener('click', muteUnmuteUser);

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
}


$('form').submit(function (e) {
    e.preventDefault();
    let inputMsg = $('input').val();
    if (inputMsg != '')
        socket.emit('send-message', inputMsg, userName);
    $('input').val('');
})

socket.on('recieve-message', (inputMsg, userName) => {
    inputMsg = urlify(inputMsg);
    $('#messages').append(`<li><b style="font-size:.9rem">${userName}</b>&nbsp;${formatAMPM(new Date)}<br/><br/>${inputMsg}</li>`);
    console.log('From server :: ', inputMsg);
})

const scrollToBottom = () => {
    var d = $('#chats');
    d.scrollTop(d.prop("scrollHeight"));
}
scrollToBottom();


var screenSharing = false
function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            console.log('Screen sharing stopped!');
            stopScreenSharing()
        }
        if (myPeer) {
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            sender.replaceTrack(videoTrack)
            screenSharing = true
        }
    })
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = myVideoStream.getVideoTracks()[0];
    if (myPeer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenSharing = false
}

document.getElementById('screen-share-btn').addEventListener('click', startScreenShare);

var isExpanded = false;
document.addEventListener('click', function (e) {
    let clickedElem = e.target;
    let clickedElemId = e.target.id;
    if (isExpanded == false) {
        console.log(clickedElem);
        if (clickedElem.classList.contains('user-video')) {
            let ele = document.getElementById(clickedElemId);
            //ele.style.height = "80vh";
            // ele.style.width = "70vw";
            ele.firstChild.style.height = "80vh";
            ele.firstChild.style.width = "70vw";
            isExpanded = true;
            let arr = document.getElementsByClassName('user-video');
            for (let i = 0; i < arr.length; i++) {
                let elem = arr[i];
                if (elem.id != clickedElemId) {
                    elem.style.display = "none";
                }
            }
        }

    } else {
        if (clickedElem.classList.contains('user-video')) {
            let ele = document.getElementById(clickedElemId);
            //ele.style.height = "150px";
            //ele.style.width = "250px";
            ele.firstChild.style.height = "150px";
            ele.firstChild.style.width = "250px";
            document.getElementById('video-grid').style.display = "flex";
            isExpanded = false;
            let arr = document.getElementsByClassName('user-video');
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.display = "flex";
            }
        }
    }

})