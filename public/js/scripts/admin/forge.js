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

const getStudentsByOffset = async (key, value) => {
    const moffset = localStorage.getItem('students-offset') || 0;
    const req = await fetch(`/admin/get/students/${moffset}?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`);
    console.log(`/admin/get/students/${moffset}?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`);
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
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
        <td>${count}</td>
        <td>${studentObject.studentId}</td>
        <td>${studentObject.firstName}</td>
        <td>${studentObject.lastName}</td>
        <td>${studentObject.level}</td>
        <td>${studentObject.program}</td>
        <td>${studentObject.department}</td>
        <td><button type="button" class="actionButton" data-label-type="courses" data-label-Student-id="${studentObject._id}" style="cursor: pointer; background-color: var(--blue-light); color: var(--default-white);">Courses</button></td>
        <td><button type="button" class="actionButton" data-label-type="repos" data-label-Student-id="${studentObject._id}" style="cursor: pointer; background-color: var(--blue); color: var(--default-white);">Repos</button></td>
        <td><button type="button" class="actionButton" data-label-type="files" data-label-Student-id="${studentObject._id}" style="cursor: pointer; background-color: var(--blue-dark); color: var(--default-white);">Files</button></td>
    `;

    count += 1;
    localStorage.setItem('count', JSON.stringify(count));

    document.getElementById(parentElement).append(tr);


    tr.addEventListener('click', (e) => {
        if (e.target.tagName != 'BUTTON') {
            const studentId = e.currentTarget.querySelector('[data-label-Student-id]').getAttribute('data-label-Student-id');
            // console.log('Student ID:', studentId);
            const anchor = document.createElement('a');
            anchor.href = `/students/view_profile/${studentId}`
            anchor.click();
        }
    })
}

const callFetchForStudents = (key, value) => {
    getStudentsByOffset(key, value)
        .then((data) => {
            const studentsArr = [...data.data.data];

            studentsArr.forEach((student) => {
                createTableRow(student, 'students-list')
            });

            const actionButtons = document.getElementsByClassName('actionButton');
            [...actionButtons].forEach((actionButton) => listen(actionButton, 'click', showView));

            localStorage.setItem('students-offset', JSON.stringify(data.data.cursor));
            // console.log('Offset updated:', data.data.cursor);
        }).catch((error) => {
            console.log('Error on line 23(forge.js): ', error);
        });
}

const main = () => {
    const query = {
        key: 'null',
        value: 'null'
    }

    const tdlist = document.getElementById('students-list');
    tdlist.innerHTML = "";

    function ensureCount(initialValue = 1) {
        let count = localStorage.getItem('count');
        if (count === null || count === undefined) {
            count = initialValue;
        } else {
            count = Number(count);
        }
        localStorage.setItem('count', JSON.stringify(count));
        return count;
    }

    let offset = Number(localStorage.getItem('students-offset') || 0);
    let count = ensureCount(); // Call without initialValue argument

    function resetCountAndOffset() {
        localStorage.setItem('count', JSON.stringify(1)); // Reset count to 1 explicitly
        localStorage.setItem('students-offset', JSON.stringify(0));

        count = 1;
        offset = 0;

        tdlist.innerHTML = "";
    }

    const selectors = [{ id: 'studentLevel', key: 'level' }, { id: 'program', key: 'program' }, { id: 'department', key: 'department' }];

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




if (document.readyState == 'loading') document.addEventListener('DOMContentLoaded', main())
else main();