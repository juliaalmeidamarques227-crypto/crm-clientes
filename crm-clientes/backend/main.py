from fastapi import FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, SessionLocal
from models import Cliente

# cria tabelas no banco (se não existirem)
Base.metadata.create_all(bind=engine)

app = FastAPI()

# libera acesso do React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🔹 CREATE (adicionar cliente)
# =========================
@app.post("/clientes")
def criar_cliente(cliente: dict):
    db = SessionLocal()

    novo = Cliente(
        nome=cliente["nome"],
        email=cliente["email"]
    )

    db.add(novo)
    db.commit()
    db.refresh(novo)

    db.close()

    return {"msg": "cliente criado", "cliente": cliente}


# =========================
# 🔹 READ (listar clientes)
# =========================
@app.get("/clientes")
def listar_clientes():
    db = SessionLocal()

    clientes = db.query(Cliente).all()

    db.close()

    return clientes


# =========================
# 🔹 DELETE (remover cliente)
# =========================
@app.delete("/clientes/{id}")
def deletar_cliente(id: int):
    db = SessionLocal()

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if cliente:
        db.delete(cliente)
        db.commit()

    db.close()

    return {"msg": "cliente removido"}

    # =========================
# 🔹 UPDATE (editar cliente)
# =========================
@app.put("/clientes/{id}")
def editar_cliente(id: int, cliente: dict):

    db = SessionLocal()

    cliente_db = db.query(Cliente).filter(Cliente.id == id).first()

    if cliente_db:
        cliente_db.nome = cliente["nome"]
        cliente_db.email = cliente["email"]

        db.commit()

    db.close()

    return {"msg": "cliente atualizado"}