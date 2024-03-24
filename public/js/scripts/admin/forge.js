if (document.readyState == 'loading') document.addEventListener('DOMContentLoaded', main())
else main();

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
    tr.innerHTML = `
        <td>${studentObject.studentId}</td>
        <td>${studentObject.firstName}</td>
        <td>${studentObject.lastName}</td>
        <td>${studentObject.level}</td>
        <td>${studentObject.program}</td>
        <td>${studentObject.department}</td>
        <td><button type="button" class="courses-button" data-label-Student-id="${studentObject._id}">View Courses</button></td>
        <td><button type="button" class="repos-button" data-label-Student-id="${studentObject._id}">View Repos</button></td>
        <td><button type="button" class="files-button" data-label-Student-id="${studentObject._id}">View Files</button></td>
    `;
    document.getElementById(parentElement).append(tr);
}

function main() {
    //TODO: find a new place to store the offset
    const studentsListContainer = document.getElementById('students-list');
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
                })
                localStorage.setItem('students-offset', JSON.stringify(data.data.cursor));
            }).catch((error) => {
                console.log('Error on line 23(forge.js): ', error);
            });
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        localStorage.setItem('students-offset', JSON.stringify(0));
        window.location.reload();
    })

    // const offset = studentsListContainer.getAttribute('data-offset');

}

