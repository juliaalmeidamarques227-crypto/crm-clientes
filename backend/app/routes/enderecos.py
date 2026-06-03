from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.endereco import Endereco
from app.schemas.endereco import EnderecoCreate

router = APIRouter()


@router.post("/enderecos")
def criar_endereco(endereco: EnderecoCreate, db: Session = Depends(get_db)):

    novo_endereco = Endereco(
        rua=endereco.rua,
        numero=endereco.numero,
        cidade=endereco.cidade,
        estado=endereco.estado,
        cliente_id=endereco.cliente_id
    )

    db.add(novo_endereco)
    db.commit()
    db.refresh(novo_endereco)

    return {
        "mensagem": "Endereço criado com sucesso"
    }


@router.put("/enderecos/{id}")
def atualizar_endereco(
    id: int,
    endereco_atualizado: EnderecoCreate,
    db: Session = Depends(get_db)
):

    endereco = db.query(Endereco).filter(Endereco.id == id).first()

    if not endereco:
        return {"erro": "Endereço não encontrado"}

    endereco.rua = endereco_atualizado.rua
    endereco.numero = endereco_atualizado.numero
    endereco.cidade = endereco_atualizado.cidade
    endereco.estado = endereco_atualizado.estado

    db.commit()
    db.refresh(endereco)

    return {
        "mensagem": "Endereço atualizado com sucesso",
        "endereco": endereco
    }


@router.delete("/enderecos/{id}")
def deletar_endereco(
    id: int,
    db: Session = Depends(get_db)
):

    endereco = db.query(Endereco).filter(Endereco.id == id).first()

    if not endereco:
        return {"erro": "Endereço não encontrado"}

    db.delete(endereco)
    db.commit()

    return {
        "mensagem": "Endereço deletado com sucesso"
    }