if (document.readyState == 'loading') document.addEventListener("DOMContentLoaded", main);
else main();

function main() {

    function createValidAuth() {
        function generateSerialString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        const now = new Date().getTime();
        const serialString = generateSerialString(12);
        const auTimestamp = `AU-${now}::${serialString}`;
        localStorage.setItem("x03n8af6", JSON.stringify(auTimestamp))
    }

    document.getElementById('login-form').addEventListener("submit", (e) => {
        e.preventDefault();

        const options = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }

        const headers = {
            'Ur-u-a': 'y',
            'Content-Type': 'application/json'
        }

        initiatePostRequest(
            '/auth/users/login',
            headers,
            options
        )
            .then(response => {
                (response)
                if (response.status === 200 && response.data.message === 'success') {
                    const userData = {
                        user: response.data.userType,
                        data: response.data.user,
                        auth: "verified"
                    }

                    window.sessionStorage.setItem("auth-user", JSON.stringify(userData));
                    createValidAuth();
                    window.location.replace(`/${response.data.userType}s/render/dashboards/${response.data.user.id}`);

                }
                else {
                    window.alert('Invalid Id or Password');
                }
            })
            .catch(error => {
                console.log(error);
            });
    })
}

/**
 * 
 * @param {String} url_endpoint of the format { '/api/end_point' }
 * @param {ObjectConstructor} headers request headers
 * @param {ObjectConstructor} options body
 * @returns {ObjectConstructor} { status_code ( as status ), data }
 */
async function initiatePostRequest(url_endpoint, headers, options) {
    ("here: 1")
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