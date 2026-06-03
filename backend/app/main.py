from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# rotas
from app.routes.clientes import router as clientes_router
from app.routes.enderecos import router as enderecos_router

# banco
from app.database.database import engine, Base

# Models (bem importante para criar tabelas)
from app.models import cliente
from app.models import endereco

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#  criando tabelas no banco automaticamente
Base.metadata.create_all(bind=engine)

# Inclui rotas
app.include_router(clientes_router)
app.include_router(enderecos_router)


@app.get("/")
def home():
    return {"mensagem": "CRM Clientes API"}