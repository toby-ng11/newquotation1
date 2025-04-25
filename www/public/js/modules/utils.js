export function resetForm($form) {
  $form
    .find(
      "input:hidden, input:text, input:password, input:file, select, textarea"
    )
    .val("")
    .trigger("change");
  $form
    .find("input:radio, input:checkbox")
    .prop("checked", false)
    .prop("selected", false)
    .trigger("change");
  $form.find("select").each(function () {
    let $select = $(this);
    if ($select.data("default-options")) {
      $select.html($select.data("default-options"));
    }
    $select.prop("selectedIndex", 0).trigger("change");
  });
  $form.find("input, select, textarea").prop("disabled", false);
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
      threshold: 0.3,
    }
  );

  elements.forEach(el => observer.observe(el));
}
