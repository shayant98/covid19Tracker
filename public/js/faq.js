const faqListItems = document.querySelectorAll(".faq");
const faqSearchInput = document.getElementById('faqSearch');

const searchFaqs = () => {

    const search = faqSearchInput.value.toLowerCase();
    faqListItems.forEach(question => {
        const questionString = question.innerHTML.toLowerCase()
        const accordionContainer = question.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

        if (search.length > 0) {
            if (!questionString.includes(search)) {
                accordionContainer.style.display = "none"
            } else {
                accordionContainer.style.display = "block"
            }
        } else {
            accordionContainer.style.display = "block"
        }
    })

};

faqSearchInput.addEventListener("keyup", searchFaqs);
