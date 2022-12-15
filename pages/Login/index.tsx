import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header, Label, Input, Button, LinkContainer, Form, Error } from '../SignUp/style';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { toast } from 'react-toastify';

interface Props {
  email: string;
  password: string;
}

function Login() {
  const { data: userData, error, mutate } = useSWR('http://localhost:3080/api/users', fetcher);
  console.log(userData, 'fetcherr');
  const [loginError, setLoginError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Props>();
  const onSubmit = (loginData: Props) => {
    // console.log(loginData);
    axios
      .post(`http://localhost:3080/api/users/login`, loginData, { withCredentials: true })
      .then((response) => {
        console.log(response);
        mutate(response.data, false);
      })
      .catch((error) => {
        console.log(error.response, false);
        toast.error(error.response?.data, { position: 'bottom-center' });
        setLoginError(error.response?.data?.statusCode === 401);
      })
      .finally(() => {});
  };
  if (userData) {
    return (
      // <Navigate to="/workspace/sleact/channel/" replace />
      <Navigate to="/workspace/Sleact/channel/1" replace />
      // <Navigate to={`/workspace/${userData?.Workspaces[0]?.id}/channel/${userData?.Workspaces[0]?.name}`} replace />
    );
  } else if (userData === undefined) {
    return <div>Loading...</div>;
  }

  console.log(errors);
  return (
    <div id="container">
      <Header>Slack</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input
              type="email"
              id="email"
              placeholder="email"
              {...register('email', {
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                  message: '이메일 형식이 아닙니다.',
                },
              })}
            />
          </div>
          <Error>{errors.email && errors.email.message}</Error>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input
              type="password"
              id="password"
              placeholder="password"
              {...register('password', {
                required: true,
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이여야 합니다.',
                },
              })}
            />
          </div>
          <Error>{errors.password && errors.password.message}</Error>
        </Label>
        {loginError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default Login;
