// Tableaux vides pour stocker les projets et les catégories
let projets = [];
let categories = [];

//Récuperer les différents éléments du DOM
const modeEdition = document.querySelector(".edition-container");
const boutonModifier = document.querySelector(".bouton-modifier");
const boutonLogin = document.querySelector(".login-nav");
const boutonLogout = document.querySelector(".logout-nav");
const boutonCategories = document.querySelector(".bouton-container");

// Fonction d'initialisation
function init() {
  getWorks();
  getCategories();
  getToken();
}

// Fonction pour récupérer les travaux/projets depuis l'API
function getWorks() {
  fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      projets = response;
      afficherWorks();
      creerMiniGallery();
    })
    .catch((error) => {
      // Gère les erreurs éventuelles
      console.error(
        "Une erreur s'est produite lors de la récupération des projets :",
        error
      );
    });
}

// Fonction pour récupérer les catégories depuis l'API
function getCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      categories = response;
      afficherCategories();
    })
    .catch((error) => {
      // Gèrer les erreurs éventuelles
      console.error(
        "Une erreur s'est produite lors de la récupération des catégories :",
        error
      );
    });
}

// Fonction pour afficher les projets
function afficherWorks() {
  const gallery = document.querySelector(".gallery");

  for (let i = 0; i < projets.length; i++) {
    // Boucle sur le tableau de projets
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = projets[i].id;
    figureElement.dataset.categoryId = projets[i].categoryId;
    figureElement.dataset.userId = projets[i].userId;

    const imgElement = document.createElement("img");
    imgElement.src = projets[i].imageUrl;

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = projets[i].title;

    gallery.appendChild(figureElement);
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
  }
}

// Fonction pour afficher les catégories
function afficherCategories() {
  // Crée et ajoute le bouton "Tous" pour afficher tous les projets
  boutonTous();
  const categoriesEmplacement = document.querySelector(".bouton-container");

  categories.forEach((categorieElement) => {
    const categorieBouton = document.createElement("button");
    categorieBouton.classList.add("btn");
    categorieBouton.innerText = categorieElement.name;
    categorieBouton.id = "categorie-" + categorieElement.id;

    // Attache un écouteur d'événements à chaque bouton
    categorieBouton.addEventListener("click", () =>
      afficherProjetsDeLaCategorie(categorieElement.id)
    );

    categoriesEmplacement.appendChild(categorieBouton);
  });
}

export function creerMiniGallery() {
  for (let i = 0; i < projets.length; i++) {
    //Récuperer la gallery
    const galleryMiniature = document.querySelector(".gallery-miniature");
    //Créer les blocs
    const blocElements = document.createElement("div");
    blocElements.className = "bloc-elements";
    //Créer l'image et lui attribuer ces propriété
    const miniImgElement = document.createElement("img");
    miniImgElement.dataset.id = projets[i].id;
    miniImgElement.dataset.categoryId = projets[i].categoryId;
    miniImgElement.dataset.userId = projets[i].userId;
    miniImgElement.src = projets[i].imageUrl;
    //Créer le bloc de la poubelle
    const blocPoubelle = document.createElement("div");
    blocPoubelle.className = "bloc-poubelle";
    //Créer le bouton poubelle et lui attribuer sa class
    const poubelle = document.createElement("span");
    poubelle.className = "fa-solid fa-trash-can poubelle";
    //Associer les éléments à leurs parents
    blocElements.appendChild(miniImgElement);
    blocElements.appendChild(blocPoubelle);
    blocPoubelle.appendChild(poubelle);
    galleryMiniature.appendChild(blocElements);
  }
}

// Fonction pour créer et ajouter le bouton "Tous"
function boutonTous() {
  // Création du bouton "Tous"
  const boutonTous = document.createElement("button");
  boutonTous.classList.add("btn", "btn-tous");
  boutonTous.innerText = "Tous";
  const categoriesEmplacement = document.querySelector(".bouton-container");

  // Ajout ecouteur d'événement click sur le bouton "Tous"
  boutonTous.addEventListener("click", afficherTousLesProjets);

  // Ajout du bouton "Tous"
  categoriesEmplacement.appendChild(boutonTous);
}

function afficherTousLesProjets() {
  // Réinitialise le DOM
  document.querySelector(".gallery").innerHTML = "";
  afficherWorks();
}

function afficherProjetsDeLaCategorie(categoryId) {
  // Filtrer les projets par categoryId.
  const projetsFiltres = projets.filter(
    (projet) => projet.categoryId.toString() === categoryId.toString()
  );

  // Sélectionne l'élément du DOM où afficher les projets et nettoie le contenu précédent
  const gallery = document.querySelector(".gallery");
  // Nettoie la galerie
  gallery.innerHTML = "";

  // Boucle sur le tableau de projets filtrés pour créer et ajouter les éléments au DOM
  projetsFiltres.forEach((projet) => {
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = projet.id;
    figureElement.dataset.categoryId = projet.categoryId;
    figureElement.dataset.userId = projet.userId;

    const imgElement = document.createElement("img");
    imgElement.src = projet.imageUrl;
    imgElement.alt = projet.title;

    const figcaptionElement = document.createElement("figcaption");
    // Définit le titre du projet
    figcaptionElement.innerText = projet.title;
    // Assemble les éléments et les ajoute à la galerie
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    gallery.appendChild(figureElement);
  });
}

function getToken() {
  //Récuperer et vérifier le token
  const token = sessionStorage.getItem("token");

  if (!token) {
    //Erreur si le token n'est pas présent
    console.log("Pas de token");
  } else {
    //Afficher la page mode édition si le token est présent
    console.log(token);
    homepageEdit();
  }
}

function homepageEdit() {
  //Modifier les classes pour masquer les éléments
  modeEdition.classList.toggle("hidden");
  boutonModifier.classList.toggle("hidden");
  boutonLogout.classList.toggle("hidden");
  boutonLogin.classList.toggle("hidden");

  boutonCategories.classList.toggle("visible");
}

//Enlève le token au click sur logout
boutonLogout.addEventListener("click", () => {
  window.sessionStorage.removeItem("token");
});

init();
