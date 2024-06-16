from typing import Annotated

from fastapi import HTTPException, APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

import crud
from InitFirestore import db
from RoleChaecker import RoleChecker
from dbGetter import get_db
from models import UserRoleEnum
from schemasPkg.createSchemas.OrderDataCreate import OrderCreate, SerializedOrder
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from schemasPkg.responseSchemas.ResponseBaseSchema import ResponseBase, ResponseStatusEnum
from utils import get_user_from_access_token

OrderRouter = APIRouter(prefix="/order")

order_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.worker])
delete_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.worker])
access_permissions = RoleChecker([UserRoleEnum.manager, UserRoleEnum.worker])
order_details_per = RoleChecker([UserRoleEnum.client, UserRoleEnum.worker])


@OrderRouter.post('/', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def create_order(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
        order_create_data: OrderCreate,
) -> ResponseBase:
    try:
        # Tworzenie referencji do kolekcji 'orders' w Firestore
        orders_ref = db.collection('orders')

        # Dodawanie nowego dokumentu reprezentującego zamówienie
        new_order_ref = orders_ref.document()
        order_create_data.status = order_create_data.status.value
        order_create_data.type = order_create_data.type.value
        # Dane zamówienia
        order_data = order_create_data.dict()
        order_data['id'] = new_order_ref.id
        order_data['client_id'] = current_user.id

        # Zapisanie danych zamówienia w bazie danych
        new_order_ref.set(order_data)

        # Zwrócenie odpowiedzi
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=SerializedOrder(**order_data)
        )
    except Exception as e:
        print(e, 'chuj')  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(status=ResponseStatusEnum.ErrorOccurred)


@OrderRouter.get('/', response_model=ResponseBase, dependencies=[Depends(access_permissions)])
def get_order(
) -> ResponseBase:
    try:
        # Pobranie wszystkich dokumentów z kolekcji 'orders'
        orders_ref = db.collection('orders').stream()

        orders = []
        for doc in orders_ref:
            order_data = doc.to_dict()
            order_dict = {
                'id': doc.id,
                'name': order_data.get('name', ''),
                'cost': order_data.get('cost', 0.0),
                'payment_token': order_data.get('payment_token', ''),
                'bar_option': order_data.get('bar_option', ''),
                'security': order_data.get('security', ''),
                'status': order_data.get('status', ''),
                'type': order_data.get('type', ''),
                'start_date': order_data.get('start_date', ''),
                'additional_info': order_data.get('additional_info', ''),
                'artist_name': order_data.get('artist_name', ''),
                'max_nr_of_people': order_data.get('max_nr_of_people', 0),
                'minimal_age': order_data.get('minimal_age', 0),
                'company_name': order_data.get('company_name', ''),
                'catering': order_data.get('catering', ''),
                'number_of_seats': order_data.get('number_of_seats', 0),
            }
            orders.append(order_dict)

        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=orders
        )

    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=jsonable_encoder(ResponseBase(
                status=ResponseStatusEnum.ErrorOccurred,
                payload=f'Some error occurred: {str(e)}'
            ))
        )


@OrderRouter.get('/my', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def get_order(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
) -> ResponseBase:
    try:
        # Pobranie wszystkich zamówień dla danego użytkownika z kolekcji 'orders'
        orders_ref = db.collection('orders').where('client_id', '==', current_user.id)
        results = orders_ref.stream()

        # Lista zamówień
        orders = []
        for order in results:
            orders.append(order.to_dict())  # Zamień DocumentSnapshot na słownik

        # Zwrócenie odpowiedzi
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=[SerializedOrder(**order) for order in orders]
        )
    except Exception as e:
        print(e)  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(status=ResponseStatusEnum.ErrorOccurred)


@OrderRouter.post('/update', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def update_order(
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
        order_data: SerializedOrder,
) -> ResponseBase:
    try:

        # Tworzymy referencję do dokumentu zamówienia w kolekcji 'orders'
        order_ref = db.collection('orders').document(order_data.id)
        updated_order = order_data.dict()
        updated_order['status'] = updated_order['status'].value
        updated_order['type'] = updated_order['type'].value
        updated_order['client_id'] = current_user.id

        # Aktualizujemy cały dokument nowymi danymi
        order_ref.set(updated_order)

        # Zwracamy odpowiedź
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=order_data
        )
    except Exception as e:
        print(e)  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(
            status=ResponseStatusEnum.ErrorOccurred,
            payload="Some error occurred during order update"
        )


@OrderRouter.post('/update_by_worker', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def update_order(
        order_data: SerializedOrder,
) -> ResponseBase:
    try:

        # Tworzymy referencję do dokumentu zamówienia w kolekcji 'orders'
        order_ref = db.collection('orders').document(order_data.id)
        updated_order = order_data.dict()
        updated_order['status'] = updated_order['status'].value
        updated_order['type'] = updated_order['type'].value
        updated_order['client_id'] = order_data.id

        # Aktualizujemy cały dokument nowymi danymi
        order_ref.set(updated_order)

        # Zwracamy odpowiedź
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=order_data
        )
    except Exception as e:
        print(e)  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(
            status=ResponseStatusEnum.ErrorOccurred,
            payload="Some error occurred during order update"
        )


@OrderRouter.get('/{order_id}', response_model=ResponseBase, dependencies=[Depends(order_details_per)])
def get_order_by_id(
        order_id: str,
        current_user: Annotated[UserDb, Depends(get_user_from_access_token)],
) -> ResponseBase:
    try:
        # Tworzymy referencję do dokumentu zamówienia w kolekcji 'orders'
        order_ref = db.collection('orders').document(order_id)

        # Pobieramy dane zamówienia
        order_data = order_ref.get().to_dict()

        # Jeśli nie ma takiego zamówienia, zwracamy błąd
        if not order_data:
            raise HTTPException(status_code=404, detail="Order not found")

        # Zwracamy odpowiedź zawierającą dane zamówienia
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=SerializedOrder(**order_data)
        )
    except Exception as e:
        print(e)  # Możesz zalogować błąd w bardziej zaawansowany sposób
        return ResponseBase(
            status=ResponseStatusEnum.ErrorOccurred,
            payload="Some error occurred while fetching order data"
        )


@OrderRouter.get('/{order_id}/guest_list', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def get_guest_list(
        order_id: str,
):
    try:
        # Pobranie dokumentu listy gości na podstawie order_id
        guest_list_ref = db.collection('guest_lists').where('order_id', '==', order_id).stream()
        guest_list_docs = [doc for doc in guest_list_ref]

        if guest_list_docs:
            # Zakładamy, że jest tylko jeden dokument dla danego order_id
            guest_list = guest_list_docs[0].to_dict()
            guests = guest_list.get('guests', [])
            return ResponseBase(
                status=ResponseStatusEnum.Processed,
                payload=guests
            )
        else:
            return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                                content=jsonable_encoder(ResponseBase(
                                    status=ResponseStatusEnum.ErrorOccurred,
                                    payload='List does not exist'
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


@OrderRouter.post("/check_date", response_model=ResponseBase)
def check_date(date: str, db: Session = Depends(get_db)):
    result = crud.check_order_date_availability(db, date)
    if result == False:
        raise HTTPException(status_code=403, detail="Date not available")

    return ResponseBase(
        status=ResponseStatusEnum.Processed,
        payload="Date available"
    )


@OrderRouter.get("/validation/orders_dates", response_model=ResponseBase)
def get_dates(db: Session = Depends(get_db)):
    result = crud.get_orders_dates(db)
    return ResponseBase(
        status=ResponseStatusEnum.Processed,
        payload=result
    )


@OrderRouter.delete('/{order_id}', response_model=ResponseBase, dependencies=[Depends(delete_permissions)])
def delete_order(order_id: str) -> ResponseBase:
    try:
        # Referencja do dokumentu
        order_ref = db.collection('orders').document(order_id)

        # Sprawdzenie, czy dokument istnieje
        if not order_ref.get().exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        # Usunięcie dokumentu
        order_ref.delete()

        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload='Order deleted'
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=jsonable_encoder(ResponseBase(
                status=ResponseStatusEnum.ErrorOccurred,
                payload=f'Some error occurred: {str(e)}'
            ))
        )
