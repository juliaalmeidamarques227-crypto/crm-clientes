from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate

router = APIRouter()


# Cadastra um novo cliente
@router.post("/clientes")
def criar_cliente(
    cliente: ClienteCreate,
    db: Session = Depends(get_db)
):

    novo_cliente = Cliente(
        nome=cliente.nome,
        email=cliente.email,
        telefone=cliente.telefone
    )

    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)

    return novo_cliente

@router.get("/clientes")
def listar_clientes(db: Session = Depends(get_db)):

    clientes = db.query(Cliente).all()

    return clientes

@router.get("/clientes/{id}")
def buscar_cliente(id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if not cliente:
        return {"erro": "Cliente não encontrado"}

    return cliente


@router.put("/clientes/{id}")
def atualizar_cliente(
    id: int,
    cliente_atualizado: ClienteCreate,
    db: Session = Depends(get_db)
):

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if not cliente:
        return {"erro": "Cliente não encontrado"}

    cliente.nome = cliente_atualizado.nome
    cliente.email = cliente_atualizado.email
    cliente.telefone = cliente_atualizado.telefone

    db.commit()
    db.refresh(cliente)

    return {
        "mensagem": "Cliente atualizado com sucesso",
        "cliente": cliente
    }

@router.delete("/clientes/{id}")
def deletar_cliente(id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if not cliente:
        return {"erro": "Cliente não encontrado"}

    db.delete(cliente)
    db.commit()

    return {
        "mensagem": "Cliente deletado com sucesso"
    }

@router.get("/clientes/{id}/enderecos")
def listar_enderecos_cliente(id: int, db: Session = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if not cliente:
        return {"erro": "Cliente não encontrado"}

    return cliente.enderecos