import React, { CSSProperties, FC, ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './style';
type Props = {
  children?: ReactNode;
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
};
const Menu = ({ children, style, show, onCloseModal, closeButton }: Props) => {
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
  }, []);
  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
