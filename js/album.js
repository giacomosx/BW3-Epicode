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

        console.log(album.tracks);
  
        populateTable(album.tracks.data)
      })
      .finally(album => {
        document.querySelector('.container--album-preview').classList.remove('d-none');
        document.querySelector('.container--trakslist').classList.remove('d-none');
        document.querySelector('.spinner-container').classList.add('d-none');
      });
  }
  

  const populateTable = (data) => {   
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    
    let indexTracks = 1;
    data.map(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = /* HTML */`
      <th class="text-white-50 fw-light " scope="row">${indexTracks}</th>
      <td>${item.title}</td>
      <td>${item.rank}</td>
      <td>${(item.duration/60).toFixed(2)}</td>
      `;
      indexTracks++
      tbody.append(tr);
    })
  }

document.addEventListener('DOMContentLoaded', loadAlbumDetails);