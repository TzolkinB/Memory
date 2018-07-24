import React from 'react';
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'Style/salert.css';

const Growl = () => {
  return (
    <Alert
      stack
      offset={75}
      position="top-right"
      timeout={4000}
      effect="slide"
    />
  );
};

export default Growl;

export const CustomTemplate = ({
  id,
  classNames,
  styles,
  message,
  handleClose,
}) => {
  return (
    <div className={classNames} id={id} style={styles}>
      <div className="s-alert-box-inner">
        <p className="font-weight-normal">&nbsp;{message}</p>
      </div>
      <span className="s-alert-close" onClick={handleClose}></span>
    </div>
  );
}
