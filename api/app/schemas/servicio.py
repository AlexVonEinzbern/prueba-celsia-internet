from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class ServicioBase(BaseModel):
    servicio: str = Field(
        ...,
        max_length=80
    )

    fecha_inicio: date = Field(
        ...,
        serialization_alias="fechaInicio",
        validation_alias="fechaInicio"
    )

    ultima_facturacion: date = Field(
        ...,
        serialization_alias="ultimaFacturacion",
        validation_alias="ultimaFacturacion"
    )

    ultimo_pago: int = Field(
        default=0,
        ge=0,
        serialization_alias="ultimoPago",
        validation_alias="ultimoPago"
    )

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )


class ServicioResponse(ServicioBase):
    identificacion: str = Field(..., max_length=20)

