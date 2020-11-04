const apiKey = "563492ad6f91700001000001c768832b78b547eb9e8a086034e76994";
const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const submitBtn = document.querySelector(".submit-btn");
const loadMore = document.querySelector(".more");
const featuredBtns = document.querySelectorAll(".featured button");

let searchValue;
let page = 1;
let fetchLink;
let currentSearch;
let featured;

searchInput.addEventListener("input", updateSearchInput);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

loadMore.addEventListener("click", loadMorePhotos);

featuredBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    featured = event.target.value;
    searchInput.value = featured;
    searchPhotos(featured);
  });
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
  fetchLink = "https://api.pexels.com/v1/curated?per_page=18&page=1";
  const data = await fetchAPI(fetchLink);
  generatePhotos(data);
}

async function searchPhotos(searchInput) {
  fetchLink = `https://api.pexels.com/v1/search?query=${searchInput}&per_page=18&page=1`;
  const data = await fetchAPI(fetchLink);
  clearGallery();
  generatePhotos(data);
}

async function loadMorePhotos() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=18&page=${page}`;
  } else if (featured) {
    fetchLink = `https://api.pexels.com/v1/search?query=${featured}&per_page=18&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=18&page=${page}`;
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
    const galleryImageInfo = document.createElement("div");
    galleryImageInfo.classList.add("gallery-img-info");
    galleryImageInfo.innerHTML = `<a href="${photo.photographer_url}" target="blank""><p>${photo.photographer}</p></a>
      <a href="${photo.src.original}" target="blank" id="download"><i class="fas fa-arrow-down"></i></a>`;
    galleryImg.innerHTML = `<img src="${photo.src.large}">`;
    const imageDarker = document.createElement("div");
    imageDarker.classList.add("image-darker");
    galleryImg.appendChild(imageDarker);
    galleryImg.appendChild(galleryImageInfo);
    gallery.appendChild(galleryImg);

    galleryImg.addEventListener("mouseover", () => {
      galleryImageInfo.style.transform = "translateY(-5rem)";
      imageDarker.style.opacity = "0.3";
    });

    galleryImg.addEventListener("mouseleave", () => {
      galleryImageInfo.style.transform = "translateY(0)";
      imageDarker.style.opacity = "0";
    });
  });
}

function clearGallery() {
  gallery.innerHTML = "";
}

curatedPhotos();
