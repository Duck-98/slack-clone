import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/style';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { IUser } from 'types/type';
import useSWR from 'swr';
import axios from 'axios';
import { useParams } from 'react-router';
interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}
/*
POST /workspaces/:workspace/channels
:workspace 내부에 채널을 생성함
body: { name: string(이름) }
return: IChannel
*/
const CreateChannelModal = ({ show, onCloseModal, setShowCreateChannelModal }: Props) => {
  const { data, error, mutate } = useSWR<IUser | false>('http://localhost:3080/api/users', fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const params = useParams();
  console.log(params, '>>>>>>>');
  const onCreateChannelModal = useCallback((e: any) => {
    e.preventDefault();
    if (!newChannel || !newChannel.trim()) return; // trim => 문자열 양쪽 공백제거(띄어쓰기 방지)
    axios
      .post(
        'http://localhost:3080/api/workspaces/:workspace/channels',
        { name: newChannel },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        mutate(false, false);
        setShowCreateChannelModal(false); // 입력이 완료되면 모달창 닫음
        setNewChannel('');
      })
      .catch((error: any) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannelModal}>
        <Label id="channel-label">
          <span>워크스페이스 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
