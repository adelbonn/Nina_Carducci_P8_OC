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
// Gestion de l'accessibilité du carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carouselExampleIndicators');
    
    // Création d'une div pour les annonces live
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('visually-hidden');
    carousel.appendChild(liveRegion);

    // Gestion des événements du carousel
    carousel.addEventListener('slide.bs.carousel', function (event) {
        const currentSlide = event.relatedTarget;
        const description = currentSlide.querySelector('.visually-hidden').textContent;
        const slideNumber = currentSlide.getAttribute('aria-label').split(':')[0];
        
        // Mise à jour de l'annonce
        liveRegion.textContent = `${slideNumber}. ${description}`;
    });

    // Gestion de la navigation au clavier
    carousel.addEventListener('keydown', function(event) {
        const activeSlide = carousel.querySelector('.carousel-item.active');
        
        switch(event.key) {
            case 'ArrowLeft':
                carousel.querySelector('.carousel-control-prev').click();
                break;
            case 'ArrowRight':
                carousel.querySelector('.carousel-control-next').click();
                break;
                case 'Home':
                    // Aller à la première diapositive
                    carousel.querySelector('[data-bs-slide-to="0"]').click();
                    break;
                case 'End':
                    // Aller à la dernière diapositive
                    const lastSlide = carousel.querySelectorAll('[data-bs-slide-to]').length - 1;
                    carousel.querySelector(`[data-bs-slide-to="${lastSlide}"]`).click();
                    break;
        }
    });
});