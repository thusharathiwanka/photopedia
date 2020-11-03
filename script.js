const apiKey = "563492ad6f91700001000001c768832b78b547eb9e8a086034e76994";
const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const submitBtn = document.querySelector(".submit-btn");
const loadMore = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

searchInput.addEventListener("input", updateSearchInput);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSearch = searchValue;
  searchPhotos(currentSearch);
});

loadMore.addEventListener("click", loadMorePhotos);

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
  fetchLink = "https://api.pexels.com/v1/curated?per_page=20&page=1";
  const data = await fetchAPI(fetchLink);
  generatePhotos(data);
}

async function searchPhotos(searchInput) {
  fetchLink = `https://api.pexels.com/v1/search?query=${searchInput}&per_page=20&page=1`;
  const data = await fetchAPI(fetchLink);
  clearGallery();
  generatePhotos(data);
}

async function loadMorePhotos() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=20&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=20&page=${page}`;
  }
  const data = await fetchAPI(fetchLink);
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
      <a href="${photo.photographer_url}" target="blank""><p>${photo.photographer}</p></a>
      <a href="${photo.src.original}" target="blank" id="download"><i class="fas fa-arrow-down"></i></a>
    </div>`;
    gallery.appendChild(galleryImg);
  });
}

function clearGallery() {
  gallery.innerHTML = "";
}

curatedPhotos();
