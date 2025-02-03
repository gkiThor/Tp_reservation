/*
Specification fonctionnelle:
- L'utilisateur peut ajouter plusieurs réservations.
- Chaque réservation doit contenir :
 . Une date sélectionnable (parmi les options définies).
 . Un nombre de places (minimum 1).
- l'utilisateur ne peut pas ajouter une nouvelle réservation tant que la précédente n’a pas de date sélectionnée.
- l'utilisateur ne peut pas choisir plusieurs fois la même date.
- Permettre de supprimer une réservation.
- Vérifier les entrées avant soumission.
*/ 

let datesToDisplay = [
    { value: "2024-01-06" },
    { value: "2024-01-13" },
    { value: "2024-01-20" },
    { value: "2024-01-27" },
];

let selectedDates = new Set();
const maxReservations = datesToDisplay.length;
let reservationCount = 1;

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const addButton = document.getElementById("add");


    // Rempli le select dynamiquement 
    function completeDates(select, currentValue = null) {

        console.log("Appel de la fonction completeDates");

        select.innerHTML = "<option value='' selected disabled>!-- Sélectionnez une date --!</option>";
    
        datesToDisplay.forEach(dateObj => {
            if (!selectedDates.has(dateObj.value) || dateObj.value === currentValue) {
                let option = document.createElement("option");
                option.value = dateObj.value;
                option.textContent = new Date(dateObj.value).toLocaleDateString("fr-FR");
                select.appendChild(option);
            }
        });

        // Désactiver si aucune date dispo
        select.disabled = select.options.length <= 1; 

        if (currentValue) select.value = currentValue;
        
    }

    // Met à jour l'état du bouton "Ajouter" en fonction des réservations actuelles et des dates sélectionnées.
    function updateAddButton() {

        console.log("Appel de la fonction updateAddButton");

        let allDatesSelected = Array.from(document.querySelectorAll(".date")).every(select => select.value !== "");

        addButton.classList.toggle("disabled", 
            // Désactiver si au moins une réservation n'a pas de date sélectionnée
            reservationCount >= maxReservations || 
            selectedDates.size >= datesToDisplay.length || 
            !allDatesSelected 
        );
    }

    // Met à jour tous les select et les dates disponibles.
    function updateAllSelects() {

        console.log("Appel de la fonction upDateAllSelects");

        document.querySelectorAll(".date").forEach(select => {
            let currentValue = select.value;
            completeDates(select, currentValue);
        });
    }

    // Gère les changements de sélection de date, en mettant à jour selectedDates et les autres select.
    function handleDateChange(event) {

        console.log("Evenements Select changement de date");

        let select = event.target;
        let previousValue = select.dataset.previousValue || null;

        if (previousValue) selectedDates.delete(previousValue);
        let newValue = select.value;
        if (newValue) selectedDates.add(newValue);
        select.dataset.previousValue = newValue;
        updateAllSelects();
        updateAddButton();
    }

    // Valide le formulaire avant de l'envoyer, vérifie les quantités et affiche des messages d'erreur si nécessaire
    function validateForm(event) {

        let isValid = true;

        document.querySelectorAll(".quantite").forEach(input => {
            let errorDiv = input.nextElementSibling;

            if (!errorDiv || !errorDiv.classList.contains("error-message")) {
                errorDiv = document.createElement("div");
                errorDiv.className = "error-message text-danger";
                input.parentNode.appendChild(errorDiv);
            }

            if (input.value < 1 || input.value === "") {
                errorDiv.textContent = "Veuillez entrer un nombre valide (minimum 1).";
                isValid = false;
            } else {
                errorDiv.textContent = "";
            }
        });

        if (selectedDates.size === 0) {
            alert("Veuillez ajouter au moins une réservation valide avant d'envoyer le formulaire.");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
    }

    // Ajoute un nouvel ensemble de champs de réservation et configure les événements associés
    function addReservation() {

        console.log("Ajoute une réservation");

        reservationCount++;
        let newReservation = document.createElement("fieldset");

        newReservation.className = "fieldset";
        newReservation.innerHTML = `
            <legend>Réservation ${reservationCount}</legend>
            <div class="form-group row">
                <div class="col-sm-4"><label>Date :</label></div>
                <div class="col-sm-8">
                    <select class="date form-control"></select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-4"><label>Nombre de places :</label></div>
                <div class="col-sm-8">
                    <input type="number" class="quantite form-control" value="1" min="1"/>
                    <div class="error-message text-danger"></div>
                </div>
            </div>
            <button type="button" class="btn btn-danger remove">Supprimer</button>
        `;

        form.insertBefore(newReservation, addButton);

        let newSelect = newReservation.querySelector(".date");

        completeDates(newSelect);
        
        newSelect.addEventListener("change", handleDateChange);

        newReservation.querySelector(".remove").addEventListener("click", function () {
            selectedDates.delete(newSelect.value);
            newReservation.remove();
            reservationCount--;
            updateAllSelects();
            updateAddButton();
        });

        updateAddButton();
    }

    addButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (!addButton.classList.contains("disabled")) {
            addReservation();
        }
    });

    form.addEventListener("submit", validateForm);

    document.querySelectorAll(".date").forEach(select => {
        completeDates(select);
        select.addEventListener("change", handleDateChange);
    });

    updateAddButton();
});