document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedAlbums();
    loadSectionContent('Muse', '.buonasera-content');
    loadSectionContent('Coldplay', '.altro-che-ti-piace-content');
  });
  
  function loadFeaturedAlbums() {
    // possiamo modificare la selezione degli artisti o la logica di selezione
    const randomArtists = ['muse', 'coldplay', 'radiohead', 'queen', 'nirvana', 'pink floyd', 'led zeppelin', 'the beatles', 'the rolling stones', 'the doors'];
    let usedArtists = []; // tiene traccia degli artisti "usati"
  
    function getRandomArtistWithoutRepeat() { // dovrebbe selezionare un artista a caso che non è stato già selezionato ma per ora non funge
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * randomArtists.length);
      } while (usedArtists.includes(randomArtists[randomIndex]));
      return randomArtists[randomIndex];
    }
  
    const randomArtist = getRandomArtistWithoutRepeat();
    usedArtists.push(randomArtist); // in teoria dovrebbe evitare che lo stesso artista venga selezionato più volte ma non sembra funzionare
  
    const apiURL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(randomArtist)}`;
    fetch(apiURL)
        .then(response => response.json())
        .then(data => populateAlbums(data.data, '.container--album-preview .row', 12)) // limita a 4 card
        .catch(error => console.error('Error fetching featured albums: ', error));
  }
  
  function loadSectionContent(query, selector) {
    const apiURL = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(query)}`;
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const section = document.querySelector(selector);
            let row = selector === '.buonasera-content';
            section.innerHTML = '';
  
            const limitedAlbums = data.data.slice(0, 8); // limite album visualizzati
            limitedAlbums.forEach(album => {
                const albumHTML = `
                    <div class="col mb-3">
                    <a href="./album.html?id=${album.album.id}" class="h-100 d-block text-decoration-none ">
                        <div class="card h-100 text-white small 
                        ${row ? 'flex-row g-0 bg--gray' : 'bg--black-light p-0'}">
                            <div class="card-img ${row ? 'w-25' : ''}">
                                <img src="${album.album.cover_medium}" class="card-img-top w-100 h-100 object-fit-cover 
                                ${row ? 'rounded-start' : 'rounded'}" alt="${album.album.title}">
                            </div>
                            <div class=" ${row ? 'ps-3 ' : ''}card-body d-flex flex-column justify-content-between p-1 pt-2">
                                <span class="fw-bold card-title ">${album.album.title}</span>
                                ${row ? '' : `<p class="card-text text-secondary small">${album.artist.name}</p>`}
                                
                            </div>
                        </div>
                    </a>    
                    </div>
                `;
                section.innerHTML += albumHTML;
            });
        })
        .catch(error => console.error(`Error fetching content for ${query}: `, error));
  }
  
  function populateAlbums(albums, selector, limit) {
    const section = document.querySelector(selector);
    const limitedAlbums = data.data.slice(0, 6); // limite album visualizzati
    albums.slice(0, limit).forEach(album => {
        const albumHTML = `
            <div class="col mb-3">
                <div class="card h-100">
                    <img src="${album.album.cover_medium}" class="card-img-top" alt="${album.album.title}">
                    <div class="card-body">
                        <h5 class="card-title">${album.album.title}</h5>
                        <p class="card-text">${album.artist.name}</p>
                        <a href="./album.html?id=${album.album.id}" class="btn btn-primary">View Album</a>
                    </div>
                </div>
            </div>
        `;
        section.innerHTML += albumHTML;
    });
  }
  
