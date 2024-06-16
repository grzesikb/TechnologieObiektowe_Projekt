from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

import crud
from database import SessionLocal
from schemasPkg.createSchemas.TokenCreateSchema import TokenUserInfoPayload, TokensCreate
from schemasPkg.createSchemas.UserCreateSchema import LoginUser
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from utils import (
    create_access_token,
    create_refresh_token,
    get_current_active_user
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


AuthRouter = APIRouter(prefix="/auth")


@AuthRouter.post("/login/")
async def create_user(user: LoginUser, db: Session = Depends(get_db)):
    db_users = crud.get_user_by_email(email=user.email)
    if not db_users:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    db_user = db_users[0].to_dict()
    print(db_user)
    if not db_user.get('password') == user.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    returnedUserPayload = TokenUserInfoPayload(id=db_user.get('id'), email=db_user.get('email'))
    userRefreshToken = TokensCreate(token=create_refresh_token(returnedUserPayload))
    crud.create_user_token(userRefreshToken, user_id=db_user.get('id'))
    return {
        "access_token": create_refresh_token(returnedUserPayload),
        "refresh_token": create_refresh_token(returnedUserPayload),
    }


@AuthRouter.get('/refreshToken')
def refreschToken(
        current_user: Annotated[UserDb, Depends(get_current_active_user)],
):
    returnedUserPayload = TokenUserInfoPayload(id=current_user['id'], email=current_user['email'])
    userRefreshToken = TokensCreate(token=create_refresh_token(returnedUserPayload))
    crud.create_user_token(userRefreshToken, user_id=current_user['id'])
    return {
        "access_token": create_access_token(returnedUserPayload),
        "refresh_token": create_refresh_token(returnedUserPayload),
    }


# @AuthRouter.get('/google_auth')
# def authentication(request: Request, token: str, db: Session = Depends(get_db)):
#         # Specify the CLIENT_ID of the app that accesses the backend:
#         user = id_token.verify_oauth2_token(token, requests.Request(),
#                                             "643015372662-hkj0n07rm68jit3cfs95tg37f65a775d.apps.googleusercontent.com")
#
#         request.session['user'] = dict({
#             "email": user["email"]
#         })
#         print(user)
#
#         db_users = crud.get_user_by_email(db, email=user['email'], )
#         if db_users.__len__():
#             print("sder")
#             db_user = db_users[0]
#             returnedUserPayload = TokenUserInfoPayload(id=db_user.id, email=db_user.email)
#             userRefreshToken = TokensCreate(token=create_refresh_token(returnedUserPayload))
#             crud.create_user_token(db, userRefreshToken, user_id=db_user.id)
#             return {
#                 "access_token": create_refresh_token(returnedUserPayload),
#                 "refresh_token": create_refresh_token(returnedUserPayload),
#             }
#         new_user = crud.create_user(db=db, user=UserCreate(
#             email=user['email'],
#             password='',
#             role=UserRoleEnum.client
#         ))
#         returnedUserPayload = TokenUserInfoPayload(id=new_user.id, email=new_user.email)
#         userRefreshToken = TokensCreate(token=create_refresh_token(returnedUserPayload))
#         crud.create_user_token(db, userRefreshToken, user_id=new_user.id)
#         return {
#             "access_token": create_refresh_token(returnedUserPayload),
#             "refresh_token": create_refresh_token(returnedUserPayload),
#         }

@AuthRouter.get('/done')
def done():
    return 'done'
