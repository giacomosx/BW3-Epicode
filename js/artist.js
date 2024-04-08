document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const artistId = urlParams.get('id');
      // se non è specificato un artista mostra placeholders
  if (!artistId) {
    console.log("nessun artista specificato, mostro placeholders");
    return;
  }

  let currentAudio = null;
  let currentPreviewUrl = null;
  let currentIndex = 0; // indice della traccia corrente
  const tracks = []; // array di tracce dell'artista

  const btnPlay = document.querySelectorAll('.btnPlay');
  const btnNext = document.querySelector('.btn--next'); // pulsante per la traccia successiva
  const btnPrev = document.querySelector('.btn--prev'); // pulsante per la traccia precedente
  const volumeControl = document.getElementById('volumeControl');
  const progressBar = document.getElementById('songProgressBar');

  function loadArtistDetails(artistId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`)
      .then(response => response.json())
      .then(artist => {
        document.querySelector(".container--artist-cover img").src = artist.picture_xl;
        document.querySelector(".container--artist-info .display-6").innerText = artist.name;
        document.querySelector(".container--artist-info .small").innerText = `${artist.nb_fan} fans`;
        loadArtistTracks(artistId);
      })
      .finally(() => {
        document.querySelector('.spinner-container').classList.add('d-none');
        document.querySelector('.container--artist-cover').classList.remove('d-none');
        document.querySelector('.container--artist-trakslist').classList.remove('d-none');
      });
  }

  function loadArtistTracks(artistId) {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`)
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('.table tbody');
        tbody.innerHTML = '';
        tracks.length = 0;
        data.data.forEach((track, index) => {
          tracks.push(track);
          const tr = document.createElement('tr');
          tr.setAttribute('data-preview', track.preview);
          tr.innerHTML = `
            <th class="text-white-50 fw-light" scope="row">${index + 1}</th>
            <td>
                <div class="d-flex g-0 align-items-center flex-row w-100  ">
                    <div class="table--img-container">
                        <img src="${track.album.cover_medium}" alt="" class="img-fluid object-fit-cover w-100 h-100 ">
                    </div>
                    <span class="table--title-song small fw-bold ps-2 ">${track.title}</span>
                </div>
            </td>
            <td class="small text-white-50  d-none d-md-table-cell">${track.rank}</td>
            <td class="small text-white-50 d-none d-md-table-cell ">${(track.duration / 60).toFixed(2)}</td>
            <td class="small text-white-50 d-md-none"><button class="btn text-white p-0"><i class="bi bi-three-dots-vertical fs-4 text-white-50 "></i></button></td>
          `;
          tbody.appendChild(tr);
        });
        addRowClickHandlers();
      });
  }

  function addRowClickHandlers() {
    const tbody = document.querySelector('.table tbody');
    tbody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        const previewUrl = row.getAttribute('data-preview');
        playPreview(previewUrl);
      });
    });
  }

  function playPreview(previewUrl) {
    if (currentAudio) currentAudio.pause();
    currentPreviewUrl = previewUrl;
    currentIndex = tracks.findIndex(track => track.preview === previewUrl);
    if (previewUrl) {
        currentAudio = new Audio(previewUrl);
        currentAudio.play();
        document.querySelector('.container__audioplayer--mobile').classList.remove('d-none')
        document.querySelector('#btnPlayDesk').setAttribute('name', 'pause-circle');
        document.querySelector('#btnPlayMobile').setAttribute('name', 'pause');
        currentAudio.addEventListener('timeupdate', updateProgressBar);
        document.querySelector('.card__audioplayer--title').innerText = tracks[currentIndex].title;
        document.querySelector('.card__audioplayer--artist').innerText = tracks[currentIndex].artist.name;
        document.querySelector('.title__audioplayer--mobile').innerText = tracks[currentIndex].title + ', ' +tracks[currentIndex].artist.name ;
        document.querySelector('.card-img img').src = tracks[currentIndex].album.cover_medium;
        updateTrackSelection();
    }
}

function updateTrackSelection() {
    const rows = document.querySelectorAll('.table tbody tr');

    rows.forEach((row, index) => {
        if (index === currentIndex) {
            row.classList.add('selected-track');
        } else {
            row.classList.remove('selected-track');
        }
    });
}


function playNext() {
    currentIndex = (currentIndex + 1) % tracks.length;
    playPreview(tracks[currentIndex].preview);
}

  function playPrevious() {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playPreview(tracks[currentIndex].preview);
  }

  function updateProgressBar() {
    if (currentAudio) {
      const percentage = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  btnPlay.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentAudio) {
        if (!currentAudio.paused) {
          currentAudio.pause();
          btn.querySelector('ion-icon').setAttribute('name', 'play-circle');
          document.querySelector('#btnPlayMobile').setAttribute('name', 'play');
        } else {
          currentAudio.play();
          btn.querySelector('ion-icon').setAttribute('name', 'pause-circle');
          document.querySelector('#btnPlayMobile').setAttribute('name', 'pause');
        }
      } else if (currentPreviewUrl) {
        playPreview(currentPreviewUrl);
      }
    });
  })

  volumeControl.addEventListener('input', () => {
    if(currentAudio) currentAudio.volume = volumeControl.value / 100;
  });


  btnNext.addEventListener('click', playNext);
btnPrev.addEventListener('click', playPrevious);

  loadArtistDetails(artistId);
});


