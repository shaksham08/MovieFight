const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //!Generating an autocomplete HTML code

  root.innerHTML = `
  <label><b>Search</b></label>
  <input class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
    
      
      < /div>
    </div>
  </div>
`;

  //!Selecting From HTML
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");

  //! ON input Function
  const onInput = async (e) => {
    const items = await fetchData(e.target.value);
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultWrapper.innerHTML = ``;
    dropdown.classList.add("is-active");

    //! Iterating Over the Movies array fetched from the api
    for (let item of items) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);

      //! Adding click even to each dropdown items
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
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
  }); //!Adding event Listener to the input change
  //!Debound is used in Utils.js file
  input.addEventListener("input", debounce(onInput, 1000));

  //!click event to window for closing the dropdown
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
