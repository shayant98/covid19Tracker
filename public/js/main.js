// // import DataChart from './Chart.js'
import Map from "./Map.js";


const Mapbox = new Map('map', 1, 'mapbox://styles/mapbox/dark-v10');

const searchInput = document.getElementById('countrySearch');
const refreshBtn = document.getElementById('refreshBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');

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
    const stateContainer = document.getElementById('stateContainer');

    const stateList1 = document.getElementById('stateList1')
    const stateList2 = document.getElementById('stateList2')

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
    if (data.hasOwnProperty('caseByState')) {
        stateContainer.style.display = 'block'


        const stateCount = data.caseByState.length
        const divider = Math.floor(stateCount / 2)

        stateList1.innerHTML = ''
        stateList2.innerHTML = ''
        for (let index = 0; index < data.caseByState.length - divider; index++) {
            initStateItems(stateList1, data.caseByState[index])
        }

        for (let index = divider; index < data.caseByState.length - 3; index++) {
            initStateItems(stateList2, data.caseByState[index])
        }


    } else {
        stateList1.innerHTML = ''
        stateList2.innerHTML = ''
        stateContainer.style.display = 'none'
    }

    goToLocationOnMap(data.CountryInfo.latlng[1], data.CountryInfo.latlng[0]);
};
const initStateItems = (list, data) => {

    const li = document.createElement('li')
    const totalCasesBadge = document.createElement('span');
    const totalDeathsBadge = document.createElement('span');
    const activeCases = document.createElement('span');

    let liBgColor = 'bg-dark'
    let liTxtColor = 'text-white'
    if (localStorage.getItem('modeSwitch') === 'light') {
        liBgColor = 'bg-light'
        liTxtColor = 'text-dark'

    }
    li.classList.add('list-group-item', 'stateListItem', liBgColor, liTxtColor)
    totalCasesBadge.classList.add("badge", "badge-warning", "badge-pill", "ml-1", 'float-right');
    totalDeathsBadge.classList.add("badge", "badge-danger", "badge-pill", "ml-1", 'float-right');
    activeCases.classList.add("text-info");

    li.innerText = data.state
    totalCasesBadge.innerText = data.totalCases
    totalDeathsBadge.innerText = data.totalDeaths
    activeCases.innerText = ` Active Cases: ${data.activeCases}`

    li.appendChild(totalDeathsBadge)
    li.appendChild(totalCasesBadge)
    li.appendChild(activeCases)
    list.appendChild(li)
}

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

const saveCountry = (button) => {
    let icon;
    if (button.nodeName === "I") {
        icon = button
    } else {
        icon = button.firstChild
    }

    if (icon.classList.contains('far')) {
        setStarSolid(icon)
    } else {
        setStarEmpty(icon)
    }
    saveCountriesToLocalStorage()
    showStarredCountries()


}

const saveCountriesToLocalStorage = () => {
    const countryArray = []
    const solidStars = document.querySelectorAll('.fas.fa-star');
    localStorage.removeItem('countries')
    solidStars.forEach(starIcon => {
        const parentLi = starIcon.parentElement.parentElement;
        const countryName = parentLi.firstChild.textContent
        countryArray.push(countryName)
    });

    localStorage.setItem('countries', countryArray.toString())

}

const setStarSolid = icon => {
    icon.classList.remove('far')
    icon.classList.add('fas')
}
const setStarEmpty = icon => {
    icon.classList.remove('fas')
    icon.classList.add('far')
}

const initStarredCountries = () => {

    const countryArray = getCountriesFromLS()

    const countryListItems = document.querySelectorAll(".list-group-item.countryListItems")

    countryArray.forEach(country => {
        for (const countryListItem of countryListItems) {
            if (countryListItem.firstChild.textContent === country) {
                const icon = countryListItem.childNodes[1].childNodes[0];
                setStarSolid(icon)

            }
        }
    });
}

const getCountriesFromLS = () => {

    const countries = localStorage.getItem('countries')
    return countries.split(",");
}

const scrollToCountry = (target) => {
    const li = document.querySelector(`[data-id="${target.textContent}"]`)
    li.scrollIntoView({
        behavior: 'smooth'
    });
    li.click()

}
const showStarredCountries = () => {
    const countryArray = getCountriesFromLS()
    const starredContainer = document.getElementById('starredContainer')
    starredContainer.innerHTML = ''
    countryArray.forEach(country => {
        const button = document.createElement("button")
        if (localStorage.getItem('modeSwitch') === 'light') {
            button.classList.add('btn', 'rounded-pill', 'btn-sm', 'btn-outline-dark', 'ml-2', 'mt-1')
        } else {
            button.classList.add('btn', 'rounded-pill', 'btn-sm', 'btn-outline-light', 'ml-2', 'mt-1')
        }
        button.innerText = country
        button.addEventListener("click", (e) => {
            scrollToCountry(e.target);
        })
        starredContainer.appendChild(button)
    });
}

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
        const starIcon = document.createElement('i')
        const starButton = document.createElement("button")

        starButton.classList.add('btn', 'btn-outline-light', 'float-right')
        starIcon.classList.add('far', 'fa-star', 'text-danger')

        starButton.appendChild(starIcon);

        li.classList.add('list-group-item', 'countryListItems');
        li.setAttribute("data-id", `${data.casesByCountry[i].name}`);
        countryNameSpan.classList.add("font-weight-bold", "countryName", "no-change", "text-dark");
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
        li.appendChild(starButton)
        li.appendChild(badgeContainer);

        li.style.pointer = 'cursor';

        li.addEventListener("click", (countryListItem) => {
            setListItemActiveState(countryListItem);
        });

        starButton.addEventListener("click", (e) => {
            e.stopPropagation();
            saveCountry(e.target)
        })
        countryList.appendChild(li);
    }
    showStarredCountries()


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
            initStarredCountries()
        }).catch(e => {
            console.error(e)
        });
};

const initTogglerBtn = () => {
    if (localStorage.getItem('modeSwitch') === 'light') {
        toggleModeBtn.classList.add('btn-outline-dark')
        toggleModeBtn.classList.remove('btn-outline-light')
        toggleModeBtn.innerHTML = '<i class="fas fa-moon"></i>'

    } else {
        toggleModeBtn.classList.add('btn-outline-light')
        toggleModeBtn.classList.remove('btn-outline-dark')
        toggleModeBtn.innerHTML = '<i class="fas fa-sun"></i>'
    }

}

const toggleLightDarkMode = () => {
    if (localStorage.getItem('modeSwitch') === 'dark') {
        toggleLightMode()
    } else {
        toggleDarkMode()
    }
    initTogglerBtn()
}


const toggleLightMode = () => {

    document.querySelectorAll('.bg-dark').forEach(element => {
        element.classList.remove('bg-dark')
        element.classList.add('bg-light')
    });
    document.querySelectorAll('.text-white').forEach(element => {
        if (!element.classList.contains('no-change')) {
            element.classList.remove('text-white')
            element.classList.add('text-dark')
        }

    });
    document.querySelectorAll('.btn-dark').forEach(element => {
        element.classList.remove('btn-dark')
        element.classList.add('btn-light')
    });
    document.querySelectorAll('.btn-outline-light').forEach(element => {
        element.classList.remove('btn-outline-light')
        element.classList.add('btn-outline-dark')
    });
    saveModeToLS('light')

}

const toggleDarkMode = () => {
    document.querySelectorAll('.bg-light').forEach(element => {
        element.classList.remove('bg-light')
        element.classList.add('bg-dark')
    });
    document.querySelectorAll('.text-dark').forEach(element => {
        if (!element.classList.contains('no-change')) {
            element.classList.remove('text-dark')
            element.classList.add('text-white')
        }
    });
    document.querySelectorAll('.btn-light').forEach(element => {
        element.classList.remove('btn-light')
        element.classList.add('btn-dark')
    });
    document.querySelectorAll('.btn-outline-dark').forEach(element => {
        element.classList.remove('btn-outline-dark')
        element.classList.add('btn-outline-light')
    });
    saveModeToLS('dark')
}

const saveModeToLS = (mode) => {
    localStorage.removeItem('modeSwitch');
    localStorage.setItem('modeSwitch', mode);
}

const getModeFromLS = () => {
    const mode = localStorage.getItem('modeSwitch')

    if (mode === 'light') {
        toggleLightMode();
    } else {
        toggleDarkMode();
    }
}
function forceRefresh() {
    const spinner = document.getElementById('refreshSpinner');
    spinner.classList.add('fa-spin');
    initData();
}

searchInput.addEventListener("keyup", searchList);

refreshBtn.addEventListener("click", forceRefresh);
toggleModeBtn.addEventListener("click", toggleLightDarkMode)
getModeFromLS()
window.onload = () => {

    initTogglerBtn()
    initData();
    Mapbox.init();

};
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}