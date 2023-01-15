const musicContainer = document.querySelector('.music-container')
const playBtn = document.querySelector('#play')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const title = document.querySelector('#title')
const cover = document.querySelector('#cover')
const fileUpload = document.querySelector('#file-upload')
const uploadBtn = document.querySelector('#upload-btn')

// Song titles
var songs = []

// Get song titles from file
$(document).ready(function(){
    getSongs()
})

async function getSongs(){
    $.getJSON("getSongs.php", function(data) {
        songs = []
        songs = data
        // Load first song into DOM
        loadSong(songs[0])
    });
}

// Initialise song index
let songIndex = 0;

// Update song details
function loadSong(song){
    title.innerText = song
    audio.src = `music/${song}.mp3`
    // cover.src = `images/${song}.png`
}

function playSong(){
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')

    audio.play()
}

function pauseSong(){
    musicContainer.classList.remove('play')
    playBtn.querySelector('i.fas').classList.add('fa-play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')

    audio.pause()
}

function prevSong(){
    songIndex--

    if(songIndex < 0){
        songIndex = songs.length - 1
    }

    loadSong(songs[songIndex])

    playSong()
}

function nextSong(){
    songIndex++

    if(songIndex > songs.length - 1){
        songIndex = 0
    }

    loadSong(songs[songIndex])

    playSong()
}

function updateProgress(e){
    const {duration, currentTime} = e.srcElement
    const progressPercent = (currentTime/duration) * 100
    progress.style.width = `${progressPercent}%`
}

function setProgress(e){
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
}


// Event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play')

    if(isPlaying){
        pauseSong()
    } else {
        playSong()
    }
})

// Upload new song
async function uploadFile(file){
    let formData = new FormData(); 
    formData.append("file", file[0]);

    $.ajax({
        url: "upload.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if(response != '')
                alert(response)
            else getSongs()
        }
    });     
}

uploadBtn.addEventListener("click", function(){
    var dropZone = document.getElementById("drop-zone")
    dropZone.classList.remove('drop-zone-hidden')
    dropZone.classList.add('drop-zone-show')
    setTimeout(()=> {
        dropZone.classList.toggle('open')
    },5);
    uploadBtn.disabled = true;
    

    // Add event listeners
    dropZone.addEventListener("dragenter", enter, false);
    dropZone.addEventListener("dragover", over, false);
    dropZone.addEventListener("dragleave", leave, false);
    dropZone.addEventListener("drop", drop, false);
  
    function enter(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  
    function over(e) {
      e.stopPropagation();
      e.preventDefault();
      document.getElementsByClassName("drop-zone-show")[0].style.backgroundColor = '#eee'
    }

    function leave(e) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementsByClassName("drop-zone-show")[0].style.backgroundColor = 'white'
    }
  
    function drop(e) {
      e.stopPropagation();
      e.preventDefault();
  
      var file = e.dataTransfer.files;
      uploadFile(file)
    }
})

function closeDropZone(){
    var dropZone = document.getElementById("drop-zone");
    dropZone.classList.add('drop-zone-hidden')
    dropZone.classList.remove('drop-zone-show')
    dropZone.classList.remove('open')
    uploadBtn.disabled = false;
}


// Change song
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)

// Update progress bar
audio.addEventListener('timeupdate', updateProgress)

// Scrub
progressContainer.addEventListener('click', setProgress)

// Auto play next song on song end
audio.addEventListener('ended', nextSong)