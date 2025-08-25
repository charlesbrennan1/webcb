// TLF Career Roadway - Simplified and debugged
const MILESTONES = [
  {
    pct: 0.08, side: 'right',
    title: 'The First Few Months',
    date: 'April - August 2021',
    role: 'Warehouse Associate (Pick/Pack/Ship)',
    desc: 'Started as a warehouse associate through a friend's referral. Spent my days picking sales orders using Zebra handhelds, pulling data from NetSuite, and shipping packages via ShipStation. Every order went from pick → pack → label → conveyor belt → out the door.',
    chips: ['🔄 Learned the entire fulfillment flow', '💡 Showed initiative in process improvements', '📈 Quickly understood system relationships'],
    isInfoBox: true,
    quote: 'This hands-on experience with warehouse operations became the foundation for everything that followed.'
  },
  {
    pct: 0.25, side: 'left',
    title: 'Day One in the Warehouse',
    date: 'April 2021',
    role: 'Warehouse Associate',
    desc: 'Started with a friend's referral. Picked sales orders using Zebra handhelds, pulling from NetSuite, shipping via ShipStation. Every order: pick → pack → label → conveyor → ship.',
    chips: ['Hands-on operations', 'System flow mastery', 'Process improvement mindset']
  },
  {
    pct: 0.35, side: 'left',
    title: 'Moving to Analytics',
    date: 'August 2021',
    role: 'Supply Chain Business Analyst',
    desc: 'Promoted from warehouse floor to analytics role. Began customizing NetSuite, analyzing costs, and optimizing operations.',
    chips: ['NetSuite customization', 'Cost analysis', 'Operational efficiency']
  },
  {
    pct: 0.65, side: 'right',
    title: 'Major Achievements',
    date: 'Late 2021 - Early 2022',
    role: 'Business Analyst',
    desc: 'Delivered significant operational improvements and cost savings through data-driven optimization.',
    chips: ['$200K annual savings', '384% SKU efficiency', '$350K dead stock liquidated']
  },
  {
    pct: 0.85, side: 'left',
    title: 'The Pivot',
    date: 'July 2022',
    role: 'Career Transition',
    desc: 'Realized my passion for enterprise software analysis. Decided to leverage operational expertise to help other companies make better technology decisions.',
    chips: ['Enterprise software focus', 'Technology advisory', 'Industry expertise']
  }
];

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  const svg = document.querySelector('.road-svg');
  const roadBase = document.getElementById('roadBase');
  const roadDash = document.getElementById('roadDash');
  const roadGlow = document.getElementById('roadGlow');
  const milestonesContainer = document.getElementById('roadMilestones');
  const progressBar = document.getElementById('roadProgressBar');

  if (!roadBase || !milestonesContainer) {
    console.log('Road elements not found - check HTML structure');
    return;
  }

  const pathLength = roadBase.getTotalLength();
  console.log('Road path length:', pathLength);

  // Setup animated road elements
  if (roadDash) {
    roadDash.style.strokeDasharray = pathLength;
    roadDash.style.strokeDashoffset = pathLength;
  }
  
  if (roadGlow) {
    roadGlow.style.strokeDasharray = pathLength;
    roadGlow.style.strokeDashoffset = pathLength;
    roadGlow.style.opacity = '0';
  }

  // Create milestones
  MILESTONES.forEach((milestone, index) => {
    const point = roadBase.getPointAtLength(pathLength * milestone.pct);
    console.log(`Milestone ${index}:`, milestone.title, 'at point:', point);
    
    const milestoneEl = document.createElement('div');
    milestoneEl.className = `road-milestone milestone-${milestone.side}`;
    milestoneEl.style.position = 'absolute';
    milestoneEl.style.left = `${(point.x / 1000) * 100}%`;
    milestoneEl.style.top = `${(point.y / 2400) * 100}%`;
    milestoneEl.style.transform = 'translate(-50%, -50%)';
    
    milestoneEl.innerHTML = `
      <div class="milestone-card ${milestone.isInfoBox ? 'info-box-style' : ''}">
        <div class="milestone-marker"></div>
        <div class="milestone-content">
          <span class="milestone-date">${milestone.date}</span>
          <h3 class="milestone-title">${milestone.title}</h3>
          <p class="milestone-role">${milestone.role}</p>
          <p class="milestone-desc">${milestone.desc}</p>
          <div class="milestone-chips">
            ${milestone.chips.map(chip => `<span class="chip">${chip}</span>`).join('')}
          </div>
          ${milestone.quote ? `<p class="milestone-quote">"${milestone.quote}"</p>` : ''}
        </div>
      </div>
    `;
    
    milestonesContainer.appendChild(milestoneEl);
  });

  // Scroll animation
  function updateRoadProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(scrollTop / docHeight, 1);
    
    const offset = pathLength * (1 - scrollPercent);
    
    if (roadDash) {
      roadDash.style.strokeDashoffset = offset;
    }
    
    if (roadGlow) {
      roadGlow.style.strokeDashoffset = offset;
      roadGlow.style.opacity = 0.1 + (scrollPercent * 0.4);
    }
    
    if (progressBar) {
      progressBar.style.width = `${scrollPercent * 100}%`;
    }
  }

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateRoadProgress();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial call
  updateRoadProgress();

  console.log('Road system initialized successfully');
});