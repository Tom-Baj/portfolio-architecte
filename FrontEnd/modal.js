import { creerMiniGallery, projets, supprimer } from "./index.js";

//Création de la modal
const modal = document.getElementById("modal-modifier");
const main = document.querySelector("main");
const modalWrapper = document.querySelector(".modal-wrapper");
const token = sessionStorage.getItem("token");
const gallery = document.querySelector(".gallery");

// Définition et placement des options avec des valeurs spécifiques
const optionsCategories = [
  { text: "", value: "" },
  { text: "Object", value: "1" },
  { text: "Appartements", value: "2" },
  { text: "Hotels & restaurants", value: "3" },
];

// Créer la fonction qui supprime le projet auprès de l'API
function supprimerWork(id, projetSupprimer) {
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
      projetSupprimer(id);
      supprimer(id);
    })
    //Retourne une erreur si la requête n'a pas fonctionnée
    .catch((error) => console.error("Erreur lors de la suppression:", error));
}

function ajouterNouveauProjet(form, inputAjoutPhoto) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    formData.append("image", inputAjoutPhoto.files[0]);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        return response.json();
      })

      .then((response) => {
        console.log(response);
        console.log("Projet ajouté avec succès");
        let categoryName = "";
        optionsCategories.forEach((option) => {
          if (option.value == form.category) {
            categoryName.innerText = option.text;
          }
        });
        response.category = {
          id: form.category,
          name: categoryName,
        };
        projets.push(response);
        afficherProjetAjoute(response);
        closeModal();
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des projets :",
          error
        );
      });
  });
}

function afficherProjetAjoute(projet) {
  //Créer et ajoute les propriétés de l'image de la gallery
  const figureElement = document.createElement("figure");
  figureElement.dataset.id = projet.id;
  figureElement.dataset.categoryId = projet.categoryId;
  figureElement.dataset.userId = projet.userId;
  //Créer l'image
  const imgElement = document.createElement("img");
  imgElement.src = projet.imageUrl;
  //Créer le titre
  const figcaptionElement = document.createElement("figcaption");
  figcaptionElement.innerText = projet.title;
  //Ajoute les éléments les uns aux autres
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);
  gallery.appendChild(figureElement);

  //Création et ajout les propriétés de l'image miniature
  const blocElements = document.createElement("div");
  blocElements.classList.add("bloc-elements");
  const miniImgElement = document.createElement("img");

  miniImgElement.dataset.id = projet.id;
  miniImgElement.dataset.categoryId = projet.categoryId;
  miniImgElement.dataset.userId = projet.userId;
  miniImgElement.src = projet.imageUrl;

  const blocPoubelle = document.createElement("div");
  blocPoubelle.classList.add("bloc-poubelle");

  const poubelle = document.createElement("span");
  poubelle.classList.add("fa-solid", "fa-trash-can", "poubelle");

  blocElements.appendChild(miniImgElement);
  blocElements.appendChild(blocPoubelle);
  blocPoubelle.appendChild(poubelle);

  clickPoubelle();
}

function clickPoubelle() {
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

//Fonction qui créer la modal

//Fonction qui ouvre la modal
export function openModal(event) {
  //Évite le rechargement de la page
  event.preventDefault();
  creationModal();

  //Récupère la modal et modifie les propriétés
  modal.classList.toggle("hidden");
  modal.setAttribute("aria-hidden", false);

  main.setAttribute("aria-hidden", true);

  creerMiniGallery();
  clickPoubelle();
}

//Fonction qui ferme la modal
function closeModal(event) {
  if (event) {
    // Évite le rechargement par défault
    event.preventDefault();
  }
  //Modifie les proprité des elements
  modal.classList.toggle("hidden");
  modal.setAttribute("aria-hidden", true);
  modal.removeAttribute("aria-modal");

  main.setAttribute("aria-hidden", false);

  //Retire le bouton de fermeture
  modal
    .querySelector(".js-fermer-modal")
    .removeEventListener("click", closeModal);
  modalWrapper.innerHTML = "";
}

function creationModal() {
  modalWrapper.innerHTML = "";
  //Création modal
  //Création modal header
  const zoneBouton = document.createElement("div");
  zoneBouton.classList.add("modal-header");
  const boutonCroix = document.createElement("button");
  boutonCroix.classList.add(
    "js-fermer-modal",
    "croix-fermer",
    "fa-solid",
    "fa-xmark"
  );

  //Création modal titre
  const zoneTitre = document.createElement("div");
  zoneTitre.classList.add("modal-title");
  const titre = document.createElement("h1");
  titre.id = "gallery-miniature";
  titre.innerText = "Galerie photo";

  //Création gallery miniature
  const zoneGalleryMiniature = document.createElement("div");
  zoneGalleryMiniature.classList.add("gallery-miniature");

  //Création modal footer
  const zoneFooter = document.createElement("div");
  zoneFooter.classList.add("modal-footer");
  const boutonAjoutPhoto = document.createElement("button");
  boutonAjoutPhoto.classList.add("ajout-photo");
  boutonAjoutPhoto.textContent = "Ajouter une photo";

  //Assembler la modal
  modalWrapper.appendChild(zoneBouton);
  zoneBouton.appendChild(boutonCroix);
  modalWrapper.appendChild(zoneTitre);
  zoneTitre.appendChild(titre);
  modalWrapper.appendChild(zoneGalleryMiniature);
  modalWrapper.appendChild(zoneFooter);
  zoneFooter.appendChild(boutonAjoutPhoto);

  //Écouteurs d'évènements
  modal.querySelector(".js-fermer-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);

  const boutonAjouterUnePhoto = document.querySelector(".ajout-photo");
  boutonAjouterUnePhoto.addEventListener("click", modalAjoutPhoto);
}

function modalAjoutPhoto() {
  modalWrapper.innerHTML = "";
  /* Fleche et croix */
  const flecheRetour = document.createElement("button");
  flecheRetour.classList.add("fleche-retour", "fa-solid", "fa-arrow-left");
  flecheRetour.type = "button";
  const croixFermer = document.createElement("button");
  croixFermer.classList.add(
    "croix-fermer",
    "fa-solid",
    "fa-xmark",
    "js-fermer-modal"
  );
  croixFermer.type = "button";

  /* ===== Form ===== */
  const form = document.createElement("form");
  /* Attribut */
  form.id = "form";
  form.classList.add("js-modal-ajout", "form-modal-ajout");
  const formContainer = document.getElementById("form");

  /* ===== Photo ===== */
  /* =============== */
  const container = document.createElement("div");
  const containerPhoto = document.createElement("div");
  const zoneAjoutPhoto = document.createElement("div");
  /* =============== */
  const iconImage = document.createElement("span");
  const labelPhoto = document.createElement("label");
  const inputPhoto = document.createElement("input");
  const textPhoto = document.createElement("p");
  /* Attributs */
  container.classList.add("zone-input-modal");
  containerPhoto.classList.add("container-ajout-photo");
  zoneAjoutPhoto.classList.add("zone-ajout-photo");
  zoneAjoutPhoto.id = "zone-ajout-photo";
  iconImage.classList.add("fa-regular", "fa-image", "icon-photo");
  labelPhoto.setAttribute("for", "image");
  labelPhoto.classList.add("label-ajouter-photo");
  labelPhoto.textContent = "Ajouter photo";
  inputPhoto.classList.add("input-ajout-photo", "form-input");
  inputPhoto.type = "file";
  inputPhoto.id = "image";
  inputPhoto.name = "image";
  inputPhoto.accept = ".jpg,.jpeg,.png";
  inputPhoto.required = true;
  inputPhoto.hidden = true;
  textPhoto.classList.add("format-photo");
  textPhoto.textContent = "jpg, png : 4mo max";
  /* Assembler */
  container.appendChild(containerPhoto);
  containerPhoto.appendChild(zoneAjoutPhoto);
  zoneAjoutPhoto.appendChild(iconImage);
  zoneAjoutPhoto.appendChild(labelPhoto);
  zoneAjoutPhoto.appendChild(inputPhoto);
  zoneAjoutPhoto.appendChild(textPhoto);
  /* Event */
  inputPhoto.addEventListener("change", imageDisplay);

  /* ===== Titre ===== */
  const containerTitle = document.createElement("div");
  const labelTitle = document.createElement("label");
  const inputTitle = document.createElement("input");
  /* Attributs */
  containerTitle.classList.add("zone-input-modal");
  labelTitle.classList.add("titre-input-modal");
  labelTitle.setAttribute("for", "title");
  labelTitle.textContent = "Titre";
  inputTitle.classList.add("zone-choix", "form-input");
  inputTitle.type = "text";
  inputTitle.id = "title";
  inputTitle.name = "title";
  inputTitle.required = true;
  /* Assembler */
  containerTitle.appendChild(labelTitle);
  containerTitle.appendChild(inputTitle);

  /* ===== Categories ===== */
  const containerCategories = document.createElement("div");
  const labelCategories = document.createElement("label");
  //Création de l'élément select
  const selectCategories = document.createElement("select");
  optionsCategories.forEach(function (optionData) {
    const option = document.createElement("option");
    option.value = optionData.value;
    option.innerText = optionData.text;
    if (optionData.value === "") {
      option.selected = true;
      option.disabled = true;
    }
    selectCategories.appendChild(option);
  });
  /* Attributs */
  containerCategories.classList.add("zone-input-modal");
  labelCategories.classList.add("titre-input-modal");
  labelCategories.setAttribute("for", "category");
  labelCategories.textContent = "Catégorie";
  selectCategories.classList.add("zone-choix", "form-input");
  selectCategories.id = "category";
  selectCategories.name = "category";
  selectCategories.required = true;
  /* Assembler */
  containerCategories.appendChild(labelCategories);
  containerCategories.appendChild(selectCategories);

  /* ===== Bouton ===== */
  const containerBouton = document.createElement("div");
  const modalBouton = document.createElement("button");
  /* Attributs */
  modalBouton.classList.add("js-modal-ajout", "bouton-valider");
  modalBouton.type = "submit";
  modalBouton.id = "bouton-valider-ajout";
  modalBouton.textContent = "Valider";
  modalBouton.disabled = true;
  /* Assembler */
  containerBouton.appendChild(modalBouton);

  /* Header */
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("new-header");
  modalHeader.appendChild(flecheRetour);
  modalHeader.appendChild(croixFermer);
  /* Event */

  /* ===== Title ===== */
  const modalTitle = document.createElement("div");
  modalTitle.classList.add("modal-title");
  const title = document.createElement("h1");
  title.id = "gallery-miniature";
  title.textContent = "Ajout Photo";
  modalTitle.appendChild(title);

  /* ===== Footer ===== */
  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modalFooter.appendChild(containerBouton);

  modalWrapper.appendChild(modalHeader);
  modalWrapper.appendChild(modalTitle);
  modalWrapper.appendChild(form);
  form.appendChild(container);
  form.appendChild(containerTitle);
  form.appendChild(containerCategories);
  form.appendChild(modalFooter);

  const inputAjoutPhoto = document.querySelector(".input-ajout-photo");

  const toutLesInputs = document.querySelectorAll(".form-input");
  toutLesInputs.forEach(function (input) {
    input.addEventListener("change", verifierChampsForm);
  });

  const formulaire = document.getElementById("form");

  ajouterNouveauProjet(formulaire, inputAjoutPhoto);

  fermerModal();
}

function fermerModal() {
  const flecheRetour = document.querySelector(".fleche-retour");
  const croixFermer = document.querySelector(".croix-fermer");
  flecheRetour.addEventListener("click", () => {
    modalWrapper.innerHTML = "";
    creationModal();
    creerMiniGallery();
  });
  croixFermer.addEventListener("click", closeModal);
}

//Stop la propagation du click sur l'arriere plan pour fermer la modal
function stopPropagation(event) {
  event.stopPropagation();
}

//Fonction qui affiche l'image
function imageDisplay(event) {
  console.log(event);
  const zoneAjoutPhoto = document.getElementById("zone-ajout-photo");
  while (zoneAjoutPhoto.firstChild) {
    zoneAjoutPhoto.removeChild(zoneAjoutPhoto.firstChild);
  }
  const file = event.target.files;

  if (file.length === 0) {
    const textErreur = document.createElement("p");
    textErreur.innerText = "Erreur aucun fichier n'est séléctionnée";
    zoneAjoutPhoto.appendChild(textErreur);
  } else {
    const zoneAjoutPhotoImage = document.createElement("img");
    zoneAjoutPhotoImage.src = URL.createObjectURL(file[0]);
    zoneAjoutPhoto.appendChild(zoneAjoutPhotoImage);
  }
}

function verifierChampsForm() {
  const boutonValider = document.getElementById("bouton-valider-ajout");
  const toutLesInputs = document.querySelectorAll(".form-input");

  let tousRemplis = true;
  // Parcourir chaque input et vérifier s'il est rempli
  toutLesInputs.forEach(function (input) {
    // Si un des champs est vide, mettre tousRemplis à false
    if (!input.value.trim()) {
      tousRemplis = false;
    }
  });

  // Activer ou désactiver le bouton en fonction de la variable tousRemplis
  boutonValider.disabled = !tousRemplis;
}

//Ferme la modal au click sur l'arrière plan
modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal(event);
  }
});

//Écoute la touche echap du clavier et ferme la modal
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
});
