if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
else main();


function main() {
    getId('createAdmin-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const adminId = getId('adminId').value;
        const firstName = getId('firstName').value;
        const lastName = getId('lastName').value;
        const department = getId('department').value;
        const password = getId('password').value;
        const role = getId('role').value;

        const options = { adminId, firstName, lastName, department, password, role };
        const headers = { 
            'Ur-u-a': 'y', 
            'Content-Type': 'application/json'
        };

        initiatePostRequest(
            '/admins/create_new_admnistrator',
            headers,
            options
        ).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    })

}