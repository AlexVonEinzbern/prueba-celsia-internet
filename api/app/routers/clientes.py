from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.cliente import Cliente
from app.models.servicio import Servicio
from app.schemas.cliente import ClienteCreate, ClienteResponse

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post("", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    existe = db.query(Cliente).filter(
        Cliente.identificacion == cliente.identificacion
    ).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El cliente ya se encuentra registrado.",
        )

    nuevo_cliente = Cliente(**cliente.model_dump())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente


@router.get("", response_model=list[ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return (
        db.query(Cliente)
        .options(selectinload(Cliente.servicios))
        .order_by(Cliente.identificacion)
        .all()
    )


@router.get("/{identificacion}", response_model=ClienteResponse)
def obtener_cliente(identificacion: str, db: Session = Depends(get_db)):
    cliente = (
        db.query(Cliente)
        .options(selectinload(Cliente.servicios))
        .filter(Cliente.identificacion == identificacion)
        .first()
    )
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )
    return cliente


@router.put("/{identificacion}", response_model=ClienteResponse)
def actualizar_cliente(
    identificacion: str,
    cliente: ClienteCreate,
    db: Session = Depends(get_db),
):
    db_cliente = db.query(Cliente).filter(
        Cliente.identificacion == identificacion
    ).first()
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )
    if cliente.identificacion != identificacion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La identificación del cuerpo no coincide con la de la ruta.",
        )

    for campo, valor in cliente.model_dump().items():
        setattr(db_cliente, campo, valor)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente


@router.delete("/{identificacion}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cliente(identificacion: str, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(
        Cliente.identificacion == identificacion
    ).first()
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado.",
        )

    # El FK servicios->clientes no tiene ON DELETE CASCADE:
    # se eliminan los servicios asociados antes que el cliente.
    db.query(Servicio).filter(Servicio.identificacion == identificacion).delete()
    db.delete(db_cliente)
    db.commit()
    return None
