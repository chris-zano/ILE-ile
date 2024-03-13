
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
 * redirect from the current page to the dashboard
 * @param {String} currentPageUrl current pages url
 * @param {String} adminId admnistrator's unique ID
 * @returns {ObjectConstructor}
 */
async function redirectToDashboard(currentPageUrl, adminId) {
    console.log(currentPageUrl.trim(), adminId.trim());

    const headers = {
        'Content-Type': 'application/json',
        'u-a-k': adminId.trim(),
        'r-a-o': currentPageUrl.trim()
    };
    console.log(headers);

    const req = await fetch(`/admin/dashboard?redirect=t&&adminId=${adminId.trim()}`, {method: "GET", headers: headers});
    const res = await req.json();

    const status = req.status;
    return {
        status,
        data: res
    };

}

function getId(id) {
    return document.getElementById(id);
}

console.log("Util is loaded ");
