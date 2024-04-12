const socket = io();


const search = () => {
    const globalSearchBtn = document.getElementById('searchBtn');

    globalSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toast("Global Search triggered");

        const category = document.getElementById("search-category").value;
        const searchInput = document.getElementById("search-input").value;

        if (category == "none") {
            toast("Please Choose a Category");
        }
        else {
            console.log("Search: ", searchInput);
            console.log("Category: ", category);

            socket.emit('search', { category, searchInput });

            socket.on('searchResults', (searchResults) => {
                console.log(searchResults);
                socket.disconnect();
            })
        }
    });
}



if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", search);
else search();