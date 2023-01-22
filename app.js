const ip = document.getElementById('ip');
const form = document.querySelector('form');
const ipAddress = document.querySelector('.ip-address');
const location = document.querySelector('.location');
const timezone = document.querySelector('.timezone');
const isp = document.querySelector('.ispname');

const pointer = L.icon({
    iconUrl: '/images/icon-location.svg',
    iconSize: [40, 50],
    iconAnchor: [20, 25],
});

// map display on page
const map = L.map('map', {
    zoomControl: false,
});

L.titleLayer('https://{s}.title.osm.org/{z}/{x}/{y}.png', {
    attribution: `Challenge by
    <a href="https://www.frontendmentor.io?ref=challenge" target="_blank"
      >Frontend Mentor</a
    >. Coded by <a href="#">@infiniteltd</a>`
}).addTo(map);

// check if any pointer came with the map
let myMarker;

const mapDisplay = (lat, lng) => {
    map.setView([lat, lng], 16);

    if (myMarker != null) myMarker.remove();

    myMarker = L.marker([lat, lng], { icon: pointer });

    myMarker.addTo(map);
};

// Get the data from Api
const getData = (inputValue = '', searchType = 'IP') => {
    const url =
        searchType === 'IP'
            ? `https://geo.ipify.org/api/v2/country?apiKey=at_82pLq6HSQNSmxSqxLlXSQvDF7l612&ipAddress=${inputValue}`
            : `https://geo.ipify.org/api/v2/country?apiKey=at_82pLq6HSQNSmxSqxLlXSQvDF7l612&domain=${inputValue}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            ipAddress.innerText = data.ip;
            location.innerText = `${data.location.region}, ${data.location.city}`;
            timezone.innerText = `UTC ${data.location.timezone}`;
            isp.innerText = data.isp;
            mapDisplay(data.location.lat, data.location.lng);
        })

        .catch((error) => {
            ipAddress.innerText = '_';
            location.innerText = '_';
            timezone.innerText = '_';
            isp.innerText = '_';

            const input = ip.searchInput;
            input.classList.add("error");

            setTimeout(() => input.classList.remove('error'), 3000);
            console.error(error);
        });

};



// Search for your IP to get details

const regexIP = /^\b([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b(\.\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b){3}$/;
const regexDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;

ip.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = ip.searchInput;

    if (input.value.match(regexIP)) {
        getData(input.value);
    }

    if (input.value.match(regexDomain)) {
        getData(input.value, (searchType = 'DOMAIN'));
    }

    if (!input.value.match(regexDomain) && !input.value.match(regexIP)) {
        input.classList.add('error');

        setTimeout(() => input.classList.remove('error'), 3000);
    }
});

getData();