import dictionary from "./modules/Dictionary.js";
import toast from "./modules/Toast.js";

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
        const loadingIcon = form.querySelector(".loading-dictionary");

        loadingIcon.classList.remove("hidden");

        dictionary.saveDictionary(file, language).then(response => {
            loadingIcon.classList.add("hidden");
            toast.showToast(`Woordenlijst ${response.language} aangepast`);
        });
    });

    // toggle new dictionary field
    document.querySelector(".toggle-new-dictionary").addEventListener("click", () => {
        document.querySelector(".dictionary").classList.toggle("hidden");
    });
}