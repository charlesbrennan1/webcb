// TLF Constellation Background - Adapted from the provided script
(function() {
  const canvas = document.getElementById('tlf-constellation');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let w, h;

  function resize() {
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  
  resize();
  window.addEventListener('resize', resize);

  // Constellation parameters
  const N = 120; // Number of particles
  const R = 100 * dpr; // Connection radius
  const SPEED = 0.2;

  // Create particles
  const particles = Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED
  }));

  // Mouse interaction
  let mx = w * 0.5;
  let my = h * 0.4;
  
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX * dpr;
    my = e.clientY * dpr;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    // Subtle mouse-following gradient
    const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(w, h));
    gradient.addColorStop(0, 'rgba(138, 227, 255, 0.03)');
    gradient.addColorStop(0.5, 'rgba(155, 140, 255, 0.02)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Update and draw particles
    for (let p of particles) {
      // Subtle mouse attraction
      p.x += p.vx + (mx - w * 0.5) * 0.00003;
      p.y += p.vy + (my - h * 0.5) * 0.00003;
      
      // Bounce off edges
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      
      // Keep particles in bounds
      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(138, 227, 255, 0.7)';
      ctx.shadowColor = 'rgba(138, 227, 255, 0.4)';
      ctx.shadowBlur = 4 * dpr;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw connections
    ctx.lineWidth = 0.5 * dpr;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        
        if (d2 < R * R) {
          const alpha = (1 - d2 / (R * R)) * 0.25;
          ctx.strokeStyle = `rgba(138, 227, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  // Card tilt effect
  const tiltCard = document.getElementById('tlf-tilt');
  if (tiltCard) {
    window.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      if (e.clientX >= rect.left && e.clientX <= rect.right && 
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        tiltCard.style.transform = `perspective(1000px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`;
      } else {
        tiltCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      }
    });
  }
})();