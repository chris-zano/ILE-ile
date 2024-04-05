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

        initiatePostRequest(
            '/auth/users/login',
            headers,
            options
        )
            .then(response => {
                if (response.status === 200 && response.data.message === 'success') {
                    const {_id, adminId, role} = response.data;
                    localStorage.setItem('login-state', JSON.stringify({
                        isLoggedIn: true,
                        _id: _id,
                        adminId: adminId,
                        role: role
                    }));

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