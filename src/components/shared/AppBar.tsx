import React from 'react';
import { MDBNavbar, MDBNavbarBrand } from 'mdb-react-ui-kit';

const AppBar = (): React.JSX.Element => {
  return (
    <div>
      <MDBNavbar expand="lg" light bgColor="primary" className="navbar-dark">
        <MDBNavbarBrand href="/" className="pl-2">
          <span className="text-white pl-3 font-weight-light">Memory Game</span>
        </MDBNavbarBrand>
      </MDBNavbar>
    </div>
  );
};

export default AppBar;
