import Map from "./MapBox.js";

const searchInput = document.getElementById('countrySearch');
const Mapbox = new Map('map', 2, 'mapbox://styles/mapbox/dark-v10')
Mapbox.init();


const goToLocationOnMap = (long, lat) => {
    Mapbox.showLocation(long, lat)
};

const setListItemActiveState = (currentListItem) => {
    const countryListItems = document.querySelectorAll('.countryListItems');
    const mode = localStorage.getItem('modeSwitch')
    countryListItems.forEach(listItem => {
        if (listItem !== currentListItem.target.closest("li")) {

            listItem.classList.add((mode === "dark") ? "bg-dark" : "bg-light")
            listItem.classList.remove("active");
        } else {
            listItem.classList.remove("bg-dark")
            listItem.classList.remove("bg-light")
            listItem.classList.add("active");
        }
    });
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
    const mode = localStorage.getItem('modeSwitch')
    countries.shift()
    countries.forEach(country => {
        const li = document.createElement("li");
        const countryNameSpan = document.createElement('span');
        const badgeContainer = document.createElement('div');
        const totalCasesBadge = document.createElement('span');
        const totalDeathsBadge = document.createElement('span');
        const totalRecoveriesBadge = document.createElement('span');



        li.classList.add('list-group-item', 'countryListItems', 'mt-3', 'shadow', (mode === "dark") ? 'bg-dark' : 'bg-light');
        li.setAttribute("data-id", `${country.name}`);
        li.setAttribute("data-region", `${country.region}`);
        countryNameSpan.classList.add("font-weight-bold", "countryName", (mode === "dark") ? 'text-white' : 'text-dark');
        countryNameSpan.innerText = country.name;

        totalCasesBadge.classList.add("badge", "badge-warning", "badge-pill", "ml-1", 'no-change');
        totalDeathsBadge.classList.add("badge", "badge-danger", "badge-pill", "ml-1", 'no-change');
        totalRecoveriesBadge.classList.add("badge", "badge-success", "badge-pill", "ml-1", 'no-change');

        totalCasesBadge.innerText = country.totalCases;
        totalDeathsBadge.innerText = country.totalDeaths;
        totalRecoveriesBadge.innerText = country.totalRecoveries;



        badgeContainer.appendChild(totalCasesBadge);
        badgeContainer.appendChild(totalDeathsBadge);
        badgeContainer.appendChild(totalRecoveriesBadge);

        li.appendChild(countryNameSpan);
        li.appendChild(badgeContainer);

        li.style.pointer = 'cursor';

        li.addEventListener("click", (countryListItem) => {
            setListItemActiveState(countryListItem);
        });


        container.appendChild(li)

    });
}

const searchList = () => {
    const countryNames = document.querySelectorAll(".countryName");
    const search = searchInput.value;


    countryNames.forEach((name) => {
        const countryName = name.textContent;
        console.log();

        const parent = name.parentElement;
        if (search.length > 0) {
            if (countryName.toString().toLowerCase().includes(search.toLowerCase())) {
                parent.style.display = "block"
            } else {
                parent.style.display = "none"
            }
        } else {
            parent.style.display = "block"
        }
    })

};

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


searchInput.addEventListener("keyup", searchList);
initData()