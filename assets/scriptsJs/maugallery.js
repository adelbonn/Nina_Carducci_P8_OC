(function ($) {
  $.fn.mauGallery = function (options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function () {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function (index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };
  $.fn.mauGallery.listeners = function (options) {
    //Gestion des clics sur les images
    $(".gallery-item").on("click keydown", ".gallery-item", function (event) {
      if (
        event.type === "click" ||
        (event.type === "keydown" && event.key === "Enter")
      ) {
        if (options.lightBox && $(this).prop("tagName") === "IMG") {
          $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
        } else {
          return;
        }
      }
    });

    //Gestion des filtres avec le clavier
    $(".gallery").on("click keydown", ".nav-link", function (event) {
      if (
        event.type === "click" ||
        (event.type === "keydown" && event.key === "Enter")
      ) {
        //mise a jour des états des filtres et de l'ARIA
        $(".nav-link").attr("aria-pressed", "false");
        $(this).attr("aria-pressed", "true");
        $.fn.mauGallery.methods.filterByTag.call(this);
      }
    });

    //naviagtion dans la lightbox
    $(".gallery").on("click keydown", ".mg-prev", function (event) {
      if (
        event.type === "click" ||
        (event.type === "keydown" && event.key === "Enter")
      ) {
        $.fn.mauGallery.methods.prevImage(options.lightboxId);
      }
    });
    $(".gallery").on("click keydown", ".mg-next", function (event) {
      if (
        event.type === "click" ||
        (event.type === "keydown" && event.key === "Enter")
      ) {
        $.fn.mauGallery.methods.nextImage(options.lightboxId);
      }
    });
    //support de touches de navigation
    $(document).on("keydown", function (event) {
      if ($("modal.fade").is(":visible")) {
        switch (event.key) {
          case "ArrowLeft":
            $(".mg-prev").trigger("click"); 
            break;
          case "ArrowRight":
            $(".mg-next").trigger("click"); 
            break;
          case "Escape":
            $(".modal.fade").modal("hide");
            break;
        }
      }
    });
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (!element.children().first().hasClass("row")) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
      const modalId = lightboxId ? lightboxId : "galleryLightbox";
      const $modal = $(`#${modalId}`);
      const $lightbox = $(`#${lightboxId}`);
      const $lightboxImage = $modal.find(".lightboxImage");
      const imageAlt = element.attr("alt") || "image de la galerie";
      const imageSrc = element.attr("src");
     

      $lightboxImage.attr("src", imageSrc);
      $lightboxImage.attr("alt", imageAlt);

      //ouvre la modale avec bootstrap
      const modal = new bootstrap.Modal($modal[0]);
      modal.show();
    },

    prevImage(lightboxId) {
      const $modal = $(`#${lightboxId}`);
      const $currentImage = $modal.find(".lightboxImage");
      const $currentSrc = $currentImage.attr("src");

      //recupéré toutes les images visible dans la galerie
      const $galleryImages = $(".gallery-item:visible");
      let currentIndex = -1;

      //trouve l index de l'image courante
      $galleryImages.each(function (index) {
        if ($(this).attr("src") === $currentSrc) {
          currentIndex = index;
        }
      });

      //calculer l index precedent
      const prevIndex =
        currentIndex - 1 < 0 ? $galleryImages.length - 1 : currentIndex - 1;
      const $prevImage = $galleryImages.eq(prevIndex);

      if ($prevImage.length) {
        const prevAlt = $prevImage.attr("alt") || "Image de la galerie";
        $currentImage.attr("src", $prevImage.attr("src")).attr("alt", prevAlt);

        // Annonce pour les lecteurs d'écrans
        $("#lightbox-caption").text(`Image suivante : ${prevAlt}`);
      }
    },
    nextImage(lightboxId) {
      const $modal = $(`#${lightboxId}`);
      const $currentImage = $modal.find(".lightboxImage");
      const $currentSrc = $currentImage.attr("src");

      //recupéré toutes les images visible dans la galerie

      const $galleryImages = $(".gallery-item:visible");
      let currentIndex = -1;

      //trouve l index de l'image courante
      $galleryImages.each(function (index) {
        if ($(this).attr("src") === $currentSrc) {
          currentIndex = index;
        }
      });

      //calculer l index suivant
      const nextIndex =
        currentIndex + 1 >= $galleryImages.length ? 0 : currentIndex + 1;
      const $nextImage = $galleryImages.eq(nextIndex);

      if ($nextImage.length) {
        const nextAlt = $nextImage.attr("alt") || "Image de la galerie";
        $currentImage.attr("src", $nextImage.attr("src")).attr("alt", nextAlt);

        // Annonce pour les lecteurs d'écrans
        $("#lightbox-caption").text(`Image suivante : ${nextAlt}`);
      }
    },
    //cree la modale
    createLightBox(gallery, lightboxId, navigation) {
      const modalId = lightboxId ? lightboxId : "galleryLightbox";
      gallery.append(
        `<div class="modal fade"
         id="${modalId}"
         tabindex="-1"
         role="dialog"
         aria-label="modale de visualisation des images"
         aria-modal="true"
        >
           <div class="modal-dialog" role="document">
              <div class="modal-content">  
               <div class="modal-header">
                 <button type="button"
                   class="close"
                   data-bs-dismiss="modal"
                   aria-label="Fermer la modale"              
                   >
                    <span aria-hidden="true">&times;</span>
                </button>
               </div>
                    <div class="modal-body">
                        <div class="lightbox">
                            ${
                              navigation
                                ? '<button class="mg-prev" type="button" aria-label="voir l\'image precedente"><</button>'
                                : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage
                             img-fluid" 
                             alt="Contenu de l'image affichée dans la modale au clique"
                            src=""
                            alt=""
                            aria-label="Image agrandie dans la modale"
                            aria-live="polite"
                            />
                            ${
                              navigation
                                ? '<button class="mg-next" type="button" aria-label="voir l\'image suivante">></button>'
                                : '<span style="display:none;" />'
                            }
                         </div>  
                      </div>
                </div>
              </div>
            </div>`
      );

      const $modal = $(`#${modalId}`);

      //gestion des evenements pour la navigation avec les flèches
      $modal.find(".mg-prev").on("click", () => {
        $.fn.mauGallery.methods.prevImage(modalId);
      });

      $modal.find(".mg-next").on("click", () => {
        $.fn.mauGallery.methods.nextImage(modalId);
      });

      //navigation au clavier
      $(document).on("keydown", function (event) {
        if ($modal.is(":visible")) {
          switch (event.key) {
            case "ArrowLeft":
              $.fn.mauGallery.methods.prevImage(modalId);
              break;
            case "ArrowRight":
              $.fn.mauGallery.methods.nextImage(modalId);
              break;
            case "Escape":
              $modal.modal("hide");
              break;
          }
        }
      });
      //nettoyage a la fermeture de la modale
      $modal.on("hidden.bs.modal", function () {
        const $lightboxImage = $(this).find(".lightboxImage");
        $lightboxImage.attr("src", "");
        $lightboxImage.attr("alt", "");
        $("#lightbox-caption").text("");
      });
    },

    showItemTags(gallery, position, tags) {
      var tagsRow = `<nav class="nav-tags"  aria-label="barre de navigation avec bouttons de filtres de la galerie de photos du portfolio de Nina Carducci">
<div class="my-4 tags-bar nav nav-pills" role="tablist">`;
      gallery.find(".gallery-item").each(function () {
        const tag = $(this).data("gallery-tag") || "all";
        $(this).closest(".item-column").attr("data-gallery-tag", tag);
      });

      tagsRow += `
           <button class="nav-link active" 
             id="all-tab"
             data-images-toggle="all" 
             type="button" 
             role="tab"
             aria-controls="all-panel"
             aria-selected="true" 
             aria-label="Afficher toutes les images de la galerie">Tous</button>`;

      $.each(tags, function (index, value) {
        const tagId = `gallery-${value.toLowerCase()}`;
        tagsRow += `
                <button class="nav-link"  
                id="${tagId}-tab"
                data-images-toggle="${value}" 
                type="button"
                role='tab'
                aria-controls="${tagId}-panel"
                aria-selected="false"
                aria-label="Afficher les images de la catégorie ${value}"
                >${value}</button>
                `;
      });

      tagsRow += `
        </div>
      </nav>
      <div class="gallery-items-row">`;
      //creation du panneaux "tous" et des panneaux par catégorie
      tagsRow += `
        <div id="all-panel" role="tabpanel" aria-labelledby="all-tab"></div>`;

      $.each(tags, function (index, value) {
        const tagId = `gallery-${value.toLowerCase()}`;
        tagsRow += `
        <div id="${tagId}-panel" role="tabpanel" aria-labelledby="${tagId}-tab hidden></div>`;
      });

      tagsRow += "</div>";

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },

    filterByTag: function () {
      const $this = $(this);
      const tag = $this.data("images-toggle");
      const gallery = $this.closest(".gallery");

    
      gallery.find(".nav-link").each(function () {
        const $btn = $(this);
        const isSelected = $btn.is($this);
        $btn
          .removeClass(isSelected ? "" : "active")
          .addClass(isSelected ? "active" : "")
          .attr("aria-selected", isSelected);

        const panelId = $btn.attr("aria-controls");
        $(`#${panelId}`).attr("hidden", !isSelected);
      });

      const $items = gallery.find(".item-column");
      if (tag === "all") {
        $items.show();
        $items.fadeIn(300);
      } else {
        $items.hide();
        $items
          .find(`[data-gallery-tag="${tag}"]`)
          .closest(".item-column")
          .show()
          .fadeIn(300);
      }
    },
  };
})(jQuery);
propos