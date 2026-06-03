from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship

from app.database.database import Base


class Cliente(Base):

    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    telefone = Column(String(20))

    data_cadastro = Column(DateTime, default=datetime.utcnow)

    #RELACIONAMENTO 1:N
    enderecos = relationship("Endereco", back_populates="cliente")
