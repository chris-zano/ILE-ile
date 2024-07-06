const studentId = JSON.parse(window.sessionStorage.getItem("auth-user")).data.id || undefined;
const rcode = JSON.parse(window.sessionStorage.getItem("auth-user")).data.registeredCourses || undefined;

const handleCheckFormSubmit = async (courses) => {
    const url = `/students/set/registration/${studentId}?rcode=${rcode}`;

    try {
        const response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({courses})
        });

        const status = response.status;
        const data = await response.json();
        console.log(data);

        if (status !== 200) {
            return false;
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const registerMain = async () => {
    const form = document.getElementById("check-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const target = event.target
        const checkedValues = [...(target.querySelectorAll("input[type='checkbox']:checked"))].map((checkbox) => checkbox.value);
        
       const data = await handleCheckFormSubmit(checkedValues);
       console.log("Return value is set as: ", data);
    });
}
document.addEventListener("DOMContentLoaded", registerMain);