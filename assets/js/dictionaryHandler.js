import dictionary from "./modules/Dictionary.js";

onLoad();

function onLoad() {
    bindEvents();
}

function bindEvents() {
    // save new dictionary
    document.querySelector("#newDictionaryForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;
        const file = form.querySelector("input[name=dictionaryFile]").files[0];
        const language = form.querySelector("input[name=dictionaryLanguage]").value;

        dictionary.saveDictionary(file, language).then(response => {

        });
    });

    // toggle new dictionary field
    document.querySelector(".toggle-new-dictionary").addEventListener("click", () => {
        document.querySelector(".dictionary").classList.toggle("hidden");
    });
}