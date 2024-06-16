from typing import Annotated

from fastapi import Query, APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

import crud
from InitFirestore import db
from RoleChaecker import RoleChecker
from dbGetter import get_db
from models import UserRoleEnum
from schemasPkg.createSchemas.AddressDataCreate import AddressCreate
from schemasPkg.createSchemas.PersonalDataCreateSchema import PersonalDataCreate
from schemasPkg.createSchemas.UserCreateSchema import UserCreateDTO, WorkerCreateDto, UserUpdate, \
    ResetPdw, WorkerUpdate
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from schemasPkg.responseSchemas.CreateUserResponseSchema import UpdateWorkerUserDataPayload
from schemasPkg.responseSchemas.ResponseBaseSchema import ResponseBase, ResponseStatusEnum
from utils import (
    get_hashed_password, get_user_from_access_token, verify_password
)

UserRouter = APIRouter(prefix="/user")


@UserRouter.post("/", response_model=ResponseBase)
def create_user(new_user_data: UserCreateDTO):
    try:
        # Sprawdzenie, czy użytkownik o podanym adresie e-mail już istnieje
        users_ref = db.collection('users').where('email', '==', new_user_data.email)
        results = users_ref.stream()
        for user in results:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Dodanie nowego użytkownika do Firestore
        user_ref = db.collection('user').document()
        user_ref.set({
            'id': user_ref.id,
            'email': new_user_data.email,
            'role': str(new_user_data.role.value),
            'password': new_user_data.password,
            'address': new_user_data.address.dict(),
            'personal_data': new_user_data.personal_data.dict()
        })

        return ResponseBase(
            status=ResponseStatusEnum.Processed
        )
    except Exception as e:
        print(e)  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(status=ResponseStatusEnum.ErrorOccurred)


# @UserRouter.post("/create-personal-data", response_model=ResponseBase)
# def create_personal_data(new_user_data: UserPersonalDataDTO,
#                          current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
#                          db: Session = Depends(get_db), ):
#     personal_data = crud.create_personal_data_created_account(db=db, personal_data=new_user_data.personal_data,
#                                                               user_id=current_user.id)
#     address_data = crud.create_address_created_account(db=db, address_data=new_user_data.address,
#                                                        user_id=current_user.id)
#     return ResponseBase(
#         status=ResponseStatusEnum.Processed,
#         payload=PersonalDataResponsePayload(
#             user_id=str(current_user.id),
#             role=UserRoleEnum.client,
#             personal_data=PersonalDataCreate(
#                 first_name=personal_data.first_name,
#                 last_name=personal_data.last_name,
#                 phone=personal_data.phone
#             ),
#             address=AddressCreate(
#                 street=address_data.street,
#                 postal_code=address_data.postal_code,
#                 city=address_data.city,
#                 house_number=address_data.house_number,
#                 country=address_data.country,
#                 voivodeship=address_data.voivodeship
#             )
#         )
#     )


@UserRouter.get("/checkEmail", response_model=ResponseBase)
def check_email(email: str = Query(...)):
    db_user = crud.get_user_by_email(email=email, )
    try:
        # Wykonanie zapytania do Firestore
        users_ref = db.collection('users').where('email', '==', email)
        results = users_ref.stream()

        # Sprawdzenie, czy znaleziono użytkownika o podanym adresie e-mail
        for user in results:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Jeśli nie znaleziono użytkownika o podanym adresie e-mail
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload="Email not registered"
        )
    except Exception as e:
        print(e)  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(status=ResponseStatusEnum.ErrorOccurred)


# Role checking is used only for demonstrate purpose

allow_create_resource = RoleChecker([UserRoleEnum.client, UserRoleEnum.worker])
allow_create_resource_manager = RoleChecker([UserRoleEnum.manager])
access_for_all = RoleChecker([UserRoleEnum.manager, UserRoleEnum.client, UserRoleEnum.worker])


@UserRouter.post("/addWorker", response_model=ResponseBase, dependencies=[Depends(allow_create_resource_manager)])
def create_user(new_user_data: WorkerCreateDto):
    # Ustawienie roli użytkownika na 2
    new_user_data.role = 2

    # Utworzenie nowego użytkownika w Firestore
    user_ref = db.collection('user').document()
    user_ref.set({
        'id': user_ref.id,
        'email': new_user_data.email,
        'password': new_user_data.password,
        'role': new_user_data.role
    })

    return ResponseBase(
        status=ResponseStatusEnum.Processed,
        payload="Worker created!"
    )


@UserRouter.get("/worker/workers", dependencies=[Depends(allow_create_resource_manager)])
async def read_workers():
    # Wykonanie zapytania do Firestore
    workers_ref = db.collection('user').where('role', '==', 2)
    results = workers_ref.stream()

    # Przetwarzanie wyników
    workers = [{'id': worker.to_dict()['id'], 'email': worker.to_dict()['email']} for worker in results]

    return workers


@UserRouter.get("/user_info/{user_id}", dependencies=[Depends(access_for_all)])
async def get_usr_personal_data(
        user_id: str,
        db: Session = Depends(get_db)
):
    address_data = crud.get_user_address(db, user_id)
    personal_data = crud.get_user_personal_data(db, user_id)

    user_info = {
        "address_data": address_data,
        "personal_data": personal_data
    }
    print(user_info)
    return user_info


@UserRouter.get("/me", dependencies=[Depends(access_for_all)])
async def read_users_me(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
):
    try:
        current_user = current_user.to_dict()
        current_user['role'] = int(current_user['role'])
        return current_user
    except Exception as e:
        user_info = {
            "id": "current_user.id",
            "email": "current_user.email",
            "role": 1,
            "address_data": {
                "street": "string",
                "postal_code": "string",
                "city": "string",
                "house_number": "string",
                "country": "string",
                "voivodeship": "string"
            },
            "personal_data": {
                "first_name": "string",
                "last_name": "string",
                "phone": "string"
            },
        }
        return user_info


@UserRouter.delete('/worker/{worker_id}', response_model=ResponseBase,
                   dependencies=[Depends(allow_create_resource_manager)])
def del_worker(
        worker_id: str,
):
    # Wykonanie zapytania do Firestore
    workers_ref = db.collection('user').where('id', '==', worker_id)
    results = workers_ref.stream()

    # Pobranie pierwszego dokumentu, który spełnia warunek
    worker_doc = None
    for worker in results:
        worker_doc = worker
        break

    # Sprawdzenie, czy dokument został znaleziony
    if worker_doc is None:
        raise HTTPException(status_code=404, detail="Worker not found")

    # Usunięcie dokumentu
    worker_doc.reference.delete()

    return ResponseBase(
        status=ResponseStatusEnum.Processed
    )


@UserRouter.post('/updateWorker', response_model=ResponseBase, dependencies=[Depends(allow_create_resource_manager)])
def update_user(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
        new_user_data: WorkerUpdate,
        db: Session = Depends(get_db)
):
    hashed_pwd = get_hashed_password(password=new_user_data.password)
    updatedUser = crud.update_user_data(
        db, hashed_pwd, user_id=new_user_data.worker_user_id,
        email=new_user_data.email, isActive=new_user_data.is_active
    )
    personal_data_db_update = crud.update_personal_data(db, new_user_data.personal_data, user_id=current_user.id)
    address_db_update = crud.update_address(db, new_user_data.address, user_id=current_user.id)
    if personal_data_db_update and address_db_update:
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=UpdateWorkerUserDataPayload(
                personal_data=PersonalDataCreate(
                    first_name=personal_data_db_update.first_name,
                    last_name=personal_data_db_update.last_name,
                    phone=personal_data_db_update.phone
                ),
                address=AddressCreate(
                    street=address_db_update.street,
                    postal_code=address_db_update.postal_code,
                    city=address_db_update.city,
                    house_number=address_db_update.house_number,
                    country=address_db_update.country,
                    voivodeship=address_db_update.voivodeship
                ),
                email=updatedUser.email,
                is_active=updatedUser.is_active,
                worker_user_id=str(updatedUser.id),
            )
        )


@UserRouter.post('/update', response_model=ResponseBase, dependencies=[Depends(allow_create_resource)])
def update_user(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
        new_user_data: UserUpdate,
):
    current_user = current_user.to_dict()

    # Wykonanie zapytania do Firestore
    users_ref = db.collection('user').where('email', '==', current_user['email']).limit(1)
    results = users_ref.get()

    # Aktualizacja pierwszego znalezionego dokumentu
    user_doc = results[0].reference
    user_doc.update(new_user_data.dict())

    return ResponseBase(
        status=ResponseStatusEnum.Processed
    )


@UserRouter.post('/resetPwd', response_model=ResponseBase, dependencies=[Depends(allow_create_resource)])
def reset_pwd(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
        payload: ResetPdw,
        db: Session = Depends(get_db)
):
    if verify_password(password=payload.old_password, hashed_pass=current_user.hashed_password):
        new_pwd = get_hashed_password(password=payload.password)
        result = crud.update_user_pwd(db, new_pwd, user_id=current_user.id)
        if result:
            return ResponseBase(
                status=ResponseStatusEnum.Processed
            )
        return ResponseBase(status=ResponseStatusEnum.ErrorOccurred)
    return ResponseBase(status=ResponseStatusEnum.ErrorOccurred, payload="Unauthorized")
