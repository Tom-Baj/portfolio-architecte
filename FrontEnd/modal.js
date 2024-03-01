let modal = null;

//Créer la fonction qui supprime le projet auprès de l'API
function supprimerWork(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    //Spécifie la method d'utilisation de l'API "DELETE"
    method: "DELETE",
  })
    .then((response) => {
      //Vérifie si la requête fonctionne ou pas
      if (!response.ok) {
        throw new Error("La suppression à échoué");
      }
      //Traite la réponse en json
      return response.json();
    })
    //Affiche la réponse
    .then((response) => {
      console.log("Projet supprimé", response);
    })
    .catch((error) => {
      console.log("Erreur", error);
    });
}

function openModal(event) {
  event.preventDefault();
  const target = document.getElementById("modal-modifier");
  target.classList.toggle("hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  //modal.addEventListener("click", closeModal);
  modal.querySelector(".js-fermer-modal").addEventListener("click", closeModal);

  clickPoubelle();
}

function closeModal(event) {
  if (modal === null) return;
  event.preventDefault();
  modal.classList.toggle("hidden");
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal
    .querySelector(".js-fermer-modal")
    .removeEventListener("click", closeModal);
  modal = null;
}

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

function clickPoubelle() {
  //Récuperer les span poubelle
  const boutonsPoubelle = document.querySelectorAll(".poubelle");
  //Iterer à travers les span
  boutonsPoubelle.forEach((boutonPoubelle) => {
    //Ajout du click sur les span
    boutonPoubelle.addEventListener("click", (event) => {
      //Récuperer sur quel bouton a eu lieu le click
      const clickedElement =
        event.target.parentNode.parentNode.firstChild.getAttribute("data-id");
      console.log(clickedElement);

      supprimerWork(clickedElement);
      event.preventDefault();
      const supprimerBloc = document.parentNode.querySelector("div");
      console.log(supprimerBloc);
      clickedElement.parentNode.removeAttribute("div");
    });
  });
}
