from datetime import datetime, timedelta
from typing import Union, Any, Annotated

from dotenv import dotenv_values
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from crud import get_user_by_email
from dbGetter import get_db
from schemasPkg.createSchemas.TokenCreateSchema import TokenUserInfoPayload
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb

# CONSTANTS
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
ALGORITHM = "HS256"

# JWT SECRETS
config = dotenv_values(".env")
JWT_SECRET_KEY = config['JWT_SECRET_KEY']
JWT_REFRESH_SECRET_KEY = config['JWT_REFRESH_SECRET_KEY']

# BCRYPT CONF
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# GETTER FROM BARER
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def extract_data(string) -> TokenUserInfoPayload:
    email_start = string.find("email='") + len("email='")
    email_end = string.find("'", email_start)
    email = string[email_start:email_end]

    id_start = string.find("id='") + len("id='")
    id_end = string.find("'", id_start)
    id = string[id_start:id_end]

    return TokenUserInfoPayload(email=email, id=id)


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    print(encoded_jwt, 'access')
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def valid_token(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        username: TokenUserInfoPayload = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = extract_data(username)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(email=token_data.email)[0].to_dict()
    if user is None:
        raise credentials_exception
    return user


def valid_acces_token(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: TokenUserInfoPayload = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = extract_data(username)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(email=token_data.email)[0]
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        current_user: Annotated[UserDb, Depends(valid_token)]
):
    print(current_user, 'chuj')
    return current_user


async def get_user_from_access_token(
        current_user: Annotated[UserDb, Depends(valid_acces_token)]
):
    return current_user
