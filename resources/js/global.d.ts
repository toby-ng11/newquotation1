export {};

type NoteModalComponent = {
    open: boolean;
    isEditing: boolean;
    submitForm: () => Promise<void>;
    editNote: (noteID : string) => Promise<void>;
    closeModal: () => void;
}

type ItemModalComponent = {
    open: boolean;
    isEditing: boolean;
    submitForm: () => Promise<void>;
    editNote: (itemUID: string) => Promise<void>;
    closeModal: () => void;
    getUOM: (item_id: string, old_uom?: string, old_price?: string, item_uid?: string) => void;
    getP21Price: (item_id: string, uom: string, old_price?: string | null) => void;
    getQuotedPrice: (item_uid: string) => void;
};

type CustomerModalComponent = {
    open: boolean;
    isEditing: boolean;
    submitForm: () => Promise<void>;
    closeModal: () => void;
    getCustomerContacts: (customerID: string) => Promise<void>;
    getContactInfo: () => Promise<void>;
};

declare global {
    interface Window {
        isOwner: boolean;
        Alpine: any;
        noteModalComponent?: NoteModalComponent;
        itemModalComponent?: ItemModalComponent;
        customerModalComponent?: CustomerModalComponent;
    }
}
