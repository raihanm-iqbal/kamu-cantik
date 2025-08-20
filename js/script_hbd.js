(function () {
  "use strict";

  var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    W = (canvas.width = window.innerWidth),
    H = (canvas.height = window.innerHeight),
    maxP = 400, // Jumlah maksimum partikel
    minP = 600, // Jumlah minimum partikel
    fireworks = [],
    birthdayText = "Happy Birthday",
    currentLetterIndex = 0,
    letterAppearDelay = 10, // Delay antara munculnya huruf dalam teks
    letterAppearCounter = 0,
    stopFireworks = false, // Flag untuk memberhentikan kembang api setelah semua huruf ditampilkan
    showFullBirthdayText = false, // Flag untuk menampilkan semua huruf "Happy Birthday"
    clickCounter = 0; // Menghitung jumlah klik

  function tick() {
    var newFireworks = [];
    ctx.clearRect(0, 0, W, H);

    fireworks.forEach(function (firework) {
      firework.draw();
      if (!firework.done) newFireworks.push(firework);
    });

    fireworks = newFireworks;
    window.requestAnimationFrame(tick);

    // Tampilkan huruf "Happy Birthday" dengan setiap kembang api
    if (
      !stopFireworks &&
      fireworks.length > 0 &&
      letterAppearCounter >= letterAppearDelay
    ) {
      letterAppearCounter = 0;
      showNextLetter();
    } else {
      letterAppearCounter++;
    }

    // Tampilkan semua huruf "Happy Birthday" setelah semua kembang api selesai meledak
    if (stopFireworks && !showFullBirthdayText) {
      showFullBirthdayText = true;
      currentLetterIndex = 0; // Setel indeks huruf kembali ke awal
    }

    // Tampilkan semua huruf "Happy Birthday" jika flag showFullBirthdayText bernilai true
    if (showFullBirthdayText) {
      for (var i = 0; i < birthdayText.length; i++) {
        var gradient = ctx.createLinearGradient(0, 0, W, 0);
        gradient.addColorStop(0, "pink");
        gradient.addColorStop(1, "blue");

        // Menampilkan teks "Happy Birthday" di tengah layar
        ctx.font = "bold 50px Arial";
        ctx.fillStyle = gradient;
        ctx.textAlign = "center";
        ctx.fillText(birthdayText, W / 2, H / 2);

        // Menampilkan teks "Nur Anina Syarita" di tengah layar
        var nameText = "Nur Anina Syarita";
        ctx.font = " 30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(nameText, W / 2, H / 2 + 70);

      }
    }
  }

  function showNextLetter() {
    if (currentLetterIndex < birthdayText.length) {
      var letter = birthdayText[currentLetterIndex];
      var gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0, "pink");
      gradient.addColorStop(1, "blue");

      ctx.font = "bold 50px Arial"; // Mengatur teks menjadi tebal (bold)
      ctx.fillStyle = gradient; // Mengatur fillStyle menggunakan gradasi warna biru ke hijau
      ctx.textAlign = "center";
      ctx.fillText(
        letter,
        W / 2 + (currentLetterIndex - birthdayText.length / 2) * 30,
        H / 2
      );
      currentLetterIndex++;
    } else {
      stopFireworks = true; // Set flag untuk memberhentikan kembang api setelah semua huruf ditampilkan
    }
  }

  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype = {
    constructor: Vector,

    add: function (vector) {
      this.x += vector.x;
      this.y += vector.y;
    },

    diff: function (vector) {
      var target = this.copy();
      return Math.sqrt(
        (target.x -= vector.x) * target.x + (target.y -= vector.y) * target.y
      );
    },

    copy: function () {
      return new Vector(this.x, this.y);
    },
  };

  var colors = [
    ["rgba(179,255,129,", "rgba(0,255,0,"], //green / white
    ["rgba(0,0,255,", "rgba(100,217,255,"], //blue / cyan
    ["rgba(255,0,0,", "rgba(255,255,0,"], //red / yellow
    ["rgba(145,0,213,", "rgba(251,144,204,"], //purple / pink
  ];

  function Firework(start, target, speed) {
    this.start = start;
    this.pos = this.start.copy();
    this.target = target;
    this.spread = Math.round(Math.random() * (maxP - minP)) + minP;
    this.distance = target.diff(start);
    this.speed = speed || Math.random() * 2 + 8; // Kecepatan kembang api
    this.angle = Math.atan2(target.y - start.y, target.x - start.x);
    this.velocity = new Vector(
      Math.cos(this.angle) * this.speed,
      Math.sin(this.angle) * this.speed
    );

    this.particals = [];
    this.prevPositions = [];

    var colorSet = colors[Math.round(Math.random() * (colors.length - 1))];

    for (var i = 0; i < this.spread; i++) {
      this.particals.push(new Partical(target.copy(), colorSet));
    }
  }

  Firework.prototype = {
    constructor: Firework,

    draw: function () {
      var last = this.prevPositions[this.prevPositions.length - 1] || this.pos;

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.strokeStyle = "rgba(255,255,255,.7)";
      ctx.stroke();

      this.update();
    },

    update: function () {
      if (this.start.diff(this.pos) >= this.distance) {
        var newParticals = [];
        this.particals.forEach(function (partical) {
          partical.draw();
          if (!partical.done) newParticals.push(partical);
        });

        this.particals = newParticals;
        this.prevPositions = [];

        if (!newParticals.length) this.done = true;
      } else {
        this.prevPositions.push(this.pos.copy());

        if (this.prevPositions.length > 8) {
          this.prevPositions.shift();
        }

        this.pos.add(this.velocity);
      }
    },
  };

  function Partical(pos, colors) {
    this.pos = pos;
    this.ease = 0.2;
    this.speed = Math.random() * 6 + 2;
    this.gravity = Math.random() * 3 + 0.1;
    this.alpha = 0.8;
    this.angle = Math.random() * (Math.PI * 2);
    this.color = colors[Math.round(Math.random() * (colors.length - 1))];
    this.prevPositions = [];
  }

  Partical.prototype = {
    constructor: Partical,

    draw: function () {
      var last = this.prevPositions[this.prevPositions.length - 1] || this.pos;

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(this.pos.x, this.pos.y);
      ctx.strokeStyle = this.color + this.alpha + ")";
      ctx.stroke();

      this.update();
    },

    update: function () {
      if (this.alpha <= 0) {
        this.done = true;
      } else {
        this.prevPositions.push(this.pos.copy());

        if (this.prevPositions.length > 10) this.prevPositions.shift();
        if (this.speed > 1) this.speed -= this.ease;

        this.alpha -= 0.01;
        this.gravity += 0.01;

        this.pos.add({
          x: Math.cos(this.angle) * this.speed,
          y: Math.sin(this.angle) * this.speed + this.gravity,
        });
      }
    },
  };

  function addFirework(target) {
    var startPos = new Vector(W / 2, H);
    target = target || new Vector(Math.random() * W, Math.random() * (H - 300));
    fireworks.push(new Firework(startPos, target));
    // showNextLetter(); // Tidak perlu lagi memanggil showNextLetter() di sini karena sudah dipanggil di dalam fungsi tick()
  }

  function handleClick(e) {
    clickCounter++;
    if (clickCounter === 10) {
      canvas.removeEventListener("click", handleClick); // Hentikan mendengarkan klik setelah mencapai 10 kali
      fireworks = []; // Hapus semua kembang api yang masih ada di layar
      addFirework(); // Tambahkan satu kembang api terakhir sebelum mengarahkan
      window.location.href = "bunga.html"; // Mengarahkan pengguna ke halaman lain setelah menampilkan kembang api
    } else {
      addFirework(new Vector(e.clientX, e.clientY));
    }
  }

  canvas.addEventListener("click", handleClick, false);

  function randomFirework() {
    if (!stopFireworks && currentLetterIndex < birthdayText.length) {
      addFirework();
      window.setTimeout(randomFirework, Math.random() * 500);
    }
  }

  tick();
  randomFirework();
})();
