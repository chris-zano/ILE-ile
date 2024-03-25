if (document.readyState == 'loading') document.addEventListener('DOMContentLoaded', main())
else main();

function listen(element, event, callback) {
    return element.addEventListener(event, callback);
}

async function getStudentsByOffset(offset) {
    const req = await fetch(`/admin/get/students/${offset}?key=department&&value=BSc. Computer Engineering`);
    const res = await req.json();
    const status = req.status;

    return {
        status: status,
        data: res
    }
}

const createTableRow = (studentObject, parentElement) => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
        <td>${studentObject.studentId}</td>
        <td>${studentObject.firstName}</td>
        <td>${studentObject.lastName}</td>
        <td>${studentObject.level}</td>
        <td>${studentObject.program}</td>
        <td>${studentObject.department}</td>
        <td><button type="button" class="actionButton" data-label-type="courses" data-label-Student-id="${studentObject._id}" style="cursor: pointer;">View Courses</button></td>
        <td><button type="button" class="actionButton" data-label-type="repos" data-label-Student-id="${studentObject._id}" style="cursor: pointer;">View Repos</button></td>
        <td><button type="button" class="actionButton" data-label-type="files" data-label-Student-id="${studentObject._id}" style="cursor: pointer;">View Files</button></td>
    `;
    document.getElementById(parentElement).append(tr);

    tr.addEventListener('click', (e) => {
        if (e.target.tagName != 'BUTTON') {
            const studentId = e.currentTarget.querySelector('[data-label-Student-id]').getAttribute('data-label-Student-id');
            console.log('Student ID:', studentId);
            const anchor = document.createElement('a');
            anchor.href = `/students/view_profile/${studentId}`
            anchor.click();
        }
    })
}

function main() {
    let offset = localStorage.getItem('students-offset');
    if (offset != null || offset != undefined) {
        console.log(offset);
    }
    else {
        offset = 0;
        console.log('Offset is: ', offset);
    }

    document.getElementById('nextPage').addEventListener('click', (e) => {
        getStudentsByOffset(offset)
            .then((data) => {
                const studentsArr = [...data.data.data];

                studentsArr.forEach((student) => {
                    createTableRow(student, 'students-list')
                });

                const actionButtons = document.getElementsByClassName('actionButton');
                [...actionButtons].forEach((actionButton) => listen(actionButton, 'click', showView));


                localStorage.setItem('students-offset', JSON.stringify(data.data.cursor));
            }).catch((error) => {
                console.log('Error on line 23(forge.js): ', error);
            });
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        localStorage.setItem('students-offset', JSON.stringify(0));
        window.location.reload();
    })


}

const modalWrite = (message) => {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.style.display = 'block';

    const paragraph = document.createElement('p');
    paragraph.textContent = message;

    modalContent.appendChild(paragraph);

    document.body.appendChild(modalContent);

    document.body.addEventListener('click', (e) => {

        if (!modalContent.contains(e.target)) {
            if (modalContent.style.display != 'none') {
                modalContent.style.display = 'none';
            }
        }
    });

    return console.log(message);
};

const modalRender = (object) => {
    // TODO: render the students data here (courrses, repos, files etc);
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];

            const paragraph = document.createElement('p');
            paragraph.textContent = `${key}: ${value}`;

            modalContent.appendChild(paragraph);
        }
    }

    return modalContent;
};

async function showView(e) {
    const studentId = e.target.getAttribute('data-label-student-id');
    const action = e.target.getAttribute('data-label-type');

    const req = await fetch(`/admin/students/get/${action}?studentId=${studentId.trim()}`)
    const res = await req.json();
    const status = req.status;

    if (status == 403 || status == 500) {
        console.log('An error occured.\nPlease Try again');
        return;
    }

    if (res.doc.length == 0) {
        return modalWrite('No data available for this student');
    }

    for (let item of res.docs) {
        console.log(item);
    }
    return;
}
