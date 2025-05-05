export function resetForm(form) {
  if (!form) return;

  // Clear common input types
  form
    .querySelectorAll(
      "input[type='hidden'], input[type='text'], input[type='password'], input[type='file'], select, textarea"
    )
    .forEach((el) => {
      el.value = "";
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });

  // Uncheck checkboxes and radios
  form
    .querySelectorAll("input[type='checkbox'], input[type='radio']")
    .forEach((el) => {
      el.checked = false;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });

  // Reset selects with custom default options (if any)
  form.querySelectorAll("select").forEach((select) => {
    const defaultOptions = select.dataset.defaultOptions;
    if (defaultOptions) {
      select.innerHTML = defaultOptions;
    }
    select.selectedIndex = 0;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // Re-enable all inputs
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.disabled = false;
  });
}

// Utility function to enable/disable buttons
export function disableButton($button, state) {
  $button.prop("disabled", state);
}

export function initFlatpickr() {
  flatpickr(".flatpickr", {
    dateFormat: "Y-m-d",
  });
}

export function runFadeInAnimation() {
  const elements = document.querySelectorAll(".fade-in-up:not(.show)");

  // Fallback if Intersection Observer is not supported
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.1, // <-- Adjust this value to control when the animation starts
    }
  );

  elements.forEach((el) => observer.observe(el));
}
