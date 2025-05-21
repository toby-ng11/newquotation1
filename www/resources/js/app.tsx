import { Container, createRoot } from 'react-dom/client';
import NewArchitectModal from './components/new-architect-dialog';

const modal = document.getElementById('new-architect-modal') as Container;
const root = createRoot(modal);
root.render(<NewArchitectModal />);
