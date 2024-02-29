let modal = null;

const openModal = function (event) {
  event.preventDefault();
  const target = document.getElementById("modal-modifier");
  target.classList.toggle("hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  //modal.addEventListener("click", closeModal);
  modal.querySelector(".js-fermer-modal").addEventListener("click", closeModal);

  //acceder a la poubelle clické
  const boutonsPoubelle = document.querySelectorAll(".poubelle");
  boutonsPoubelle.forEach((boutonPoubelle) => {
    boutonPoubelle.addEventListener("click", (event) => {
      const clickedElement = event.target;
      console.log(clickedElement);
    });
  });
};

const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  modal.classList.toggle("hidden");
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

function suprimerPhoto() {}

suprimerPhoto();
