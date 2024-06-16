from typing import List

from fastapi import HTTPException, Depends

from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from utils import get_user_from_access_token


class RoleChecker:
    def __init__(self, allowed_roles: List):
        self.allowed_roles = allowed_roles

    def __call__(self, user: UserDb = Depends(get_user_from_access_token)):
        user = user.to_dict()
        if not user['role']:
            print(f"User with role {user['role']} not in {self.allowed_roles}")
            raise HTTPException(status_code=403, detail="Operation not permitted")
