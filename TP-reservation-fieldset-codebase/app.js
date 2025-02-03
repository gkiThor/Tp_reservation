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

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const addButton = document.getElementById("add");


    // Rempli le select dynamiquement 
    function completeDates(select, currentValue = null) {

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
        
        let allDatesSelected = Array.from(document.querySelectorAll(".date")).every(select => select.value !== "");

        addButton.classList.toggle("disabled", 
            // Désactiver si au moins une réservation n'a pas de date sélectionnée
            reservationCount >= maxReservations || 
            selectedDates.size >= datesToDisplay.length || 
            !allDatesSelected 
        );
    }

    document.querySelectorAll(".date").forEach(select => {
        completeDates(select);
    });


});