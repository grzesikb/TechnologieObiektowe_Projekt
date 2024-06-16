import numbers
from datetime import datetime, time

from sqlalchemy import null
from sqlalchemy.orm import Session
from uuid import uuid4
import uuid

import models
from InitFirestore import db
from schemasPkg.createSchemas.AddressDataCreate import AddressCreate
from schemasPkg.createSchemas.GuestDataCreate import GuestCreate, GuestCreateResponseDto
from schemasPkg.createSchemas.InvoiceCreateSchema import InvoiceCreate, SerializedInvoiceWithItems
from schemasPkg.createSchemas.InvoiceItemCreateSchema import InvoiceItemCreate, SerializedInvoiceItem
from schemasPkg.createSchemas.OrderDataCreate import OrderCreate, SerializedOrder
from schemasPkg.createSchemas.PaymentDataCreateSchema import PaymentDataCreate, PaymentDataUpdate
from schemasPkg.createSchemas.PersonalDataCreateSchema import PersonalDataCreate
from schemasPkg.createSchemas.TokenCreateSchema import TokensCreate
from schemasPkg.createSchemas.UserCreateSchema import UserCreate, ResetPdw
from schemasPkg.dbEntitiesSchemas.GuestDbSchema import GuestDb
from schemasPkg.dbEntitiesSchemas.InvoiceItemDbSchema import InvoiceItem
from schemasPkg.dbEntitiesSchemas.OrederDbSchema import OrderDb
from schemasPkg.dbEntitiesSchemas.TokenDbSchema import Tokens
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from models import OrderTypeEnum, OrderStatusEnum
from google.cloud.firestore_v1.base_query import FieldFilter


def get_user_address(db: Session, user_id: str):
    return db.query(models.Addresses).filter(models.Addresses.user_id == uuid.UUID(user_id)).first()


def get_user_personal_data(db: Session, user_id: str):
    return db.query(models.PersonalData).filter(models.PersonalData.user_id == uuid.UUID(user_id)).first()


def get_workers(db: Session):
    results = db.query(models.User).filter(models.User.role == 'worker').with_entities(models.User.id,
                                                                                       models.User.email).all()
    return [{"id": row.id, "email": row.email} for row in results]


def get_user_by_email(email: str):
    return db.collection('user').where(filter=FieldFilter('email', '==', email)).get()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate):
    db_user = models.User(email=user.email, hashed_password=user.password, role=user.role)
    db_user.id = uuid4()
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_order_by_id_manager(db: Session, order_id: str) -> OrderDb | None:
    result = db.query(models.Order).filter_by(id=uuid.UUID(order_id)).first()
    if result:
        return OrderDb(
            id=str(result.id),
            name=result.name,
            bar_option=result.bar_option,
            security=result.security,
            type=result.type,
            status=result.status,
            start_date=result.start_date,
            additional_info=result.additional_info,
            client_id=str(result.client_id)
        )
    return None


def create_guest_list(db: Session, order_id: str):
    order = get_order_by_id_manager(db=db, order_id=order_id)
    order_list = get_guest_list_by_order(db, order_id=order.id)
    if order and not order_list:
        db_guest_list = models.GuestList()
        db_guest_list.id = uuid4()
        db_guest_list.order_id = uuid.UUID(order.id)
        db.add(db_guest_list)
        db.commit()
        db.refresh(db_guest_list)
        return db_guest_list
    if order_list:
        return 'List exist'
    return None


def delete_guest_list(db: Session, list_id: str):
    guest_list = get_guest_list_delete(db, list_id).first()
    guest_list_Query = get_guest_list_delete(db, list_id)
    if not guest_list:
        return None
    guest_list_Query.delete()
    db.commit()
    return get_guest_list_delete(db, list_id)


def get_guest_list(db: Session, id: str) -> models.GuestList | None:
    return db.query(models.GuestList).filter_by(id=uuid.UUID(id)).first()


def get_guest_list_delete(db: Session, id: str):
    return db.query(models.GuestList).filter_by(id=uuid.UUID(id))


def get_guest_list_by_order(db: Session, order_id: str) -> models.GuestList | None:
    return db.query(models.GuestList).filter_by(order_id=uuid.UUID(order_id)).first()


def create_guest(db: Session, order_id: str, guest_data: GuestCreate):
    guest_list = get_guest_list_by_order(db, order_id)
    if guest_list:
        db_guest = models.Guest(
            name=guest_data.name,
            surname=guest_data.surname,
            table_number=guest_data.table_number
        )
        db_guest.id = uuid4()
        db_guest.list_id = guest_list.id
        db.add(db_guest)
        db.commit()
        db.refresh(db_guest)
        return db_guest
    return None


def create_invoice(
        db: Session,
        create_data: InvoiceCreate,
):
    client = db.query(models.User).filter_by(id=uuid.UUID(create_data.client_id)).first()
    order = get_order_by_id_manager(db, create_data.order_id)
    if client and order:
        db_invoice = models.Invoice(
            invoice_nr=create_data.invoice_nr,
            created_at=create_data.created_at,
            nip=create_data.nip
        )
        db_invoice.id = uuid4()
        db_invoice.client_id = uuid.UUID(create_data.client_id)
        db_invoice.order_id = uuid.UUID(create_data.order_id)
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        return db_invoice
    return None


def create_invoice_item(
        db: Session,
        create_data: InvoiceItemCreate,
):
    invoice = db.query(models.Invoice).filter_by(id=uuid.UUID(create_data.invoice_id)).first()
    if invoice:
        db_invoice_item = models.InvoiceItem(
            name=create_data.name,
            count=create_data.count,
            price_per_item=create_data.price_per_item
        )
        db_invoice_item.id = uuid4()
        db_invoice_item.invoice_id = uuid.UUID(create_data.invoice_id)
        db.add(db_invoice_item)
        db.commit()
        db.refresh(db_invoice_item)
        return db_invoice_item
    return None


def get_all_invoice_items_by_invoice_id(db: Session, invoice_id: str):
    items = db.query(models.InvoiceItem).filter_by(invoice_id=invoice_id).all()
    if items:
        return [InvoiceItem(
            name=item.name,
            id=str(item.id),
            count=item.count,
            invoice_id=str(item.invoice_id),
            price_per_item=item.price_per_item
        ) for item in items]
    return None


def get_invoice_by_order_id(db: Session, order_id: str):
    order = get_order_by_id_manager(db, order_id=order_id)
    if order:
        invoice = db.query(models.Invoice).filter_by(order_id=uuid.UUID(order.id)).first()
        if invoice:
            items = get_all_invoice_items_by_invoice_id(db, invoice_id=invoice.id)
            if items:
                return SerializedInvoiceWithItems(
                    order_id=str(invoice.order_id),
                    id=str(invoice.id),
                    client_id=str(invoice.client_id),
                    invoice_nr=invoice.invoice_nr,
                    created_at=str(invoice.created_at),
                    nip=int(invoice.nip),
                    items=[SerializedInvoiceItem(
                        name=item.name,
                        id=str(item.id),
                        count=item.count,
                        invoice_id=str(item.invoice_id),
                        price_per_item=item.price_per_item
                    ) for item in items]
                )
            return SerializedInvoiceWithItems(
                order_id=str(invoice.order_id),
                id=str(invoice.id),
                client_id=str(invoice.client_id),
                invoice_nr=invoice.invoice_nr,
                created_at=str(invoice.created_at),
                nip=int(invoice.nip),
                items=[])
        return None
    return None


def get_guest(db: Session, guest_id: str):
    return db.query(models.Guest).filter_by(id=uuid.UUID(guest_id))


def delete_guest(db: Session, guest_id: int):
    guest = get_guest(db, guest_id).first()
    guestQuery = get_guest(db, guest_id)
    if not guest:
        return None
    guestQuery.delete()
    db.commit()
    return get_guest(db, guest_id)


def update_user_data(db: Session, hashed_pwd: str, user_id: str, email: str, isActive: bool) -> models.User | None:
    user = db.query(models.User).filter_by(id=uuid.UUID(user_id))
    print(user)
    if user:
        user.update({
            "hashed_password": hashed_pwd,
            "email": email,
            "is_active": isActive
        })
        db.commit()
        return user.first()
    return None


def update_user_pwd(db: Session, hashed_pwd: str, user_id: str) -> models.User | None:
    user = db.query(models.User).filter_by(id=uuid.UUID(user_id))
    if user:
        user.update({
            "hashed_password": hashed_pwd,

        })
        db.commit()
        return user.first()
    return None


def delete_address(db: Session, user_id: str) -> models.Addresses | None:
    address = db.query(models.Addresses).filter_by(user_id=uuid.UUID(user_id))
    if address:
        address.delete()
        db.commit()
        return db.query(models.Addresses).filter_by(id=uuid.UUID(user_id)).first()
    return None


def delete_personal_data(db: Session, user_id: str) -> models.PersonalData | None:
    personalData = db.query(models.PersonalData).filter_by(user_id=uuid.UUID(user_id))
    if personalData:
        personalData.delete()
        db.commit()
        return db.query(models.PersonalData).filter_by(id=uuid.UUID(user_id)).first()
    return None


def delete_worker(db: Session, user_id: str) -> models.User | None:
    address = delete_address(db, user_id)
    print(address)
    personal_data = delete_personal_data(db, user_id)
    user = db.query(models.User).filter_by(id=uuid.UUID(user_id))
    if user:
        user.delete()
        db.commit()
        return db.query(models.User).filter_by(id=uuid.UUID(user_id)).first()
    return None


def create_personal_data(db: Session, personal_data: PersonalDataCreate, user_id: str) -> models.PersonalData:
    db_personal_data = models.PersonalData(
        first_name=personal_data.first_name,
        last_name=personal_data.last_name,
        phone=personal_data.phone
    )
    db_personal_data.id = uuid4()
    db_personal_data.user_id = user_id
    db.add(db_personal_data)
    db.commit()
    db.refresh(db_personal_data)
    return db_personal_data


def create_personal_data_created_account(db: Session, personal_data: PersonalDataCreate,
                                         user_id: str) -> models.PersonalData:
    db_personal_data = models.PersonalData(
        first_name=personal_data.first_name,
        last_name=personal_data.last_name,
        phone=personal_data.phone
    )
    db_personal_data.id = uuid4()
    db_personal_data.user_id = uuid.UUID(user_id)
    db.add(db_personal_data)
    db.commit()
    db.refresh(db_personal_data)
    return db_personal_data


def update_personal_data(
        db: Session,
        personal_data: PersonalDataCreate,
        user_id: str
) -> models.PersonalData | None:
    old_personal_data = db.query(models.PersonalData).filter_by(user_id=uuid.UUID(user_id))
    if old_personal_data:
        old_personal_data.update(
            {
                "first_name": personal_data.first_name,
                "last_name": personal_data.last_name,
                "phone": personal_data.phone
            }
        )
        db.commit()
        return old_personal_data.first()
    return None


def create_address(db: Session, address_data: AddressCreate, user_id: str) -> models.Addresses:
    db_address = models.Addresses(
        street=address_data.street,
        postal_code=address_data.postal_code,
        city=address_data.city,
        house_number=address_data.house_number,
        country=address_data.country,
        voivodeship=address_data.voivodeship
    )
    db_address.id = uuid4()
    db_address.user_id = user_id
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address


def create_address_created_account(db: Session, address_data: AddressCreate, user_id: str) -> models.Addresses:
    db_address = models.Addresses(
        street=address_data.street,
        postal_code=address_data.postal_code,
        city=address_data.city,
        house_number=address_data.house_number,
        country=address_data.country,
        voivodeship=address_data.voivodeship
    )
    db_address.id = uuid4()
    db_address.user_id = uuid.UUID(user_id)
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address


def update_address(
        db: Session,
        address_data: AddressCreate,
        user_id: str
) -> models.Addresses | None:
    old_address = db.query(models.Addresses).filter_by(user_id=uuid.UUID(user_id))
    if old_address:
        old_address.update({
            "street": address_data.street,
            "postal_code": address_data.postal_code,
            "city": address_data.city,
            "house_number": address_data.house_number,
            "country": address_data.country,
            "voivodeship": address_data.voivodeship
        })
        db.commit()
        return old_address.first()
    return None


def update_guest_add_place(db: Session, place_id: int, guest_id: str):
    old_guest = db.query(models.Guest).filter_by(id=uuid.UUID(guest_id))
    if old_guest:
        old_guest.update({
            "table_number": str(place_id)
        })
        db.commit()
        return old_guest.first()
    return None


def create_order(db: Session, order_create_data: OrderCreate, user_id: int) -> OrderDb:
    db_order = models.Order(
        cost=order_create_data.cost,
        payment_token=order_create_data.payment_token,
        name=order_create_data.name,
        bar_option=order_create_data.bar_option,
        security=order_create_data.security,
        type=order_create_data.type,
        start_date=order_create_data.start_date,
        additional_info=order_create_data.additional_info,
        status=order_create_data.status,
        artist_name=order_create_data.artist_name,
        max_nr_of_people=order_create_data.max_nr_of_people,
        minimal_age=order_create_data.minimal_age,
        company_name=order_create_data.company_name,
        catering=order_create_data.catering,
        number_of_seats=order_create_data.number_of_seats,
    )
    db_order.id = uuid4()
    db_order.client_id = uuid.UUID(user_id)
    db.add(db_order)
    print(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: str):
    order = get_order(db, order_id).first()
    orderQuery = get_order(db, order_id)
    if not order:
        return None
    orderQuery.delete()
    db.commit()
    return get_order(db, order_id)


def get_order(db: Session, order_id: str):
    return db.query(models.Order).filter_by(id=uuid.UUID(order_id))


def check_order_date_availability(db: Session, date: str):
    orders_list = get_all_orders(db)
    if not orders_list:
        return True
    orders_dates = [order.start_date for order in orders_list]
    for order_date in orders_dates:
        if date == order_date:
            return False
    return True


def get_orders_dates(db: Session):
    orders_list = get_all_orders(db)
    if not orders_list:
        return []
    orders_dates = [order.start_date for order in orders_list]
    return orders_dates


def get_tokens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Tokens).offset(skip).limit(limit).all()


def get_all_user_orders(db: Session, user_id: int) -> list[OrderDb]:
    result = db.query(models.Order).filter_by(client_id=uuid.UUID(user_id)).all()
    return [OrderDb(
        id=str(order.id),
        cost=order.cost,
        payment_token=order.payment_token,
        name=order.name,
        bar_option=order.bar_option,
        security=order.security,
        type=order.type,
        status=order.status,
        start_date=order.start_date,
        additional_info=order.additional_info,
        artist_name=order.artist_name,
        max_nr_of_people=order.max_nr_of_people,
        minimal_age=order.minimal_age,
        company_name=order.company_name,
        catering=order.catering,
        number_of_seats=order.number_of_seats,
        client_id=str(order.client_id)
    ) for order in result]


def get_all_orders(db: Session) -> list[OrderDb]:
    result = db.query(models.Order).all()
    return [OrderDb(
        id=str(order.id),
        cost=order.cost,
        payment_token=order.payment_token,
        name=order.name,
        bar_option=order.bar_option,
        security=order.security,
        type=order.type,
        status=order.status,
        start_date=order.start_date,
        additional_info=order.additional_info,
        artist_name=order.artist_name,
        max_nr_of_people=order.max_nr_of_people,
        minimal_age=order.minimal_age,
        company_name=order.company_name,
        catering=order.catering,
        number_of_seats=order.number_of_seats,
        client_id=str(order.client_id)
    ) for order in result]


def get_order_by_id(db: Session, user_id: int, order_id: int) -> list[OrderDb]:
    result = db.query(models.Order).filter_by(id=uuid.UUID(order_id)).all()
    return [OrderDb(
        id=str(order.id),
        name=order.name,
        cost=order.cost,
        payment_token=order.payment_token,
        bar_option=order.bar_option,
        security=order.security,
        type=order.type,
        status=order.status,
        start_date=order.start_date,
        additional_info=order.additional_info,
        artist_name=order.artist_name,
        max_nr_of_people=order.max_nr_of_people,
        minimal_age=order.minimal_age,
        company_name=order.company_name,
        catering=order.catering,
        number_of_seats=order.number_of_seats,
        client_id=str(order.client_id)
    ) for order in result]


def update_order_by_id_payments(db: Session, order_id: int, payment_id: str) -> list[OrderDb]:
    result = db.query(models.Order).filter_by(id=uuid.UUID(order_id)).first()
    result.payment_token = payment_id
    result.status = OrderStatusEnum.PendingConfirmation
    db.commit()
    return result


def get_guests_in_list_by_order_id(db: Session, order_id: str) -> list[GuestCreateResponseDto] | None:
    list = db.query(models.GuestList).filter_by(order_id=uuid.UUID(order_id)).first()
    if list:
        guests = db.query(models.Guest).filter_by(list_id=list.id).all()
        if guests:
            return [GuestCreateResponseDto(
                id=str(guest.id),
                name=guest.name,
                surname=guest.surname,
                table_number=guest.table_number,
                order_id=str(guest.list_id),
            ) for guest in guests]
        else:
            if list.id:
                return []
            else:
                return None
    else:
        return None


def update_order(db: Session, order: SerializedOrder, user_id: str) -> OrderDb | None:
    print("HSD")
    print(user_id)
    result = db.query(models.Order).filter_by(client_id=uuid.UUID(user_id))
    print(result)
    result = result.filter_by(id=uuid.UUID(order.id))
    print(result.first())
    if result:
        result.update(
            {
                "bar_option": order.bar_option,
                "security": order.security,
                "cost": order.cost,
                "payment_token": order.payment_token,
                "name": order.name,
                "type": order.type,
                "status": order.status,
                "start_date": order.start_date,
                "additional_info": order.additional_info,
                "artist_name": order.artist_name,
                "max_nr_of_people": order.max_nr_of_people,
                "minimal_age": order.minimal_age,
                "company_name": order.company_name,
                "catering": order.catering,
                "number_of_seats": order.number_of_seats,
            })
        db.commit()
        return result.first()
    return None


def update_order_by_worker(db: Session, order: SerializedOrder) -> OrderDb | None:
    result = db.query(models.Order).filter_by(id=uuid.UUID(order.id))
    if result:
        result.update(
            {
                "bar_option": order.bar_option,
                "security": order.security,
                "cost": order.cost,
                "payment_token": order.payment_token,
                "name": order.name,
                "type": order.type,
                "status": order.status,
                "start_date": order.start_date,
                "additional_info": order.additional_info,
                "artist_name": order.artist_name,
                "max_nr_of_people": order.max_nr_of_people,
                "minimal_age": order.minimal_age,
                "company_name": order.company_name,
                "catering": order.catering,
                "number_of_seats": order.number_of_seats,
            })
        db.commit()
        return result.first()
    return None


def get_token_by_value(token: str):
    print(token)
    return db.collection('tokens').where(filter=FieldFilter('token', '==', token)).get()


def create_user_token( token: TokensCreate, user_id: str):
    db_item = models.Tokens(token=token.token, user_id=user_id)
    db.collection('tokens').add({
        "id": str(uuid4()),
        "token": db_item.token,
        "user_id": db_item.user_id
    })
    return db_item


def create_payment_data(db: Session, payment_data: PaymentDataCreate, user_id: str):
    new_payment_data = models.PaymentDetails(
        name=payment_data.name,
        surname=payment_data.surname,
        number=payment_data.number,
        CCV=payment_data.CCV,
        expiration_date=payment_data.expiration_date
    )
    new_payment_data.id = uuid4()
    new_payment_data.user_id = uuid.UUID(user_id)
    db.add(new_payment_data)
    db.commit()
    db.refresh(new_payment_data)
    return new_payment_data


def update_payment_data(db: Session, new_payment_data: PaymentDataUpdate, user_id: str) -> models.PaymentDetails | None:
    old_payment_data = db.query(models.PaymentDetails).filter_by(id=uuid.UUID(new_payment_data.id))
    old_payment_data.filter_by(user_id=uuid.UUID(user_id))
    if old_payment_data:
        old_payment_data.update({
            "name": new_payment_data.name,
            "surname": new_payment_data.surname,
            "number": new_payment_data.number,
            "CCV": new_payment_data.CCV,
            "expiration_date": new_payment_data.expiration_date,
        })
        db.commit()
        return old_payment_data.first()
    return None
