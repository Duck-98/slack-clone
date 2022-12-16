import React, { useCallback } from 'react';
import useSWR from 'swr';

import fetcher from '@utils/fetcher';
import { IUser } from 'types/type';
import { Container, Header } from './style';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR<IUser>('http://localhost:3080/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {
    dedupingInterval: 2000,
  });

  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
    console.log('sub');
  }, []);

  if (!userData || !myData) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData?.nickname} />
        <span>{userData?.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
}

export default DirectMessage;
