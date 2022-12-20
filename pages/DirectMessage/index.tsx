import React, { useCallback } from 'react';
import useSWR from 'swr';

import fetcher from '@utils/fetcher';
import { IUser, IDM } from 'types/type';
import { Container, Header } from './style';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: myData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {
    dedupingInterval: 2000,
  });

  const { data: chatData, mutate: chatMutate } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');
  /*
POST /workspaces/:workspace/dms/:id/chats
:workspace 내부의 :id와 나눈 dm을 저장
body: { content: string(내용) }
return: 'ok'
dm 소켓 이벤트가 emit됨

*/
  const onSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      console.log(chat);
      if (chat?.trim()) {
        axios
          .post(
            `/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            {
              withCredentials: true,
            },
          )
          .then((response) => {
            chatMutate();
            setChat(''); // 입력 후 채팅창 지우기
          })
          .catch(console.error);
      }
      console.log('sub');
    },
    [chat, myData, userData],
  );

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
