const deletePost = async (button, id) => {
    const url = `/admins/announcements/delete?id=${id}`;
    const response = await fetch(url, {method: "DELETE"});
    const data = await response.json();

    window.location.reload();
}

const announcemetMain = async () => {
   document.getElementById('show-form').addEventListener('click', (e) => {
    document.getElementById('form-container').classList.toggle('hidden');
    document.getElementById('notifications-container').classList.toggle('hidden')
    e.target.textContent = e.target.textContent === 'Create New' ? 'Show History': 'Create New'
   })

}



document.addEventListener('DOMContentLoaded', announcemetMain);