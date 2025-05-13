import flatpickr from "flatpickr";

export function initFlatpickr() {
  flatpickr(".flatpickr", {
    dateFormat: "Y-m-d",
  });

  flatpickr(".flatpickr-time", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
  });
}
