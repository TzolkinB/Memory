import React from 'react'

class Modal extends React.Component {

  componentDidMount() {
    $('#modal').on('shown.bs.modal', function () {
      $('#databaseYear').trigger('focus');
    })
  }

  render() {
    const {
      children, closeText, confirmText,
      handleClick
    } = this.props;

    return(
      <div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-0 pl-5">
              {children}
            </div>
            <div className="modal-footer p-3">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">{closeText}</button>
              <button type="button" className="btn btn-raised btn-primary text-white" onClick={handleClick}>{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
