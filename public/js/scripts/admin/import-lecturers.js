const main = () => {
    console.log("Lecturers hold")

    document.getElementById("add-tutor").addEventListener("submit", (e) => {
        e.preventDefault();

        const lecturerId = document.getElementById("lecturerId").value;
        const lecturerIdRegEexp = /^TU-\d{3}[A-Za-z0-9]*$/;

        if (!lecturerIdRegEexp.test(lecturerId)) {
            document.getElementById("lecturerId").style.border = "1px solid var(--red)"
            toast("Invalid Id format")
            return;
        }

        e.target.submit();
    })
}

if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", main);
else main()