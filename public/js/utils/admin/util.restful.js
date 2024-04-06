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