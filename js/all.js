//載入地圖
const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const violetIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const marker = L.marker([0, 0] , {icon:violetIcon}).addTo(map);

//定位使用者位置
if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(position => {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    console.log(userLat, userLng);
    map.setView([userLat, userLng], 13);
    marker.setLatLng([userLat,userLng]).bindPopup(
        `<h3>你的位置</h3>`)
        .openPopup();
    });
} else {
    console.log('geolocation not available');
}

//新增定位按鈕
let geoBtn = document.getElementById('jsGeoBtn');
geoBtn.addEventListener('click',function(){
    map.setView([userLat, userLng], 13);
},false);


//定義marker顏色
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

//取出全國藥局JSON資料至全域變數
let data;

function getData(){
    const xhr = new XMLHttpRequest;
    xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',true)
    xhr.send(null);
    xhr.onload = function(){
        data = JSON.parse(xhr.responseText).features;
        addMarker();
        renderList('南投縣');
        addCountyList();
    }
}

function init(){
    renderDate();
    getData();
}

init();

//將marker群組套件載入
const markers = new L.MarkerClusterGroup().addTo(map);

//倒入全國藥局資料並標上marker
function addMarker(){
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
            `<p style="text-align:center; font-weight:bold; font-size:1.5em; margin:15px 0;">${pharmacyName}</p>
            <div style="display:flex; justify-content:center;">
            <span style="color:white; background-color:#73C0D8; border-radius:50px; padding:5px; width:100px; margin-right:5%; text-align:center; font-size:12pt;">成人:${maskAdult}</span>
            <span style="color:white; background-color:#73C0D8; border-radius:50px; padding:5px;width:100px;text-align:center;font-size:12pt;">兒童:${maskChild}</span>
            </div>`
        ));
    }
    map.addLayer(markers);
}

//在panel印出今天日期
function renderDate(){
    const dateInfo = new Date();
    const day = dateInfo.getDay();
    const date = dateInfo.getDate();
    const month = dateInfo.getMonth();
    const year = dateInfo.getFullYear();
    const dayChinese = judgeChineseDay(day);
    let today;
    if(month == '10' || month == '11' || month == '12'){
        today = year + '-' + (month+1) + '-' + date;
        }else{
        today = year + '-0' + (month+1) + '-' + date;
        }
    if(day == 1 || day == 3 || day == 5){
        document.querySelector('.idNumOdd').style.display = 'block';
    }else if(day == 2 || day == 4 || day == 6){
        document.querySelector('.idNumEven').style.display = 'block';
    }
    else if(day == 7){
        document.querySelector('.idNumAll').style.display = 'block';
    }else{
        alert('沒有這一天');
    }
        document.querySelector('.todayDate').textContent = today;
        document.querySelector('.infoWeek h2 span').textContent = dayChinese;
    }

//判斷星期幾並把數字轉成中文字
function judgeChineseDay(day){
    switch(day){
        case 1:
            return '一';
            break;
        case 2:
            return '二';
            break;
        case 3:
            return '三';
            break;
        case 4:
            return '四';
            break;
        case 5:
            return '五';
            break;
        case 6:
            return '六';
            break;
        case 7:
            return '日';
            break;
    }

}

// document.querySelector('.countyList option').textContent='南投縣';

//縣市選單
const countySelector = document.querySelector('.countyList');
function addCountyList(){
    let allCounty = [];
    let countyStr='';
    countyStr += '<option>--請選擇縣市--</option>'
    for(let i=0;i<data.length;i++){
        const countyName = data[i].properties.county;
        if(allCounty.indexOf(countyName) == -1 && countyName !== ''){
        allCounty.push(countyName);
        countyStr += `<option>${countyName}</option>`
        }
    }
    countySelector.innerHTML = countyStr;
}
const townSelector = document.querySelector('.townList');
function addTownList(){
    let allTown = [];
    let townStr='';
    townStr += '<option>--請選擇鄉鎮市區--</option>'
    for(let i=0;i<data.length;i++){
        const countyName = data[i].properties.county;
        const townName = data[i].properties.town;
        if(allTown.indexOf(townName) == -1 ){
        allTown.push(townName);
        countyStr += `<option>${townName}</option>`
        }
    }
    countySelector.innerHTML = townStr;
}

//在左邊欄印出藥局名稱
function renderList(county){
    let str = '';
    for(let i = 0;i<data.length;i++){
        const countyName = data[i].properties.county;
        const pharmacyName = data[i].properties.name;
        const maskAdult = data[i].properties.mask_adult;
        const maskChild = data[i].properties.mask_child;
        if(countyName == county){
            str+=`<ul>
            <div class="maskContent">
            <li>${pharmacyName}</li>
            <div class="panelMaskNum">
            <span class="gray">成人口罩數量${maskAdult}</span>
            <span>兒童口罩數量${maskChild}</span>
            </div>
            </div>
            </ul>`
        }
    }
        document.querySelector('.pharmacyList').innerHTML = str;
}