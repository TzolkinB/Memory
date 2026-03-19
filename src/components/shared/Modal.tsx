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
  open: boolean;
  onClose: () => void;
  handleClick: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  closeText,
  confirmText,
  open,
  onClose,
  handleClick,
}) => {
  return (
    <>
      <MDBModal
        open={open}
        onClose={onClose}
        tabIndex={-1}
        data-testid="restart-modal"
      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={onClose}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className="pb-0 pl-5">{children}</MDBModalBody>
            <MDBModalFooter className="p-3">
              <MDBBtn color="secondary" onClick={onClose}>
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
};

export default Modal;
