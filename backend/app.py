from fastapi import FastAPI, HTTPException, Request, Depends
import requests
from pydantic import BaseModel
import logging, os

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException


APP_ID = os.environ['APP_ID']
APP_SECRET = os.environ['APP_SECRET']
JWT_SECRET = os.environ['JWT_SECRET']

class Settings(BaseModel):
    authjwt_secret_key: str = JWT_SECRET
    authjwt_algorithm: str = "HS256"

@AuthJWT.load_config
def get_config():
    return Settings()

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(lineno)d] [%(levelname)s]: %(message)s')

app = FastAPI()
userDict = {}

class AuthForm(BaseModel):
    code: str

class AccessToken(BaseModel):
    access_token: str

@app.post("/api/wx_login_callback", response_model=AccessToken)
async def auth_token(form_data: AuthForm, Authorize: AuthJWT = Depends()):
    code = form_data.code
    if not code:
        raise HTTPException(status_code=400, detail="Code not found")

    url = f'https://api.weixin.qq.com/sns/oauth2/access_token?appid={APP_ID}&secret={APP_SECRET}&code={code}&grant_type=authorization_code'
    response = requests.get(url)
    data = response.json()
    logging.info(f"response={data}")

    if 'errcode' in data:
        raise HTTPException(status_code=400, detail=data['errmsg'])

    openId = data['openid']
    access_token = Authorize.create_access_token(subject=openId)
    userDict[openId] = openId

    return {"access_token": access_token}

@app.get("/api/protected")
async def protected_page(Authorize: AuthJWT = Depends()):
    
    Authorize.jwt_required()
    openId = Authorize.get_jwt_subject()

    if openId not in userDict:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # 业务逻辑

    return {openId}
