import React from 'react';
import { MDBContainer, MDBNavbar, MDBNavbarBrand } from 'mdb-react-ui-kit';

const AppBar = (): React.JSX.Element => {
  return (
    <div>
      <MDBNavbar expand="lg" bgColor="primary">
        <MDBContainer fluid>
          <MDBNavbarBrand href="/" className="text-white ps-4">
            Memory Game
          </MDBNavbarBrand>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
};

export default AppBar;
