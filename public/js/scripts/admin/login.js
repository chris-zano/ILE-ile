if (document.readyState == 'loading') document.addEventListener("DOMContentLoaded", main);
else main();

function main() {
    document.getElementById('login-form').addEventListener("submit", (e)=> {
        e.preventDefault();

        const options = {
            adminId: document.getElementById('adminId').value,
            password: document.getElementById('password').value
        }

        const headers = {
            'Ur-u-a': 'y',
            'Content-Type': 'application/json'
        }

        initiatePostRequest(
            'http://localhost:5050/auth/admin/login-with-username-and-password',
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