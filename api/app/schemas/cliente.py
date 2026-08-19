from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.servicio import ServicioResponse


class ClienteBase(BaseModel):
    identificacion: str = Field(..., max_length=20)
    nombres: str = Field(..., max_length=80)
    apellidos: str = Field(..., max_length=80)

    tipo_identificacion: str = Field(
        ...,
        max_length=2,
        serialization_alias="tipoIdentificacion",
        validation_alias="tipoIdentificacion",
    )

    fecha_nacimiento: date = Field(
        ...,
        serialization_alias="fechaNacimiento",
        validation_alias="fechaNacimiento",
    )

    numero_celular: str = Field(
        ...,
        max_length=20,
        serialization_alias="numeroCelular",
        validation_alias="numeroCelular",
    )

    correo_electronico: EmailStr = Field(
        ...,
        serialization_alias="correoElectronico",
        validation_alias="correoElectronico",
    )

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class ClienteCreate(ClienteBase):
    pass


class ClienteResponse(ClienteBase):
    servicios: list[ServicioResponse] = Field(
        default_factory=list
    )
