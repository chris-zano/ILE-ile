let userdata = window.sessionStorage.getItem('auth-user') || undefined;

if (!userdata) window.location.replace('/login');

const adminId = JSON.parse(userdata).data.id;


function listen(element, event, callback) {
    return element.addEventListener(event, callback);
}

const modalWrite = (message) => {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay')
    const modalContent = document.createElement('div');
    modalContent.classList.add('popup');

    modalContent.style.display = 'block';
    modalContent.innerHTML = `
        <div id="close">&#10060;</div>
    `;

    const closeBtn = modalContent.querySelector('#close');
    closeBtn.classList.add('close');
    closeBtn.addEventListener('click', () => {
        modalContent.style.display = 'none';
        document.getElementById('wrapper-main').classList.remove('blur');
        document.getElementById('wrapper-main').style.pointerEvents = 'inherit';
    })

    const paragraph = document.createElement('p');
    paragraph.textContent = message;

    modalContent.appendChild(paragraph);
    document.getElementById('wrapper-main').classList.add('blur');
    document.getElementById('wrapper-main').style.pointerEvents = 'none';

    document.body.appendChild(modalContent);

    return;
};

const modalRender = (array) => {
    // TODO: render the students data here (courrses, repos, files etc);
    const overlay = document.createElement('div');
    overlay.classList.add('overlay')
    const modalContent = document.createElement('div');
    modalContent.classList.add('popup');

    modalContent.style.display = 'block';
    modalContent.innerHTML = `
        <div id="close">&#10060;</div>
    `;

    const closeBtn = modalContent.querySelector('#close');
    closeBtn.classList.add('close');
    closeBtn.addEventListener('click', () => {
        modalContent.style.display = 'none';
        document.getElementById('wrapper-main').classList.remove('blur');
        document.getElementById('wrapper-main').style.pointerEvents = 'inherit';
    })

    for (let object of array) {
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                const value = object[key];

                const paragraph = document.createElement('p');
                paragraph.textContent = `${key}: ${value}`;

                modalContent.appendChild(paragraph);
            }
        }
    }
    document.getElementById('wrapper-main').classList.add('blur');
    document.getElementById('wrapper-main').style.pointerEvents = 'none';

    document.body.appendChild(modalContent);

};

async function showView(e) {
    const studentId = e.target.getAttribute('data-label-student-id');
    const action = e.target.getAttribute('data-label-type');

    const req = await fetch(`/admin/lecturers/get/${action}?lecturerId=${studentId.trim()}`)
    const res = await req.json();
    const status = req.status;

    if (status == 403 || status == 500) {
        return;
    }

    if (res.doc.length == 0) {
        return modalWrite('No data available for this lecturer');
    }

    for (let item of res.docs) {
    }
    return;
}

const getLecturersByOffset = async (key, value) => {
    const moffset = localStorage.getItem('tutors-offset') || 0;
    const req = await fetch(`/admin/get/lecturers/${moffset}?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`);
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
        <td>No</td>
        <td>data</td>
        <td>available</td>
        <td>Import</td>
        <td>data</td>
        `;
        document.getElementById(parentElement).append(tr);
        document.getElementById('nextPage').style.display = "none"
        return;
    }
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
        <td data-label-Lecturer-id="${studentObject._id}">${count}</td>
        <td data-label-Lecturer-id="${studentObject._id}">${studentObject.lecturerId}</td>
        <td data-label-Lecturer-id="${studentObject._id}">${studentObject.firstName}</td>
        <td data-label-Lecturer-id="${studentObject._id}">${studentObject.lastName}</td>
        <td data-label-Lecturer-id="${studentObject._id}">${studentObject.faculty}</td>
    `;

    count += 1;
    localStorage.setItem('count', JSON.stringify(count));

    document.getElementById(parentElement).append(tr);

    tr.addEventListener('click', (e) => {
        const lecturerId = e.target.getAttribute('data-label-Lecturer-id');
        const anchor = document.createElement('a');
        anchor.href = `/admins/render/profile/tutor/${lecturerId}/${adminId}`
        anchor.click();
    })
}

const callfetchForLetcurers = (key, value) => {
    getLecturersByOffset(key, value)
        .then((data) => {
            const studentsArr = [...data.data.data];

            if (studentsArr.length == 0) {
               createTableRow({}, 'lecturers-list')
            }
            studentsArr.forEach((student) => {
                createTableRow(student, 'lecturers-list')
            });

            const actionButtons = document.getElementsByClassName('actionButton');
            [...actionButtons].forEach((actionButton) => listen(actionButton, 'click', showView));

            localStorage.setItem('tutors-offset', JSON.stringify(data.data.cursor));
        }).catch((error) => {
            console.log(error)
        });
}

const main = () => {
    const query = {
        key: 'null',
        value: 'null'
    }

    const tdlist = document.getElementById('lecturers-list');
    tdlist.innerHTML = "";
    // Initialize count to 1
    let count = 1;
    localStorage.setItem('count', JSON.stringify(count));

    // Initialize offset to 0
    let offset = 0;
    localStorage.setItem('tutors-offset', JSON.stringify(offset));

    function resetCountAndOffset() {
        localStorage.setItem('count', JSON.stringify(1)); // Reset count to 1 explicitly
        localStorage.setItem('tutors-offset', JSON.stringify(0));

        count = 1;
        offset = 0;

        tdlist.innerHTML = "";
        document.getElementById('nextPage').style.display = "unset"
    }

    const selectors = [{ id: 'faculty', key: 'faculty' }];

    callfetchForLetcurers(query.key, query.value);

    document.getElementById('nextPage').addEventListener('click', (e) => {
        tdlist.innerHTML = "";
        callfetchForLetcurers(query.key, query.value);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        resetCountAndOffset();
        selectors.forEach((selector) => {
            document.getElementById(selector.id).value = 'none'
        });
        query.key = null;
        query.value = null;
        callfetchForLetcurers(query.key, query.value);
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
            callfetchForLetcurers(query.key, query.value);
        });
    });




}

if (document.readyState == 'loading') document.addEventListener('DOMContentLoaded', main)
else main();