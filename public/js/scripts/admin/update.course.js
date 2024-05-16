const main = () => {
    const faculty = document.getElementById('faculty');

    document.getElementById("add-course").addEventListener("submit", (e) => {
        e.preventDefault();

        if (faculty.value == "none") {
            toast("Select a Faculty");
            return;
        }

        document.getElementById("add-course").submit()
    })
    
    faculty.addEventListener("change", async (e)=> {
        const req = await fetch(`/admin/get/lecturers/0?key=faculty&value=${faculty.value}`);
        const res = await req.json();

        res.data.forEach(lecturer => {
            const option = document.createElement('option');
            option.value = `${lecturer.lecturerId}_${lecturer.firstName} ${lecturer.lastName}`;
            option.textContent = `${lecturer.firstName} ${lecturer.lastName}`;
            document.getElementById('lecturer').append(option)
        });
    })
}

document.addEventListener("DOMContentLoaded", main);