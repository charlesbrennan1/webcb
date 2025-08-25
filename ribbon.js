// ==========================================================================
// RIBBON CANVAS ANIMATION - HERO BACKGROUND
// WebGL-free flowing ribbon animation with performance optimizations
// ==========================================================================

class RibbonAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;
    this.isVisible = true;
    this.lastTime = 0;
    this.targetFPS = 60;
    this.frameInterval = 1000 / this.targetFPS;
    
    // Performance settings
    this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR for performance
    
    // Animation parameters
    this.ribbons = [];
    this.particleCount = 8;
    this.speed = 0.5;
    this.time = 0;
    
    // Colors matching the design system
    this.colors = [
      'rgba(138, 227, 255, 0.1)',  // --accent-1 with opacity
      'rgba(155, 140, 255, 0.08)', // --accent-2 with opacity
      'rgba(92, 255, 138, 0.06)',  // --accent-3 with opacity
    ];
    
    this.init();
    this.setupEventListeners();
  }
  
  init() {
    this.resize();
    this.createRibbons();
    this.animate();
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    // Pause animation when tab is not visible (performance)
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.animate();
      }
    });
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.speed = 0.1;
      this.particleCount = 4;
    }
  }
  
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    
    this.ctx.scale(this.dpr, this.dpr);
    this.createRibbons();
  }
  
  createRibbons() {
    this.ribbons = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      this.ribbons.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        angle: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        size: 60 + Math.random() * 40,
        opacity: 0.3 + Math.random() * 0.4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        path: [],
        maxPathLength: 50 + Math.random() * 30
      });
    }
  }
  
  updateRibbons(deltaTime) {
    this.time += deltaTime * 0.001;
    
    this.ribbons.forEach(ribbon => {
      // Update position with sine wave movement
      ribbon.angle += 0.005 * ribbon.speed;
      ribbon.x += Math.cos(ribbon.angle + this.time * 0.5) * ribbon.speed;
      ribbon.y += Math.sin(ribbon.angle * 0.7 + this.time * 0.3) * ribbon.speed * 0.8;
      
      // Wrap around screen edges
      if (ribbon.x < -50) ribbon.x = this.width + 50;
      if (ribbon.x > this.width + 50) ribbon.x = -50;
      if (ribbon.y < -50) ribbon.y = this.height + 50;
      if (ribbon.y > this.height + 50) ribbon.y = -50;
      
      // Add current position to path
      ribbon.path.push({ x: ribbon.x, y: ribbon.y });
      
      // Limit path length for performance
      if (ribbon.path.length > ribbon.maxPathLength) {
        ribbon.path.shift();
      }
    });
  }
  
  drawRibbons() {
    // Clear canvas with subtle gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, 'rgba(5, 7, 11, 0.95)');
    gradient.addColorStop(1, 'rgba(10, 15, 22, 0.95)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ribbons.forEach(ribbon => {
      if (ribbon.path.length < 2) return;
      
      this.ctx.save();
      
      // Create ribbon path with smooth curves
      this.ctx.beginPath();
      this.ctx.moveTo(ribbon.path[0].x, ribbon.path[0].y);
      
      for (let i = 1; i < ribbon.path.length - 1; i++) {
        const current = ribbon.path[i];
        const next = ribbon.path[i + 1];
        const controlX = (current.x + next.x) / 2;
        const controlY = (current.y + next.y) / 2;
        this.ctx.quadraticCurveTo(current.x, current.y, controlX, controlY);
      }
      
      // Apply gradient along the ribbon
      const ribbonGradient = this.ctx.createLinearGradient(
        ribbon.path[0].x, ribbon.path[0].y,
        ribbon.path[ribbon.path.length - 1].x, ribbon.path[ribbon.path.length - 1].y
      );
      ribbonGradient.addColorStop(0, 'transparent');
      ribbonGradient.addColorStop(0.5, ribbon.color);
      ribbonGradient.addColorStop(1, 'transparent');
      
      this.ctx.strokeStyle = ribbonGradient;
      this.ctx.lineWidth = ribbon.size * 0.1;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.globalAlpha = ribbon.opacity * (0.6 + 0.4 * Math.sin(this.time + ribbon.angle));
      this.ctx.stroke();
      
      // Add glow effect
      this.ctx.shadowColor = ribbon.color.replace('0.1)', '0.3)');
      this.ctx.shadowBlur = 20;
      this.ctx.stroke();
      
      this.ctx.restore();
    });
  }
  
  animate(currentTime = 0) {
    if (!this.isVisible) return;
    
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= this.frameInterval) {
      this.updateRibbons(deltaTime);
      this.drawRibbons();
      this.lastTime = currentTime;
    }
    
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resize);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const ribbonCanvas = document.getElementById('ribbon-canvas');
  if (ribbonCanvas) {
    new RibbonAnimation(ribbonCanvas);
  }
});