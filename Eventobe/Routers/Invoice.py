from datetime import datetime, time
from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm.session import Session
from starlette.responses import JSONResponse

import crud
from RoleChaecker import RoleChecker
from dbGetter import get_db
from models import UserRoleEnum
from schemasPkg.createSchemas.GuestListCreate import GuestListBase, GuestListCreate, GuestListCreateDto
from schemasPkg.createSchemas.InvoiceCreateSchema import InvoiceCreate, SerializedInvoice, SerializedInvoiceWithItems
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from schemasPkg.responseSchemas.ResponseBaseSchema import ResponseBase, ResponseStatusEnum
from utils import get_user_from_access_token

InvoiceRouter = APIRouter(prefix="/invoice")

order_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.manager, UserRoleEnum.worker])

@InvoiceRouter.post('/', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def create_invoice(
        create_data: InvoiceCreate,
        db: Session = Depends(get_db),
):
    invoice = crud.create_invoice(db, create_data)
    if invoice:
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=SerializedInvoice(
                id=str(invoice.id),
                invoice_nr=invoice.invoice_nr,
                created_at=str(invoice.created_at),
                nip=invoice.nip,
                client_id=str(invoice.client_id),
                order_id=str(invoice.order_id)
            )
        )
    return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                        content=jsonable_encoder(ResponseBase(
                            status=ResponseStatusEnum.ErrorOccurred,
                            payload='Some error occurred, possible given order id is mismatching or client id'
                        ))
                        )

@InvoiceRouter.get('/{order_id}', dependencies=[Depends(order_permissions)])
def create_invoice(
        order_id: str,
        db: Session = Depends(get_db),
):
    data = crud.get_invoice_by_order_id(db, order_id)
    if data:
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=SerializedInvoiceWithItems(
                id=data.id,
                invoice_nr=data.invoice_nr,
                created_at=str(data.created_at),
                nip=data.nip,
                client_id=data.client_id,
                order_id=data.order_id,
                items=data.items
            )
        )
    return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                        content=jsonable_encoder(ResponseBase(
                            status=ResponseStatusEnum.ErrorOccurred,
                            payload='Some error occurred, possible given order id is mismatching'
                        ))
                        )
