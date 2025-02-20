const socket = io();
const videoGrid = document.getElementById('video-grid');
const myGrid = document.getElementById('my-grid');
const peers = {};
const names = {};
const participants = [];

let peerConnectionEstablished = false;
let myPeer = null;
let count = 0;
let myVideoStream;
let currentPeer = null;
let userName = undefined;
let uid = undefined;
let permissionClass = undefined;
let studentId = undefined;
let profilePicUrl = '';
let userData = sessionStorage.getItem('auth-user');



const authenticateUserSession = () => {
    try {

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
        }
    }
    catch (error) {
        console.log('an error occured while authenticating the user');
        console.error(error);
    }
}

const getTurnCredentials = async () => {
    try {
        const response = await fetch('/rtc/turn/get-credentials');
        const { data } = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to get TURN credentials {status: ${response.status}}`);
        }

        return data
    } catch (error) {
        console.error("An error occured while fetching turn credentials", error);
        return null;
    }
}

const configureNewPeer = async () => {
    try {
        const turnCredentials = await getTurnCredentials();
        if (!turnCredentials) {
            console.log('Failed to get TURN credentials');
            const coursePageUrl = constructCourseViewUrl(userData, ROOM_ID);
            alert("Admin cannot start call");
            return window.location.replace(coursePageUrl);
        }

        const { username, password } = turnCredentials;
        myPeer = new Peer();
       
        console.log("success", myPeer)
    }
    catch (error) {
        console.log('failed to configure new peer');
        console.error(error);
    }
}

const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const setTime = () => {
    document.getElementById('time').innerText = formatAMPM(new Date) + " | Meeting";
}

const setLocalDateTime = () => {
    setInterval(setTime, 1000);
}

const connectToNewUser = async (userId, name, cuid, stream, retryCount = 0) => {
    console.log('connecting to new user')
    const maxRetries = 3;
    const delay = 1000 * (retryCount + 1); // Exponential backoff

    try {
        console.log('calling')
        const call = await myPeer.call(userId, stream);

        if (call) {
            if (peers[userId]) {
                peers[userId].close();
                delete peers[userId];
            }

            peers[userId] = call;
            currentPeer = call;

            console.log('Current peers:', peers);

            const video = document.createElement('video');

            call.on('stream', userVideoStream => {
                console.log('called, stream incoming')
                addVideoStream(video, userVideoStream, cuid, false, 'connect-user');
            });

            call.on('close', () => {
                if (video && video.srcObject) {
                    const tracks = video.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                }
                video.srcObject = null;
                video.remove();
                socket.emit("user_call_closed", (uid));
            });
        } else {
            console.error(`Failed to call peer for user: ${userId}`);
        }
    } catch (error) {
        console.error(`Error connecting to ${name}, retrying...`, error);
        if (retryCount < maxRetries) {
            setTimeout(() => connectToNewUser(userId, name, cuid, stream, retryCount + 1), delay);
        } else {
            console.error(`Failed to connect to ${name} after ${maxRetries} retries`);
        }
    }
};

const addVideoStream = (video, stream, streamId, state, caller) => {

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
            outerDiv.setAttribute("id", streamId);
            outerDiv.appendChild(video);

            videoGrid.classList.add(`${roomCount === 2 ? 'two-callers' : 'one-caller'}`);
            state ? myGrid.appendChild(outerDiv) : videoGrid.appendChild(outerDiv);
        })

    } else {
        console.log(`Stream for ${name} is undefined or null.`);
    }

    console.log('added stream', peers)

    setTimeout(() => {
        cleanUpUI();
    }, 20000);
}
function randomDelay() {
    const delay = Math.floor(Math.random() * 100) + 1; // Generates a delay between 1 and 100 ms
    return new Promise(resolve => setTimeout(resolve, delay));
}

const handlePeerCalls = (stream) => {
    try {
        myPeer.on('call', call => {
            console.log('answering call from ', call);
            call.answer(stream);

            const video = document.createElement('video');
            call.on('stream', userVideoStream => {
                console.log('streaming user media')
                addVideoStream(video, userVideoStream, uid, false, 'call-answer')
            })
            currentPeer = call;
        });

        myPeer.on('open', id => {
            peers[id] = myPeer
            console.log('Current peers:', peers);

            peerConnectionEstablished = true;
            randomDelay().then(() => {
                socket.emit('join-room', {roomId: ROOM_ID, peerId: id, name: userName, userId: uid});
            });
        });

        socket.on('user-connected', ({ userId, name, cuid }) => {
            console.log(`new user connected: `, { userId, name, cuid });
            connectToNewUser(userId, name, cuid, stream);
        });

        socket.on("call-terminated", () => {
            const coursePageUrl = constructCourseViewUrl(userData, ROOM_ID);
            alert("Host has ended this call");
            return window.location.replace(coursePageUrl);
        });
    }
    catch (error) {
        console.log('Error occured while processing call');
        console.error(error);
    }
}

const rtcMainLib = async () => {

    //authenticate user.
    authenticateUserSession();

    //set the local date and time
    setLocalDateTime();

    //configure  peerConnection
    try {
        console.log('configuring peers');
        await configureNewPeer();  // Make sure this is awaited
    } catch (error) {
        console.log(`Failure to configure peer connection`);
        return;
    }

    //create user video element and set to mute
    const myVideo = document.createElement('video'); //div which contains the video
    myVideo.id = `user-video_${uid}`
    myVideo.muted = true;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        myVideoStream = stream;
        addVideoStream(myVideo, stream, uid, true, 'me-loaded');

        handlePeerCalls(stream);
    } catch (error) {
        console.error('Error accessing media devices:', error);
        return alert('Error accessing media devices. Please check permissions.');
    }

    try {

        await addParticipant(ROOM_ID, { userName, uid, permissionClass, studentId, profilePicUrl });

        socket.on('user-disconnected', userId => {
            if (peers[userId]) {
                peers[userId].close();
                delete peers[userId];
            }
            const videoElement = document.getElementById(`video-${userId}`);
            if (videoElement) {
                videoElement.remove();
            }
            cleanUpUI();
        });


    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Error accessing media devices. Please check your permissions.');
    }
}

document.addEventListener("DOMContentLoaded", rtcMainLib);

function cleanUpUI() {
    const intervalId = setInterval(() => {
        const joiningVideos = document.querySelectorAll('.joining');
        Array.from(joiningVideos).forEach(joiningVideo => {
            if (joiningVideo.childElementCount === 0) {
                try {
                    joiningVideo.remove();
                    console.log('this one was empty and removed', joiningVideo);
                }
                catch (error) {
                    console.log('An error occured while deleting object');
                }
            }
        });
    }, 2000);

    // Clear the interval after 20 seconds
    setTimeout(() => {
        clearInterval(intervalId);
        console.log('Cleanup interval cleared');
    }, 20000);
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
    console.log('starting screen shaaring for ', peers)
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

        // Iterate through all peers and update their video track
        Object.values(peers).forEach((peer) => {
            console.log(peer)
            let sender = peer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            });
            if (sender) {
                sender.replaceTrack(videoTrack);
            }
        });

        screenSharing = true;

    }).catch((err) => {
        console.error('Error starting screen share:', err);
        alert('Error starting screen share:', err);
    });
}

function stopScreenSharing() {
    if (!screenSharing) return;

    let videoTrack = myVideoStream.getVideoTracks()[0];

    // Replace the screen share track with the original video track for all peers
    Object.values(peers).forEach((peer) => {
        let sender = peer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        });
        if (sender) {
            sender.replaceTrack(videoTrack);
        }
    });

    // Stop the screen sharing tracks
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });

    screenStream = null;
    screenSharing = false;
}
document.getElementById('screen-share-btn').addEventListener('click', startScreenShare); 