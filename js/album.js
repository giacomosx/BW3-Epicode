document.addEventListener('DOMContentLoaded', () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const albumId = urlParams.get('id') || '302127';

  let currentAudio = null;
  let currentPreviewUrl = null;
  let currentIndex = 0; // indice della traccia corrente
  const tracks = []; // array di tracce dell'album

  const btnPlay = document.getElementById('btnPlay');
  const btnNext = document.querySelector('.btn--next'); // pulsante per la traccia successiva
  const btnPrev = document.querySelector('.btn--prev'); // pulsante per la traccia precedente
  const tbody = document.querySelector('tbody');
  const volumeControl = document.getElementById('volumeControl');
  const progressBar = document.getElementById('songProgressBar'); // barra di progresso della canzone

  // fetch dell'album selezionato
  function loadAlbumDetails(albumId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
      .then(response => response.json())
      .then(album => {
        document.querySelector(".container--album-info--bg-transp .album-title").innerText = album.title;
        document.querySelector(".container--album-pic img").src = album.cover_medium;
        populateTable(album.tracks.data);
      })
      .finally(() => {
        document.querySelector('.container--album-preview').classList.remove('d-none');
        document.querySelector('.container--trakslist').classList.remove('d-none');
        document.querySelector('.spinner-container').classList.add('d-none');
      });
  }

  // popola la tabella con le tracce dell'album
  function populateTable(tracksData) {
    tbody.innerHTML = '';
    tracks.length = 0;
    tracksData.forEach((track, index) => {
      tracks.push(track);
      const tr = document.createElement('tr');
      tr.setAttribute('data-preview', track.preview);
      tr.innerHTML = `
        <th class="text-white-50 fw-light" scope="row">${index + 1}</th>
        <td>${track.title}</td>
        <td class="small text-white-50  d-none d-md-table-cell">${track.rank}</td>
        <td class="small text-white-50 d-none d-md-table-cell ">${(track.duration / 60).toFixed(2)}</td>
        <td class="small text-white-50 d-md-none"><button class="btn text-white p-0"><i class="bi bi-three-dots-vertical fs-4 text-white-50 "></i></button></td>
      `;
      tbody.appendChild(tr);
    });
    addRowClickHandlers();
    updateTrackSelection();
  }

  // aggiunge un event listener per ogni riga della tabella
  function addRowClickHandlers() {
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        const previewUrl = row.getAttribute('data-preview');
        playPreview(previewUrl);
      });
    });
  }

  // riproduce l'anteprima della traccia selezionata e aggiorna il nome della traccia e dell'artista + l'immagine dell'album
  function playPreview(previewUrl) {
    if (currentAudio) currentAudio.pause();
    currentPreviewUrl = previewUrl;
    currentIndex = tracks.findIndex(track => track.preview === previewUrl);
    if (previewUrl) {
        currentAudio = new Audio(previewUrl);
        currentAudio.play();
        btnPlay.querySelector('ion-icon').setAttribute('name', 'pause-circle');
        currentAudio.addEventListener('timeupdate', updateProgressBar);
        updateTrackSelection();
        document.querySelector('.card__audioplayer--title').innerText = tracks[currentIndex].title;
        document.querySelector('.card__audioplayer--artist').innerText = tracks[currentIndex].artist.name;
        document.querySelector('.title__audioplayer--mobile').innerText = tracks[currentIndex].title + ', ' +tracks[currentIndex].artist.name ;
        document.querySelector('.card-img img').src = tracks[currentIndex].album.cover_medium;
    }
}

  // aggiorna la riga selezionata nella tabella delle tracce
  function updateTrackSelection() {
    tbody.querySelectorAll('tr').forEach((row, index) => {
      if (index === currentIndex) {
        row.classList.add('selected-track');
      } else {
        row.classList.remove('selected-track');
      }
    });
  }

  // aggiorna la barra di avanzamento della traccia
  function updateProgressBar() {
    if (currentAudio) {
      const percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  // event listener per la barra di avanzamento della traccia
  function playNext() {
    currentIndex = (currentIndex + 1) % tracks.length;
    playPreview(tracks[currentIndex].preview);
  }

  function playPrevious() {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playPreview(tracks[currentIndex].preview);
  }

  btnNext.addEventListener('click', playNext);
  btnPrev.addEventListener('click', playPrevious);

  // event listener per il pulsante di riproduzione
  btnPlay.addEventListener('click', () => {
    if (currentAudio) {
      if (!currentAudio.paused) {
        currentAudio.pause();
        btnPlay.querySelector('ion-icon').setAttribute('name', 'play-circle');
      } else {
        currentAudio.play();
        btnPlay.querySelector('ion-icon').setAttribute('name', 'pause-circle');
      }
    } else if (currentPreviewUrl) {
      playPreview(currentPreviewUrl);
    }
  });

  // event listener per la barra di controllo del volume
  volumeControl.addEventListener('input', () => {
    if(currentAudio) currentAudio.volume = volumeControl.value / 100;
  });

  loadAlbumDetails(albumId);
});
