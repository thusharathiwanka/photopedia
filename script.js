const apiKey = "563492ad6f91700001000001c768832b78b547eb9e8a086034e76994";
const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const submitBtn = document.querySelector(".submit-btn");
let searchValue;

searchInput.addEventListener("input", updateSearchInput);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchPhotos(searchValue);
});

async function fetchAPI(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: apiKey,
    },
  });
  const data = await dataFetch.json();

  return data;
}

async function curatedPhotos() {
  const data = await fetchAPI("https://api.pexels.com/v1/curated?per_page=20");
  generatePhotos(data);
}

async function searchPhotos(searchInput) {
  const data = await fetchAPI(
    `https://api.pexels.com/v1/search?query=${searchInput}&per_page=20`
  );
  clearGallery();
  generatePhotos(data);
}

function updateSearchInput(event) {
  searchValue = event.target.value;
}

function generatePhotos(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `<img src="${photo.src.large}">
    <div class="gallery-img-info">
      <p>${photo.photographer}</p>
      <a href="${photo.src.original}" target="blank"><i class="fas fa-arrow-down"></i></a>
    </div>`;
    gallery.appendChild(galleryImg);
  });
}

function clearGallery() {
  gallery.innerHTML = "";
}

curatedPhotos();
