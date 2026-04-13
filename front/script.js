var map = L.map('map').setView([-21.2522, -52.0353], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Exemplo de marcador
L.marker([-21.2522, -52.0353])
    .addTo(map)
    .bindPopup("<b>Brasilândia - MS</b><br>Centro da cidade")
    .openPopup();