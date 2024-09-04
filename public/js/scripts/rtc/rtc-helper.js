const getSystemDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();

    return {
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear()
    };
}

const getSystemTime = () => {
    const time = new Date();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return {
        hours: hours < 10 ? "0" + hours : hours,
        minutes: minutes < 10 ? "0" + minutes : minutes,
        seconds: seconds < 10 ? "0" + seconds : seconds,
        timeStamp: time.getTime()
    }
}

const addParticipant = async (courseId, participant) => {
    const request = await fetch(`/rtc/add-participant/${courseId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ participant })
    });

    const status = request.status;
    const response = await request.json();

    if (status === 200) {
        return response.doc;
    }

    console.error("an unexpected error occured while adding participant");
    return [];
}

const getParticipants = async (courseId) => {
    const request = await fetch(`/rtc/get-participants/${courseId}`);
    const status = request.status;
    const response = await request.json();

    if (status === 200) {
        return response.doc;
    }

    console.error('An unexpected error occured while fetching participants');
    return [];
}

const updateCourseMeetingInformation = async () => {
    let startDateTime = window.sessionStorage.getItem("date-Time") || undefined;

    const url = `/rtc/update-call-info/${ROOM_ID}/${CHAPTER}`;
    const participants = await getParticipants(ROOM_ID);
    const headers = { "Content-Type": "application/json" };

    const request = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ attendees: participants })
    });

    const response = await request.json();

    if (response.status === 200 && response.message === "Success") {
        const courseViewUrl = constructCourseViewUrl(userData, ROOM_ID);
        return window.location.href = courseViewUrl;
    }
}

const constructCourseViewUrl = (userData, courseId) => {
    const userType = userData.user;
    const userId = userData.data.id;

    return `/${userType}s/render/course/${courseId}/${userId}`;

}

const rtcHelperMain = async () => {

    //set start time and date.
    const dateTime = {
        courseId: ROOM_ID,
        date: getSystemDate(),
        time: getSystemTime()
    }

    window.sessionStorage.setItem("date-Time", JSON.stringify(dateTime));


    // get-participants button
    const participantsBtn = document.getElementById("get-participants");
    participantsBtn.addEventListener("click", async () => {
        const articleAtt = document.getElementById("article-attendance");
        if (articleAtt.getAttribute("aria-hidden") === "true") {
            document.getElementById("popups").setAttribute("aria-hidden", "false");
            articleAtt.setAttribute("aria-hidden", "false");

            const participants = await getParticipants(ROOM_ID);
            document.getElementById('participants-list').innerHTML = "";

            participants.forEach((participant) => {
                const li = document.createElement("li");
                if (participant.permissionClass === 'lecturer') {
                    li.innerHTML = `
                        <img src="${participant.profilePicUrl}" alt="pp" width="30px" height="30px" style="object-fit: cover; border-radius: 50%;">
                        <p>${participant.userName}(Host)</p>
                  `;
                }

                else if (participant.permissionClass === 'student') {
                    li.innerHTML = `
                        <img src="${participant.profilePicUrl}" alt="pp" width="30px" height="30px" style="object-fit: cover; border-radius: 50%;">
                        <p>${participant.userName}<br>${participant.studentId}</p>
                    `;
                }
                else {
                    return;
                }
                document.getElementById('participants-list').append(li);
            });

        }
        else {
            document.getElementById("popups").setAttribute("aria-hidden", "true")
            articleAtt.setAttribute("aria-hidden", "true")
        }

    });


    //toggle chats open close
    const chatsDiv = document.getElementById("chats");
    const chatsBtn = document.getElementById("chat-box-btn");
    chatsBtn.addEventListener('click', () => {
        if (chatsDiv.getAttribute("aria-hidden") === "true") {
            document.getElementById("popups").setAttribute("aria-hidden", "false")
            chatsDiv.setAttribute('aria-hidden', "false");
        }
        else {
            chatsDiv.setAttribute('aria-hidden', 'true');
            document.getElementById("popups").setAttribute("aria-hidden", "true");
        }
    })

    // end call by lecturer;
    const endCallBtn = document.getElementById('end-btn');
    endCallBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log(permissionClass);

        if (permissionClass === "student") {
            return window.location.href = `/call/end/${ROOM_ID}/${CHAPTER}`;
        }

        if (permissionClass === "lecturer") {
            console.log("COURSE CLEARED FOR ALL");

            //end class for all
            alert("end call for all?");
            socket.emit("end-call-for-all", (ROOM_ID));

            // update the course with the meeting information
            await updateCourseMeetingInformation();
            // clear the attendees array of the course.
        }
    });


}

document.addEventListener("DOMContentLoaded", rtcHelperMain);