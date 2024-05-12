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

function getId(id) {
    return document.getElementById(id);
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

if (themeToggleBtn.getAttribute('data-enabled') == "true" && (lsThemeValue) == true) {
    console.log(themeToggleBtn.getAttribute('data-enabled') === String(lsThemeValue) === "true");
    console.log(themeToggleBtn.getAttribute('data-enabled'), String(lsThemeValue));
    
    root.style.setProperty("--text", "#f6eef6")
    root.style.setProperty("--background", "#292929")
    root.style.setProperty("--background-main", "#363636")
    root.style.setProperty("--white", "#131313")
    root.style.setProperty("--primary", "#3074d9")
    root.style.setProperty("--secondary", "#742774")
    root.style.setProperty("--accent", "#4eda51")
    root.style.setProperty("--red", "#4eda51")
}
else {
    console.log(themeToggleBtn.getAttribute('data-enabled') === String(lsThemeValue));
    console.log(themeToggleBtn.getAttribute('data-enabled'), String(lsThemeValue));

    root.style.setProperty("--text", "#051e0e")
    root.style.setProperty("--background", "#f2f2f2")
    root.style.setProperty("--white", "#ffffff")
    root.style.setProperty("--primary", "#3074d9")
    root.style.setProperty("--secondary", "#54b1b3")
    root.style.setProperty("--accent", "#57b0e0")
    root.style.setProperty("--red", "#ac0000")
}