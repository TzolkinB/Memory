import React    from 'react';
import { Link } from 'react-router-dom';

const AppBar = () => {
  return(
    <div>
      <nav className="navbar navbar-expand-lg text-white bg-primary navbar-dark">
        <a href="/" className="navbar-brand pl-2">
          <span className="text-white pl-3 font-weight-light">Memory Game</span>
        </a>
      </nav>
    </div>
  );
}

export default AppBar;
