from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm.session import Session

import crud
from InitFirestore import db
from RoleChaecker import RoleChecker
from dbGetter import get_db
from models import UserRoleEnum
from schemasPkg.createSchemas.GuestDataCreate import GuestCreate, UpdateTableNrDto, GuestCreateResponseDto
from schemasPkg.responseSchemas.ResponseBaseSchema import ResponseBase, ResponseStatusEnum

GuestRouter = APIRouter(prefix="/guest")

order_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.worker])
delete_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.worker])


@GuestRouter.post('/', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def create(
        data: GuestCreate,
):
    try:
        # Pobranie dokumentu listy gości na podstawie order_id
        guest_list_ref = db.collection('guest_lists').where('order_id', '==', data.order_id).stream()
        guest_list_docs = [doc for doc in guest_list_ref]

        if guest_list_docs:
            # Zakładamy, że jest tylko jeden dokument dla danego order_id
            guest_list_doc = guest_list_docs[0]
            guest_list = guest_list_doc.to_dict()
            guests = guest_list.get('guests', [])

            # Dodanie nowego gościa do listy
            new_guest = {
                'id': guest_list_doc.id,
                'name': data.name,
                'surname': data.surname,
            }
            guests.append(new_guest)

            # Aktualizacja dokumentu w Firestore
            db.collection('guest_lists').document(guest_list_doc.id).update({
                'guests': guests
            })

            return ResponseBase(
                status=ResponseStatusEnum.Processed,
                payload='Guest added successfully'
            )
        else:
            return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                                content=jsonable_encoder(ResponseBase(
                                    status=ResponseStatusEnum.ErrorOccurred,
                                    payload='Guest list does not exist'
                                ))
                                )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=jsonable_encoder(ResponseBase(
                status=ResponseStatusEnum.ErrorOccurred,
                payload=f'Some error occurred: {str(e)}'
            ))
        )


@GuestRouter.post('/update_table_number', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def add_place(
        data: UpdateTableNrDto,
        db: Session = Depends(get_db),
):
    updated = crud.update_guest_add_place(db, place_id=data.table_nr, guest_id=data.guest_id)
    if updated:
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=GuestCreateResponseDto(
                id=updated.id,
                list_id=updated.list_id,
                name=updated.name,
                surname=updated.surname,
                table_number=updated.table_number
            )
        )
    return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                        content=jsonable_encoder(ResponseBase(
                            status=ResponseStatusEnum.ErrorOccurred,
                            payload='Some error occurred, possible given list id is mismatching'
                        ))
                        )


@GuestRouter.delete('/{guest_id}', response_model=ResponseBase, dependencies=[Depends(delete_permissions)])
def delete_guest(
        guest_id: str,
):
    try:
        # Pobranie wszystkich dokumentów z kolekcji guest_lists
        guest_lists = db.collection('guest_lists').stream()
        guest_list_doc = None

        # Przeszukiwanie dokumentów w celu znalezienia odpowiedniego
        for doc in guest_lists:
            guest_list = doc.to_dict()
            guests = guest_list.get('guests', [])
            if any(guest.get('id') == guest_id for guest in guests):
                guest_list_doc = doc
                break

        if guest_list_doc:
            guest_list = guest_list_doc.to_dict()
            guests = guest_list.get('guests', [])

            # Usunięcie gościa z listy
            updated_guests = [guest for guest in guests if guest.get('id') != guest_id]

            # Aktualizacja dokumentu w Firestore
            db.collection('guest_lists').document(guest_list_doc.id).update({
                'guests': updated_guests
            })

            return ResponseBase(
                status=ResponseStatusEnum.Processed,
                payload='Guest deleted'
            )
        else:
            return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                                content=jsonable_encoder(ResponseBase(
                                    status=ResponseStatusEnum.ErrorOccurred,
                                    payload='Guest not found in any list'
                                ))
                                )

    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=jsonable_encoder(ResponseBase(
                status=ResponseStatusEnum.ErrorOccurred,
                payload=f'Some error occurred: {str(e)}'
            ))
        )
