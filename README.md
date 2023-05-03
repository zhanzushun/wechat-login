# 微信二维码扫码登录含前端（react）和后端（python fastapi）

## 准备工作

1. 注册微信网站应用， 拿到 appid 和 appsecret
2. jwt_secret 通过工具随机生成
3. 准备域名和一个 callback url 给微信方进行回调

## 登录流程

1. 用户访问你的网站，这里假设地址为： /protected
2. ProtectedPage 检查是否有【access-token】：如果有，表示已经登录，如果没有则跳转到二维码扫码页面且提供一个【回调网址】，这里使用 /login_callback
3. 用户扫码成功，微信方返回一个Code, 以Code为参数跳转到【回调网址】
4. 【回调网址】LoginCallback 组件内部发送 Code 访问后端 /api/wx_login_callback
5. 后端使用 Code 再调用微信方，返回授权用户的 openid，根据openid生成【access-token】返回前端，表示登录成功
6. 需要注意，在nginx中需要使用 try_files 配置前端 react 网址，使得【回调网址】能正确返回到 react 页面，如下：

```
location /login_callback {
    try_files $uri /index.html;
}
```

## Frontend Files (前端文件说明)

```
前端文件大部分都是 create-react-app 自动生成
只有以下几个文件是代码：

1. App.js (路由)
2. Consts.js (配置文件)
3. LoginCallback.js (回调地址组件)
4. ProtectedPage.js （受保护页面访问必须先登录）

```

## Frontend Dependencies (前端依赖)

```
npm install axios
npm install react
npm install react-router-dom
```

## Frontend Configuration （前端配置）

change configurations in src/Consts.js

```
export const URLS = {
    PROTECTED: '/protected',
    CALLBACK: '/login_callback',
    EXTERNAL_CALLBACK: 'https://your-domain/login_callback',
    CALLBACK_API: '/api/wx_login_callback',
}

export const APPID = 'your-wechat-appid'
```

## Frontend Start （前端启动）

npm start

## Frontend Build （前端编译，结果可发布到nginx）

npm run build

## Backend Dependencies （后端依赖）

```
pip install fastapi uvicorn
pip install fastapi-jwt-auth
```

## Backend Configurations （后端配置）

```
配置到环境变量中，或者修改下面的代码直接配置在代码中， 其中 jwt_secret 可通过工具随机生成

APP_ID = os.environ['APP_ID']
APP_SECRET = os.environ['APP_SECRET']
JWT_SECRET = os.environ['JWT_SECRET']
```

## Backend Start （后端启动）

```
uvicorn app:app --reload --host 0.0.0.0 --port 80
```
