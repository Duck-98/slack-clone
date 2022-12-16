import React, { useCallback, useEffect, useRef } from 'react';
import { Mention } from 'react-mentions';
import { useParams } from 'react-router-dom';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from './style';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { IUser } from 'types/type';
import autosize from 'autosize';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox = ({ chat, onSubmitForm, onChangeChat, placeholder }: Props) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);
  const { workspace } = useParams();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

  const onKeydownChat = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-text"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          ref={textareaRef}
        >
          {/* <Mention
               appendSpaceOnAdd
               trigger="@"
               data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
               renderSuggestion={renderSuggestion}
            /> */}
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
