const addParticipant = async (courseId, participant) => {
    console.log({ courseId, participant })
    const request = await fetch(`/rtc/add-participant/${courseId}`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({participant })
    });

    const status = request.status;
    const response = await request.json();

    if (status === 200)  {
        console.log('Participants data added successfully', response.doc);
        return response.doc;
    }

    console.error("an unexpected error occured while adding participant");
    return [];
}

const getParticipants = async (courseId) => {
    const request = await fetch(`/rc/get-participants/${courseId}`);
    const status = request.status;
    const response = await request.json();

    if (status === 200) {
        console.log('Participants data fetched successfully', response.doc);
        return response.doc;
    }

    console.error('An unexpected error occured while fetching participants');
    return [];
}