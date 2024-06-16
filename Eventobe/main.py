from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware



from Routers import auth, user, order,  GuestList, Guest, Invoice, InvoiceItem

from database import engine
from fastapi.middleware.cors import CORSMiddleware
import models



models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware ,secret_key='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')

app.include_router(auth.AuthRouter)
app.include_router(user.UserRouter)
app.include_router(order.OrderRouter)
app.include_router(GuestList.GuestListRouter)
app.include_router(Guest.GuestRouter)
app.include_router(Invoice.InvoiceRouter)
app.include_router(InvoiceItem.InvoiceItemRouter)





@app.get("/")
async def root():
    return {"APIVersion": "0.0.1"}