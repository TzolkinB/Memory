import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './css/app.css';

import AppBar from './components/shared/AppBar';
import Footer from './components/shared/Footer';
import Main from './components/Main';

export const App = (): React.JSX.Element => (
  <div>
    <AppBar />
    <Main />
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: 'blue',
            color: 'white',
          },
        },
        error: {
          style: {
            background: 'red',
            color: 'white',
          },
        },
        style: {
          padding: '5rem 5rem',
        },
      }}
    />
    <Footer />
  </div>
);

const root = createRoot(document.getElementById('memory-game')!);
root.render(
  <HashRouter basename="/">
    <App />
  </HashRouter>
);
