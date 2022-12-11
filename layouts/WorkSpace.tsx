import fetcher from '@utils/fetcher';
import React, { FC, ReactNode, useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { useNavigate } from 'react-router';
type Props = {
  children?: React.ReactNode;
};
const WorkSpace = ({ children }: Props) => {
  const navigate = useNavigate();
  const { data: userData, error, mutate: revalidateUser } = useSWR('http://localhost:3080/api/users', fetcher);
  const onLogOut = useCallback(() => {
    axios
      .post('http://localhost:3080/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        revalidateUser();
      })
      .catch((error) => {
        console.dir(error);
        // toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, []);
  if (!userData) {
    navigate('/login');
  }
  return (
    <div>
      <button onClick={onLogOut}>로그아웃</button>
    </div>
  );
};

export default WorkSpace;
