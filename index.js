let currentSongs = new Audio();
let currFolder;
let songs;
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}`);

  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songsUl = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
  songsUl.innerHTML = "";
  for (const song of songs) {
    songsUl.innerHTML =
      songsUl.innerHTML +
      `<li class="list-none bg-black shadow-2xl flex justify-around items-center border border-white rounded-md border-solid cursor-pointer mb-2 py-2">
              <i class="ri-music-2-fill text-white"></i>
              <div class="info">
                <div class="text-md text-white">${song.replaceAll(
                  "%20",
                  " "
                )}</div>
                </div>
                  <div class="playnow flex gap-2 items-center ">
                    <span class="text-sm invert">Play Now</span>
                    <i class="ri-play-circle-line text-white text-xl"></i>
                  </div>
            </li>
    `;
  }



  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSongs.src = `/${currFolder}/` + track;
  currentSongs.play();
  if (!currentSongs.pause()) {
    currentSongs.play();
    play.classList.add("ri-pause-circle-line");
    play.classList.remove("ri-play-circle-line");
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

function updateVolumeIcon(volume) {
  if (volume == 0) {
    volumeIcon.className =
      "ri-volume-mute-line text-white text-lg cursor-pointer";
  } else if (volume > 0 && volume <= 50) {
    volumeIcon.className =
      "ri-volume-down-line text-white text-lg cursor-pointer";
  } else {
    volumeIcon.className =
      "ri-volume-up-line text-white text-lg cursor-pointer";
  }
}
async function main() {
  await getSongs("src/songs/cs");
  playMusic(songs[0], true);

  
    // load the playlist whenever card clicked
    Array.from(document.getElementsByClassName("card")).forEach((element) => {
      element.addEventListener("click", async (item) => {
        songs = await getSongs(
          `src/songs/${item.currentTarget.dataset.folder}`
        );
      });
    });
  

  play.addEventListener("click", () => {
    if (currentSongs.paused) {
      currentSongs.play();
      play.classList.remove("ri-play-circle-line");
      play.classList.add("ri-pause-circle-line");
    } else {
      currentSongs.pause();
      play.classList.remove("ri-pause-circle-line");
      play.classList.add("ri-play-circle-line");
    }
  });

  currentSongs.addEventListener("timeupdate", () => {
    let duration = currentSongs.duration;
    let current = currentSongs.currentTime;
    let currmin = Math.floor(current / 60);
    let currsec = Math.floor(current % 60);
    if (currsec < 10) {
      currsec = "0" + currsec;
    }

    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (isNaN(sec)) {
      return "00:00";
    }
    document.querySelector(".songTime").innerHTML =
      currmin + ":" + currsec + "/" + min + ":" + sec;
    document.querySelector(".circle").style.left =
      (current / duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let position = e.offsetX / document.querySelector(".seekbar").offsetWidth;
    currentSongs.currentTime = position * currentSongs.duration;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.display = "block";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.display = "none";
  });

  back.addEventListener("click", () => {
    currentSongs.pause();
    play.classList.add("ri-pause-circle-line");
    play.classList.remove("ri-play-circle-line");
    let song = songs.pop();
    songs.unshift(song);
    playMusic(songs[0], true);
  });

  next.addEventListener("click", () => {
    currentSongs.pause();
    play.classList.add("ri-pause-circle-line");
    play.classList.remove("ri-play-circle-line");
    let song = songs.shift();
    songs.push(song);
    playMusic(songs[0], true);
    document;
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/ 100");
      currentSongs.volume = parseInt(e.target.value) / 100;
      if (currentSongs.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("src/images/mute.svg", "src/images/volume.svg");
      }
    });

  // Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("src/images/volume.svg")) {
      e.target.src = e.target.src.replace(
        "src/images/volume.svg",
        "src/images/mute.svg"
      );
      currentSongs.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace(
        "src/images/mute.svg",
        "src/images/volume.svg"
      );
      currentSongs.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
