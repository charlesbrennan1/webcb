// ==========================================================================
// ABOUT BACKGROUND - NEURAL LATTICE ANIMATION  
// Subtle neural network background with improved color matching
// ==========================================================================

class NeuralLattice {
  constructor() {
    this.canvas = document.getElementById('about-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.idle = false;
    
    // Network parameters
    this.spacing = 80 * this.dpr;
    this.jitter = 12 * this.dpr;
    this.nodes = [];
    this.links = [];
    this.signals = [];
    
    this.init();
  }
  
  init() {
    this.resize();
    this.buildLattice();
    this.createSignals();
    this.setupEventListeners();
    this.animate();
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.buildLattice();
    });
    
    document.addEventListener('visibilitychange', () => {
      this.idle = document.hidden;
    });
  }
  
  resize() {
    this.width = this.canvas.width = Math.floor(window.innerWidth * this.dpr);
    this.height = this.canvas.height = Math.floor(window.innerHeight * this.dpr);
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
  }
  
  buildLattice() {
    this.nodes = [];
    this.links = [];
    
    const cols = Math.ceil(this.width / this.spacing) + 2;
    const rows = Math.ceil(this.height / (this.spacing * 0.86)) + 2;
    
    // Create nodes in hexagonal pattern
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + (r % 2 ? 0.5 : 0)) * this.spacing + (Math.random() - 0.5) * this.jitter;
        const y = r * this.spacing * 0.86 + (Math.random() - 0.5) * this.jitter;
        this.nodes.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    }
    
    // Create connections between nodes
    const getIndex = (r, c) => r * cols + c;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = getIndex(r, c);
        
        // Connect to right neighbor
        if (c + 1 < cols) this.links.push([i, getIndex(r, c + 1)]);
        
        // Connect to lower neighbors (hexagonal pattern)
        if (r + 1 < rows) {
          if (r % 2 === 0) {
            if (c < cols) this.links.push([i, getIndex(r + 1, c)]);
            if (c - 1 >= 0) this.links.push([i, getIndex(r + 1, c - 1)]);
          } else {
            if (c + 1 < cols) this.links.push([i, getIndex(r + 1, c + 1)]);
            if (c < cols) this.links.push([i, getIndex(r + 1, c)]);
          }
        }
      }
    }
  }
  
  createSignals() {
    this.signals = Array.from({length: 25}, () => ({
      t: Math.random(),
      speed: 0.0008 + Math.random() * 0.002,
      linkIndex: Math.floor(Math.random() * this.links.length),
      opacity: 0.6 + Math.random() * 0.4
    }));
  }
  
  draw() {
    if (this.idle) {
      requestAnimationFrame(() => this.draw());
      return;
    }
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Subtle gradient background
    const gradient = this.ctx.createRadialGradient(
      this.width * 0.3, this.height * 0.2, 0,
      this.width * 0.3, this.height * 0.2, Math.max(this.width, this.height)
    );
    gradient.addColorStop(0, 'rgba(138, 227, 255, 0.02)');
    gradient.addColorStop(0.6, 'rgba(155, 140, 255, 0.01)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw connections
    this.ctx.lineWidth = 0.8 * this.dpr;
    this.ctx.strokeStyle = 'rgba(138, 227, 255, 0.08)';
    this.ctx.beginPath();
    
    for (const [a, b] of this.links) {
      const nodeA = this.nodes[a];
      const nodeB = this.nodes[b];
      this.ctx.moveTo(nodeA.x, nodeA.y);
      this.ctx.lineTo(nodeB.x, nodeB.y);
    }
    
    this.ctx.stroke();
    
    // Draw nodes with subtle pulsing
    for (const node of this.nodes) {
      node.phase += node.pulseSpeed;
      const pulse = (1 + Math.sin(node.phase)) * 0.5;
      const radius = (0.8 + pulse * 0.4) * this.dpr;
      
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(138, 227, 255, ${0.3 + pulse * 0.2})`;
      this.ctx.shadowColor = 'rgba(138, 227, 255, 0.4)';
      this.ctx.shadowBlur = 4 * this.dpr;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }
    
    // Draw animated signals
    for (const signal of this.signals) {
      if (signal.linkIndex >= this.links.length) continue;
      
      const [aIdx, bIdx] = this.links[signal.linkIndex];
      const nodeA = this.nodes[aIdx];
      const nodeB = this.nodes[bIdx];
      
      const x = nodeA.x + (nodeB.x - nodeA.x) * signal.t;
      const y = nodeA.y + (nodeB.y - nodeA.y) * signal.t;
      const size = 1.5 * this.dpr;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(155, 140, 255, ${signal.opacity})`;
      this.ctx.shadowColor = `rgba(155, 140, 255, 0.6)`;
      this.ctx.shadowBlur = 8 * this.dpr;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      
      // Update signal position
      signal.t += signal.speed;
      if (signal.t >= 1) {
        signal.t = 0;
        signal.linkIndex = Math.floor(Math.random() * this.links.length);
        signal.speed = 0.0008 + Math.random() * 0.002;
        signal.opacity = 0.6 + Math.random() * 0.4;
      }
    }
    
    requestAnimationFrame(() => this.draw());
  }
  
  animate() {
    requestAnimationFrame(() => this.draw());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new NeuralLattice();
});