from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm.session import Session
from starlette.responses import JSONResponse

import crud
from InitFirestore import db
from RoleChaecker import RoleChecker
from dbGetter import get_db
from models import UserRoleEnum
from schemasPkg.createSchemas.GuestListCreate import GuestListCreate, GuestListCreateDto
from schemasPkg.responseSchemas.ResponseBaseSchema import ResponseBase, ResponseStatusEnum

GuestListRouter = APIRouter(prefix="/guestList")

order_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.manager, UserRoleEnum.worker])
delete_permissions = RoleChecker([UserRoleEnum.manager, UserRoleEnum.worker])


@GuestListRouter.post('/', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def add_guest_list(
        create_data: GuestListCreateDto,
):
    try:
        # Sprawdzenie czy istnieje lista gości z podanym order_id
        guest_list_ref = db.collection('guest_lists').where('order_id', '==', create_data.order_id).stream()
        existing_lists = [doc for doc in guest_list_ref]

        if existing_lists:
            return ResponseBase(
                status=ResponseStatusEnum.Processed,
                payload='List exist'
            )

        # Tworzenie nowej listy gości
        new_list_ref = db.collection('guest_lists').add({
            'order_id': create_data.order_id,
            'guests': []
        })
        new_list_id = new_list_ref[1].id  # new_list_ref[1] to DocumentReference, new_list_ref[0] to Timestamp

        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=GuestListCreate(id=new_list_id)
        )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=jsonable_encoder(ResponseBase(
                status=ResponseStatusEnum.ErrorOccurred,
                payload=f'Some error occurred: {str(e)}'
            ))
        )


@GuestListRouter.delete('/{list_id}', response_model=ResponseBase, dependencies=[Depends(delete_permissions)])
def delete_guest_list(
        list_id: str,
        db: Session = Depends(get_db),
):
    result = crud.delete_guest_list(db, list_id)
    if result:
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload='Guest list deleted'
        )
    return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                        content=jsonable_encoder(ResponseBase(
                            status=ResponseStatusEnum.ErrorOccurred,
                            payload='Some error occurred, possible given list id is mismatching'
                        ))
                        )
