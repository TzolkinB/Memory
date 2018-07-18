import React          from 'react'
import { HashRouter } from 'react-router-dom'
import { render }     from 'react-dom'

import 'Style/app.css';

import AppBar from './components/shared/AppBar';
import Footer from './components/shared/Footer';
import Main   from './components/Main';

const App = () => (
  <div>
    <AppBar />
    <Main />
    <Footer />
  </div>
)

render(
  <HashRouter basename="/">
    <App />
  </HashRouter>

  , document.getElementById('memory-game'));
