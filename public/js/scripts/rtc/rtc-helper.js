const addParticipant = async (courseId, participant) => {
    console.log({ courseId, participant })
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
        console.log('Participants data added successfully', response.doc);
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
        console.log('Participants data fetched successfully', response.doc);
        return response.doc;
    }

    console.error('An unexpected error occured while fetching participants');
    return [];
}

const updateCourseMeetingInformation = async () => {
    const url = `/rtc/update-call-info/${ROOM_ID}`;
    const participants = await getParticipants(ROOM_ID);
    const headers = {"Content-Type": "application/json"};

    const request = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({attendees: participants})
    });

    const response = await request.json();

    console.log(response);
}

const constructCourseViewUrl = (userData, courseId) => {
    const userType = userData.user;
    const userId = userData.data.id;

    return `/${userType}s/render/course/${courseId}/${userId}`;

}

const rtcHelperMain = async () => {
    // get-participants button
    const participantsBtn = document.getElementById("get-participants");
    participantsBtn.addEventListener("click", async () => {
        const participants = await getParticipants(ROOM_ID);
        console.log("On button click, participants are:", participants);
    });

    // end call by lecturer;
    const endCallBtn = document.getElementById('end-btn');
    endCallBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log(permissionClass);

        if (permissionClass === "student") {
            return window.location.href = `/room/end/${ROOM_ID}`;
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
    })
}

document.addEventListener("DOMContentLoaded", rtcHelperMain);