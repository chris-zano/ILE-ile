if (document.readyState == 'loading') document.addEventListener("DOMContentLoaded", main);
else main();

function main() {
    document.getElementById('login-form').addEventListener("submit", (e) => {
        e.preventDefault();

        console.log(document.getElementById('adminId').value);
        console.log(document.getElementById('password').value);
        const options = {
            adminId: document.getElementById('adminId').value,
            password: document.getElementById('password').value
        }

        const headers = {
            'Ur-u-a': 'y',
            'Content-Type': 'application/json'
        }

        initiatePostRequest(
            '/auth/admins/loginwithusernameandpassword',
            headers,
            options
        )
            .then(response => {
                console.log(response);

                if (response.status === 200 && response.data.message === 'success') {
                    const url = new URL(window.location.href);

                    redirectToDashboard(url.pathname, response.data.user.adminId)
                    .then((res)=>{
                        if (res.status === 200 && res.data.message === 'success') {
                            window.location.href = res.data.url;
                        }
                        else {
                            alert('Invalid username or passwword!!!');
                        }
                    })
                    .catch((error) => console.log(error));
                }
            })
            .catch(error => {
                console.log(error);
            });
        console.log("hello ILE");
    })
}