import { init } from "./index.js";
import { clickPoubelle } from "./modal.js";

//RÉcupère les éléments du DOM
//Récupère le titre de la modal
const titreGalleryMiniature = document.getElementById("gallery-miniature");
//Récupère les photos de la modal
const photoGalleryMiniature = document.querySelector(".gallery-miniature");
//Récupereer gallery
const gallery = document.querySelector(".gallery");
//Récupère le bouton ajout photo de la modal
const boutonAjoutPhoto = document.querySelector(".ajout-photo");
//Récupère l'icon de la fleche
const flecheRetour = document.querySelector(".fleche-retour");
//Récupère le Header de la modal
const modalHeader = document.querySelector(".modal-header");
//Récupère le footer de la modal
const modalFooter = document.querySelector(".modal-footer");
//Récupère le bouton valider
const boutonValider = document.querySelector(".bouton-valider");
//Récupère tout les elements avec la meme class
const elementsAjoutPhoto = document.querySelectorAll(".js-modal-ajout");
//Récuperer l'input l'input
const inputAjoutPhoto = document.querySelector(".input-ajout-photo");
//Récuperer la zone ou afficher la photo
const zoneAjoutPhoto = document.querySelector(".zone-ajout-photo");
//Récuperer le token
const token = sessionStorage.getItem("token");
//Récuperer la zone form
const form = document.getElementById("form");

//Écouter l'évènement
inputAjoutPhoto.addEventListener("change", imageDisplay);

//Fonction qui affiche l'image
function imageDisplay() {
  while (zoneAjoutPhoto.firstChild) {
    zoneAjoutPhoto.removeChild(zoneAjoutPhoto.firstChild);
  }
  const file = inputAjoutPhoto.files;

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
//Fonction qui masque l'ancienne modal
function masquerMiniGallery() {
  boutonAjoutPhoto.addEventListener("click", () => {
    titreGalleryMiniature.classList.toggle("hidden");
    photoGalleryMiniature.classList.toggle("hidden");
    boutonAjoutPhoto.classList.toggle("hidden");
    modalFooter.classList.toggle("hidden");

    modalHeader.style.textAlign = "";

    actualiserModal();
  });
}

//Fonction qui affiche les nouveau elements de la modal
function actualiserModal() {
  elementsAjoutPhoto.forEach((elementAjoutPhoto) => {
    elementAjoutPhoto.classList.toggle("hidden");
  });
  modalHeader.style.display = "flex";
  modalHeader.style.justifyContent = "space-between";
}

function clickRetour() {
  flecheRetour.addEventListener("click", () => {
    titreGalleryMiniature.classList.toggle("hidden");
    photoGalleryMiniature.classList.toggle("hidden");
    boutonAjoutPhoto.classList.toggle("hidden");
    modalFooter.classList.toggle("hidden");
    actualiserModal();
    actualiserHeaderModal();
    viderLesChampsForm();
  });
}

function actualiserHeaderModal() {
  modalHeader.style.textAlign = "end";
  modalHeader.style.display = "";
  modalHeader.style.justifyContent = "";
}

function ajouterNouveauProjet() {
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
        afficherProjetAjoute(response);
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des projets :",
          error
        );
      });
  });
}

function verifierChampsForm() {
  let tousRemplis = true;
  const inputs = form.querySelectorAll("input");
  inputs.forEach(function (input) {
    if (!input.value.trim()) {
      tousRemplis = false;
    }
  });
  boutonValider.disabled = !tousRemplis;
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
  photoGalleryMiniature.appendChild(blocElements);

  clickPoubelle();
}

export function viderLesChampsForm() {
  const inputs = form.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.value = "";
  });
}

document.querySelectorAll("#form input").forEach((input) => {
  input.addEventListener("keyup", verifierChampsForm);
  input.addEventListener("change", verifierChampsForm);
});

verifierChampsForm();
masquerMiniGallery();
clickRetour();
ajouterNouveauProjet();
