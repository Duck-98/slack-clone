import Chat from '@components/Chat';
import React from 'react';
import { IDM } from 'types/type';
import { ChatZone, Section } from './style';

interface Props {
  chatData?: IDM[];
}

const ChatList = ({ chatData }: Props) => {
  return (
    <ChatZone>
      {/* <Section>section</Section> */}
      {chatData?.map((chat) => (
        <Chat key={chat.id} data={chat} />
      ))}
    </ChatZone>
  );
};

export default ChatList;
