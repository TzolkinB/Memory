import React from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from 'mdb-react-ui-kit';

interface ModalProps {
  children: React.ReactNode;
  closeText: string;
  confirmText: string;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface JQueryElement {
  trigger: (event: string) => void;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
  modal: (action: string) => void;
}

type JQueryLike = (selector: string) => JQueryElement;

const getJQuery = (): JQueryLike | undefined => {
  const windowWithJQuery = window as Window & { $?: JQueryLike };
  return windowWithJQuery.$;
};

class Modal extends React.Component<ModalProps> {
  state = {
    open: false,
  };

  componentDidMount() {
    // jQuery integration: listen for Bootstrap modal events and sync with MDB modal state
    const $ = getJQuery();
    if ($) {
      const modalElement = $('#modal');

      // Override jQuery modal method to control MDB modal
      const originalModal = modalElement.modal;
      modalElement.modal = (action: string) => {
        if (action === 'hide') {
          this.setState({ open: false });
        } else if (action === 'show') {
          this.setState({ open: true });
        }
        return originalModal?.call(modalElement, action);
      };

      // Listen for Bootstrap modal show events (triggered by data-toggle)
      modalElement.on('show.bs.modal', () => {
        this.setState({ open: true });
      });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render(): React.JSX.Element {
    const { children, closeText, confirmText, handleClick } = this.props;

    return (
      <>
        {/* Hidden div to maintain jQuery compatibility */}
        <div id="modal" className="d-none" data-testid="restart-modal" />

        <MDBModal
          open={this.state.open}
          onClose={this.handleClose}
          tabIndex={-1}
        >
          <MDBModalDialog centered>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={this.handleClose}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody className="pb-0 pl-5">{children}</MDBModalBody>
              <MDBModalFooter className="p-3">
                <MDBBtn color="secondary" onClick={this.handleClose}>
                  {closeText}
                </MDBBtn>
                <MDBBtn
                  color="primary"
                  className="btn-raised text-white"
                  onClick={handleClick}
                >
                  {confirmText}
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
    );
  }
}

export default Modal;
