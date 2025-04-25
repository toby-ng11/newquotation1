export function navUnderline() {
  return {
    currentEl: null, // Track the clicked tab
    hoverEl: null, // Track the hovered tab
    init() {
      this.updateUnderline();
      document.body.addEventListener("htmx:afterSwap", () => {
        this.$nextTick(() => this.updateUnderline());
      });
    },
    setActive(event) {
      this.currentEl = event.target.closest(".top-level-entry");
      this.moveUnderline(this.currentEl);
    },
    setHover(event) {
      this.hoverEl = event.target.closest(".top-level-entry");
      this.moveUnderline(this.hoverEl);
    },
    clearHover() {
      this.hoverEl = null;
      if (this.currentEl) {
        this.moveUnderline(this.currentEl);
      } else {
        // No active tab, hide the underline
        const underline = this.$refs.underline;
        underline.style.width = "0";
      }
    },
    updateUnderline() {
      this.currentEl = document.querySelector(".top-level-entry.active");
      if (this.currentEl) {
        this.moveUnderline(this.currentEl);
      }
    },
    moveUnderline(el) {
      if (!el) return;
      const underline = this.$refs.underline;
      const rect = el.getBoundingClientRect();
      const wrapperRect = el.closest(".nav-wrapper").getBoundingClientRect();
      const targetWidth = rect.width;
      const targetX = rect.left - wrapperRect.left;

      underline.style.transition =
        "width 0.3s cubic-bezier(0.25, 1.5, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1.5, 0.5, 1)";
      underline.style.width = `${targetWidth}px`;
      underline.style.transform = `translateX(${targetX}px)`;
    },
  };
}
