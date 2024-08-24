/**
 * 
 * @param {String} url_endpoint of the format { '/api/end_point' }
 * @param {ObjectConstructor} headers request headers
 * @param {ObjectConstructor} options body
 * @returns {ObjectConstructor} { status_code ( as status ), data }
 */
async function initiatePostRequest(url_endpoint, headers, options) {
    const res = await fetch(url_endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(options)
    });

    const status = res.status;
    const data = await res.json();

    return {
        status: status,
        data: data
    }
}

/**
 * 
 * @param {URL} url - the api endpoint to navigate to 
 * @returns {Object} - response object
 */
const fetchData = async (url) => {
    const headers = { "Content-Type": "application/json" };
    try {
        const response = await fetch(url);

        return { status: response.status, data: await response.json() };
    }
    catch (error) {
    }
}

function getId(id) {
    return document.getElementById(id);
}


const checkAndRenderImageBackground = () => {
    const image = document.getElementById("profile-main");
    const images = document.querySelectorAll("img");

    for (let image of images) {
        image.addEventListener("load", () => {
        });

        image.addEventListener("error", (e) => {
            image.setAttribute("src", "/images/system/logo");
        });
    }

    image.addEventListener("load", () => {
        // console.log("image has successfully loaded");
    })

    image.addEventListener("error", (e) => {
        // console.log("error loading image");
        image.setAttribute("src", "/images/system/logo")
    })
}
// checkAndRenderImageBackground();

const navigateToPage = (position = 0) => {
    location.href = document.getElementsByClassName("header_nav-a")[position].getAttribute('href');
}

const toggleThemeShortcut = () => {
    document.getElementById("toggle").click();
}


const dateComponentsToMilliseconds = ({ year, month, day, hours, minutes, seconds }) => {
    const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const m = monthsArray.indexOf(month) || null;

    if (!m) return null;
    try {
        const date = new Date(year, month - 1, day, hours, minutes, seconds);
        return date.getTime();
    }
    catch (error) {
        console.log(error);
        return null
    }
}

const millisecondsToDateComponents = (milliseconds) => {
    const time = new Date(milliseconds);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return {
        hours: hours < 10 ? "0" + hours : hours,
        minutes: minutes < 10 ? "0" + minutes : minutes,
        seconds: seconds < 10 ? "0" + seconds : seconds,
        timeStamp: time.getTime()
    }
}

const getSystemDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear(),
        hours: hours < 10 ? "0" + hours : hours,
        minutes: minutes < 10 ? "0" + minutes : minutes,
        seconds: seconds < 10 ? "0" + seconds : seconds,
        timeStamp: date.getTime()
    };
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayOfWeek = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    let hour = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const period = hour >= 12 ? 'pm' : 'am';

    if (hour > 12) {
        hour -= 12;
    } else if (hour === 0) {
        hour = 12;
    }

    const daySuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // special case for 11th-13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${dayOfWeek}, ${day}${daySuffix(day)} ${month}, ${year} : ${hour}:${minutes} ${period}`;
}
console.log("Util is loaded ");

const toast = (message) => {
    const pop = document.createElement('div');
    pop.innerHTML = `
    <div id="toast" class="toast show">
        <div id="toastText" class="toast-text">${message}</div>
    </div>
    `;
    document.body.appendChild(pop);
    setTimeout(function () {
        document.body.removeChild(pop)
    }, 3000);
}

const isLoggedin = window.sessionStorage.getItem("auth-user")

if (!isLoggedin) {
    window.location.href = '/login'
}

// setting theme

//get both local storage value and inbutton value
const themeToggleBtn = document.getElementById("toggle");
const lsThemeValue = JSON.parse(window.localStorage.getItem('toggle-btn-enabled'));
const root = document.documentElement

// if (themeToggleBtn.getAttribute('data-enabled') == "true" && (lsThemeValue) == true) {
//     // console.log(themeToggleBtn.getAttribute('data-enabled') === String(lsThemeValue) === "true");
//     // console.log(themeToggleBtn.getAttribute('data-enabled'), String(lsThemeValue));

//     root.style.setProperty("--text", "#f6eef6")
//     root.style.setProperty("--background", "#292929")
//     root.style.setProperty("--background-main", "#363636")
//     root.style.setProperty("--white", "#131313")
//     root.style.setProperty("--primary", "#3074d9")
//     root.style.setProperty("--secondary", "#742774")
//     root.style.setProperty("--accent", "#4eda51")
//     root.style.setProperty("--red", "#4eda51")
// }