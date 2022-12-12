import fetcher from '@utils/fetcher';
import React, { FC, ReactNode, useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { Navigate } from 'react-router';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './style';
import gravatar from 'gravatar';

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
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogOut}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Slack</WorkspaceName>
          <MenuScroll>
            {/* <Menu></Menu> */}
            MenuScroll
          </MenuScroll>
        </Channels>
        <Chats>Chats</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default WorkSpace;
