
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');

    searchBar.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = this.value;
            fetchResults(query); 
        }
    });

    // event listener per il pulsante di ricerca
    searchButton.addEventListener('click', function () {
        const query = searchBar.value;
        fetchResults(query); 
    });

    function fetchResults(query) {
        const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(query)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = document.querySelector('.results');
                resultsContainer.innerHTML = '';
                data.data.forEach(track => {
                    // per ogni traccia crea un elemento html con link cliccabili, da accompagnare all'eventuale css e allo stile della pagina
                    const trackElement = document.createElement('div');
                    trackElement.classList.add('track', 'text-white');
                    trackElement.innerHTML = /* HTML */ `
                    <div class="col">
                        <div class="card h-100 text-white small bg-transparent ">
                            <div class="card-img">
                                <a href="./album.html" class="h-100 w-100 d-block text-decoration-none ">
                                    <img src="${track.album.cover_medium}" class="rounded w-100 h-100 object-fit-cover" alt="${track.album.title}">
                                </a>    
                            </div>
                            <div class="card-body d-flex flex-column justify-content-between p-1 pt-2">
                                <a href="./artist.html?id=${track.artist.id}" class="text-white text-decoration-none">${track.artist.name}</a>
                                <a href="./album.html?id=${track.album.id}" class="text-white-50">${track.title}</a>                           
                            </div>
                        </div>
                    </div>
                    `;
                    resultsContainer.appendChild(trackElement);
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }
});
