const searchInput = document.getElementById("countrySearch");

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

const toggleLightDarkMode = () => {
  if (localStorage.getItem("modeSwitch") === "dark") {
    toggleLightMode();
  } else {
    toggleDarkMode();
  }
  initTogglerBtn();
};

const toggleLightMode = () => {
  document.querySelectorAll(".bg-dark").forEach((element) => {
    element.classList.remove("bg-dark");
    element.classList.add("bg-light");
  });
  document.querySelectorAll(".text-white").forEach((element) => {
    if (!element.classList.contains("no-change")) {
      element.classList.remove("text-white");
      element.classList.add("text-dark");
    }
  });
  document.querySelectorAll(".btn-dark").forEach((element) => {
    element.classList.remove("btn-dark");
    element.classList.add("btn-light");
  });
  document.querySelectorAll(".btn-outline-light").forEach((element) => {
    element.classList.remove("btn-outline-light");
    element.classList.add("btn-outline-dark");
  });
  saveModeToLS("light");
};

const toggleDarkMode = () => {
  document.querySelectorAll(".bg-light").forEach((element) => {
    element.classList.remove("bg-light");
    element.classList.add("bg-dark");
  });
  document.querySelectorAll(".text-dark").forEach((element) => {
    if (!element.classList.contains("no-change")) {
      element.classList.remove("text-dark");
      element.classList.add("text-white");
    }
  });
  document.querySelectorAll(".btn-light").forEach((element) => {
    element.classList.remove("btn-light");
    element.classList.add("btn-dark");
  });
  document.querySelectorAll(".btn-outline-dark").forEach((element) => {
    element.classList.remove("btn-outline-dark");
    element.classList.add("btn-outline-light");
  });
  saveModeToLS("dark");
};

const saveModeToLS = (mode) => {
  localStorage.removeItem("modeSwitch");
  localStorage.setItem("modeSwitch", mode);
};

const getModeFromLS = () => {
  const mode = localStorage.getItem("modeSwitch");

  if (mode === "light") {
    toggleLightMode();
  } else {
    toggleDarkMode();
  }
};

const toggleDetaiSpinner = (type) => {
  const spinner = document.getElementById("detailSpinner");
  const detailContainer = document.getElementById("detailContainer");
  if (type === "success") {
    spinner.classList.remove("d-flex");
    detailContainer.classList.remove("d-none");
  } else if (type === "loading") {
    spinner.classList.add("d-flex");
    detailContainer.classList.add("d-none");
  } else {
    spinner.classList.add("d-flex");
    detailContainer.classList.add("d-none");
    alert("STH WENT WRONG");
  }
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

toggleModeBtn.addEventListener("click", toggleLightDarkMode);
searchInput.addEventListener("keyup", searchList);

window.onload = () => {
  initTogglerBtn();
};
getModeFromLS();
