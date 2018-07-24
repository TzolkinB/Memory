import React    from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mi-footer">
      <div className="container">
        <p className="text-white font-weight-light">Copyright &#169; {currentYear} Kimberly Bell</p>
      </div>
    </footer>
  );
}

export default Footer;
