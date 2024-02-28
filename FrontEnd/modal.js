let modal = null;

let miniGallery = [];

function afficherGalleryMiniature() {
  fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      miniGallery = response;
      creerMiniGallery();
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des projets :",
        error
      );
    });
}

function creerMiniGallery() {
  for (let i = 0; i < miniGallery.length; i++) {
    //Récuperer la gallery
    const galleryMiniature = document.querySelector(".gallery-miniature");
    //Créer les blocs
    const blocElements = document.createElement("div");
    //Créer l'image et lui attribuer ces propriété
    const miniImgElement = document.createElement("img");
    miniImgElement.dataset.id = miniGallery[i].id;
    miniImgElement.dataset.categoryId = miniGallery[i].categoryId;
    miniImgElement.dataset.userId = miniGallery[i].userId;
    miniImgElement.src = miniGallery[i].imageUrl;
    //Créer le bloc de la poubelle
    const blocPoubelle = document.createElement("div");
    blocPoubelle.className = "bloc-poubelle";
    //Créer le bouton poubelle et lui attribuer sa class
    const poubelle = document.createElement("button");
    poubelle.className = "fa-solid fa-trash-can poubelle";
    //Associer les éléments à leurs parents
    galleryMiniature.appendChild(blocElements);
    galleryMiniature.appendChild(miniImgElement);
    blocElements.appendChild(blocPoubelle);
    blocPoubelle.appendChild(poubelle);
  }
}

const openModal = function (event) {
  event.preventDefault();
  const target = document.querySelector(event.target.getAttribute("href"));
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-fermer-modal").addEventListener("click", closeModal);
};

const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal
    .querySelector(".js-fermer-modal")
    .removeEventListener("click", closeModal);
  modal = null;
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

afficherGalleryMiniature();
