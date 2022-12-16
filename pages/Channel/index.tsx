import InviteChannelModal from '@components/InviteChannelModal';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Header } from './style';
interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function Channel({ show, onCloseModal, setShowInviteChannelModal }: Props) {
  const { channel } = useParams();

  const [chat, onChangeChat] = useInput('');
  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
  }, []);
  return (
    <Container>
      <Header>Channel</Header>
      <InviteChannelModal
        show={show}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
        channel={channel}
      />
    </Container>
  );
}

export default Channel;
