$(document).ready(function() {
    $('.gallery').mauGallery({
        columns: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3
        },
        lightBox: true,
        lightboxId: 'myAwesomeLightbox',
        showTags: true,
        tagsPosition: 'top'
    });
});
//fn raccourci jQuery qui s'exécute lorsque le DOM est complètement chargé, donc l'élément gallery ne s'écécute qu'après le chargement de la page entière
// light box : true, affiche les images en grand format pour la modal lightbox
// lightboxId : 'myAwesomeLightbox', id de la lightbox
// showTags : true, affiche les tags 
// tagsPosition : 'top', position des tags en haut de l'image
// donc le code initialise la gallery avec des colonnes adaptatives en fonctions de la taille de l'ecran, active lightbox pour afficher les images en plein écran, et affiche des tags en haut de la gallerie pour filtrer les images (même principe que portfolio archi)