// MAPA
var map = L.map('map').setView([-21.2522, -52.0353], 14);

// BASE
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// DADOS TEMPORÁRIOS
const dadosCasos = {
    "Coqueiral": 25
};

// COR
function getColor(casos) {
    return casos > 30 ? '#e74c3c' :
        casos > 15 ? '#f39c12' :
            casos > 5 ? '#f1c40f' :
                '#2ecc71';
}

// ESTILO
function style(feature) {
    return {
        fillColor: getColor(feature.properties.casos),
        weight: 2,
        color: 'white',
        fillOpacity: 0.7
    };
}

// ==========================
//  CAIXA DE INFO (TOPO)
// ==========================
var info = L.control({ position: 'topright' });

info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Dados do Bairro</h4>' + (props ?
        '<b>' + props.name + '</b><br />Casos: ' + props.casos
        : 'Clique em um bairro');
};

info.addTo(map);

// ==========================
//  RESETAR TODOS OS BAIRROS
// ==========================
function resetAllStyles() {
    geojson.eachLayer(function (layer) {
        geojson.resetStyle(layer);
    });
}

// ==========================
// EVENTOS (AGORA COM CLIQUE)
// ==========================
function onEachFeature(feature, layer) {

    layer.on({
        click: function (e) {

            resetAllStyles(); // limpa os outros

            var layer = e.target;

            // destaque visual
            layer.setStyle({
                weight: 3,
                color: '#2c3e50',
                fillOpacity: 0.9
            });

            //  atualiza a caixa no canto
            info.update(layer.feature.properties);
        }
    });


}

// ==========================
// GEOJSON
// ==========================
var geojson;

fetch('bairros.geojson')
    .then(res => res.json())
    .then(data => {

        data.features.forEach(feature => {
            const nome = feature.properties.name;
            feature.properties.casos = dadosCasos[nome] || 0;
        });

        geojson = L.geoJSON(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        // ajusta o zoom automaticamente
        map.fitBounds(geojson.getBounds());
    });

// ==========================
//  LEGENDA (INFERIOR)
// ==========================
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');

    var grades = [0, 5, 15, 30];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);