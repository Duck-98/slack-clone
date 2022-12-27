import React from 'react';
import { IDM } from 'types/type';
import { ChatWrapper } from './style';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';

interface Props {
  data: IDM;
}

function Chat({ data }: Props) {
  //   const { workspace, id } = useParams<{ workspace: string; id: string }>();
  //   const { data: user } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher, {
  //     dedupingInterval: 2000,
  //   });
  const user = data.Sender;
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '24px', d: 'retro' })} alt={user?.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          {/* <span>{data.createdAt}</span> */}
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
}

export default Chat;
