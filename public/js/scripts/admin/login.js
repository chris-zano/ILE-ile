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
            '/auth/admin/loginwithusernameandpassword',
            headers,
            options
        )
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
        console.log("hello ILE");
    })
}