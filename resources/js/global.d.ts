export {};

declare global {
    interface Window {
        ownTableCount: number;
        assignTableCount: number;
        otherTableCount: number;
        quoteTableCount: number;
        noteTableCount: number;
        isOwner: boolean;
        openCreateArchitectModal: any;
    }
}
