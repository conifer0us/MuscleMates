import { createRoot } from 'react-dom/client';
import { MyApp } from './Components.js'

const appDomNode = document.getElementById('app')
const appRoot = createRoot(appDomNode);
appRoot.render(<MyApp />);
