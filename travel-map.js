// Lightweight Leaflet map with year filters
(function(){
  // Check dependencies first
  if (typeof L === 'undefined') {
    console.error('❌ Leaflet.js not loaded - travel map cannot initialize');
    return;
  }
  
  const mapEl = document.getElementById('travel-map');
  if (!mapEl) {
    console.warn('⚠️ Travel map element not found');
    return;
  }

  try {
    // Initialize map with error handling
    const map = L.map(mapEl, {
      zoomControl: false,
      worldCopyJump: true
    });
    
    console.log('📍 Travel map initialized successfully');
  // Use CartoDB Dark Matter (free, no auth required)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  // Data — approximate coords are fine for a travel map
  const trips = [
    // 2022
    {year:2022, city:'Miami Beach, FL, USA', name:'IFS Unleashed 2022', lat:25.7907, lng:-80.1300},

    // 2023
    {year:2023, city:'Nashville, TN, USA', name:'Kinexions 2023', lat:36.1627, lng:-86.7816},
    {year:2023, city:'Las Vegas, NV, USA', name:'Blue Yonder ICON 2023', lat:36.1699, lng:-115.1398},
    {year:2023, city:'Las Vegas, NV, USA', name:'Oracle CloudWorld 2023', lat:36.1699, lng:-115.1398},

    // 2024
    {year:2024, city:'New York City, NY, USA', name:'Infor Analyst Summit 2024', lat:40.7128, lng:-74.0060},
    {year:2024, city:'Redwood City, CA, USA', name:'Oracle Analyst Summit 2024', lat:37.4852, lng:-122.2364},
    {year:2024, city:'Dallas, TX, USA', name:'Blue Yonder ICON 2024', lat:32.7767, lng:-96.7970},
    {year:2024, city:'Miami, FL, USA', name:'Kinexions 2024', lat:25.7617, lng:-80.1918},
    {year:2024, city:'Nashville, TN, USA', name:'Epicor Insights 2024', lat:36.1627, lng:-86.7816},
    {year:2024, city:'Chamonix, France', name:'Infor ICE (International Customer Event)', lat:45.9237, lng:6.8694},
    {year:2024, city:'Las Vegas, NV, USA', name:'SuiteWorld 2024', lat:36.1699, lng:-115.1398},
    {year:2024, city:'Las Vegas, NV, USA', name:'Oracle CloudWorld 2024', lat:36.1699, lng:-115.1398},
    {year:2024, city:'Las Vegas, NV, USA', name:'Infor Velocity Summit 2024', lat:36.1699, lng:-115.1398},
    {year:2024, city:'Dallas, TX, USA', name:'JAMIS Summit 2024', lat:32.7767, lng:-96.7970},
    {year:2024, city:'Orlando, FL, USA', name:'IFS Unleashed 2024', lat:28.5383, lng:-81.3792},
    {year:2024, city:'Miami, FL, USA', name:'CMiC Connect 2024', lat:25.7617, lng:-80.1918},
    {year:2024, city:'Philadelphia, PA, USA', name:'Unit4 Analyst Summit 2024', lat:39.9526, lng:-75.1652},
    {year:2024, city:'Washington, DC, USA', name:'Deltek ProjectCon 2024', lat:38.9072, lng:-77.0369},

    // 2025
    {year:2025, city:'New York City, NY, USA', name:'Infor Analyst Summit 2025', lat:40.7128, lng:-74.0060},
    {year:2025, city:'Redwood City, CA, USA', name:'Oracle Analyst Summit 2025', lat:37.4852, lng:-122.2364},
    {year:2025, city:'Austin, TX, USA', name:'Kinexions 2025', lat:30.2672, lng:-97.7431},
    {year:2025, city:'Atlanta, GA, USA', name:'RELEX Live 2025', lat:33.7490, lng:-84.3880},
    {year:2025, city:'Nashville, TN, USA', name:'Blue Yonder 2025', lat:36.1627, lng:-86.7816},
    {year:2025, city:'Las Vegas, NV, USA', name:'Epicor Insights 2025', lat:36.1699, lng:-115.1398},
    {year:2025, city:'Amsterdam, Netherlands', name:'o9 Solutions aim10x (EU)', lat:52.3676, lng:4.9041},
    {year:2025, city:'San Diego, CA, USA', name:'Samsara Beyond 2025', lat:32.7157, lng:-117.1611},
    {year:2025, city:'Chicago, IL, USA', name:'FourKites Summit 2025', lat:41.8781, lng:-87.6298},
    {year:2025, city:'Dallas, TX, USA', name:'o9 Solutions aim10x (US)', lat:32.7767, lng:-96.7970},
    {year:2025, city:'New York City, NY, USA', name:'IFS IndustrialX', lat:40.7128, lng:-74.0060},
    {year:2025, city:'Las Vegas, NV, USA', name:'SuiteWorld 2025', lat:36.1699, lng:-115.1398},
    {year:2025, city:'Las Vegas, NV, USA', name:'Oracle CloudWorld 2025', lat:36.1699, lng:-115.1398},
  ];

  // Year -> color
  const colors = { 2022:'#8ae3ff', 2023:'#9b8cff', 2024:'#5cff8a', 2025:'#ffd166' };

  // Marker layer
  const layersByYear = { 2022:L.layerGroup(), 2023:L.layerGroup(), 2024:L.layerGroup(), 2025:L.layerGroup() };

  // Group trips by location to handle multiple conferences per city
  const locationGroups = {};
  trips.forEach(t => {
    const key = `${t.lat},${t.lng}`;
    if (!locationGroups[key]) {
      locationGroups[key] = {
        lat: t.lat,
        lng: t.lng,
        city: t.city,
        events: []
      };
    }
    locationGroups[key].events.push(t);
  });

  // Build markers
  const bounds = [];
  Object.values(locationGroups).forEach(location => {
    // Sort events by year
    location.events.sort((a, b) => a.year - b.year);
    
    // Determine marker color (use most recent year)
    const latestYear = Math.max(...location.events.map(e => e.year));
    const markerColor = colors[latestYear];
    
    // Create larger, more visible marker
    const m = L.circleMarker([location.lat, location.lng], {
      radius: 10, // Increased from 6
      color: markerColor,
      weight: 3, // Increased from 2
      fillColor: markerColor,
      fillOpacity: 0.6, // Increased from 0.35
      stroke: true
    });
    
    // Create popup content with all events for this location
    let popupContent = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #eaf0ff; min-width: 200px;">`;
    popupContent += `<h4 style="margin: 0 0 8px 0; color: #8ae3ff; font-size: 16px;">${location.city}</h4>`;
    
    // Group events by year for better organization
    const eventsByYear = {};
    location.events.forEach(event => {
      if (!eventsByYear[event.year]) eventsByYear[event.year] = [];
      eventsByYear[event.year].push(event);
    });
    
    Object.keys(eventsByYear).sort().forEach(year => {
      popupContent += `<div style="margin-bottom: 6px;">`;
      popupContent += `<span style="color: ${colors[year]}; font-weight: 600; font-size: 14px;">${year}:</span><br>`;
      eventsByYear[year].forEach(event => {
        popupContent += `<span style="color: #eaf0ff; font-size: 13px; line-height: 1.4;">• ${event.name}</span><br>`;
      });
      popupContent += `</div>`;
    });
    
    popupContent += `</div>`;
    
    m.bindPopup(popupContent, {
      maxWidth: 300,
      className: 'custom-popup'
    });
    
    // Add to appropriate year layers (add to all years that have events at this location)
    const yearsAtLocation = [...new Set(location.events.map(e => e.year))];
    yearsAtLocation.forEach(year => {
      m.addTo(layersByYear[year]);
    });
    
    bounds.push([location.lat, location.lng]);
  });

  // Add all layers to map initially
  Object.values(layersByYear).forEach(l => l.addTo(map));
  if (bounds.length) map.fitBounds(bounds, { padding:[20,20] });

  // Filters
  const boxes = document.querySelectorAll('.travel-filters input[type="checkbox"]');
  boxes.forEach(box => {
    box.addEventListener('change', () => {
      const y = box.value;
      if (box.checked) layersByYear[y].addTo(map);
      else map.removeLayer(layersByYear[y]);
    });
  });

  // Optional: custom legend
  const legend = L.control({position:'bottomleft'});
  legend.onAdd = function(){
    const div = L.DomUtil.create('div','legend');
    div.style.padding='8px 10px'; div.style.background='#0c111a'; div.style.border='1px solid #24304b'; div.style.borderRadius='10px';
    div.innerHTML = '<strong>Years</strong><br>' +
      Object.entries(colors).map(([y,c]) => `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};margin-right:6px;"></span>${y}`).join('<br>');
    return div;
  };
  legend.addTo(map);
  
  } catch (error) {
    console.error('❌ Travel map initialization failed:', error);
    // Hide the map container if there's an error
    if (mapEl) {
      mapEl.style.display = 'none';
      mapEl.insertAdjacentHTML('afterend', 
        '<div style="text-align: center; color: var(--muted); padding: 40px;">Map temporarily unavailable</div>'
      );
    }
  }
})();