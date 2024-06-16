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
from schemasPkg.createSchemas.InvoiceCreateSchema import InvoiceCreate, SerializedInvoice
from schemasPkg.createSchemas.InvoiceItemCreateSchema import InvoiceItemCreate, SerializedInvoiceItem
from schemasPkg.dbEntitiesSchemas.UserDbSchema import UserDb
from schemasPkg.responseSchemas.ResponseBaseSchema import ResponseBase, ResponseStatusEnum
from utils import get_user_from_access_token

InvoiceItemRouter = APIRouter(prefix="/invoice_item")

order_permissions = RoleChecker([UserRoleEnum.client, UserRoleEnum.manager, UserRoleEnum.worker])
delete_permissions = RoleChecker([UserRoleEnum.manager, UserRoleEnum.worker])


@InvoiceItemRouter.post('/', response_model=ResponseBase, dependencies=[Depends(order_permissions)])
def create_invoice(
        create_data: InvoiceItemCreate,
        db: Session = Depends(get_db),
):
    invoice_item = crud.create_invoice_item(db, create_data)
    if invoice_item:
        return ResponseBase(
            status=ResponseStatusEnum.Processed,
            payload=SerializedInvoiceItem(
                id=str(invoice_item.id),
                name=invoice_item.name,
                count=invoice_item.count,
                price_per_item=invoice_item.price_per_item,
                invoice_id=str(invoice_item.invoice_id)
            )
        )
    return JSONResponse(status_code=status.HTTP_409_CONFLICT,
                        content=jsonable_encoder(ResponseBase(
                            status=ResponseStatusEnum.ErrorOccurred,
                            payload='Some error occurred, possible given order id is mismatching or client id'
                        ))
                        )