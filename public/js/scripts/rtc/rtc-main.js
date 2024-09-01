const socket = io();
const videoGrid = document.getElementById('video-grid');
const myGrid = document.getElementById('my-grid');
const participantGrid = document.getElementById('participants-grid');
var myPeer = new Peer();
let count = 0;
let myVideoStream; //the video stram is stored in this variable

let lecturerStreamSet = false

let currentPeer = null;
const peers = {};
const names = {};
const participants = [];

let userName = undefined;
let uid = undefined;
let permissionClass = undefined;
let studentId = undefined;
let profilePicUrl = '';

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

    profilePicUrl = data.profilePicUrl;

    // participants.push[{ userName, uid, permissionClass, studentId }];
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



navigator.mediaDevices.getUserMedia({
    video: true, //we want video
    audio: true //we want audio
}).then(async (stream) => {
    // console.log("uid to be set: ", uid);
    const tempuid = uid
    myVideoStream = stream; //storing the video stream returned to the myVideoStream variable

    console.log('adding my video stream', userName, permissionClass)
    addVideoStream(myVideo, stream, userName, tempuid, true, 'me-loaded'); //appended my stream to 'video-grid' div
    //add participant to list of participants
    await addParticipant(ROOM_ID, { userName, uid, permissionClass, studentId, profilePicUrl });

    myPeer.on('call', call => {
        call.answer(stream);
        const { name, userId, cuiid } = call.metadata
        console.log("caller: ", { name, userId, cuiid })

        const video = document.createElement('video');
        let html = '<i class="fas fa-microphone"></i>'
        video.innerHTML = html;
        call.on('stream', userVideoStream => {
            console.log('on stream video displayed', { name, cuiid });
            addVideoStream(video, userVideoStream, name, cuiid, false, 'call-answer')
        })
        currentPeer = call;
    })
    socket.on('user-connected', ({ userId, name, cuid }) => {
        console.log(`new user connected: `, { userId, name, cuid })
        setTimeout(connectToNewUser, 1000, userId, name, cuid, stream);
    });

}).catch((err) => {
    console.error('Error accessing media devices:', err);
    alert('Error accessing media devices. Please check your permissions.');
});

socket.on("call-terminated", () => {
    const coursePageUrl = constructCourseViewUrl(userData, ROOM_ID);
    alert("Host has ended this call");
    return window.location.replace(coursePageUrl);
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId].close();
        const videoElement = document.getElementById(`video-${userId}`);
        // console.log("disconnected user's video is: ", videoElement)
        if (videoElement) {
            videoElement.remove();
        }
        delete peers[userId];
    }
    cleanUpUI();
});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id, userName, uid, permissionClass);
});


function connectToNewUser(userId, name, cuid, stream) {
    const call = myPeer.call(userId, stream, { metadata: { name: userName, userId: myPeer.id, cuiid: cuid } });
    const video = document.createElement('video');

    video.id = `video-${userId}-${cuid}`; // Set the ID for the video element

    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, name, cuid, false, 'connect-user');
    });

    call.on('close', () => {
        // console.log(`Call with ${name} (${userId}) closed`);
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        video.srcObject = null;
        video.remove();
        socket.emit("user_call_closed", (uid));
    });

    peers[userId] = call;
    currentPeer = call;
}

function addVideoStream(video, stream, name, cuid, state, caller) {
    console.log("Adding a new video for: ",
        { video, name, cuid }
    )

    if (state) {
        console.log("stream is mine")
    }
    else {
        console.log("stream is theirs")
    }
    if (stream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        let roomCount = 0;

        getParticipants(ROOM_ID).then((participants) => {
            if (participants.length === 1) {
                console.log("you are the only one on this call")
            }
            if (participants.length === 2) {
                roomCount = 2
                console.log("there are only 2 people on this call")
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            let outerDiv = document.createElement('div');
            outerDiv.classList.add('user-video');
            outerDiv.classList.add(caller);
            outerDiv.classList.add(`${state ? 'mine' : 'joining'}`);
            outerDiv.appendChild(video);

            videoGrid.classList.add(`${roomCount === 2 ? 'two-callers' : 'one-caller'}`);
            state ? myGrid.appendChild(outerDiv) : videoGrid.appendChild(outerDiv);
        })

    } else {
        console.log(`Stream for ${name} is undefined or null.`);
    }

    setTimeout(() => {
        cleanUpUI();
    }, 20000);
}

function cleanUpUI() {
    const intervalId = setInterval(() => {
        const videoObjects = document.querySelectorAll('.joining');
        for (let container of videoObjects) {
            if (container.childElementCount === 0) {
                console.log("Removing container due to no active video feed.");
                videoGrid.removeChild(container);
            }
            const videoElement = container.querySelector("video");
            if (!videoElement || !hasActiveVideoFeed(videoElement)) {
                console.log("Removing container due to no active video feed.");
                videoGrid.removeChild(container);
            }
        }
    }, 2000); // Cleanup every 2 seconds

    // Clear the interval after 20 seconds
    setTimeout(() => {
        clearInterval(intervalId);
        console.log('Cleanup interval cleared');
    }, 20000);
}

function hasActiveVideoFeed(videoElement) {
    if (videoElement && videoElement.srcObject instanceof MediaStream) {
        const stream = videoElement.srcObject;
        if (!stream.active) return false;

        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();

        const hasActiveVideo = videoTracks.some(track => track.readyState === 'live' && track.enabled);
        const hasActiveAudio = audioTracks.some(track => track.readyState === 'live' && track.enabled);

        return hasActiveVideo || hasActiveAudio;
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
    document.getElementById('msg-preview').setAttribute('aria-hidden', 'true')
})

socket.on('recieve-message', (inputMsg, userName) => {
    inputMsg = urlify(inputMsg);
    $('#chat-list').append(`<li><span class="sender">${userName}</span><p class="message">${inputMsg}</p><span class="date-time">&nbsp;${formatAMPM(new Date)}</span>`);
})

const scrollToBottom = () => {
    var d = $('#chats');
    d.scrollTop(d.prop("scrollHeight"));
}
scrollToBottom();


var screenSharing = false;
var screenStream = null;

function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing();
        return;
    }
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            console.log('Screen sharing stopped!');
            stopScreenSharing();
        };
        if (myPeer && currentPeer) {
            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            });
            sender.replaceTrack(videoTrack);
            screenSharing = true;
        }
    }).catch((err) => {
        console.error('Error starting screen share:', err);
        alert('Error starting screen share:', err)
    });
}

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = myVideoStream.getVideoTracks()[0];
    if (myPeer && currentPeer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        });
        sender.replaceTrack(videoTrack);
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenStream = null;
    screenSharing = false;
}
document.getElementById('screen-share-btn').addEventListener('click', startScreenShare);