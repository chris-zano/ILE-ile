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
                if (response.status === 200 && response.data.message === 'success') {
                    const {_id, adminId} = response.data;

                    window.location.href = `/admin/dashboards?id=${_id}&&adminId=${adminId}`;
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