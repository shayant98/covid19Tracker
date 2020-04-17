import Map from "./MapBox.js";

const Mapbox = new Map('map', 2, 'mapbox://styles/mapbox/dark-v10')
Mapbox.init();


const goToLocationOnMap = (long, lat) => {
    Mapbox.showLocation(long, lat)
};

const initTotalData = (confirmed, deaths, recoveries) => {
    const casesContainer = document.getElementById('totalCases')
    const deathsContainer = document.getElementById('totalDeaths')
    const recoveriesContainer = document.getElementById('totalRecoveries')

    casesContainer.innerText = confirmed
    deathsContainer.innerText = deaths
    recoveriesContainer.innerText = recoveries
}

const initCountryList = (countries) => {
    const container = document.getElementById('countriesContainer')
    countries.shift()
    countries.forEach(country => {

        const div = document.createElement('div')
        const nameSpan = document.createElement('span')

        div.classList.add('list-group-item', 'text-dark')

        nameSpan.innerText = country.name


        div.appendChild(nameSpan)
        container.appendChild(div)



    });
}

const initData = () => {
    fetch(`${window.location.origin}/api/currentstatus`)
        .then(res => {

            return res.json();
        }).then(data => {
            initTotalData(data.totalCases, data.totalDeaths, data.totalRecoveries)
            initCountryList(data.casesByCountry)
        }).catch(e => {
            console.error(e)
        });
};

initData()