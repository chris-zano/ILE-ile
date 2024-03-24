if (document.readyState == 'loading')document.addEventListener('DOMContentLoaded', main())
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

    getStudentsByOffset(offset)
    .then((data) => {
        console.log(data);
        localStorage.setItem('students-offset', JSON.stringify(data.data.cursor));
    }).catch((error) => {
        console.log('Error on line 23(forge.js): ', error);
    })
    // const offset = studentsListContainer.getAttribute('data-offset');


}

