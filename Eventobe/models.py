import enum

from sqlalchemy import Boolean, Column, ForeignKey, Enum, String, DateTime, BigInteger, Integer
from sqlalchemy.orm import relationship
from sqlalchemy import Uuid
from database import Base


class UserRoleEnum(enum.Enum):
    client = 1
    worker = 2
    manager = 3


class OrderTypeEnum(enum.Enum):
    Public = 1
    Occasional = 2
    Private = 3


class OrderStatusEnum(enum.Enum):
    Submitted = 1
    Accepted = 2
    PendingConfirmation = 3
    Confirmed = 4
    PendingOfferConfirmation = 5
    OfferConfirmed = 6
    Ready =  7
    Made = 8


class User(Base):
    __tablename__ = "user"

    id = Column(Uuid, primary_key=True, index=True)
    email = Column(String(350), unique=True, index=True)
    hashed_password = Column(String(100))
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRoleEnum))

    tokens = relationship("Tokens", back_populates="user",cascade="all, delete")
    address = relationship("Addresses", back_populates="user",cascade="all, delete")
    personal_data = relationship("PersonalData", back_populates="user",cascade="all, delete")
    paymentDetails = relationship("PaymentDetails", back_populates="user",cascade="all, delete")
    orders = relationship("Order", back_populates="user",cascade="all, delete")
    invoices = relationship("Invoice", back_populates="user",cascade="all, delete")


class PersonalData(Base):
    __tablename__ = "personalData"

    id = Column(Uuid, primary_key=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(200))
    phone = Column(String(15))
    user_id = Column(Uuid, ForeignKey("user.id",ondelete="CASCADE"))

    user = relationship("User", back_populates="personal_data",cascade="all, delete")


class Tokens(Base):
    __tablename__ = "tokens"

    id = Column(Uuid, primary_key=True, index=True)
    token = Column(String(500), index=True)
    user_id = Column(Uuid, ForeignKey("user.id",ondelete="CASCADE"))

    user = relationship("User", back_populates="tokens",cascade="all, delete")


class Addresses(Base):
    __tablename__ = "addresses"

    id = Column(Uuid, primary_key=True, index=True)
    street = Column(String(100))
    postal_code = Column(String(100))
    city = Column(String(100))
    house_number = Column(String(20))
    country = Column(String(100))
    voivodeship = Column(String(100))
    user_id = Column(Uuid, ForeignKey("user.id",ondelete="CASCADE"))

    user = relationship("User", back_populates="address",cascade="all, delete")


class Order(Base):
    __tablename__ = "order"

    id = Column(Uuid, primary_key=True, index=True)
    type = Column(Enum(OrderTypeEnum))
    start_date = Column(String(12))
    additional_info = Column(String(500))
    name = Column(String(200))
    cost = Column(BigInteger)
    payment_token = Column(String(200))
    bar_option = Column(Boolean)
    security = Column(Boolean)
    status = Column(Enum(OrderStatusEnum))
    #PublicEvent
    artist_name = Column(String(200))
    max_nr_of_people = Column(Integer)
    minimal_age = Column(Integer)

    #PrivateEvent
    company_name = Column(String(200))
    catering = Column(Boolean)
    number_of_seats = Column(Integer)

    client_id = Column(Uuid, ForeignKey("user.id"))

    user = relationship("User", back_populates="orders",cascade="all, delete")
    guest_list = relationship("GuestList", back_populates="order", cascade="all, delete")
    invoice = relationship("Invoice", back_populates="order")


class PaymentDetails(Base):
    __tablename__ = "paymentDetails"

    id = Column(Uuid, primary_key=True, index=True)
    name = Column(String(100))
    surname = Column(String(200))
    number = Column(BigInteger())
    CCV = Column(Integer())
    expiration_date = Column(String(10))
    user_id = Column(Uuid, ForeignKey("user.id",ondelete="CASCADE"))

    user = relationship("User", back_populates="paymentDetails",cascade="all, delete")


class GuestList(Base):
    __tablename__ = "guestList"

    id = Column(Uuid, primary_key=True, index=True)
    order_id = Column(Uuid, ForeignKey("order.id", ondelete="CASCADE"))

    order = relationship("Order", back_populates="guest_list", cascade="all, delete")
    guest = relationship("Guest", back_populates="list", cascade="all, delete")


class Invoice(Base):
    __tablename__ = "Invoice"

    id = Column(Uuid, primary_key=True, index=True)

    invoice_nr = Column(String(100))
    created_at = Column(String(12))
    nip = Column(String(10))
    client_id = Column(Uuid, ForeignKey("user.id"))
    order_id = Column(Uuid, ForeignKey("order.id"))

    user = relationship("User", back_populates="invoices",cascade="all, delete")
    items = relationship("InvoiceItem", back_populates="invoice")
    order = relationship("Order", back_populates="invoice")


class InvoiceItem(Base):
    __tablename__ = "InvoiceItem"

    id = Column(Uuid, primary_key=True, index=True)
    name = Column(String(100))
    count = Column(BigInteger())
    price_per_item = Column(BigInteger())
    invoice_id = Column(Uuid, ForeignKey("Invoice.id"))

    invoice = relationship("Invoice", back_populates="items")


class Guest(Base):
    __tablename__ = "guest"

    id = Column(Uuid, primary_key=True, index=True)
    name = Column(String(100))
    surname = Column(String(200))
    table_number = Column(String(20))
    list_id = Column(Uuid, ForeignKey("guestList.id", ondelete="CASCADE"))

    list = relationship("GuestList", back_populates="guest")
