from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Endereco(Base):

    __tablename__ = "enderecos"

    id = Column(Integer, primary_key=True, index=True)

    rua = Column(String(100), nullable=False)
    numero = Column(Integer, nullable=False)
    cidade = Column(String(50), nullable=False)
    estado = Column(String(50), nullable=False)

    cliente_id = Column(Integer, ForeignKey("clientes.id"))

    cliente = relationship("Cliente", back_populates="enderecos")