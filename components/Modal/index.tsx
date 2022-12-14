import React, { ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateModal } from './style';

interface Props {
  children: ReactNode;
  show: boolean;
  onCloseModal: () => void;
}

const Modal = ({ children, show, onCloseModal }: Props) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);
  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
