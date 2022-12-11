import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header, Label, Input, Button, LinkContainer, Form, Error } from './style';
import { useForm } from 'react-hook-form';
import { User } from 'types/user';
import axios from 'axios';

interface Props {
  email: string;
  nickname: string;
  password: string;
}

function SignUp() {
  const navigate = useNavigate();
  const [signUpError, setSignUpError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<User>();
  const onSubmit = (data: Props) => {
    console.log(data);
    // console.log(data.length)
    axios
      .post(`http://localhost:3080/api/users`, data)
      .then((response) => {
        console.log(response);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error.response);
        setSignUpError(error.response.data);
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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input
              type="text"
              id="nickname"
              placeholder="nickname"
              {...register('nickname', {
                required: true,
                maxLength: {
                  value: 12,
                  message: '닉네임은 최대 12자입니다.',
                },
              })}
            />
          </div>
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
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="passwordCheck"
              id="passwordCheck"
              placeholder="비밀번호 확인"
              {...register('passwordCheck', {
                required: true,
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return '비밀번호가 일치하지않습니다.';
                  }
                },
              })}
            />
            <Error>{errors.passwordCheck && errors.passwordCheck.message}</Error>
          </div>
          {signUpError && <Error>{signUpError}</Error>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default SignUp;
