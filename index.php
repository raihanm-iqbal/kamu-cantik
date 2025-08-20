<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <title>&lt;3</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />

  <!-- CSS -->
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/demo.css" />

  <style>
    /* Default: bunga berhenti */
.flowers, .flowers * {
  animation-play-state: paused !important;
}
/* Kalau ada class animate → jalan normal */
.flowers.animate, .flowers.animate * {
  animation-play-state: running !important;
}

    /* Tombol Play sebagai gambar */
    #play-btn {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      width: 250px;
      height: auto;
      cursor: pointer;
      z-index: 10000;
      opacity: 0;
      transition: opacity 1s ease, transform 0.8s ease;
    }

    /* Animasi muncul */
    #play-btn.show {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }

    /* Saat menghilang */
    #play-btn.hide {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.1);
      pointer-events: none;
    }

    /* Lyrics */
    #lyrics {
      position: absolute;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.8em;
      text-align: center;
      padding: 30px;
      border-radius: 15px;
      min-width: 80%;
      min-height: 100px;
      margin-top: 20px;
      z-index: 10;
    }

    .cursor {
      display: inline-block;
      width: 15px;
      animation: blink 1s infinite;
    }

    @keyframes blink {

      0%,
      50% {
        opacity: 1;
      }

      51%,
      100% {
        opacity: 0;
      }
    }

    @font-face {
      font-family: "8bit";
      src: url("fonts/8bit.ttf") format("truetype");
    }

    /* Window Title Bar */
    #custom-title-bar {
      -webkit-app-region: drag;
      height: 35px;
      color: rgb(255, 220, 220);
      font-size: 1.5em;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      font-family: "8bit", cursive;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }

    #window-controls {
      display: flex;
      -webkit-app-region: no-drag;
    }

    #window-controls button {
      background: transparent;
      border: none;
      padding: 5px;
      margin-right: 10px;
      cursor: pointer;
    }

    #window-controls button img {
      width: 20px;
      height: 20px;
      filter: brightness(0) invert(1);
    }

    #window-controls button:hover img {
      filter: brightness(0.9) invert(1) drop-shadow(0 0 2px white);
    }

    /* Body */
    body {
      padding-top: 35px;
      margin: 0;
      background: url("cute.gif") no-repeat center center fixed;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: "8bit", cursive;
      color: white;
      text-shadow: 2px 2px 4px #000;
      position: relative;
      overflow: hidden;
    }
  </style>
</head>

<body class="not-loaded">
  <!-- Background -->
  <div id="bunga-canvas">
    <div class="night"></div>
    <div class="flowers">
      <?php include "bunga.html"; ?>
    </div>
  </div>

  <!-- Controls -->
  <div id="controls">
    <!-- Tombol Play diubah jadi gambar -->
    <img id="play-btn" src="amplop.png" alt="Play" />
    <audio id="bg-music" src="backsound.mp3"></audio>

    <div id="window-controls">
      <button hidden id="home-btn"><img src="assets/home.png" /></button>
      <button hidden id="max-btn"><img src="assets/maximize.png" /></button>
      <button hidden id="close-btn"><img src="assets/close.png" /></button>
    </div>
  </div>

  <!-- Lyrics -->
  <div id="lyrics">
    <span id="text"></span><span class="cursor">|</span>
  </div>

  <!-- Scripts -->
  <script src="js/script.js"></script>
  <script>
    document.getElementById("home-btn").addEventListener("click", () => location.reload());
    document.getElementById("max-btn").addEventListener("click", () => window.electronAPI.sendWindowControl("maximize"));
    document.getElementById("close-btn").addEventListener("click", () => window.electronAPI.sendWindowControl("close"));

    const lyrics = [
      "sempurnalah duniaku saat kau disisiku",
      "Karena kamu cantik",
      "Kan ku beri segalanya apa yang ku punya",
      "Dan hatimu baik",
      "Sempurnalah duniaku saat kau disisiku",
      "Bukan karena make up di wajahmu",
      "Atau lipstik merah itu",
      "Lembut hati tutur kata",
      "Terciptalah cinta yang ku puja",
    ];

    const settings = [{
        delay: 300,
        speed: 120
      },
      {
        delay: 1300,
        speed: 90
      },
      {
        delay: 400,
        speed: 90
      },
      {
        delay: 1200,
        speed: 115
      },
      {
        delay: 10,
        speed: 110
      },
      {
        delay: 400,
        speed: 90
      },
      {
        delay: 1100,
        speed: 95
      },
      {
        delay: 400,
        speed: 100
      },
      {
        delay: 1000,
        speed: 95
      },
    ];

    let index = 0,
      charIndex = 0;
    const display = document.getElementById("text");
    const playBtn = document.getElementById("play-btn");
    const music = document.getElementById("bg-music");

    function typeLine() {
      if (index >= lyrics.length) {
        display.textContent = "<3";
        return;
      }
      const line = lyrics[index];
      const config = settings[index];
      if (charIndex < line.length) {
        display.textContent += line.charAt(charIndex);
        charIndex++;
        setTimeout(typeLine, config.speed);
      } else {
        index++;
        charIndex = 0;
        setTimeout(() => {
          display.textContent = "";
          typeLine();
        }, config.delay);
      }
    }

    // Saat tombol Play ditekan
    playBtn.addEventListener("click", () => {
      music.play();
      playBtn.classList.add("hide"); // fade out tombol
      setTimeout(() => playBtn.remove(), 1000);

      // === INI BAGIAN NGEJALANIN BUNGA ===
      document.querySelector(".flowers").classList.add("animate");

      // mulai lirik
      index = 0;
      charIndex = 0;
      display.textContent = "";
      typeLine();
    });


    // Kasih animasi masuk setelah load
    window.addEventListener("load", () => {
      setTimeout(() => playBtn.classList.add("show"), 200);
    });
  </script>
</body>

</html>
