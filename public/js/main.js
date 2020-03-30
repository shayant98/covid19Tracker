

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
    console.log(123);

    if (localStorage.getItem('modeSwitch') === 'dark') {
        toggleLightMode()
    } else {
        toggleDarkMode()
    }
    initTogglerBtn()
}


const toggleLightMode = () => {
    console.log(123);

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
toggleModeBtn.addEventListener("click", toggleLightDarkMode)


window.onload = () => {
    initTogglerBtn()
}
getModeFromLS()

if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js');
    });
}