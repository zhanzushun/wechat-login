import React, { useState, useEffect } from 'react';
import { URLS, APPID } from './Consts'

const ProtectedPage = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    } else {
      handleLogin(); // 自动触发登录流程
    }
  }, []);

  const handleLogin = () => {
    const appId = APPID;
    const redirectUri = encodeURIComponent(URLS.EXTERNAL_CALLBACK);
    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
    window.location.href = url;
  };
  
  if (!accessToken) {
    return (
      <div>
        <h1>请稍候，正在跳转到登录页面...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>受保护页面内容</h1>
      {/* 在此处添加受保护页面的内容 */}
    </div>
  );
};

export default ProtectedPage;
