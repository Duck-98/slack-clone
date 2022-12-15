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
  setShowInviteChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteChannelModal = ({ show, onCloseModal, setShowInviteChannelModal }: Props) => {
  const { channel, workspace } = useParams();
  const { data: userData } = useSWR<IUser | false>('http://localhost:3080/api/users', fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });

  const { mutate: inviteMutate } = useSWR<IUser[]>(
    userData ? `http://localhost:3080/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
    {
      dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
    },
  );

  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  /*
GET /workspaces/:workspace/channels/:channel/members
:workspace 내부의 :channel 멤버 목록을 가져옴
return: IUser[]
POST /workspaces/:workspace/channels/:channel/members
:workspace 내부의 :channel로 멤버 초대
body: { email: string(이메일) }
return: 'ok'

  */

  const onInviteMember = useCallback(
    (e: any) => {
      e.preventDefault();
      axios
        .post(
          `http://localhost:3080/api/workspaces/${workspace}/channels/${channel}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setShowInviteChannelModal(false);
          inviteMutate(response.data, false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newMember],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
