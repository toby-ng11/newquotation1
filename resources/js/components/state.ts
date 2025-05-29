const state = {
    unsave: false,
    lastChanged: null,
};

const listeners = new Set();

export function getState() {
    return { ...state };
}

export function setState(updates) {
    Object.assign(state, updates);
    listeners.forEach((callback) => callback(getState()));
}

export function subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback); // unsubscribe
}
