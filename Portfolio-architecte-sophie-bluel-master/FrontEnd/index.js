const figures = document.querySelectorAll('.gallery figure');
const sectionPortfolio = document.getElementById('portfolio');
const gallery = document.querySelector('.gallery');

let modalProjets;




// Recherchez tous les éléments <li> dans la liste de navigation
const menuItems = document.querySelectorAll('nav ul li');


// Parcourez les éléments <li> pour trouver celui avec le texte "login"
menuItems.forEach(item => {
    if (item.textContent.toLowerCase() === "login") {
        item.setAttribute('style', 'cursor:pointer;');
        // Ajoutez un gestionnaire d'événements de clic pour la redirection
        item.addEventListener('click', () => {
            // Redirigez l'utilisateur vers la page "login.js"
            window.location.href = 'login.html';
        });
    }
});




// Fonction pour récupérer les filtres depuis l'API et les afficher
async function recupererFiltres(projets) {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        // Je crée une div pour les filtres
        const divFiltres = document.createElement('div');
        divFiltres.classList.add('divFiltres');
        document.getElementById('portfolio').insertBefore(divFiltres, document.querySelector('.gallery'));

        // Je crée le filtre "Tous" en premier car il n'est pas présent dans l'api
        const filterAll = document.createElement('div');
        filterAll.classList.add('filtres');
        filterAll.innerText = 'Tous';
        filterAll.addEventListener('click', () => {
            // J' affiche tous les projets
            document.querySelector('.gallery').innerHTML = '';
            genererProjets(projets);
        });
        divFiltres.appendChild(filterAll);

        // Je crée les filtres pour chaque catégorie
        categories.forEach(category => {
            const filter = document.createElement('div');
            filter.classList.add('filtres');
            filter.innerText = category.name;
            filter.addEventListener('click', () => {
                // Je filtre les projets par catégorie et j'affiche les résultats
                const filteredProjects = projets.filter(projet => projet.categoryId === category.id);
                document.querySelector('.gallery').innerHTML = '';
                genererProjets(filteredProjects);
            });
            divFiltres.appendChild(filter);
        });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
    }
}



// Fonction pour générer les projets
function genererProjets(projets) {
    projets.forEach(projet => {
        // Je crée la balise dédiée à un projet
        const projetElement = document.createElement("figure");
        // Je crée l’élément img.
        const imageElement = document.createElement("img");
        // J'accède à la propriété imageUrl de l'objet projet pour configurer la source de l’image.
        imageElement.src = projet.imageUrl;
        // Je crée l'élément figcaption.
        const titleProjet = document.createElement("figcaption");
        // J'accède à la propriété title de l'objet projet pour configurer le contenu du figcaption.
        titleProjet.innerText = projet.title;
        // Je rattache l’image à projetElement
        projetElement.appendChild(imageElement);
        projetElement.appendChild(titleProjet);

        // Je rattache la balise figure à la galerie
        gallery.appendChild(projetElement);
    });
}





// Fonction pour récupérer les projets depuis l'API
async function recuperationProjets() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const projets = await response.json();
         // Je supprime les filtres existants si ils existent
         const divFiltres = document.querySelector('.divFiltres');
         if (divFiltres) {
             divFiltres.remove();
         }
        // J'appelle la fonction genererProjets() pour afficher les projets
        genererProjets(projets);
        // J'appelle la fonction recupererFiltres() pour récupérer, afficher les filtres
        recupererFiltres(projets);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des projets :', error);
    }
}

// Appel initial pour récupérer les projets et les filtres
recuperationProjets();



// function actualiserListeProjets() {
//     fetch(`http://localhost:5678/api/works`)
//         .then(response => response.json())
//         .then(projets => {
//             const modalProjets = document.querySelector('.modalProjets');
//             modalProjets.innerHTML = '';

//             projets.forEach(projet => {
//                 const projetElement = document.createElement('div');
//                 projetElement.classList.add('projetElement');

//                 // REMPLACER LE PROJETELEMENT.INNERHTML PAR DES CREATEELEMENT //
//                 const divElement = document.createElement('div');
//                 divElement.classList.add('projet-image');

//                 const imgp = document.createElement('img');
//                 imgp.classList.add('imgp');
//                 imgp.src = projet.imageUrl;
//                 imgp.alt = projet.title;

//                 const imgPoubelle = document.createElement('img');
//                 imgPoubelle.classList.add('img-trash');
//                 imgPoubelle.src = "./assets/icons/trash-can.png";
//                 imgPoubelle.setAttribute("data-projet-id", projet.id);

//                 projetElement.appendChild(divElement);
//                 divElement.appendChild(imgp);
//                 divElement.appendChild(imgPoubelle);







//                 // nouveauxProjets.forEach(projet => {
//                 //     const projetElement = document.createElement('div');
//                 //     projetElement.classList.add('projetElement');
//                 //     projetElement.innerHTML = `
//                 //     <div class="projet-image">
//                 //     <img src="${projet.imageUrl}" alt="${projet.title}" class="imgp"/>
//                 //     <img src="./assets/icons/trash-can.png" class="img-trash" data-projet-id="${projet.id}"/>
//                 // </div>
//                 //     `;
//                 //     modalProjets.appendChild(projetElement);
//             });
//         })
//         .catch(error => {
//             console.error('Une erreur s\'est produite lors de la mise à jour de la liste des projets :', error);
//         });
// }

function supprimerProjet(projetId) {
    const token = sessionStorage.getItem('authToken');
    
    fetch(`http://localhost:5678/api/works/${projetId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then(response => {
        if (response.ok) {
            actualiserListeProjets();
            gallery.innerHTML = "";
            recuperationProjets();
            
        } else {
            console.error('Erreur lors de la suppression du projet :', response.status);
        }
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la suppression du projet :', error);
    });
}




function actualiserListeProjets() {
    fetch(`http://localhost:5678/api/works`)
        .then(response => response.json())
        .then(projets => {
            const modalProjets = document.querySelector('.modalProjets');
            modalProjets.innerHTML = '';

            projets.forEach(projet => {
                const projetElement = document.createElement('div');
                projetElement.classList.add('projetElement');

                // Création des éléments pour chaque projet
                const divElement = document.createElement('div');
                divElement.classList.add('projet-image');

                const imgp = document.createElement('img');
                imgp.classList.add('imgp');
                imgp.src = projet.imageUrl;
                imgp.alt = projet.title;

                const imgPoubelle = document.createElement('img');
                imgPoubelle.classList.add('img-trash');
                imgPoubelle.src = "./assets/icons/trash-can.png";
                imgPoubelle.setAttribute("data-projet-id", projet.id);



                 // Ajout d'un gestionnaire d'événements pour la suppression du projet
                 imgPoubelle.addEventListener('click', () => {
                    const projetId = projet.id;
                    // Appel de la fonction de suppression du projet
                    supprimerProjet(projetId);
                    
                });



                // Ajout des éléments au projetElement
                divElement.appendChild(imgp);
                divElement.appendChild(imgPoubelle);
                projetElement.appendChild(divElement);

                // Ajout du projetElement à la modalProjets
                modalProjets.appendChild(projetElement);
            });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la mise à jour de la liste des projets :', error);
        });
}




document.addEventListener('DOMContentLoaded', () => {

    // Je vérifie si l'utilisateur est connecté en vérifiant la présence du token
    const token = sessionStorage.getItem('authToken');
    const sectionPortfolio = document.getElementById('portfolio');

    if (token) {

        const bandeau = document.createElement('div');
        bandeau.classList.add('bandeau');
        const body = document.querySelector('body');
        const header = document.querySelector('header');
        body.insertBefore(bandeau, header);

        const modeEdition = document.createElement('div');
        modeEdition.classList.add('modeEdition');
        modeEdition.innerHTML = '<img src="./assets/icons/whiteEdit.png"> Mode édition';
        bandeau.appendChild(modeEdition);

        // L'utilisateur est connecté, j'ajoute le bouton de modification
        // Je crée la div de modification
        const editDiv = document.createElement('div');
        editDiv.classList.add('edit-button');

        // J'ajoute l'icône et le texte à l'intérieur de la div
        editDiv.innerHTML = '<img src="./assets/icons/edit.png"> modifier';



        // J'insére editDiv après le h2 dans la section #portfolio
        const h2Element = sectionPortfolio.querySelector('h2');
        if (h2Element) {
            h2Element.insertAdjacentElement('afterend', editDiv);
        }

        editDiv.addEventListener('click', () => {
            // console.log('click sur modifier');
            // Je Crée les éléments de la modale
            const fond = document.createElement('div');
            const modal = document.createElement('div');
            const modalProjets = document.createElement('div');
            const modalProjetsH3 = document.createElement('h3');
            const buttonModal = document.createElement('button');


            modalProjets.classList.add('modalProjets');
            modalProjetsH3.classList.add('modalProjetsH3');
            modalProjetsH3.innerText = "Galerie photo"
            buttonModal.classList.add('buttonModal');


            buttonModal.innerText = "Ajouter une photo";
            fond.classList.add('fond');
            modal.classList.add('modal');

            // const modalContent = document.createElement('div');
            // modalContent.classList.add('modal-content');

            const closeButton = document.createElement('div');
            closeButton.classList.add('close-modal');
            closeButton.innerHTML = '<img src="./assets/icons/xmark.png">'

            // J'ajoute les éléments de la modale au DOM
            // fond.appendChild(modal);
            // modalContent.appendChild(closeButton);
            // modalContent.appendChild(modalProjetsH3)
            // modal.appendChild(modalContent);
            modal.appendChild(closeButton);
            modal.appendChild(modalProjetsH3)
            modal.appendChild(modalProjets)
            modal.appendChild(buttonModal)
            document.body.appendChild(fond);
            document.body.appendChild(modal)

            // J'affiche la modale
            modal.style.display = 'block';

            fetch(`http://localhost:5678/api/works`)
                .then(response => response.json())
                .then(projets => {
                    modalProjets.innerHTML = "";
                    projets.forEach(projet => {
                        // J'utilise la fonction actualiserListeProjets pour générer les projets
                        actualiserListeProjets();
                    });

                    // projets.forEach(projet => {
                    //     const projetElement = document.createElement('div');
                    //     projetElement.classList.add('projetElement');

                    //     // REMPLACER LE PROJETELEMENT.INNERHTML PAR DES CREATEELEMENT //
                    //     const divElement = document.createElement('div');
                    //     divElement.classList.add('projet-image');

                    //     const imgp = document.createElement('img');
                    //     imgp.classList.add('imgp');
                    //     imgp.src = projet.imageUrl;
                    //     imgp.alt = projet.title;

                    //     const imgPoubelle = document.createElement('img');
                    //     imgPoubelle.classList.add('img-trash');
                    //     imgPoubelle.src = "./assets/icons/trash-can.png";
                    //     imgPoubelle.setAttribute("data-projet-id",projet.id);

                    //     projetElement.appendChild(divElement);
                    //     divElement.appendChild(imgp);
                    //     divElement.appendChild(imgPoubelle);



                    //     projetElement.innerHTML = `
                    // <div class="projet-image">
                    //     <img src="${projet.imageUrl}" alt="${projet.title}" class="imgp"/>
                    //     <img src="./assets/icons/trash-can.png" class="img-trash" data-projet-id="${projet.id}"/>
                    // </div>
                    // `;
                    // modalProjets.appendChild(projetElement);


                    // METTRE LA PARTIE SUPPRIMER UN PROJET ICI //

                    /*------------------------------ SUPPRIMER PROJET -------------------------------------*/


                    // const imgTrash = document.querySelectorAll('.img-trash');
                    // // console.log(imgTrash);

                    // imgTrash.forEach(trash => {
                    // const imgPoubelle = document.querySelectorAll('.img-trash');
                    // imgPoubelle.forEach(imgPoubelle => {
                    //     imgPoubelle.addEventListener('click', (event) => {
                    //         console.log('test');
                    //         event.preventDefault();
                    //         const projetId = event.target.getAttribute('data-projet-id');

                    //         console.log(projetId);

                    //         fetch(`http://localhost:5678/api/works/${projetId}`, {
                    //             method: 'DELETE',
                    //             headers: {
                    //                 'Authorization': `Bearer ${token}`,
                    //             },
                    //         })
                    //             // .then(response => response.json())
                    //             .then(result => {
                    //                 fetch('http://localhost:5678/api/works')
                    //                     .then(response => response.json())
                    //                     .then(projets => {

                    //                         // Après la suppression réussie du projet, je supprime l'élément HTML correspondant.
                    //                         const projetElement = imgPoubelle.closest('.projetElement');
                    //                         projetElement.remove();
                    //                         actualiserListeProjets();
                    //                         document.querySelector('.gallery').innerHTML = "";
                    //                         genererProjets(projets);
                    //                         // modalProjets.innerHTML = "";

                    //                         // projets.forEach(projet => {
                    //                         //     const projetElement = document.createElement('div');
                    //                         //     projetElement.classList.add('projetElement');
                    //                         //     projetElement.innerHTML = `
                    //                         //         <div class="projet-image">
                    //                         //             <img src="${projet.imageUrl}" alt="${projet.title}" class="imgp"/>
                    //                         //             <img src="./assets/icons/trash-can.png" class="img-trash"/>
                    //                         //         </div>
                    //                         //     `;
                    //                         //     modalProjets.appendChild(projetElement);
                    //                         // });
                    //                     })
                    //                     .catch(error => {
                    //                         console.error('Une erreur s\'est produite lors de la mise à jour de la liste des projets :', error);
                    //                     });
                    //             })
                    //             .catch(error => {
                    //                 console.error('Une erreur s\'est produite lors de la suppression du projet :', error);
                    //             });
                    //     });
                    // })

                    // });

                    // })
                })

            /*------------------------------------- MODAL FORMULAIRE -----------------------------------*/

            buttonModal.addEventListener('click', () => {
                modalProjetsH3.innerText = "Ajout photo"
                const valider = document.createElement('button');
                valider.classList.add('validerForm');
                valider.innerText = "Valider";
                const formulaire = document.createElement('form');
                formulaire.classList.add('formModal');
                formulaire.innerHTML = `
                <div class="ajoutPhoto">
                <label for="imgFile" class="addImage">
                    <img src="./assets/icons/addImage.png"/>
                    <span class="buttonAddPhoto">+ Ajouter photo</span>
                </label>
                <input type="file" id="imgFile" name="image" accept="image/*" class="inputAjout" style="display: none;">
                <p>jpg.png : 4mo max</p>
            </div>
            
                    <div class="formAjoutPhoto">
                        <div class="inputAjoutPhoto">
                            <label for="imgTitle">Titre</label>
                            <input type="text" name="title" id="imgTitle" class="inputAjout">
                        </div>
                        <div class="inputAjoutPhoto">
                            <label for="imgCategory">Catégorie</label>
                            <select id="imgCategory" class="inputAjout" name="category">
                            <option></option>

                            </select>

                        </div>
                        
                    </div>
                   
                    `
                const arrow = document.createElement('img');
                arrow.classList.add('arrow');
                arrow.src = "./assets/icons/arrow.png";
                modal.appendChild(arrow);

                // J'ajoute un gestionnaire d'événements pour la flèche de retour
                arrow.addEventListener('click', () => {
                    // Je masque le formulaire d'ajout de projet
                    formulaire.style.display = 'none';
                    // Je réaffichie la liste des projets avec les icônes de poubelles
                    fetch(`http://localhost:5678/api/works`)
                        .then(response => response.json())
                        .then(projets => {
                            modalProjets.innerHTML = "";

                            projets.forEach(projet => {
                                const projetElement = document.createElement('div');
                                projetElement.classList.add('projetElement');

                                // REMPLACER LE PROJETELEMENT.INNERHTML PAR DES CREATEELEMENT //

                                projetElement.innerHTML = `
                <div class="projet-image">
                    <img src="${projet.imageUrl}" alt="${projet.title}" class="imgp"/>
                    <img src="./assets/icons/trash-can.png" class="img-trash" data-projet-id="${projet.id}"/>
                </div>
            `;
                                modalProjets.appendChild(projetElement);
                            });
                        });

                });


                modalProjets.innerHTML = "";
                modalProjets.appendChild(formulaire);
                modalProjets.appendChild(valider);





                // Génération des options et valeurs pour le select
                const imgCategorieSelect = document.getElementById('imgCategory');
                fetch(`http://localhost:5678/api/categories`)
                    .then(response => response.json())
                    .then(categories => {
                        categories.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.id;
                            option.textContent = category.name;
                            imgCategorieSelect.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
                    });




                 // Je sélectionne l'input de type file et le label correspondant
                const imgFileInput = document.getElementById('imgFile');
                const addImageLabel = document.querySelector('.addImage');
                let isAddingImage = false;


                // J'ajoute un écouteur d'événement pour le clic sur le label
                addImageLabel.addEventListener('click', () => {
                    if (!isAddingImage) {
                        isAddingImage = true;
                       
                        // Je clique sur l'input de type file pour ouvrir la boîte de dialogue de sélection de fichier
                    imgFileInput.click();
                    }
                    
                });

                // J'ajoute un écouteur d'événement pour le changement de l'input de type file
                imgFileInput.addEventListener('change', (event) => {
                isAddingImage = false;
                    const selectedFile = event.target.files[0];
                    if (selectedFile) {
                        // Je met à jour le texte du label avec le nom du fichier sélectionné
                        addImageLabel.querySelector('span').textContent = selectedFile.name;
                    }
                });

                

                // console.log(token);




                /*--------------------------- AJOUT PROJET -------------------------------------------*/



                document.querySelector('.validerForm').addEventListener('click', async (event) => {

                    event.preventDefault();

                    // Je récupére les valeurs des champs
                    const imgTitle = document.getElementById('imgTitle').value;
                    const imgCategory = document.getElementById('imgCategory').value;
                    const imgFile = imgFileInput.files[0];


                    // Je vérifie si les champs sont vides ou invalides
                    if (!imgTitle || !imgCategory || !imgFile) {

                        // Je vérifie si il y a déjà un message d'erreur
                        const existingErrorMessage = document.querySelector('.error-message');

                        if (existingErrorMessage) {
                            // Si il existe déjà un message d'erreur, je le supprime
                            existingErrorMessage.remove();
                        }


                        // Je crée un élément de message d'erreur
                        const errorMessage = document.createElement('p');
                        errorMessage.classList.add('error-message');
                        errorMessage.innerText = 'Tous les champs sont obligatoires';

                        // J'insère le message d'erreur après le formulaire dans la modale
                        formulaire.insertAdjacentElement('afterend', errorMessage);

                        return; // J'arrête la soumission du formulaire en cas d'erreur
                    }


                    // const formData = new FormData(formulaire);

                    // Je crée un objet FormData pour envoyer les données
                    const formData = new FormData();
                    formData.append('image', imgFile);
                    formData.append('title', imgTitle);
                    formData.append('category', imgCategory);


                    // console.log(imgTitle);
                    // console.log(imgCategory);
                    // console.log(imgFile);

                    try {
                        const response = await fetch('http://localhost:5678/api/works', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json',
                            },
                            body: formData
                        })

                        if (response.ok) {
                            fetch('http://localhost:5678/api/works')
                                .then(response => response.json())
                                .then(projets => {
                                    document.querySelector('.gallery').innerHTML = "";
                                    // Le projet a été ajouté avec succès, j'actualise la liste des projets
                                    actualiserListeProjets();
                                    recuperationProjets();

                                    // Je ferme la modale
                                    // fond.style.display = 'none';
                                    // modal.style.display = 'none';
                                })

                        } else {
                            console.error('Erreur lors de l\'ajout du projet:', response.status);
                        }
                    } catch (error) {


                        console.error('Une erreur s\'est produite lors de l\'ajout du projet:', error);
                    }

                });

            });


            // Je ferme la modale lorsque le bouton de fermeture est cliqué
            closeButton.addEventListener('click', () => {
                fond.style.display = 'none'
                modal.style.display = 'none';
                // Je supprime les éléments de la modale du DOM si nécessaire
                modal.remove();
            });

            fond.addEventListener('click', (event) => {
                if (event.target === fond) {
                    fond.style.display = 'none'
                    modal.style.display = 'none';
                    // Je supprime les éléments de la modale du DOM si nécessaire
                    modal.remove();
                }
            })
        });

    }
});



