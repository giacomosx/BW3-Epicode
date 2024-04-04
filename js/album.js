// carica i dettagli dell'album e la lista delle tracce sulla pagina dell'album
function loadAlbumDetails() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const albumId = urlParams.get('id') || '302127'; // ho messo un id di default giusto per avere qualcosa -- @g
  
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
      .then(response => response.json())
      .then(album => {
        // imposta i dettagli dell'album
        document.querySelector(".container--album-info .album-title").innerText = album.title;
        document.querySelector(".container--album-pic img").src = album.cover_medium;
  
        // pulisci e popola la lista delle tracce
        const tracksListContainer = document.querySelector(".container--trakslist");
        tracksListContainer.innerHTML = ''; 
        album.tracks.data.forEach(track => {
          tracksListContainer.innerHTML += `<div>${track.title}</div>`;
        });
      });
  }
  
document.addEventListener('DOMContentLoaded', loadAlbumDetails);
  
