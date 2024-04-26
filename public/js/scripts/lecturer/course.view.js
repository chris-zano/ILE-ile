const createNewChapter = async() => {
    const courseId = document.getElementById('courseId').value;
    const courseVersion = document.getElementById('v').value;

    console.log(courseId, courseVersion)
}


const main = () => {
    const addNewChptBtn = document.getElementById("add-chapter");

    addNewChptBtn.addEventListener("click", createNewChapter);
}

document.addEventListener("DOMContentLoaded", main);