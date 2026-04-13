function getColor(status) {
    if (status === "ativa") return "green";
    if (status === "cheia") return "red";
    return "blue"
}



var map = L.map('map').setView([-21.48, -51.53], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

//vou precisar dos dados do backend para adicionar no js

fetch('')
then(res => res.json())
    .then(dados => {
        dados.forEach(p => {
            L.circleMarker([p.lat, p.lng], {
                radius: 8,
                color: getColor(p.status),
                fillColor: getColor(p.status),
                fillOpacity: 0.8
            })
                .addTo(map)
                .bindPopup(`Status: ${p.status}<br>Bairro: ${p.bairro}`);
        });
    });

//aqui vai entrar os casos de dengue, porém preciso dos dados do back tbm
fetch('')
    .then()