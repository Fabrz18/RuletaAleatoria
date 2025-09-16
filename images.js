// Seleccionamos inputs e imágenes
const imgLeftInput = document.getElementById("img-left-input");
const imgRightInput = document.getElementById("img-right-input");
const imgLeft = document.getElementById("img-left");
const imgRight = document.getElementById("img-right");

// Función para subir imagen y guardar en localStorage
function handleImageUpload(input, imgElement, storageKey) {
  // Click en la imagen abre input
  imgElement.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      imgElement.src = dataUrl;
      localStorage.setItem(storageKey, dataUrl);
    }
    reader.readAsDataURL(file);
  });
}

// Activar para ambos lados
handleImageUpload(imgLeftInput, imgLeft, "imageLeft");
handleImageUpload(imgRightInput, imgRight, "imageRight");

// Cargar imágenes al iniciar
window.addEventListener("load", () => {
  const savedLeft = localStorage.getItem("imageLeft");
  const savedRight = localStorage.getItem("imageRight");

  if (savedLeft) imgLeft.src = savedLeft;
  if (savedRight) imgRight.src = savedRight;
});
