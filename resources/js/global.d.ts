export {};

declare global {
    interface Window {
        isOwner: boolean;
        Alpine: any;
    }
}
