import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/style';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { IChannel, IUser } from 'types/type';
import useSWR from 'swr';
import axios from 'axios';
import { useParams } from 'react-router';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }: Props) => {
  const { channel, workspace } = useParams();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3080/api/users', fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });

  const {
    data: channelData,
    error: channelError,
    mutate: channelMutate,
  } = useSWR<IChannel[]>(userData ? `http://localhost:3080/api/workspaces/${workspace}/channels` : null, fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });

  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  /*
  POST /workspaces/:workspace/channels
:workspace 내부에 채널을 생성함
body: { name: string(이름) }
return: IChannel
  */

  const onCreateChannel = useCallback(
    (e: any) => {
      console.log('click');
      e.preventDefault();
      axios
        .post(
          `http://localhost:3080/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setShowCreateChannelModal(false);
          channelMutate();
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
