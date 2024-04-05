document.addEventListener('DOMContentLoaded', () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const albumId = urlParams.get('id') || '302127';

  let currentAudio = null;
  let currentPreviewUrl = null;
  const btnPlay = document.getElementById('btnPlay');
  const tbody = document.querySelector('tbody');
  const volumeControl = document.getElementById('volumeControl');

  // fetch dell'album selezionato
  function loadAlbumDetails(albumId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`)
      .then(response => response.json())
      .then(album => {
        document.querySelector(".container--album-info .album-title").innerText = album.title;
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
  function populateTable(tracks) {
    tbody.innerHTML = '';
    tracks.forEach((track, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-preview', track.preview);
      tr.innerHTML = `
        <th class="text-white-50 fw-light" scope="row">${index + 1}</th>
        <td>${track.title}</td>
        <td>${track.rank}</td>
        <td>${(track.duration/60).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
    addRowClickHandlers();
  }

  // aggiunge un event listener per ogni riga della tabella
  function addRowClickHandlers() {
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        tbody.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected-track'));
        row.classList.add('selected-track');
        const previewUrl = row.getAttribute('data-preview');
        playPreview(previewUrl);
      });
    });
  }

  // riproduce l'anteprima della traccia selezionata
  function playPreview(previewUrl) {
    if(currentAudio) {
      currentAudio.pause();
    }
    currentPreviewUrl = previewUrl;
    if(previewUrl) {
      currentAudio = new Audio(previewUrl);
      currentAudio.play();
      btnPlay.querySelector('ion-icon').setAttribute('name', 'pause-circle');
      currentAudio.addEventListener('timeupdate', updateProgressBar);
    }
  }

  // aggiorna la barra di avanzamento della traccia
  function updateProgressBar() {
    if (currentAudio && progressBar) {
      const percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

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
    if(currentAudio) {
      currentAudio.volume = volumeControl.value / 100;
    }
  });

  loadAlbumDetails(albumId);
});
