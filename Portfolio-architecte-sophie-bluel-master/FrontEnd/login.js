const form = document.querySelector('form');
 const loginSubmit = document.getElementById('loginSubmit');

// let inputs = document.getElementsByTagName('input');


// function verifierChamp(balise) {
//     if (balise.value === "") {
//         // alert('Tous les champs sont obligatoires')
       
//         const champVide = document.createElement('p');
//         champVide.classList.add('champVide');
//         champVide.innerText = "Tous les champs sont obligatoires"
//         form.insertBefore(champVide, loginSubmit)

//     } else {
//         console.log('champ ok');
//     }

  
// }


function verifierEmail(balise) {
    let emailRegexp = new RegExp("[a-z._-]+@[a-z._-]+\\.[a-z._-]+")       //[a-zA-Z0-9._-]+@[a-zA-Z._-]+\\.[a-z._-]+
    if (emailRegexp.test(balise.value)) {
        // console.log('email valide');
    }
}


async function fetchUser() {


    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;

    const données = {
        email: emailValue,
        password: passwordValue,
    }



    const response = await fetch("http://localhost:5678/api/users/login",
        {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(données)
        });
    if (response.ok === true) {
        return response.json();
    }

    //  throw new Error('Impossible de contacter le serveur')



};





form.addEventListener('submit', (event) => {

    try {
        event.preventDefault()

        const baliseEmail = document.getElementById("email")
        // verifierChamp(baliseEmail)
        verifierEmail(baliseEmail)

        const balisePassword = document.getElementById("password")
        // verifierChamp(balisePassword)

         // Je supprime d'abord tout message d'erreur existant
         const existingErrorMessages = document.querySelectorAll('.errorLogin');
         existingErrorMessages.forEach(errorMessage => errorMessage.remove());


        fetchUser().then(response => {
            if (response.token) {
                const token = response.token;
                sessionStorage.setItem('authToken', token);
                // ici faire redirection
                window.location.href = "index.html";
            } else {
                console.log("Pas de token dans la réponse de l'API.");
                // ici pourquoi pas afficher un message mais pas obligé
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
        console.log("Une erreur est survenue : " + error.message);
    };


})


