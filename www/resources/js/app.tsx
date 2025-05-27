import { Container, createRoot } from 'react-dom/client';

let modalLoaded = false;

async function showNewArchitectModal() {
  if (!modalLoaded) {
    const { default: NewArchitectModal } = await import('./components/new-architect-dialog');

    const modal = document.getElementById('new-architect-modal') as Container;
    const root = createRoot(modal);
    root.render(<NewArchitectModal />);
    modalLoaded = true;
  }
  // Show the modal (add your show logic here)
}

// Attach to button click or other trigger
document.getElementById('open-modal-btn')?.addEventListener('click', showNewArchitectModal);
