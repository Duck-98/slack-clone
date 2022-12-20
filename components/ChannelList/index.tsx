import fetcher from '@utils/fetcher';
import React from 'react';
import { IChannel, IUser } from 'types/type';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';

const ChannelList = () => {
  const { workspace } = useParams();

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher, {
    dedupingInterval: 2000,
  });
  return (
    <>
      {channelData?.map((channel) => (
        <div>{channel.name}</div>
      ))}
    </>
  );
};

export default ChannelList;
