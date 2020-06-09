//! Funtion TO fetch movies from the OMDP API
const fetchMovie = async (searchTerm) => {
  let response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apiKey: "af22c0bb",
      s: searchTerm,
    },
  });

  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

//!Generating an autocomplete HTML code
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search For a movie </b></label>
  <input class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
    
      
      < /div>
    </div>
  </div>
`;

//!Selecting From HTML
const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultWrapper = document.querySelector(".results");

//! ON input Function
const onInput = async (e) => {
  const movies = await fetchMovie(e.target.value);
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultWrapper.innerHTML = ``;
  dropdown.classList.add("is-active");

  //! Iterating Over the Movies array fetched from the api
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${movie.Title}
    `;

    //! Adding click even to each dropdown items
    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });
    resultWrapper.appendChild(option);
  }
};

//!Adding event Listener to the input change
//!Debound is used in Utils.js file
input.addEventListener("input", debounce(onInput, 1000));

//!click event to window for closing the dropdown
document.addEventListener("click", (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove("is-active");
  }
});

//! Making a follow request to a particular clicked movie in Dropdowns
const onMovieSelect = async (movie) => {
  console.log(movie.imdbID);
  const movieId = movie.imdbID;
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apiKey: "af22c0bb",
      i: movieId,
    },
  });
  console.log(response.data);
  document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
