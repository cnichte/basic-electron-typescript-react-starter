import { createRoot } from 'react-dom/client';
import { App_Routes } from './app/frontend/App_Routes';

const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App_Routes />);
