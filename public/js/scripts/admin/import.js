const main = () => {
    const programSelect = document.getElementById('program');
    const facultyInput = document.getElementById('faculty');

    const programToFacultyMap = {
        "BSc. Computer Engineering": "Engineering",
        "BSc. Telecom Engineering": "Engineering",
        "BSc. Computer Science": "FoCIS",
        "Bsc. Information Technology": "FoCIS"
    };

    function updateFaculty() {
        const selectedProgram = programSelect.value;
        const correspondingFaculty = programToFacultyMap[selectedProgram];
        facultyInput.value = correspondingFaculty || '';
    }

    programSelect.addEventListener("change", updateFaculty);

}

if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main()