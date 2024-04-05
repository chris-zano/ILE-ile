if (document.readyState == 'loading') document.addEventListener("DOMContentLoaded", main);
else main();

function main() {
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

        console.log(options)

        initiatePostRequest(
            '/auth/users/login',
            headers,
            options
        )
            .then(response => {
                console.log(response)
                if (response.status === 200 && response.data.message === 'success') {
                    const userData = {
                        user: response.data.userType,
                        data: response.data.user,
                        auth: "verified"
                    }

                    window.sessionStorage.setItem("auth-user", JSON.stringify(userData));

                    console.log(`/${response.data.userType}s/render/dashboards/${response.data.user.id}`)
                    window.location.href = `/${response.data.userType}s/render/dashboards/${response.data.user.id}`;

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