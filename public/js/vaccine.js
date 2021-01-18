const initVaccineCountryData = async () => {
  const request = await fetch(`${window.location.origin}/api/vaccines`);
  const data = await request.json();
  renderVaccineCountryData(data);
};

const renderVaccineCountryData = (countries) => {
  const container = document.getElementById("vaccineCountriesListContainer");
  const mode = localStorage.getItem("modeSwitch");

  countries.forEach((country) => {
    const {
      location,
      vaccines,
      source_name,
      source_website,
      last_observation_date,
    } = country;
    const li = document.createElement("li");
    const countryNameSpan = document.createElement("span");
    const badgeContainer = document.createElement("div");
    const vaccinesBadge = document.createElement("span");
    const lastObservationBadge = document.createElement("span");

    li.classList.add(
      "list-group-item",
      "countryListItems",
      "mt-3",
      "shadow",
      mode === "dark" ? "bg-dark" : "bg-light"
    );
    li.setAttribute("data-id", `${location}`);
    li.setAttribute("data-sname", `${source_name}`);
    li.setAttribute("data-ssite", `${source_website}`);
    li.setAttribute("data-lod", `${last_observation_date}`);
    li.setAttribute("data-vac", `${vaccines}`);
    countryNameSpan.classList.add(
      "font-weight-bold",
      "countryName",
      mode === "dark" ? "text-white" : "text-dark"
    );

    vaccinesBadge.classList.add(
      "badge",
      "badge-success",
      "badge-pill",
      "ml-1",
      "no-change"
    );
    lastObservationBadge.classList.add(
      "badge",
      "badge-info",
      "badge-pill",
      "ml-1",
      "no-change"
    );

    vaccinesBadge.innerText = ` ${vaccines}`;
    lastObservationBadge.innerText = last_observation_date;

    countryNameSpan.innerText = location;

    badgeContainer.appendChild(vaccinesBadge);
    badgeContainer.appendChild(lastObservationBadge);

    li.appendChild(countryNameSpan);
    li.appendChild(badgeContainer);
    li.style.pointer = "pointer";

    container.appendChild(li);

    li.addEventListener("click", (countryListItem) => {
      setListItemActiveState(countryListItem);
    });
  });
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
      toggleDetaiSpinner("loading");
      getDetailInfo(listItem.firstChild.textContent.toLowerCase());
    }
  });
};

const getDetailInfo = async (countryName) => {
  toggleDetaiSpinner("loading");
  const res = await fetch(
    `${window.location.origin}/api/vaccines/${countryName}`
  );
  if (res.ok) {
    const data = await res.json();
    renderDetailInfo(data);
  }
};

const renderDetailInfo = (data) => {
  toggleDetaiSpinner("success");
  const countryVacLogTable = document.getElementById("countryVacLogTable");
  const countryObservationDate = document.getElementById(
    "countryObservationDate"
  );
  const countryVaccines = document.getElementById("countryVaccines");
  const countrySource = document.getElementById("countrySource");
  const countryName = document.getElementById("countryName");
  countryVacLogTable.innerHTML = "";

  data.forEach((data) => {
    const {
      date,
      vaccine,
      source_url,
      total_vaccinations,
      people_vaccinated,
      people_fully_vaccinated,
    } = data;

    const tableRow = document.createElement("tr");
    const tableDate = document.createElement("td");
    const tableVaccine = document.createElement("td");
    const tableVacToday = document.createElement("td");
    const tablePeopleVac = document.createElement("td");
    const tablePeopleFull = document.createElement("td");

    tableDate.innerText = date;
    tableVaccine.innerText = vaccine;
    tableVacToday.innerText = total_vaccinations;
    tablePeopleVac.innerText = people_vaccinated;
    tablePeopleFull.innerText = people_fully_vaccinated;

    tableRow.appendChild(tableDate);
    tableRow.appendChild(tableVaccine);
    tableRow.appendChild(tableVacToday);
    tableRow.appendChild(tablePeopleVac);
    tableRow.appendChild(tablePeopleFull);

    countryVacLogTable.appendChild(tableRow);
  });
  const { lod, sname, ssite, vac, id } = getDataValues();
  countryName.innerText = id;
  countryObservationDate.innerText = lod;
  countryVaccines.innerText = vac;
  countrySource.href = ssite;
  countrySource.innerText = sname;
};

const getDataValues = () => {
  const currentActiveLi = document.querySelector(".countryListItems.active");
  return currentActiveLi.dataset;
};

initVaccineCountryData();
