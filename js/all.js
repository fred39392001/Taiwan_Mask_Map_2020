//載入地圖
// const map = L.map('map').setView([40.731701, -73.993411
// ], 16);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

const map = L.map('map', {
    center: [23.7558752,120.6875181],
    zoom: 16
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);
//取得使用者定位
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition, showError);
// } else {
//     alert("您的瀏覽器不支援定位系統");
//     let position = {
//         coords: {
//             latitude: '23.8523405',
//             longitude: '120.9009427',
//         },
//         zoom: 7,
//     }
//     showPosition(position);
// }

// function showPosition(position) {
//     let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], position.zoom || 17);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(map);
// }

// function showError(error) {
//     let position = {
//         coords: {
//             latitude: '23.8523405',
//             longitude: '120.9009427',
//         },
//         zoom: 7,
//     }
//     switch (error.code) {
//         case error.PERMISSION_DENIED:
//             alert("讀取不到您目前的位置");
//             showPosition(position);
//             break;
//         case error.POSITION_UNAVAILABLE:
//             alert("讀取不到您目前的位置");
//             showPosition(position);
//             break;
//         case error.TIMEOUT:
//             alert("讀取位置逾時");
//             showPosition(position);
//             break;
//         case error.UNKNOWN_ERROR:
//             alert("Error");
//             showPosition(position);
//             break;
//     }
// }

let mask;

const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const markers = new L.MarkerClusterGroup().addTo(map);
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position){
        let yourLat = position.coords.latitude;
        let yourLng = position.coords.longitude;
        console.log(yourLat, yourLng);
        marker.setLatLng([yourLat,yourLng]).bindPopup(
            `<h3>你的位置</h3>`);
        });
    } else {
        console.log('geolocation is not available');
    };


// function getUserPosition() {
//     if (navigator.geolocation) {
//         function showPosition(position) {
//             let yourLat = position.coords.latitude;
//             let yourLng = position.coords.longitude;
//             L.marker([yourLat, yourLng], { icon: violetIcon }).addTo(map)
//                 .bindPopup("<p>我在這裡</p>").openPopup();
//         }

//         function showError() {
//             console.log('抱歉，現在無法取的您的地理位置。')
//         }

//         navigator.geolocation.getCurrentPosition(showPosition, showError);
//     } else {
//         console.log('抱歉，您的裝置不支援定位功能。');
//     }

const xhr = new XMLHttpRequest();
xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
xhr.send();
xhr.onload = function(){
    const data = JSON.parse(xhr.responseText).features;
    for(let i = 0;i<data.length;i++){
        const pharmacyName = data[i].properties.name;
        const maskAdult = data[i].properties.mask_adult;
        const maskChild = data[i].properties.mask_child;
        const lat = data[i].geometry.coordinates[1];
        const lng = data[i].geometry.coordinates[0];
        // console.log(pharmacyName);
        if(maskAdult == 0 || maskChild == 0){
            mask = redIcon;
        }else{
            mask = greenIcon;
        }
        markers.addLayer(L.marker([lat,lng], {icon: mask}).bindPopup(
        `<h1>${pharmacyName}</h1>
        <p>成人口罩數量${maskAdult}</p>
        <p>兒童口罩數量${maskChild}</p>`));
    }
    map.addLayer(markers);
}