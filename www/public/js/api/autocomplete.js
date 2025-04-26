export function setupAutoComplete({
  fieldName,
  fetchUrl,
  fillFields = [],
  renderItem = defaultRenderItem,
  extraSelectActions = [],
  minLength = 1,
  queryParamName = "pattern",
  limitParamName = "limit"
}) {
  const input = document.querySelector(fieldName);

  if (!input) return;

  let autocompleteList = document.createElement("ul");
  autocompleteList.classList.add("autocomplete-list");
  input.parentNode.style.position = "relative"; // Ensure positioning
  input.parentNode.appendChild(autocompleteList);

  let activeIndex = -1;
  let debounceTimer = null;

  input.addEventListener("input", function () {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      activeIndex = -1;
      autocompleteList.innerHTML = "";

      if (query.length < minLength) {
        input.classList.remove("loading");
        return;
      }

      input.classList.add("loading");

      const url = `${fetchUrl}?${queryParamName}=${encodeURIComponent(query)}&${limitParamName}=10`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          input.classList.remove("loading");
          autocompleteList.innerHTML = "";

          if (!data.length) {
            const noResult = document.createElement("li");
            noResult.textContent = "No matches found.";
            noResult.classList.add("no-result");
            autocompleteList.appendChild(noResult);
            return;
          }

          data.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = renderItem(item);
            listItem.setAttribute("data-index", index);
            listItem.addEventListener("click", function () {
              // Fill fields
              fillFields.forEach(({ fieldSelector, itemKey }) => {
                const targetField = document.querySelector(fieldSelector);
                if (targetField && item[itemKey] !== undefined) {
                  targetField.value = item[itemKey];
                }
              });
              extraSelectActions.forEach(fn => {
                if (typeof fn === "function") {
                  fn(item);
                }
              });
              autocompleteList.innerHTML = "";
            });
            autocompleteList.appendChild(listItem);
          });
        })
        .catch((error) => {
          input.classList.remove("loading");
          autocompleteList.innerHTML = "";
          console.error('Autocomplete fetch error:', error);
        });
    }, 300); // 300ms debounce
  });

  input.addEventListener("keydown", function (e) {
    const items = autocompleteList.querySelectorAll("li:not(.no-result)");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActive(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActive(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex > -1) {
        items[activeIndex].click();
      }
    } else if (e.key === "Escape") {
      autocompleteList.innerHTML = "";
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target !== input && !autocompleteList.contains(e.target)) {
      autocompleteList.innerHTML = "";
    }
  });

  function updateActive(items) {
    items.forEach((item) => item.classList.remove("active"));
    if (activeIndex > -1 && items[activeIndex]) {
      items[activeIndex].classList.add("active");
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  function defaultRenderItem(item) {
    return `<div><strong>${item.id}</strong><br>${item.name}</div>`;
  }
}
