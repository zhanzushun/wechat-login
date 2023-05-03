
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { URLS } from './Consts'



const LoginCallback = () => {
  const navigate = useNavigate();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  console.log("code=" + code)

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await axios.post(URLS.CALLBACK_API, { code });
        localStorage.setItem('accessToken', response.data.access_token);
        navigate(URLS.PROTECTED);
      } catch (err) {
        console.error('登录失败，请重试');
      }
    };

    if (code) {
      getAccessToken();
    } else {
      navigate(URLS.PROTECTED);
    }
  }, [code, navigate]);

  return (
    <div>
      <h1>处理登录回调...</h1>
    </div>
  );
};

export default LoginCallback;
