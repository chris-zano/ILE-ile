/**
 * 
 * @param {Event} event 
 */
const handleCarouselCardClick = (event) => {
    const targetBtn = event.target;
    const targetparent = targetBtn.parentElement.parentElement;

    if (!targetparent.classList.contains("active")) {
        let activeBtn = document.querySelector(".carousel-card.active");
        activeBtn.classList.remove("active");
        targetparent.classList.add("active");
    }

    //handle fetching data related to course code
    console.log(targetBtn.getAttribute("data-code"));
}

const handleCheckFormSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    const checkedValues = [...(target.querySelectorAll("input[type='checkbox']:checked"))].map((checkbox) => checkbox.value);
    console.log(checkedValues)
    
    // checkedValues.forEach(checkbox => {
    //     console.log(checkbox.checked);
    // })
}

const organiseMain = () => {
    const carouselCodes = [...(document.getElementsByClassName("data-courseCode"))];
    const form = document.getElementById("check-form")
    
    carouselCodes.forEach(card => {
        return card.addEventListener("click", (event) => handleCarouselCardClick(event));
    });

    form.addEventListener("submit", (event) => {
        return handleCheckFormSubmit(event);
    })

}

document.addEventListener("DOMContentLoaded", organiseMain)