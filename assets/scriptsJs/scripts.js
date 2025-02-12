$(document).ready(function() {
    //initialisation de la galerie avec un petit delai pour s'assurer que le DOM est prêt)
    setTimeout(function() {
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
//affiche la galerie après initialisation
$('.gallery').fadeIn();
    }, 100);
});
