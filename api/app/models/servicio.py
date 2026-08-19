from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Servicio(Base):
    __tablename__ = "servicios"

    identificacion: Mapped[str] = mapped_column(
        String(20),
        ForeignKey(
            "clientes.identificacion",
            onupdate="CASCADE"
        ),
        primary_key=True
    )

    servicio: Mapped[str] = mapped_column(
        String(80),
        primary_key=True
    )

    fecha_inicio: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    ultima_facturacion: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    ultimo_pago: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )

    cliente: Mapped["Cliente"] = relationship(
        back_populates="servicios"
    )
