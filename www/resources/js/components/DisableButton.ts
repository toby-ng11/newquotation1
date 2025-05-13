export function disableButton(button, state) {
  if (button instanceof HTMLElement) {
    button.disabled = state;
  }
}