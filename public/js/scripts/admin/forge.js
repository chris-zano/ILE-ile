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
    const offset = studentsListContainer.getAttribute('data-offset');

    getStudentsByOffset(offset.trim())
    .then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log('Error on line 23(forge.js): ', error);
    })

}

