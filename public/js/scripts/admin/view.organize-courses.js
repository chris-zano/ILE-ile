/**
 * Fetches and returns the coursess for a given registration code.
 * if no courses have been assigned, it loads the available courses to be registered.
 * @param {String} code the registratio code
 * @return {Promise<void>} the status and json of the response
 */
const getCoursesForRegistrationCode = async (code) => {
    const url = encodeURI(`/admin/get/registration-code-courses?rcode=${code}`);
    console.log(url);
}

/**
 * Sets or updates the courrses for a given registration code
 * @param {String} code the registration code
 * @param {Array} course_codes the selected course codes for this registration code
 * @return {Promise<void>} the status and json of the response
 */
const setCoursesForRegistrationCode = async (code = "", course_codes = []) => {
    const url = encodeURI(`/admin/set/registration-code-courses?rcode=${code}`);
    console.log(url);
    console.log(course_codes)
}

/**
 * 
 * @param {Event} event 
 */
const handleCarouselCardClick = (event) => {
    const targetBtn = event.target;
    const targetparent = targetBtn.parentElement.parentElement;
    const rCode = targetBtn.getAttribute("data-code"); // registration code

    if (!targetparent.classList.contains("active")) {
        let activeBtn = document.querySelector(".carousel-card.active");
        activeBtn.classList.remove("active");
        targetparent.classList.add("active");
    }

    //handle fetching data related to course code
    getCoursesForRegistrationCode(rCode)
}

const handleCheckFormSubmit = (event) => {
    event.preventDefault();

    let activeRegCode = document.querySelector(".carousel-card.active")
    .querySelector("h3").getAttribute("data-code")
    const target = event.target;
    const checkedValues = [...(target.querySelectorAll("input[type='checkbox']:checked"))].map((checkbox) => checkbox.value);

    console.log(activeRegCode)
    setCoursesForRegistrationCode(activeRegCode, [...checkedValues])
}

const organiseMain = () => {
    const courseGroups = JSON.parse(document.getElementById("courses-fetch-and-unmount").innerText);
    const carouselCodes = [...(document.getElementsByClassName("data-courseCode"))];
    const form = document.getElementById("check-form");

    console.log(courseGroups)
    document.getElementById("courses-fetch-and-unmount").innerText = ""
    document.getElementById("courses-fetch-and-unmount").innerHTML = ""
    carouselCodes.forEach(card => {
        return card.addEventListener("click", (event) => handleCarouselCardClick(event));
    });

    form.addEventListener("submit", (event) => {
        return handleCheckFormSubmit(event);
    })

}

document.addEventListener("DOMContentLoaded", organiseMain)