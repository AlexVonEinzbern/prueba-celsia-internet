from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cliente import Cliente
from app.models.servicio import Servicio
from app.schemas.servicio import ServicioBase, ServicioResponse

router = APIRouter(
    prefix="/clientes/{identificacion}/servicios",
    tags=["Servicios"],
)


def _validar_cliente_existe(db: Session, identificacion: str) -> None:
    cliente = db.query(Cliente).filter(
        Cliente.identificacion == identificacion
    ).first()
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )


def _obtener_servicio_o_404(
    db: Session,
    identificacion: str,
    servicio: str,
) -> Servicio:
    db_servicio = db.query(Servicio).filter(
        Servicio.identificacion == identificacion,
        Servicio.servicio == servicio,
    ).first()
    if not db_servicio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El cliente no tiene contratado este servicio.",
        )
    return db_servicio


@router.post("", response_model=ServicioResponse, status_code=status.HTTP_201_CREATED)
def asociar_servicio(
    identificacion: str,
    servicio: ServicioBase,
    db: Session = Depends(get_db),
):
    _validar_cliente_existe(db, identificacion)

    existe = db.query(Servicio).filter(
        Servicio.identificacion == identificacion,
        Servicio.servicio == servicio.servicio,
    ).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El cliente ya tiene contratado este servicio.",
        )

    nuevo_servicio = Servicio(
        identificacion=identificacion,
        **servicio.model_dump()
    )
    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)
    return nuevo_servicio


@router.get("", response_model=list[ServicioResponse])
def listar_servicios(identificacion: str, db: Session = Depends(get_db)):
    _validar_cliente_existe(db, identificacion)
    return (
        db.query(Servicio)
        .filter(Servicio.identificacion == identificacion)
        .order_by(Servicio.servicio)
        .all()
    )


@router.get("/{servicio}", response_model=ServicioResponse)
def obtener_servicio(
    identificacion: str,
    servicio: str,
    db: Session = Depends(get_db),
):
    _validar_cliente_existe(db, identificacion)
    return _obtener_servicio_o_404(db, identificacion, servicio)


@router.put("/{servicio}", response_model=ServicioResponse)
def actualizar_servicio(
    identificacion: str,
    servicio: str,
    datos: ServicioBase,
    db: Session = Depends(get_db),
):
    _validar_cliente_existe(db, identificacion)
    if datos.servicio != servicio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre del servicio del cuerpo no coincide con el de la ruta.",
        )

    db_servicio = _obtener_servicio_o_404(db, identificacion, servicio)
    for campo, valor in datos.model_dump().items():
        setattr(db_servicio, campo, valor)
    db.commit()
    db.refresh(db_servicio)
    return db_servicio


@router.delete("/{servicio}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(
    identificacion: str,
    servicio: str,
    db: Session = Depends(get_db),
):
    _validar_cliente_existe(db, identificacion)
    db_servicio = _obtener_servicio_o_404(db, identificacion, servicio)
    db.delete(db_servicio)
    db.commit()
    return None
