import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';
/* 코드 스플리팅 */
const Login = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const App: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/workspace/channel" element={<Channel />} />
    </Routes>
  );
};

export default App;
