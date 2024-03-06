import { viderLesChampsForm } from "./ajoutphoto.js";

//Initialise la modal a null
let modal = null;

// Créer la fonction qui supprime le projet auprès de l'API
function supprimerWork(id, callback) {
  //Récupère le token dans le sesionStorage
  const token = sessionStorage.getItem("token");
  //Appel à l'API avec la method DELETE et envoi le token
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    //Vérifie si la réponse est ok ou pas
    .then((response) => {
      if (!response.ok) {
        throw new Error("La suppression a échoué");
      }
      console.log("Projet supprimé avec succès");
      // Passe l'ID du projet supprimé au callback
      callback(id);
    })
    //Retourne une erreur si la requête n'a pas fonctionnée
    .catch((error) => console.error("Erreur lors de la suppression:", error));
}

//Fonction de la gestion du click sur la poubelle
export function clickPoubelle() {
  //Récupère les boutons poubelle et ajoute un évènement click sur chacune
  const boutonsPoubelle = document.querySelectorAll(".poubelle");
  boutonsPoubelle.forEach((bouton) => {
    bouton.addEventListener("click", (event) => {
      //Empeche le rechargement par default du navigateur
      event.preventDefault();
      //Récupère les objets du DOM
      const elementProjet = bouton.closest(".bloc-elements");
      const projectId = elementProjet.querySelector("img").dataset.id;

      // Passer une fonction callback pour gérer la suppression visuelle
      supprimerWork(projectId, (idSupprime) => {
        // Supprime visuellement l'élément projet de la mini galerie
        elementProjet.remove();

        // Supprime également l'élément correspondant dans la galerie principale
        const elementDansGaleriePrincipale = document.querySelector(
          `.gallery figure[data-id="${idSupprime}"]`
        );
        if (elementDansGaleriePrincipale) {
          elementDansGaleriePrincipale.remove();
        }
      });
    });
  });
}

//function qui ouvre la modal
function openModal(event) {
  //Évite le rechargement de la page
  event.preventDefault();
  //Récupère la modal et modifie les propriétés
  const target = document.getElementById("modal-modifier");
  target.classList.toggle("hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  //Ferme la modal au click
  modal.addEventListener("click", closeModal);
  //Retire les écouteurs d'évènements
  modal.querySelector(".js-fermer-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  //Appel la fonction du click sur les poubelles
  clickPoubelle();
}

//Fonction qui ferme la modal
function closeModal(event) {
  //Vérifie si la modal est affiché
  if (modal === null) return;
  // Évite le rechargement par défault
  event.preventDefault();
  //Modifie les proprité des elements
  modal.classList.toggle("hidden");
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  //Retire le bouton de fermeture
  modal
    .querySelector(".js-fermer-modal")
    .removeEventListener("click", closeModal);
  if (modal) {
    const closeButton = modal.querySelector(".js-fermer-modal"); // Remplacez ceci par votre sélecteur réel
    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    } else {
      console.error("Le bouton de fermeture n'a pas été trouvé dans la modal");
    }
  } else {
    console.error("L'élément modal n'est pas défini");
  }
  modal = null;
  viderLesChampsForm();
}

//Permet de stopper la propagation du click pour fermer uniquement en dehors de la modal
function stopPropagation(event) {
  event.stopPropagation();
}

//Écoute le cique pour ouvrir la modal
const boutonModal = document.querySelector(".js-modal");
if (boutonModal) {
  boutonModal.addEventListener("click", openModal);
}

//Écoute la touche echap du clavier et ferme la modal
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
});
