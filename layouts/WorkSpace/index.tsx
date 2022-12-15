import fetcher from '@utils/fetcher';
import React, { ReactNode, useCallback, useState } from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './style';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IChannel, IUser, IWorkspace } from 'types/type';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';
import CreateChannelModal from '@components/CreateChannelModal';

/* import */
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

type Props = {
  children?: ReactNode;
};
const WorkSpace = ({ children }: Props) => {
  const { channel, workspace } = useParams();
  const {
    data: userData,
    error,
    mutate: revalidateUser,
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
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showCreateWorkSpaceModal, setShowCreateWorkSpaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false);
  const onLogOut = useCallback(() => {
    axios
      .post('http://localhost:3080/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        revalidateUser(false);
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  const onClickUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserProfile((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkSpaceModal(false);
    setShowCreateChannelModal(false);
  }, []); // 화면에 있는 모든 모달을 닫아주는 함수

  const onClickCreateWorkSpace = useCallback(() => {
    setShowCreateWorkSpaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          'http://localhost:3080/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate(false, false);
          setShowCreateWorkSpaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkSpaceModal((prev) => !prev);
  }, []);

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserProfile && (
              <Menu style={{ right: 0, top: 38 }} show={showUserProfile} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws: IWorkspace) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.name}/channel/${ws.id}`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Slack</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkSpaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <button>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널만들기</button>
                <button onClick={onLogOut}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((channel) => (
              <div>{channel.name}</div>
            ))}
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="/channel/:channel" element={<Channel />} />
            <Route path="/dm/:id" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
      // input이 있는 컴포넌트는 따로 분리하는게 리렌더링을 덜 하게 해서 효율적이다.
      <Modal show={showCreateWorkSpaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 URL</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </div>
  );
};

export default WorkSpace;
