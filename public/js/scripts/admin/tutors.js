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
    const lecturerId = e.target.getAttribute('data-label-Lecturer-id');

    const req = await fetch(`/admin/lecturers/get/courses?id=${lecturerId.trim()}`)
    const res = await req.json();
    const status = req.status;

    if (status == 403 || status == 500) {
        console.log('An error occured.\nPlease Try again');
        return;
    }

    if (res.doc.length == 0) {
        return modalWrite('No data available for this lecturer');
    }

    modalRender(res.doc);
    return;
}

const getStudentsByOffset = async (key, value) => {
    const moffset = localStorage.getItem('tutors-offset') || 0;
    const req = await fetch(`/admin/get/lecturers/${moffset}?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`);
    console.log(`/admin/get/letcurers/${moffset}?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`);
    const res = await req.json();
    const status = req.status;

    return {
        status: status,
        data: res
    }
}

const createTableRow = (lecturerObject, parentElement) => {
    let count = Number(localStorage.getItem('count-2')) || 1;
    const tr = document.createElement('tr');

    tr.style.cursor = 'pointer';
    tr.innerHTML = `
        <td>${count}</td>
        <td>${lecturerObject.lecturerId}</td>
        <td>${lecturerObject.firstName}</td>
        <td>${lecturerObject.lastName}</td>
        <td>${lecturerObject.faculty}</td>
        <td><button type="button" class="actionButton btn-courses" data-label-type="courses" data-label-Lecturer-id="${lecturerObject._id}" ">Courses</button></td>
    `;

    count += 1;
    localStorage.setItem('count-2', JSON.stringify(count));

    document.getElementById(parentElement).append(tr);


    tr.addEventListener('click', (e) => {
        if (e.target.tagName != 'BUTTON') {
            const lecturerId = e.currentTarget.querySelector('[data-label-Lecturer-id]').getAttribute('data-label-Lecturer-id');
            // console.log('Student ID:', lecturerId);
            const anchor = document.createElement('a');
            anchor.href = `/lecturers/view_profile/${lecturerId}`
            anchor.click();
        }
    })
}

const callFetchForStudents = (key, value) => {
    getStudentsByOffset(key, value)
        .then((data) => {
            const lecturersArr = [...data.data.data];

            lecturersArr.forEach((lecturer) => {
                createTableRow(lecturer, 'lecturers-list')
            });

            const actionButtons = document.getElementsByClassName('actionButton');
            [...actionButtons].forEach((actionButton) => listen(actionButton, 'click', showView));

            localStorage.setItem('tutors-offset', JSON.stringify(data.data.cursor));
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

    const tdlist = document.getElementById('lecturers-list');
    tdlist.innerHTML = "";
    // Initialize count to 1
    let count = 1;
    localStorage.setItem('count-2', JSON.stringify(count));

    // Initialize offset to 0
    let offset = 0;
    localStorage.setItem('tutors-offset', JSON.stringify(offset));
    

    const selectors = [{ id: 'faculty', key: 'faculty' }];

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