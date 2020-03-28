// // import DataChart from './Chart.js'
import Map from "./Map.js";


const Mapbox = new Map('map', 1, 'mapbox://styles/mapbox/dark-v10');

const searchInput = document.getElementById('countrySearch');
const refreshBtn = document.getElementById('refreshBtn');

const goToLocationOnMap = (long, lat) => {
    Mapbox.showLocation(long, lat)
};

const setListItemActiveState = (currentListItem) => {
    const countryListItems = document.querySelectorAll('.countryListItems');
    countryListItems.forEach(listItem => {
        if (listItem !== currentListItem.target.closest("li")) {

            listItem.classList.remove("active");
        } else {
            listItem.classList.add("active");
            getDetailInfo(listItem.firstChild.textContent.toLowerCase());
        }
    });
};

const renderDetails = (data) => {
    const countryDetailName = document.getElementById('countryDetailName');
    const countryDetailImage = document.getElementById('countryFlag');

    const closedCasesContainer = document.getElementById('closedCasesContainer');
    const activeCasesContainer = document.getElementById('activeCasesContainer');

    const countryDetailTotalCases = document.getElementById('countryDetailTotalCases');
    const countryDetailTotalRecoveries = document.getElementById('countryDetailTotalRecoveries');
    const countryDetailTotalDeaths = document.getElementById('countryDetailTotalDeaths');

    const countryClosedTotalCases = document.getElementById('countryClosedTotalCases');
    const countryClosedTotalRecoveries = document.getElementById('countryClosedTotalRecoveries');
    const countryClosedTotalDeaths = document.getElementById('countryClosedTotalDeaths');

    const countryActiveTotalCases = document.getElementById('countryActiveTotalCases');
    const countryActiveMild = document.getElementById('countryActiveMild');
    const countryActiveSevere = document.getElementById('countryActiveSevere');

    countryDetailName.innerText = data.CountryInfo.name;
    countryDetailImage.src = data.CountryInfo.flag;

    countryDetailTotalCases.innerText = data.totalCases;
    countryDetailTotalRecoveries.innerText = data.totalRecoveries;
    countryDetailTotalDeaths.innerText = data.totalDeaths;

    if (data.hasOwnProperty('closedCases') && data.closedCases.totalClosed !== "") {

        closedCasesContainer.style.display = "block";
        countryClosedTotalCases.innerText = data.closedCases.totalClosed;
        countryClosedTotalRecoveries.innerText = data.closedCases.totalClosedRecoveries;
        countryClosedTotalDeaths.innerText = data.closedCases.totalClosedDeaths;
    } else {
        countryClosedTotalCases.innerText = "";
        countryClosedTotalRecoveries.innerText = "";
        countryClosedTotalDeaths.innerText = "";
        closedCasesContainer.style.display = "none"
    }
    if (data.hasOwnProperty('activeCases') && data.activeCases.totalActive !== "") {
        activeCasesContainer.style.display = "block";
        countryActiveTotalCases.innerText = data.activeCases.totalActive;
        countryActiveMild.innerText = data.activeCases.totalActiveMild;
        countryActiveSevere.innerText = data.activeCases.totalActiveSevere;
    } else {
        countryActiveTotalCases.innerText = "";
        countryActiveMild.innerText = "";
        countryActiveSevere.innerText = "";
        activeCasesContainer.style.display = "none"
    }

    goToLocationOnMap(data.CountryInfo.latlng[1], data.CountryInfo.latlng[0]);
};

const parseUiValues = (data) => {
    const currentActiveLi = document.querySelector(".countryListItems.active")
    data.totalCases = currentActiveLi.lastChild.childNodes[0].textContent || 0
    data.totalDeaths = currentActiveLi.lastChild.childNodes[1].textContent || 0
    data.totalRecoveries = currentActiveLi.lastChild.childNodes[2].textContent || 0
    return data
}

const getDetailInfo = async (countryName) => {
    const res = await fetch(`${window.location.href}api/cases/${countryName}`);
    let data
    if (res.ok) {
        data = await res.json();
        if (data.totalCases === "") {
            data = parseUiValues(data);
        }

        renderDetails(data);
    }
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

const renderData = (data) => {
    const countryCount = document.getElementById('countryCount');
    const totalCases = document.getElementById('totalCases');
    const totalDeaths = document.getElementById('totalDeaths');
    const totalRecoveries = document.getElementById('totalRecoveries');
    const countryList = document.getElementById('countryList');
    const totalClosedCases = document.getElementById('totalClosedCases');
    const totalClosedRecoveries = document.getElementById('totalClosedRecoveries');
    const totalClosedDeaths = document.getElementById('totalClosedDeaths');
    const totalClosedRecoveriesPerc = document.getElementById('totalClosedRecoveriesPerc');
    const totalClosedDeathsPerc = document.getElementById('totalClosedDeathsPerc');
    const totalActiveCases = document.getElementById('totalActiveCases');
    const totalActiveMild = document.getElementById('totalActiveMild');
    const totalActiveSevere = document.getElementById('totalActiveSevere');
    const totalActiveMildPerc = document.getElementById('totalActiveMildPerc');
    const totalActiveSeverePerc = document.getElementById('totalActiveSeverePerc');

    countryCount.innerText = data.casesByCountry.length - 1;
    totalCases.innerText = data.totalCases;
    totalDeaths.innerText = data.totalDeaths;
    totalRecoveries.innerText = data.totalRecoveries;
    totalClosedCases.innerText = data.closedCases.totalClosed;
    totalClosedRecoveries.innerText = data.closedCases.totalClosedRecoveries;
    totalClosedDeaths.innerText = data.closedCases.totalClosedDeaths;
    totalActiveCases.innerText = data.activeCases.totalActive;
    totalActiveMild.innerText = data.activeCases.totalActiveMild;
    totalActiveSevere.innerText = data.activeCases.totalActiveSevere;
    totalActiveMildPerc.innerText = `${data.activeCases.totalActiveMildPerc}%`;
    totalActiveSeverePerc.innerText = `${data.activeCases.totalActiveSeverePerc}%`;
    totalClosedRecoveriesPerc.innerText = `${data.activeCases.totalClosedRecoveriesPerc}%`;
    totalClosedDeathsPerc.innerText = `${data.activeCases.totalClosedDeathsPerc}%`;

    countryList.innerHTML = '';
    for (let i = 0; i < data.casesByCountry.length - 1; i++) {
        const li = document.createElement("li");
        const countryNameSpan = document.createElement('span');
        const badgeContainer = document.createElement('div');
        const totalCasesBadge = document.createElement('span');
        const totalDeathsBadge = document.createElement('span');
        const totalRecoveriesBadge = document.createElement('span');
        li.classList.add('list-group-item', 'countryListItems');
        countryNameSpan.classList.add("font-weight-bold", "countryName");
        countryNameSpan.innerText = data.casesByCountry[i].name;

        totalCasesBadge.classList.add("badge", "badge-warning", "badge-pill", "ml-1");
        totalDeathsBadge.classList.add("badge", "badge-danger", "badge-pill", "ml-1");
        totalRecoveriesBadge.classList.add("badge", "badge-success", "badge-pill", "ml-1");

        totalCasesBadge.innerText = data.casesByCountry[i].totalCases;
        totalDeathsBadge.innerText = data.casesByCountry[i].totalDeaths;
        totalRecoveriesBadge.innerText = data.casesByCountry[i].totalRecoveries;

        badgeContainer.appendChild(totalCasesBadge);
        badgeContainer.appendChild(totalDeathsBadge);
        badgeContainer.appendChild(totalRecoveriesBadge);

        li.appendChild(countryNameSpan);
        li.appendChild(badgeContainer);

        li.style.pointer = 'cursor';

        li.addEventListener("click", (countryListItem) => {
            setListItemActiveState(countryListItem);
        });
        countryList.appendChild(li);
    }
};

const initData = () => {
    fetch(`${window.location.href}api/currentstatus`)
        .then(res => {

            return res.json();
        }).then(data => {
            const spinners = document.querySelectorAll('.fa-circle-notch');
            const refreshSpinner = document.getElementById('refreshSpinner');

            refreshSpinner.classList.remove('fa-spin');
            spinners.forEach(el => {
                el.style.display = 'none';
            });
            renderData(data);
        }).catch(e => {
            console.error(e)
        });
};
function forceRefresh() {
    const spinner = document.getElementById('refreshSpinner');
    spinner.classList.add('fa-spin');
    initData();
}

searchInput.addEventListener("keyup", searchList);

refreshBtn.addEventListener("click", forceRefresh);


window.onload = () => {
    // statCounter();
    initData();
    Mapbox.init();
};
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}