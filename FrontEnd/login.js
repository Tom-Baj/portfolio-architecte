function userLogin() {
  const formulaireLogin = document.querySelector(".formulaire-login");

  formulaireLogin.addEventListener("submit", (event) => {
    // Empeche le chargement par default
    event.preventDefault();

    const login = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    // Convertit l'objet login en une chaîne JSON pour l'envoi
    const chargeUtile = JSON.stringify(login);

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log("Utilisateur connecté");
        window.sessionStorage.setItem("token", response.token);
        window.location.href = "index.html";
      })
      .catch((error) => {
        document.getElementById("erreur-message").textContent =
          "Erreur dans l’identifiant ou le mot de passe";
      });
  });
}

userLogin();
