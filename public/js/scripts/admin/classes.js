const DAY_OF_THE_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let localScheduleStore = [];

const renderSchedule = (schedule) => {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay')
    const container = document.getElementById('schedule-container');

    const scheduleCard = document.createElement('div');
    scheduleCard.className = 'schedule-card';

    const classIdElement = document.createElement('h2');
    classIdElement.classList.add("class-h2")
    classIdElement.innerHTML = `<p>${schedule.classId}</p><div id="close" style="font-size: 20px">&#10060;</div>`;

    
   
    scheduleCard.appendChild(classIdElement);

    const days = Object.keys(schedule.schedule);

    days.forEach(day => {
        const daySection = document.createElement('div');
        daySection.className = 'day-section';

        const dayName = document.createElement('div');
        dayName.className = 'day-name';
        dayName.textContent = day;
        daySection.appendChild(dayName);

        const schedulesContainer = document.createElement('div');
        schedulesContainer.className = 'schedules';

        if (schedule.schedule[day].length === 0) {
            const noClasses = document.createElement('div');
            noClasses.textContent = 'No classes today';
            schedulesContainer.appendChild(noClasses);
        } else {
            schedule.schedule[day].forEach(scheduleItem => {
                const scheduleElement = document.createElement('div');
                scheduleElement.className = 'schedule-item';

                scheduleElement.innerHTML = `
                    <p>Course: ${scheduleItem.course}</p>
                    <p class="time-schedule">${scheduleItem.start_time}:00 - ${Number(scheduleItem.start_time) + Number(scheduleItem.duration)}:00</p>
                    <a href="#" class="lectId-profile-url">${scheduleItem.lecturer}</a>
                `;
                scheduleElement.style.width = "200px"
                schedulesContainer.appendChild(scheduleElement);
            });
        }

        daySection.appendChild(schedulesContainer);
        scheduleCard.appendChild(daySection);
    });

    container.innerHTML = "";
    container.appendChild(scheduleCard);
    container.classList.remove("hidden");

    const closeBtn = container.querySelector('#close');
    closeBtn.addEventListener('click', () => {
        container.classList.add("hidden");
    })
}

const renderClassSchedule = (classId) => {
    const classScheduleData = localScheduleStore.filter((item) => item.classId === classId)[0];
    console.log(classScheduleData)
    renderSchedule(classScheduleData)
}

const getLecturersName = async (lecturerId) => {
    try {
        const response = await fetch(`/admins/user/get-lecturers-name/${lecturerId}`);
        const status = response.status;
        const data = await response.json();

        return status === 200? `${data.data.firstname} ${data.data.lastname}`: lecturerId;
    }catch(error) {
        console.log(error);
    }
}

const classesMain = async () => {
    const listOfClasses = document.getElementsByClassName("admin-class-list-li");

    for (let listItem of listOfClasses) {
        let class_scheduleJSON = listItem.querySelector(".class_schedule");
        let classIdElement = listItem.querySelector(".class-id-p");

        if (!class_scheduleJSON.classList.contains("hidden")) {
            class_scheduleJSON.classList.add("hidden");
        }

        let classId = classIdElement.textContent.trim();
        class_scheduleJSON = JSON.parse(class_scheduleJSON.textContent);

        let classSchedule = {
            classId: classId,
            schedule: {}
        };

        for (let day of DAY_OF_THE_WEEK) {
            classSchedule.schedule[day] = [];
        }

        for (let schedule of class_scheduleJSON) {
            let { day, start_time, duration, course, credit, lecturer } = schedule;
            if (DAY_OF_THE_WEEK.includes(day)) {
                const lecturersName = await getLecturersName(lecturer)
                classSchedule.schedule[day].push({
                    start_time: start_time,
                    duration: duration,
                    course: course,
                    credit: credit,
                    lecturer: lecturersName,
                    lecturerId: lecturer
                });
            }
        }

        localScheduleStore.push(classSchedule);
    }

    // console.log(localScheduleStore)
    Array.from(document.getElementsByClassName("schedule-btn-b")).forEach((button) => {
        const buttonParent = button.parentElement.parentElement;
        const classId = buttonParent.querySelector(".class-id-p").textContent;

        button.addEventListener("click", (e) => {
            renderClassSchedule(classId);
        });
    });
};

document.addEventListener("DOMContentLoaded", async() => {
    await classesMain()
});
