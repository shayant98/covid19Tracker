const searchInput = document.getElementById("countrySearch");
const refreshBtn = document.getElementById("refreshBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const RegionSwitchers = document.querySelectorAll(".regionSwitchers");

const switchRegion = (newRegion) => {
  const currentRegion = document.querySelector(".regionSwitchers.active");

  currentRegion.classList.remove("active");
  newRegion.classList.add("active");

  const allCountries = document.querySelectorAll(".countryListItems");

  if (newRegion.innerText !== "All") {
    allCountries.forEach((fullListCountry) => {
      if (
        !fullListCountry
          .getAttribute("data-region")
          .includes(newRegion.innerText)
      ) {
        fullListCountry.style.display = "none";
      } else {
        fullListCountry.style.display = "block";
      }
    });
  } else {
    allCountries.forEach((fullListCountry) => {
      fullListCountry.style.display = "block";
    });
  }
};

const setListItemActiveState = (currentListItem) => {
  const countryListItems = document.querySelectorAll(".countryListItems");
  const mode = localStorage.getItem("modeSwitch");
  countryListItems.forEach((listItem) => {
    if (listItem !== currentListItem.target.closest("li")) {
      listItem.classList.add(mode === "dark" ? "bg-dark" : "bg-light");

      listItem.classList.remove("active");
    } else {
      listItem.classList.remove("bg-dark");
      listItem.classList.remove("bg-light");

      listItem.classList.add("active");
      getDetailInfo(listItem.firstChild.textContent.toLowerCase());
    }
  });
};

const renderDetails = (data) => {
  const countryDetailName = document.getElementById("countryDetailName");
  const countryDetailImage = document.getElementById("countryFlag");

  const closedCasesContainer = document.getElementById("closedCasesContainer");
  const activeCasesContainer = document.getElementById("activeCasesContainer");
  const stateContainer = document.getElementById("stateContainer");

  const stateList1 = document.getElementById("stateList1");
  const stateList2 = document.getElementById("stateList2");

  const countryDetailTotalCases = document.getElementById(
    "countryDetailTotalCases"
  );
  const countryDetailTotalRecoveries = document.getElementById(
    "countryDetailTotalRecoveries"
  );
  const countryDetailTotalDeaths = document.getElementById(
    "countryDetailTotalDeaths"
  );

  const countryClosedTotalCases = document.getElementById(
    "countryClosedTotalCases"
  );
  const countryClosedTotalRecoveries = document.getElementById(
    "countryClosedTotalRecoveries"
  );
  const countryClosedTotalDeaths = document.getElementById(
    "countryClosedTotalDeaths"
  );

  const countryActiveTotalCases = document.getElementById(
    "countryActiveTotalCases"
  );
  const countryActiveMild = document.getElementById("countryActiveMild");
  const countryActiveSevere = document.getElementById("countryActiveSevere");

  countryDetailName.innerText = data.CountryInfo.name;
  countryDetailImage.src = data.CountryInfo.flag;

  countryDetailTotalCases.innerText = data.totalCases;
  countryDetailTotalRecoveries.innerText = data.totalRecoveries;
  countryDetailTotalDeaths.innerText = data.totalDeaths;

  if (
    data.hasOwnProperty("closedCases") &&
    data.closedCases.totalClosed !== null
  ) {
    closedCasesContainer.style.display = "block";
    countryClosedTotalCases.innerText = data.closedCases.totalClosed;
    countryClosedTotalRecoveries.innerText =
      data.closedCases.totalClosedRecoveries;
    countryClosedTotalDeaths.innerText = data.closedCases.totalClosedDeaths;
  } else {
    countryClosedTotalCases.innerText = "";
    countryClosedTotalRecoveries.innerText = "";
    countryClosedTotalDeaths.innerText = "";
    closedCasesContainer.style.display = "none";
  }
  if (
    data.hasOwnProperty("activeCases") &&
    data.activeCases.totalActive !== null
  ) {
    activeCasesContainer.style.display = "block";
    countryActiveTotalCases.innerText = data.activeCases.totalActive;
    countryActiveMild.innerText = data.activeCases.totalActiveMild;
    countryActiveSevere.innerText = data.activeCases.totalActiveSevere;
  } else {
    countryActiveTotalCases.innerText = "";
    countryActiveMild.innerText = "";
    countryActiveSevere.innerText = "";
    activeCasesContainer.style.display = "none";
  }
  if (data.hasOwnProperty("caseByState")) {
    stateContainer.style.display = "block";

    const stateCount = data.caseByState.length;
    const divider = Math.floor(stateCount / 2);

    stateList1.innerHTML = "";
    stateList2.innerHTML = "";
    for (let index = 0; index < data.caseByState.length - divider; index++) {
      initStateItems(stateList1, data.caseByState[index]);
    }

    for (let index = divider; index < data.caseByState.length - 3; index++) {
      initStateItems(stateList2, data.caseByState[index]);
    }
  } else {
    stateList1.innerHTML = "";
    stateList2.innerHTML = "";
    stateContainer.style.display = "none";
  }
};
const initStateItems = (list, data) => {
  const li = document.createElement("li");
  const totalCasesBadge = document.createElement("span");
  const totalDeathsBadge = document.createElement("span");
  const totalActiveBadge = document.createElement("span");
  const totalTestsBadge = document.createElement("span");

  let liBgColor = "bg-dark";
  let liTxtColor = "text-white";
  if (localStorage.getItem("modeSwitch") === "light") {
    liBgColor = "bg-light";
    liTxtColor = "text-dark";
  }

  initBadgeTooltip(totalCasesBadge, "Confirmed");
  initBadgeTooltip(totalDeathsBadge, "Deaths");
  initBadgeTooltip(totalActiveBadge, "Active");
  initBadgeTooltip(totalTestsBadge, "Tests");

  li.classList.add("list-group-item", "stateListItem", liBgColor, liTxtColor);
  totalCasesBadge.classList.add(
    "badge",
    "badge-warning",
    "badge-pill",
    "ml-1",
    "float-right"
  );
  totalDeathsBadge.classList.add(
    "badge",
    "badge-danger",
    "badge-pill",
    "ml-1",
    "float-right"
  );
  totalActiveBadge.classList.add(
    "badge",
    "badge-info",
    "badge-pill",
    "ml-1",
    "float-right"
  );
  totalTestsBadge.classList.add(
    "badge",
    "badge-primary",
    "badge-pill",
    "ml-1",
    "float-right"
  );

  li.innerText = data.state;
  totalCasesBadge.innerText = data.totalCases;
  totalDeathsBadge.innerText = data.totalDeaths;
  totalActiveBadge.innerText = data.activeCases;
  totalTestsBadge.innerText = data.totalTest;

  li.appendChild(totalTestsBadge);
  li.appendChild(totalDeathsBadge);
  li.appendChild(totalCasesBadge);
  li.appendChild(totalActiveBadge);
  list.appendChild(li);
};

const parseUiValues = (data) => {
  const currentActiveLi = document.querySelector(".countryListItems.active");
  data.totalCases = currentActiveLi.lastChild.childNodes[0].textContent || 0;
  data.totalDeaths = currentActiveLi.lastChild.childNodes[1].textContent || 0;
  data.totalRecoveries =
    currentActiveLi.lastChild.childNodes[2].textContent || 0;
  return data;
};

const getDetailInfo = async (countryName) => {
  const res = await fetch(`${window.location.href}api/cases/${countryName}`);
  let data;
  if (res.ok) {
    data = await res.json();
    if (data.totalCases === "") {
      data = parseUiValues(data);
    }

    renderDetails(data);
  }
  $('[data-toggle="tooltip"]').tooltip();
};

const searchList = () => {
  const countryNames = document.querySelectorAll(".countryName");
  const search = searchInput.value;

  countryNames.forEach((name) => {
    const countryName = name.textContent;
    console.log();

    const parent = name.parentElement;
    if (search.length > 0) {
      if (countryName.toString().toLowerCase().includes(search.toLowerCase())) {
        parent.style.display = "block";
      } else {
        parent.style.display = "none";
      }
    } else {
      parent.style.display = "block";
    }
  });
};

const saveCountry = (button) => {
  let icon;
  if (button.nodeName === "I") {
    icon = button;
  } else {
    icon = button.firstChild;
  }

  if (icon.classList.contains("far")) {
    setStarSolid(icon);
  } else {
    setStarEmpty(icon);
  }
  saveCountriesToLocalStorage();
  showStarredCountries();
};

const saveCountriesToLocalStorage = () => {
  const countryArray = [];
  const solidStars = document.querySelectorAll(".fas.fa-star");
  localStorage.removeItem("countries");
  solidStars.forEach((starIcon) => {
    const parentLi = starIcon.parentElement.parentElement;
    const countryName = parentLi.firstChild.textContent;
    countryArray.push(countryName);
  });

  localStorage.setItem("countries", countryArray.toString());
};

const setStarSolid = (icon) => {
  icon.classList.remove("far");
  icon.classList.add("fas");
};
const setStarEmpty = (icon) => {
  icon.classList.remove("fas");
  icon.classList.add("far");
};

const initStarredCountries = () => {
  const countryArray = getCountriesFromLS();

  const countryListItems = document.querySelectorAll(
    ".list-group-item.countryListItems"
  );

  countryArray.forEach((country) => {
    for (const countryListItem of countryListItems) {
      if (countryListItem.firstChild.textContent === country) {
        const icon = countryListItem.childNodes[1].childNodes[0];
        setStarSolid(icon);
      }
    }
  });
};

const getCountriesFromLS = () => {
  const countries = localStorage.getItem("countries");
  return countries.split(",");
};

const scrollToCountry = (target) => {
  const li = document.querySelector(`[data-id="${target.textContent}"]`);
  li.scrollIntoView({
    behavior: "smooth",
  });
  li.click();
};
const showStarredCountries = () => {
  const countryArray = getCountriesFromLS();
  const starredContainer = document.getElementById("starredContainer");
  starredContainer.innerHTML = "";
  countryArray.forEach((country) => {
    const button = document.createElement("button");
    if (localStorage.getItem("modeSwitch") === "light") {
      button.classList.add(
        "btn",
        "rounded-pill",
        "btn-sm",
        "btn-outline-dark",
        "ml-2",
        "mt-1"
      );
    } else {
      button.classList.add(
        "btn",
        "rounded-pill",
        "btn-sm",
        "btn-outline-light",
        "ml-2",
        "mt-1"
      );
    }
    button.innerText = country;
    button.addEventListener("click", (e) => {
      scrollToCountry(e.target);
    });
    starredContainer.appendChild(button);
  });
};

const renderData = (data) => {
  const countryCount = document.getElementById("countryCount");
  const updateTime = document.getElementById("updateTime");
  const totalCases = document.getElementById("totalCases");
  const totalCasesToday = document.getElementById("totalCasesToday");
  const totalDeaths = document.getElementById("totalDeaths");
  const totalDeathsToday = document.getElementById("totalDeathsToday");
  const totalRecoveries = document.getElementById("totalRecoveries");
  const countryList = document.getElementById("countryList");
  const totalClosedCases = document.getElementById("totalClosedCases");
  const totalClosedRecoveries = document.getElementById(
    "totalClosedRecoveries"
  );
  const totalClosedDeaths = document.getElementById("totalClosedDeaths");
  const totalClosedRecoveriesPerc = document.getElementById(
    "totalClosedRecoveriesPerc"
  );
  const totalClosedDeathsPerc = document.getElementById(
    "totalClosedDeathsPerc"
  );
  const totalActiveCases = document.getElementById("totalActiveCases");
  const totalActiveMild = document.getElementById("totalActiveMild");
  const totalActiveSevere = document.getElementById("totalActiveSevere");
  const totalActiveMildPerc = document.getElementById("totalActiveMildPerc");
  const totalActiveSeverePerc = document.getElementById(
    "totalActiveSeverePerc"
  );
  const mode = localStorage.getItem("modeSwitch");

  countryCount.innerHTML = `${data.casesByCountry.length - 3}`; //total, mszaandam, princes cruise removed from total;
  totalCases.innerText = data.totalCases;
  totalDeaths.innerText = data.totalDeaths;
  totalRecoveries.innerText = data.totalRecoveries;
  totalCasesToday.innerText = data.casesByCountry[0].newCases;
  totalDeathsToday.innerText = data.casesByCountry[0].newDeaths;
  totalClosedCases.innerText = data.closedCases.totalClosed;
  totalClosedRecoveries.innerText = data.closedCases.totalClosedRecoveries;
  totalClosedDeaths.innerText = data.closedCases.totalClosedDeaths;
  totalActiveCases.innerText = data.activeCases.totalActive;
  totalActiveMild.innerText = data.activeCases.totalActiveMild;
  totalActiveSevere.innerText = data.activeCases.totalActiveSevere;
  totalActiveMildPerc.innerText = `${data.activeCases.totalActiveMildPerc}%`;
  totalActiveSeverePerc.innerText = `${data.activeCases.totalActiveSeverePerc}%`;
  totalClosedRecoveriesPerc.innerText = `${data.closedCases.totalClosedRecoveriesPerc}%`;
  totalClosedDeathsPerc.innerText = `${data.closedCases.totalClosedDeathsPerc}%`;
  var currentDate = new Date();
  updateTime.innerText = currentDate.toLocaleString();
  countryList.innerHTML = "";
  data.casesByCountry.shift();
  for (let i = 0; i < data.casesByCountry.length - 1; i++) {
    const li = document.createElement("li");
    const countryNameSpan = document.createElement("span");
    const badgeContainer = document.createElement("div");
    const totalCasesBadge = document.createElement("span");
    const totalDeathsBadge = document.createElement("span");
    const totalRecoveriesBadge = document.createElement("span");
    const newCasesTodayBadge = document.createElement("span");
    const newDeathsTodayBadge = document.createElement("span");

    const starIcon = document.createElement("i");
    const starButton = document.createElement("button");

    starButton.classList.add("btn", "btn-outline-light", "float-right");
    starIcon.classList.add("far", "fa-star", "text-danger");

    starButton.appendChild(starIcon);

    li.classList.add(
      "list-group-item",
      "countryListItems",
      mode === "dark" ? "bg-dark" : "bg-light"
    );
    li.setAttribute("data-id", `${data.casesByCountry[i].name}`);
    li.setAttribute("data-region", `${data.casesByCountry[i].region}`);
    countryNameSpan.classList.add(
      "font-weight-bold",
      "countryName",
      mode === "dark" ? "text-white" : "text-dark"
    );
    countryNameSpan.innerText = data.casesByCountry[i].name;

    totalCasesBadge.classList.add(
      "badge",
      "badge-warning",
      "badge-pill",
      "ml-1"
    );
    totalDeathsBadge.classList.add(
      "badge",
      "badge-danger",
      "badge-pill",
      "ml-1"
    );
    totalRecoveriesBadge.classList.add(
      "badge",
      "badge-success",
      "badge-pill",
      "ml-1"
    );

    newCasesTodayBadge.classList.add(
      "badge",
      "badge-light",
      "badge-pill",
      "ml-1"
    );
    newDeathsTodayBadge.classList.add(
      "badge",
      "badge-light",
      "badge-pill",
      "ml-1"
    );

    totalCasesBadge.innerText = data.casesByCountry[i].totalCases;
    totalDeathsBadge.innerText = data.casesByCountry[i].totalDeaths;
    totalRecoveriesBadge.innerText = data.casesByCountry[i].totalRecoveries;
    newCasesTodayBadge.innerText = data.casesByCountry[i].newCases;
    newDeathsTodayBadge.innerText = data.casesByCountry[i].newDeaths;

    badgeContainer.appendChild(totalCasesBadge);
    badgeContainer.appendChild(totalDeathsBadge);
    badgeContainer.appendChild(totalRecoveriesBadge);
    badgeContainer.appendChild(newCasesTodayBadge);
    badgeContainer.appendChild(newDeathsTodayBadge);

    li.appendChild(countryNameSpan);
    li.appendChild(starButton);
    li.appendChild(badgeContainer);

    li.style.pointer = "cursor";

    li.addEventListener("click", (countryListItem) => {
      setListItemActiveState(countryListItem);
    });

    starButton.addEventListener("click", (e) => {
      e.stopPropagation();
      saveCountry(e.target);
    });
    countryList.appendChild(li);
  }
  showStarredCountries();
};

const initData = () => {
  fetch(`${window.location.href}api/currentstatus`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const spinners = document.querySelectorAll(".fa-circle-notch");
      const refreshSpinner = document.getElementById("refreshSpinner");

      refreshSpinner.classList.remove("fa-spin");
      spinners.forEach((el) => {
        el.style.display = "none";
      });
      renderData(data);
      initStarredCountries();
    })
    .catch((e) => {
      console.error(e);
    });
};

const initTogglerBtn = () => {
  if (localStorage.getItem("modeSwitch") === "light") {
    toggleModeBtn.classList.add("btn-outline-dark");
    toggleModeBtn.classList.remove("btn-outline-light");
    toggleModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    toggleModeBtn.classList.add("btn-outline-light");
    toggleModeBtn.classList.remove("btn-outline-dark");
    toggleModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
};

const initBadgeTooltip = (badge, title) => {
  badge.setAttribute("data-toggle", "tooltip");
  badge.setAttribute("data-placement", "top");
  badge.setAttribute("data-title", title);
};

const forceRefresh = () => {
  const spinner = document.getElementById("refreshSpinner");
  const currentActiveLi = document.querySelector(".countryListItems.active");
  spinner.classList.add("fa-spin");
  initData();
  if (currentActiveLi !== null) {
    getDetailInfo(currentActiveLi.firstChild.textContent);
  }
};

searchInput.addEventListener("keyup", searchList);

refreshBtn.addEventListener("click", forceRefresh);
window.onload = () => {
  initTogglerBtn();
  initData();
};

RegionSwitchers.forEach((RegionSwitcher) => {
  RegionSwitcher.addEventListener("click", () => {
    switchRegion(RegionSwitcher);
  });
});
if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}
