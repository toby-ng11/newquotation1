import { showFlashMessage } from "../modules/flashmessage.js";

export function loadingState() {
  return {
    loading: false,
    requestCount: 0,
    timeoutId: null,
    errorMessage: "",
    init() {
      document.body.addEventListener("htmx:beforeRequest", () => {
        this.requestCount++;
        this.loading = true;
        this.errorMessage = "";

        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
          this.requestCount = 0;
          this.loading = false;
          this.errorMessage = "Request timed out. Please try again.";
        }, 10000);
      });
      const endRequest = () => {
        this.requestCount = Math.max(0, this.requestCount - 1);
        if (this.requestCount === 0) {
          this.loading = false;
          if (this.timeoutId) clearTimeout(this.timeoutId);
        }
        
      };
      const handleError = (msg = "Something went wrong. Please try again.") => {
        showFlashMessage(msg, false);
      };
      document.body.addEventListener("htmx:afterSwap", () => {
        endRequest();
      });
      document.body.addEventListener("htmx:responseError", () => {
        endRequest();
        handleError();
      });
      document.body.addEventListener("htmx:sendError", () => {
        endRequest();
        handleError();
      });
      document.body.addEventListener("htmx:timeout", () => {
        endRequest();
        this.errorMessage = "Request timed out. Please try again.";
      });
    },
  };
}
