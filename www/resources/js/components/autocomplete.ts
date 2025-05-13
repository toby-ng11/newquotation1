function defaultRenderItem(item) {
  return `<div><strong>${item.id}</strong><br>${item.name}</div>`;
}

export function setupAutoComplete({
  fieldName,
  fetchUrl,
  fillFields = [],
  renderItem = defaultRenderItem,
  extraSelectActions = [],
  minLength = 1,
  queryParamName = "pattern",
  limitParamName = "limit",
}) {
  const input = document.querySelector(fieldName);
  if (!input || input.classList.contains("no-autocomplete")) return;

  const isOverlay = input.closest(".overlay-style");
  //const isModal = input.closest(".modal-box");
  const container = isOverlay;

  const autocompleteList = container
    ? input.parentNode.querySelector(".autocomplete-list")
    : document.createElement("ul");

  if (!container) {
    autocompleteList.classList.add("autocomplete-list");
    document.body.appendChild(autocompleteList);
  }

  input.parentNode.style.position = "relative"; // Ensure positioning

  let activeIndex = -1;
  let debounceTimer = null;

  input.addEventListener("input", function () {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      activeIndex = -1;
      //autocompleteList.innerHTML = "";

      if (query.length < minLength) {
        return;
      }

      const url = `${fetchUrl}?${queryParamName}=${encodeURIComponent(
        query
      )}&${limitParamName}=10`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          autocompleteList.classList.add("visible");
          autocompleteList.innerHTML = "";

          if (container) container.classList.add("fly-up");

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
              extraSelectActions.forEach((fn) => {
                if (typeof fn === "function") {
                  fn(item);
                }
              });
              autocompleteList.classList.remove("visible");
              autocompleteList.innerHTML = "";
              if (container) container.classList.remove("fly-up");
            });
            autocompleteList.appendChild(listItem);
          });
          positionList();
        })
        .catch((error) => {
          autocompleteList.innerHTML = "";
          console.error("Autocomplete fetch error:", error);
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
      if (container) container.classList.remove("fly-up");
    }
  });

  document.addEventListener("click", function (e) {
    if (
      autocompleteList &&
      e.target !== input &&
      !autocompleteList.contains(e.target)
    ) {
      autocompleteList.innerHTML = "";
      if (container) container.classList.remove("fly-up");
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (document.activeElement === input) positionList();
    },
    true
  );

  window.addEventListener("resize", () => {
    if (document.activeElement === input) positionList();
  });

  function updateActive(items) {
    items.forEach((item) => item.classList.remove("active"));
    if (activeIndex > -1 && items[activeIndex]) {
      items[activeIndex].classList.add("active");
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }

  function positionList() {
    if (container) return; // no manual positioning needed

    const rect = input.getBoundingClientRect();
    const isReversed = input.classList.contains("reverse-autocomplete");

    autocompleteList.style.position = "absolute";
    autocompleteList.style.left = `${rect.left + window.scrollX}px`;
    autocompleteList.style.width = `${rect.width}px`;
    autocompleteList.style.zIndex = "10000";
    if (isReversed) {
      autocompleteList.style.top = `${
        rect.top + window.scrollY - autocompleteList.offsetHeight
      }px`;
    } else {
      autocompleteList.style.top = `${rect.bottom + window.scrollY}px`;
    }
  }
}
