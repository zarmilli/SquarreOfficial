document.getElementById('download-btn').addEventListener('click', () => {
  window.location.href = 'download.html';
});

class Particle {
  x = 0;

  y = 0;

  radius = 0;

  direction = 0;

  speed = 0;

  lifetime = 0;

  ran = 0;

  image = null;

  size = 10;

  options;

  constructor(
    canvas,
    options = {
      horizontalMotion: false,
      sizeRange: [10, 10],
    }
  ) {
    if (options.imgSrc) {
      this.image = new Image();
      this.image.src = options.imgSrc;
    }

    this.options = options;

    this.reset(canvas);
    this.initialize(canvas);
  }

  reset(canvas) {
    this.x = Math.round((Math.random() * canvas.width) / 2 + canvas.width / 4);
    this.y = Math.random() * 100 + 5;

    this.radius = 1 + Math.floor(Math.random() * 0.5);
    this.direction = (Math.random() * Math.PI) / 2 + Math.PI / 4;
    this.speed = 0.02 + Math.random() * 0.08;

    const second = 60;
    this.lifetime = second * 3 + Math.random() * (second * 30);

    this.size = this.options.sizeRange
      ? Math.random() *
          (this.options.sizeRange[1] - this.options.sizeRange[0]) +
        this.options.sizeRange[0]
      : 10;

    if (this.options.horizontalMotion) {
      this.direction = Math.random() <= 0.5 ? 0 : Math.PI;
      this.lifetime = 30 * second;
    }

    this.ran = 0;
  }

  initialize(canvas) {
    this.ran = Math.random() * this.lifetime;
    const baseSpeed = this.speed;
    this.speed = Math.random() * this.lifetime * baseSpeed;
    this.update(canvas);
    this.speed = baseSpeed;
  }

  update(canvas) {
    this.ran += 1;

    const addX = this.speed * Math.cos(this.direction);
    const addY = this.speed * Math.sin(this.direction);
    this.x += addX;
    this.y += addY;

    if (this.ran > this.lifetime) {
      this.reset(canvas);
    }
  }

  render(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();

    const x = this.ran / this.lifetime;
    const o = (x - x * x) * 4;
    ctx.globalAlpha = Math.max(0, o * 0.8);

    if (this.image) {
      ctx.translate(this.x, this.y);
      const w = this.size;
      const h = (this.image.naturalWidth / this.image.naturalHeight) * w;
      ctx.rotate(this.direction - Math.PI);
      ctx.drawImage(this.image, -w / 2, h, h, w);
    } else {
      ctx.ellipse(
        this.x,
        this.y,
        this.radius,
        this.radius * 1.5,
        this.direction,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "white";
      ctx.fill();
    }
    ctx.restore();
  }
}

function ParticlesCanvas() {
  const canvasRef = {
    current: document.querySelector("#anim"),
  };
  console.log(canvasRef);

  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const particles = [];

  canvas.width = canvas.scrollWidth;
  canvas.height = canvas.scrollHeight;

  // Basic particle config
  const particleCount = 40;
  let imageParticleCount = particleCount;

  // Holiday overrides
  let imageOverride = [];
  const date = new Date();
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 11 && day >= 24 && day <= 26) {
    imageOverride = [
      // {
      //   image: "/lightbar-images/snowflake.svg",
      //   sizeRange: [4, 15],
      // },
      // {
      //   image: "/lightbar-images/santa.png",
      //   sizeRange: [15, 30],
      // },
    ];
  }

  // Fish easter egg
  const shouldShowFishie = Math.floor(Math.random() * 600) === 69;
  if (shouldShowFishie) {
    imageOverride = [
      {
        image: "/lightbar-images/fishie.png",
        sizeRange: [10, 11],
      },
    ];
    imageParticleCount = particleCount / 2;
  }

  // HOIST THE SAIL (of particles)!
  for (let i = 0; i < particleCount; i += 1) {
    const isImageParticle = imageOverride && i <= imageParticleCount;
    const randomImageIndex = Math.floor(Math.random() * imageOverride.length);
    const sizeRange = imageOverride[randomImageIndex]?.sizeRange;
    const src = imageOverride[randomImageIndex]?.image;
    const particle = new Particle(canvas, {
      imgSrc: isImageParticle ? src : undefined,
      horizontalMotion: src?.includes("fishie"),
      sizeRange,
    });
    particles.push(particle);
  }

  let shouldTick = true;
  let handle = null;
  function particlesLoop() {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (shouldTick) {
      for (const particle of particles) {
        particle.update(canvas);
      }
      shouldTick = false;
    }

    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    for (const particle of particles) {
      particle.render(canvas);
    }

    handle = requestAnimationFrame(particlesLoop);
  }
  const interval = setInterval(() => {
    shouldTick = true;
  }, 1e3 / 120); // tick 120 times a sec

  particlesLoop();

  return () => {
    if (handle) cancelAnimationFrame(handle);
    clearInterval(interval);
  };
}

ParticlesCanvas();