from pydantic import BaseModel


class EnderecoCreate(BaseModel):
    rua: str
    numero: int
    cidade: str
    estado: str
    cliente_id: int