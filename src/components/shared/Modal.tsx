import React from 'react';

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
}

type JQueryLike = (selector: string) => JQueryElement;

const getJQuery = (): JQueryLike | undefined => {
  const windowWithJQuery = window as Window & { $?: JQueryLike };
  return windowWithJQuery.$;
};

class Modal extends React.Component<ModalProps> {
  private handleModalShown = () => {
    getJQuery()?.('#databaseYear').trigger('focus');
  };

  componentDidMount() {
    getJQuery()?.('#modal').on('shown.bs.modal', this.handleModalShown);
  }

  componentWillUnmount() {
    getJQuery()?.('#modal').off('shown.bs.modal', this.handleModalShown);
  }
  render(): React.JSX.Element {
    const { children, closeText, confirmText, handleClick } = this.props;

    return (
      <div
        className="modal fade"
        id="modal"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-0 pl-5">{children}</div>
            <div className="modal-footer p-3">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                {closeText}
              </button>
              <button
                type="button"
                className="btn btn-raised btn-primary text-white"
                onClick={handleClick}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
