import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Label, Input, Button, LinkContainer, Form, Error } from '../SignUp/style';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface Props {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Props>();
  const onSubmit = (data: Props) => {
    console.log(data);
    axios
      .post(`http://localhost:3080/api/users/login`, data)
      .then((response) => {
        console.log(response);
        // navigate('/login');
      })
      .catch((error) => {
        console.log(error.response);
        setLoginError(error.response.data);
      })
      .finally(() => {});
  };
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
        {loginError && <Error>{loginError}</Error>}
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
