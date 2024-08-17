let userdata = window.sessionStorage.getItem('auth-user') || undefined;

if (!userdata) window.location.replace('/login');

const adminId = JSON.parse(userdata).data.id;

const getStudentsByOffset = async (key, value) => {
    const moffset = localStorage.getItem('students-offset') || 0;
    const req = await fetch(`/admin/get/students/${moffset}?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`);
    const res = await req.json();
    const status = req.status;

    return {
        status: status,
        data: res
    }
}

const createTableRow = (studentObject, parentElement) => {
    let count = Number(localStorage.getItem('count'));
    const tr = document.createElement('tr');

    if (Object.keys(studentObject).length == 0) {
        tr.innerHTML = `
        <td></td>
        <td></td>
        <td>No</td>
        <td>data</td>
        <td>available</td>
        <td>Import</td>
        <td>data</td>
        <td></td>
        `;
        document.getElementById(parentElement).append(tr);
        document.getElementById('nextPage').style.display = "none"
        return;
    }
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
        <td data-label-Student-id="${studentObject._id}" >${count}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.studentId}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.firstName}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.lastName}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.level}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.program}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.faculty}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.session}</td>
        <td data-label-Student-id="${studentObject._id}" >${studentObject.registeredCourses}</td>
    `;

    count += 1;
    localStorage.setItem('count', JSON.stringify(count));

    document.getElementById(parentElement).append(tr);


    tr.addEventListener('click', (e) => {
        const studentId = e.target.getAttribute('data-label-Student-id');
        const anchor = document.createElement('a');
        anchor.href = `/admins/render/profile/student/${studentId}/${adminId}`
        anchor.click();
    })
}

const callFetchForStudents = (key, value) => {
    getStudentsByOffset(key, value)
        .then((data) => {
            console.log(data);
            const studentsArr = [...data.data.data];

            if (studentsArr.length == 0) {
                createTableRow({}, 'students-list')
            }
            studentsArr.forEach((student) => {
                createTableRow(student, 'students-list')
            });

            localStorage.setItem('students-offset', JSON.stringify(data.data.cursor));
        }).catch((error) => {
            console.log(error)
        });
}

const main = () => {
    const query = {
        key: 'null',
        value: 'null'
    }

    const tdlist = document.getElementById('students-list');
    tdlist.innerHTML = "";
    // Initialize count to 1
    let count = 1;
    localStorage.setItem('count', JSON.stringify(count));

    // Initialize offset to 0
    let offset = 0;
    localStorage.setItem('students-offset', JSON.stringify(offset));

    function resetCountAndOffset() {
        localStorage.setItem('count', JSON.stringify(1)); // Reset count to 1 explicitly
        localStorage.setItem('students-offset', JSON.stringify(0));

        count = 1;
        offset = 0;

        tdlist.innerHTML = "";
        document.getElementById('nextPage').style.display = "unset"
    }

    const selectors = [{ id: 'studentLevel', key: 'level' }, { id: 'program', key: 'program' }, { id: 'faculty', key: 'faculty' }, { id: 'session', key: 'session' }];

    callFetchForStudents(query.key, query.value);

    document.getElementById('nextPage').addEventListener('click', (e) => {
        tdlist.innerHTML = "";
        callFetchForStudents(query.key, query.value);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        resetCountAndOffset();
        selectors.forEach((selector) => {
            document.getElementById(selector.id).value = 'none'
        });
        query.key = null;
        query.value = null;
        callFetchForStudents(query.key, query.value);
    });


    selectors.forEach((selector) => {
        document.getElementById(selector.id).addEventListener('change', (e) => {
            resetCountAndOffset();
            if (e.target.value == 'none') {
                query.key = null;
                query.value = null;
            }
            else {
                query.key = selector.key;
                query.value = e.target.value.trim();
            }
            callFetchForStudents(query.key, query.value);
        });
    });
}
if (document.readyState == 'loading') document.addEventListener('DOMContentLoaded', main)
else main();