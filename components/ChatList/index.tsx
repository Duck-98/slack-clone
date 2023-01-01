import Chat from '@components/Chat';
import React, { useCallback, useRef } from 'react';
import { IDM } from 'types/type';
import { ChatZone, Section } from './style';
import { Scrollbars } from 'react-custom-scrollbars';
interface Props {
  chatData?: IDM[];
}

const ChatList = ({ chatData }: Props) => {
  const onScroll = useCallback(() => {}, []);
  const scrollbarRef = useRef(null);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
