from pydantic import BaseModel


# Dados recebidos para criar um cliente
class ClienteCreate(BaseModel):
    nome: str
    email: str
    telefone: str


# Dados retornados pela API
class ClienteResponse(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str

    class Config:
        from_attributes = True