import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3080';
const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, []);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    // 소켓이 존재하지 않을 때만 소켓을 만듬
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;

/*
WebSocket
웹소켓 API

socket.on
서버에서 클라이언트로 보내는 이벤트(클라이언트에서는 on으로 받음)

hello
소켓 연결 테스트용 API
서버 data: string(네임스페이스 이름)
onlineList
현재 온라인인 사람들 아이디 목록
서버 data: number[](아이디 목록)
message
새로운 채널 메시지가 올 때
서버 데이터: IChat(채팅 데이터)
dm
새로운 dm 메시지가 올 때
서버 데이터: IDM(dm 데이터)
socket.emit
클라이언트에서 서버로 보내는 이벤트(클라이언트에서는 emit으로 보냄)

login
워크스페이스, 채널이 로딩 완료되었을 때 서버에 로그인했음을 알리는 이벤트
클라이언트 data: { id: number(유저 아이디), channels: number[](채널 아이디 리스트) }
disconnect
클라이언트에서 소켓 연결을 종료하는 함수
*/
