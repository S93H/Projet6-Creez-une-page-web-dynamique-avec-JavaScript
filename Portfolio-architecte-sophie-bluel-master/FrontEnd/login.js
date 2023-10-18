const form = document.querySelector('form');
 const loginSubmit = document.getElementById('loginSubmit');

//------------------------------ FONCTION ASYNCHRONE POUR EFFECTUER UNE REQUETE AU SERVEUR D'AUTHENTIFICATION ---------------------//

async function fetchUser() {

    // Je récupère la valeur de l'e-mail depuis le champ de formulaire
    const emailValue = document.getElementById("email").value;

    // Je récupère la valeur du mot de passe depuis le champ de formulaire
    const passwordValue = document.getElementById("password").value;

     // Je crée un objet contenant les données d'authentification (e-mail et mot de passe)
    const données = {
        email: emailValue,
        password: passwordValue,
    }


    // J'envoie une requête POST au serveur avec les données d'authentification
    const response = await fetch("http://localhost:5678/api/users/login",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }, 
            // J'ajoute les en-têtes appropriés à la requête
            body: JSON.stringify(données) //stringify me sert à convertir un objet JavaScript en une chaîne de caractères JSON //
        });
        // Je vérifie si la réponse de la requête est OK (statut HTTP 200)
    if (response.ok === true) {
        // Si la réponse est OK, je retourne les données JSON de la réponse
        return response.json();
    }

    // Si la réponse n'est pas OK, la gestion de l'erreur est effectuée ailleurs, notamment dans le formulaire de soumission.



};





form.addEventListener('submit', (event) => {

    try {
        // J'empêche le formulaire de se soumettre normalement ce qui entrainerai un rechargement de la page
        event.preventDefault()

         // Je supprime d'abord tout message d'erreur existant
         const existingErrorMessages = document.querySelectorAll('.errorLogin');
         existingErrorMessages.forEach(errorMessage => errorMessage.remove());


        fetchUser().then(response => {
            if (response.token) {
                const token = response.token;
                // J'enregistre le jeton d'authentification dans la session en cours
                sessionStorage.setItem('authToken', token); // sessionStorage est un objet JavaScript qui fait partie de l'API de stockage web. Il est utilisé pour stocker des données de manière temporaire pendant la durée de vie de la session de navigation d'un utilisateur. 
                // setItem permet d'ajouter ou de mettre à jour une paire clé-valeur dans sessionStorage. 

                // ici je fais la redirection vers la page administrateur
                window.location.href = "index.html";
            } 
        }).catch(error => {
            console.error("Une erreur s'est produite lors de la récupération du token :", error);

            // J'affiche un message d'erreur si l'email ou le mot de passe ne correspond pas

            const errorLogin = document.createElement('p');
            errorLogin.classList.add('errorLogin');
            errorLogin.innerText = "L'email ou le mot de passe est incorrect"
            form.insertBefore(errorLogin, loginSubmit);
        });

    } catch (error) {
        console.error("Une erreur est survenue : " + error.message);
    };


})


