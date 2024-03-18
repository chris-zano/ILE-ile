if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
else main();

function getValues() {
    const id = getId('id').value;
    const v = getId('v').value;
    const adminId = getId('adminId').value;
    const firstName = getId('firstName').value;
    const lastName = getId('lastName').value;
    const department = getId('department').value;
    const password = getId('password').value;
    const role = getId('role').value;

    const options = { v, id, adminId, firstName, lastName, department, password, role };
    const headers = {
        'Ur-u-a': 'y',
        'Content-Type': 'application/json'
    };
    return { options, headers }
}

function main() {
    getId('createAdmin-form').addEventListener('submit', (e) => {
        e.preventDefault();

        initiatePostRequest(
            '/admins/update_admin',
            getValues().headers,
            getValues().options
        ).then((response) => {
            if (response.status === 200 && response.data === 'okay') {
                const url = new URL(window.location.href);
                const id = url.searchParams.get('id');
                const adminId = url.searchParams.get('adminId');

                window.location.href = `/admin/dashboards?id=${id}&&adminId=${adminId}`;
            }
            else {
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error);
        });
    });

    getId('delete_btn').addEventListener('click', (e) => {
        e.preventDefault();

        initiatePostRequest(
            '/admins/delete_admin',
            getValues().headers,
            getValues().options
        ).then((response) => {
            if (response.status === 200 && response.data === 'okay') {
                console.log(response);
                // const url = new URL(window.location.href);
                // const id = url.searchParams.get('id');
                // const adminId = url.searchParams.get('adminId');

                // window.location.href = `/admin/dashboards?id=${id}&&adminId=${adminId}`;
            }
            else {
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error);
        });
    })

}