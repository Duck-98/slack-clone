import fetcher from '@utils/fetcher';
import React, { ReactNode, useCallback, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
// import { Navigate, Routes } from 'react-router';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './style';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
/* import */
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

type Props = {
  children?: ReactNode;
};
const WorkSpace = ({ children }: Props) => {
  const {
    data: userData,
    error,
    mutate: revalidateUser,
  } = useSWR('http://localhost:3080/api/users', fetcher, {
    dedupingInterval: 2000, // cache의 유지 시간(2초) -> 2초동안 아무리 많이 호출해도 한 번 useSWR이 요청감
  });

  const [showUserProfile, setShowUserProfile] = useState(false);
  // console.log(showUserProfile, '<<<<<<<');
  const onLogOut = useCallback(() => {
    axios
      .post('http://localhost:3080/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        revalidateUser(false, false);
      })
      .catch((error) => {
        console.dir(error);
        // toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserProfile((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {}, []);

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
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Slack</WorkspaceName>
          <MenuScroll>
            {/* <Menu></Menu> */}
            MenuScroll
          </MenuScroll>
        </Channels>
        <Chats>
          <Routes>
            <Route path="channel" element={<Channel />} />
            <Route path="dm" element={<DirectMessage />} />
          </Routes>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default WorkSpace;
