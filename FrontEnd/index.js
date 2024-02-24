// Initialisation de deux tableaux vides pour stocker les projets et les catégories
let projets = [];
let categories = [];

// Fonction d'initialisation appelée au chargement de la page/script
function init() {
  getWorks(); // Appelle la fonction pour récupérer les travaux/projets
  getCategories(); // Appelle la fonction pour récupérer les catégories
}

// Fonction pour récupérer les travaux/projets depuis une API
function getWorks() {
  fetch("http://localhost:5678/api/works") // Requête HTTP GET à l'API
    .then((response) => {
      // Traitement de la réponse
      if (!response.ok) {
        // Si le statut de la réponse n'est pas OK, lève une erreur
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json(); // Transforme la réponse en JSON
    })
    .then((response) => {
      projets = response; // Stocke les projets récupérés dans le tableau projets
      afficherWorks(); // Appelle la fonction pour afficher les projets
    })
    .catch((error) => {
      // Gère les erreurs éventuelles
      console.error(
        "Une erreur s'est produite lors de la récupération des projets :",
        error
      );
    });
}

// Fonction pour récupérer les catégories depuis une API
function getCategories() {
  fetch("http://localhost:5678/api/categories") // Requête HTTP GET à l'API
    .then((response) => {
      // Traitement de la réponse
      if (!response.ok) {
        // Si le statut de la réponse n'est pas OK, lève une erreur
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json(); // Transforme la réponse en JSON
    })
    .then((response) => {
      categories = response; // Stocke les catégories récupérées dans le tableau categories
      afficherCategories(); // Appelle la fonction pour afficher les catégories
    })
    .catch((error) => {
      // Gère les erreurs éventuelles
      console.error(
        "Une erreur s'est produite lors de la récupération des catégories :",
        error
      );
    });
}

// Fonction pour afficher les projets
function afficherWorks() {
  const gallery = document.querySelector(".gallery"); // Sélectionne l'élément du DOM où afficher les projets

  for (let i = 0; i < projets.length; i++) {
    // Boucle sur le tableau de projets
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = projets[i].id;
    figureElement.dataset.categoryId = projets[i].categoryId;
    figureElement.dataset.userId = projets[i].userId;

    const imgElement = document.createElement("img");
    imgElement.src = projets[i].imageUrl; // Définit l'URL de l'image du projet

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = projets[i].title; // Définit le titre du projet

    gallery.appendChild(figureElement); // Ajoute l'élément figure à la galerie
    figureElement.appendChild(imgElement); // Ajoute l'image au figure
    figureElement.appendChild(figcaptionElement); // Ajoute la légende au figure
  }
}

// Fonction pour afficher les catégories
function afficherCategories() {
  boutonTous(); // Crée et ajoute le bouton "Tous" pour afficher tous les projets
  for (let i = 0; i < categories.length; i++) {
    // Boucle sur le tableau de catégories
    const categorieElement = categories[i];

    const categoriesEmplacement = document.querySelector(".bouton-container");

    const categorieBouton = document.createElement("button");
    categorieBouton.classList.add("btn");
    categorieBouton.dataset.id = categorieElement.id;
    categorieBouton.innerText = categorieElement.name; // Définit le nom de la catégorie sur le bouton

    categoriesEmplacement.appendChild(categorieBouton); // Ajoute le bouton de catégorie à l'emplacement des boutons
  }
}

// Fonction pour créer et ajouter le bouton "Tous"
function boutonTous() {
  const boutonTous = document.createElement("button");
  boutonTous.classList.add("btn", "btn-tous");
  boutonTous.innerText = "Tous";
  const categoriesEmplacement = document.querySelector(".bouton-container");
  categoriesEmplacement.appendChild(boutonTous);
}

init();
