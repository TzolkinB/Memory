import React    from 'react';
import { Link } from 'react-router-dom';

const AppBar = () => {
  return(
    <div>
      <nav className="navbar navbar-expand-lg text-white bg-primary navbar-dark">
        <a href="/" className="navbar-brand pl-2">
          <span className="text-white pl-3 font-weight-light">Memory Game</span>
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav">
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default AppBar;
