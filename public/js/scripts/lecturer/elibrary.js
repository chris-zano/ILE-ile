document.addEventListener("DOMContentLoaded", async () => {
    const resourcesList = document.getElementById('resources-list');

    try {
        // Fetch data from the server
        const response = await fetch('/library/get');
        const result = await response.json();

        if (response.ok && result.data && result.data.length > 0) {
            // Clear any existing list items
            resourcesList.innerHTML = '';

            // Iterate over the fetched resources and create list items
            result.data.forEach(resource => {
                const listItem = document.createElement('li');
                listItem.className = 'resource-card';

                listItem.innerHTML = `
                    <article class="resource-info">
                        <img src="/library/files/?filename=${resource.thumbnail}" alt="${resource.type}" />
                        <div class="resource-details">
                            <div class="resource-title">${resource.title}</div>
                            <div class="resource-author">${resource.author}</div>
                            <span class="resource-year">${resource.year}</span>
                            <div class="download-btn">
                                <button type="button">
                                    <a href="/library/files/?filename=${resource.file}" download="${resource.title}">Download</a>
                                </button>
                            </div>
                        </div>
                    </article>
                `;

                // Append the newly created list item to the resources list
                resourcesList.appendChild(listItem);
            });

            // Optionally, add event listeners for the delete buttons if needed
            document.querySelectorAll('.delete-resource').forEach(button => {
                button.addEventListener('click', handleDeleteResource);
            });
        } else {
            resourcesList.innerHTML = '<li>No resources found.</li>';
        }
    } catch (error) {
        console.error('Error fetching resources:', error);
        resourcesList.innerHTML = '<li>Error fetching resources.</li>';
    }
});

// Optional: Handle the deletion of resources
async function handleDeleteResource(event) {
    event.preventDefault();
    const resourceId = event.target.getAttribute('data-id');
    
    try {
        const response = await fetch(`/library/delete/${resourceId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove the corresponding list item from the DOM
            event.target.closest('.resource-card').remove();
        } else {
            console.error('Failed to delete resource');
        }
    } catch (error) {
        console.error('Error deleting resource:', error);
    }
}
