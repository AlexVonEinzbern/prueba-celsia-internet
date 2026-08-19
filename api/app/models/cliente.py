from datetime import date

from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    identificacion: Mapped[str] = mapped_column(
        String(20),
        primary_key=True
    )

    nombres: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )

    apellidos: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )

    tipo_identificacion: Mapped[str] = mapped_column(
        String(2),
        nullable=False
    )

    fecha_nacimiento: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    numero_celular: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    correo_electronico: Mapped[str] = mapped_column(
        String(80),
        nullable=False
    )

    servicios: Mapped[list["Servicio"]] = relationship(
        back_populates="cliente"
    )
