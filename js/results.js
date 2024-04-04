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
                    // per ogni traccia crea un elemento html con link cliccabili, da accompagnare al css e allo stile della pagina
                    const trackElement = document.createElement('div');
                    trackElement.classList.add('track', 'text-white');
                    trackElement.innerHTML = `
                        <p>
                            <a href="./artist.html?id=${track.artist.id}" class="text-white">${track.artist.name}</a> - 
                            <a href="./album.html?id=${track.album.id}" class="text-white">${track.title}</a>
                        </p>
                    `;
                    resultsContainer.appendChild(trackElement);
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }
});
