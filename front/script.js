//  MAPA
var map = L.map('map').setView([-21.2522, -52.0353], 14);

// BASE
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// DADOS (CASOS) TEMPORÁRIOS

const dadosCasos = {
    "Coqueiral": 25,
    "Jardim Mão Amiga": 10,
    "Jardim Brasilia II": 8,
    "Residencial Valle Verde": 5,
    "Jardim Imperial": 12,
    "Jardim Brasilia I": 6,
    "Jardim Camargo I": 20,
    "Jardim Camargo II": 18,
    "Jardim Primavera": 9,
    "Centro": 35,
    "São Domingos": 7,
    "Isac Honorato Barbosa": 11,
    "Parque João De Abreu l": 4,
    "Parque João De Abreu II": 6,
    "Flavio Derzi": 14,
    "José Rodrigues Da Silva": 13,
    "João Paulo da Silva": 16,
    "José Inácio Batista": 3,
    "José Alves De Freitas": 2,
    "Juvenal Serafim Uchoa": 1
};




//  COR BAIRROS

function getColor(casos) {
    return casos > 30 ? '#ef9a9a' :
        casos > 15 ? '#ffcc80' :
            casos > 5 ? '#fff59d' :
                '#a5d6a7';
}



//  ESTILO BAIRROS

function style(feature) {
    return {
        fillColor: getColor(feature.properties.casos),
        weight: 1,
        color: '#ffffff',
        fillOpacity: 0.4
    };
}

// ==========================
//  INFO (CLIQUE)
// ==========================
var info = L.control({ position: 'topright' });

info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4> Dados do Bairro</h4>' + (props ?
        `<b>${props.name}</b><br>
         Casos: <b>${props.casos}</b>` :
        'Clique em um bairro');
};

info.addTo(map);

// ==========================
//  EVENTOS
// ==========================
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#2c3e50',
        fillOpacity: 0.7
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    info.update(e.target.feature.properties);
}

// ==========================
//  LIGAÇÃO BAIRROS
// ==========================
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// ==========================
//  GEOJSON
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

        map.fitBounds(geojson.getBounds());
    });



// ==========================
// LEGENDA BAIRROS
// ==========================
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');

    var grades = [0, 5, 15, 30];
    var labels = ['Baixo', 'Moderado', 'Alto', 'Crítico'];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            `<i style="background:${getColor(grades[i] + 1)}"></i>
             ${labels[i]} (${grades[i]}${grades[i + 1] ? '–' + grades[i + 1] : '+'})<br>`;
    }

    return div;
};

legend.addTo(map);

