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
  setShowInviteWorkspaceModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteWorkspaceModal = ({ show, onCloseModal, setShowInviteWorkspaceModal }: Props) => {
  const { workspace } = useParams();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });

  const { mutate: membersMutate } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });

  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  /*
  GET /workspaces/:workspace/members
:workspace 내부의 멤버 목록을 가져옴
return: IUser[]

POST /workspaces/:workspace/members
:workspace로 멤버 초대
body: { email: string(이메일) }
return: 'ok'
  */

  const onInviteMember = useCallback(
    (e: any) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          setShowInviteWorkspaceModal(false);
          membersMutate(response.data, false);
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

export default InviteWorkspaceModal;
