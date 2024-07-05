const adminId = JSON.parse(window.sessionStorage.getItem("auth-user")).data.id || undefined
/**
 * Fetches and returns the coursess for a given registration code.
 * if no courses have been assigned, it loads the available courses to be registered.
 * @param {String} code the registratio code
 * @return {Promise<void>} the status and json of the response
 */
const getCoursesForRegistrationCode = async (code) => {
    const url = `/admins/get/registration-code-courses/${adminId}?rcode=${encodeURIComponent(code)}`;
    try {

        const response = await fetch(url);
        const status = response.status;
        const data = await response.json();

        return {status, data}
    }
    catch (error) {
        console.log(error)
    }
}

/**
 * Sets or updates the courrses for a given registration code
 * @param {String} code the registration code
 * @param {Array} course_codes the selected course codes for this registration code
 * @return {Promise<void>} the status and json of the response
 */
const setCoursesForRegistrationCode = async (code = "", course_codes = []) => {
    const url = `/admins/set/registration-code-courses/${adminId}?rcode=${encodeURIComponent(code)}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ courses: course_codes })
        });
        const status = response.status;
        const data = await response.json();
        
        return {status, data}
    } catch (error) {
        console.log(error);
    }
}

/**
 * Handles fetching courses for a specfied course code.
 * It extracts the `registration code` from 
 * ```js
 * [htmlButtonElement].querySeletor("data-code")
 * ```
 * It changes the visual appearance of the selected button signifying that it is active.
 * 
 * It awaits response from a fetch request and displays success or error info on the screen
 * @async
 * @param {Event} event 
 */
const handleCarouselCardClick = async (button) => {
    const targetBtn = button
    const targetparent = targetBtn.parentElement.parentElement;
    const rCode = targetBtn.getAttribute("data-code");

    if (!targetparent.classList.contains("active")) {
        let activeBtn = document.querySelector(".carousel-card.active");
        activeBtn.classList.remove("active");
        targetparent.classList.add("active");
    }

    //handle fetching data related to course code
    const response = await getCoursesForRegistrationCode(rCode);
    const doc = response.data.doc;
    if (response.status !== 200) {
        Toast_Notification.showError("Document not found");
        return;
    }

    if (doc === null){
        Toast_Notification.showInfo("No courses have been registered with this course code.");
        return;
    }
    console.log(doc);    
}

const handleCheckFormSubmit = async (event) => {
    event.preventDefault();

    let activeRegCode = document.querySelector(".carousel-card.active")
        .querySelector("h3").getAttribute("data-code")
    const target = event.target;
    const checkedValues = [...(target.querySelectorAll("input[type='checkbox']:checked"))].map((checkbox) => checkbox.value);

    const response = await setCoursesForRegistrationCode(activeRegCode, [...checkedValues]);

    if (response.status !== 200) {
        Toast_Notification.showError(response.data.message);
        return;
    }

    Toast_Notification.showSuccess(response.data.message);

}

const organiseMain = () => {
    const courseGroups = JSON.parse(document.getElementById("courses-fetch-and-unmount").innerText);
    // const carouselCodes = [...(document.getElementsByClassName("data-courseCode"))];
    const form = document.getElementById("check-form");

    console.log(courseGroups)

    document.getElementById("courses-fetch-and-unmount").innerText = ""
    document.getElementById("courses-fetch-and-unmount").innerHTML = ""

    form.addEventListener("submit", async (event) => {
        if (document.querySelector("#change-selection").classList.contains("btn-disabled")) {
            return event.preventDefault();
        }
        return await handleCheckFormSubmit(event);
    })

}

document.addEventListener("DOMContentLoaded", organiseMain)