import { enableBodyScroll, disableBodyScroll } from "./body-scroll-lock.js";

class Lightbox {
  static init() {
    const links = Array.from(
      document.querySelectorAll(
        'a[href$=".png"], a[href$=".webp"], a[href$=".jpg"], a[href$=".svg"], a[href$=".jpeg"], a[href$=".mp4"], a[href$=".gif"]'
      )
    );
    const gallery = links.map((link) => link.getAttribute("href"));
    links.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        new Lightbox(e.currentTarget.getAttribute("href"), gallery);
      })
    );
  }

  constructor(url, images) {
    this.element = this.buildDOM(url);
    this.images = images;
    this.url = null;
    this.currentIndex = this.images.findIndex((image) => image === url);
    this.isLoading = false;
    this.loadImage(url)
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading image or video:", error);
        this.isLoading = false;
      });
    this.onKeyUp = this.onKeyUp.bind(this);
    document.body.appendChild(this.element);
    disableBodyScroll(this.element);
    document.addEventListener("keyup", this.onKeyUp);

    activeLightbox = this;
  }


  loadImage(url) {
    return new Promise((resolve, reject) => {
      this.url = null;
      this.isLoading = true;
      const container = this.element.querySelector(".lightbox__container");
      const loader = document.createElement("div");
      loader.classList.add("lightbox__loader");
      container.innerHTML = "";
      container.appendChild(loader);
  
      // Vérifie si l'URL est une vidéo
      if (url.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
  
        // Réglez le volume à 10%
        video.volume = 0.1;
  
        // Démarre la vidéo automatiquement
        video.autoplay = true;
  
        // Appliquer la taille maximale à 70vh
        video.style.maxHeight = '70vh';
        video.style.width = 'auto';
  
        video.addEventListener("loadeddata", () => {
          console.log("Video loaded:", url);
          container.removeChild(loader);
          container.appendChild(video);
          this.url = url;
          this.isLoading = false;
          resolve();
        });
  
    
        video.addEventListener("error", (error) => {
          console.error("Error loading video:", error);
          this.isLoading = false; 
          reject(error);
        });
      } else {
        // Chargez l'image comme précédemment
        const image = new Image();
        image.onload = () => {
          console.log("Image loaded:", url);
          container.removeChild(loader);
          container.appendChild(image);
          this.url = url;
          this.isLoading = false; 
          resolve();
        };
        image.src = url;
      }
    });
  }
  

  onKeyUp(e) {
    if (e.key === "Escape") {
      this.close(e);
    } else if (e.key === "ArrowLeft") {
      this.prev(e);
    } else if (e.key === "ArrowRight") {
      this.next(e);
    }
  }

  close(e) {
    this.element.classList.add("fadeOut");
    enableBodyScroll(this.element);
    window.setTimeout(() => {
      this.element.parentElement.removeChild(this.element);
    }, 500);
    document.removeEventListener("keyup", this.onKeyUp);
    activeLightbox = null;
  }

  next(e) {
    e.preventDefault();
  
    // Vérifiez si la vidéo actuelle est en cours de chargement
    if (this.isLoading) {
      return;
    }
  
    this.isLoading = true;
  
    // Augmentez l'index avant le chargement pour éviter de recharger la même vidéo
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  
    let nextIndex = (this.currentIndex + 1) % this.images.length;
  
    if (nextIndex === 0) {
      console.log("Loading the first video");
    } else {
      console.log("Loading next video");
    }
  
    this.loadImage(this.images[nextIndex])
      .then(() => {
        console.log("Next image or video loaded successfully");
      })
      .catch((error) => {
        console.error("Error loading image or video:", error);
      })
      .finally(() => {
        
        setTimeout(() => {
          this.isLoading = false;
          console.log("Loading marked as complete");
        }, 100);
      });
  }

  prev(e) {
    e.preventDefault();
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.loadImage(this.images[this.currentIndex])
      .then(() => {
        this.isLoading = false;
      })
      .catch((error) => {
        console.error("Error loading image or video:", error);
        this.isLoading = false;
      });
  }

  buildDOM(url) {
    const dom = document.createElement("div");
    dom.classList.add("lightbox");
    dom.innerHTML = `<button class="lightbox__close">Fermer</button>
    <button class="lightbox__next">Suivant</button>
    <button class="lightbox__prev">Précédent</button>
    <div class="lightbox__container">
    </div>`;
    dom
      .querySelector(".lightbox__close")
      .addEventListener("click", this.close.bind(this));
    dom
      .querySelector(".lightbox__next")
      .addEventListener("click", this.next.bind(this));
    dom
      .querySelector(".lightbox__prev")
      .addEventListener("click", this.prev.bind(this));
    return dom;
  }
}

let activeLightbox = null;
Lightbox.init();
