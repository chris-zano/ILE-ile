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

    document.getElementById("add-student").addEventListener("submit", (e) => {
        e.preventDefault();

        const studentId = document.getElementById("studentId").value;
        const studentIdRegEexp = /^\d{10}$/;

        if (!studentIdRegEexp.test(studentId)) {
            document.getElementById("studentId").style.border = "1px solid var(--red)"
            toast("Invalid student Id format")
            return;
        }

        e.target.submit();
    })

}

if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main()