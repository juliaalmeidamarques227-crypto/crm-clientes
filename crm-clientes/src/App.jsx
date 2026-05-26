import { useEffect, useState } from "react";
import ClienteCard from "./components/ClienteCard";

export default function App() {

  // ===== estados =====
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pagina, setPagina] = useState("clientes");

  // ===== carregar clientes =====
  useEffect(() => {
    fetch("http://127.0.0.1:8000/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  // ===== adicionar cliente =====
  function adicionarCliente() {

    if (!nome || !email) {
      alert("preencha os campos");
      return;
    }

    fetch("http://127.0.0.1:8000/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email
      })
    })
      .then(() => {
        return fetch("http://127.0.0.1:8000/clientes");
      })
      .then((res) => res.json())
      .then((data) => {

        setClientes(data);

        setNome("");
        setEmail("");
      });
  }

  // ===== remover cliente =====
  function removerCliente(id) {

    fetch(`http://127.0.0.1:8000/clientes/${id}`, {
      method: "DELETE"
    })
      .then(() => {

        const novaLista = clientes.filter(
          (cliente) => cliente.id !== id
        );

        setClientes(novaLista);
      });
  }

  // ===== editar cliente =====
  function editarCliente(cliente) {

    const novoNome = window.prompt(
      "Novo nome:",
      cliente.nome
    );

    const novoEmail = window.prompt(
      "Novo email:",
      cliente.email
    );

    if (!novoNome || !novoEmail) return;

    fetch(`http://127.0.0.1:8000/clientes/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: novoNome,
        email: novoEmail
      })
    })
      .then(() => {

        const novaLista = clientes.map((c) => {

          if (c.id === cliente.id) {
            return {
              ...c,
              nome: novoNome,
              email: novoEmail
            };
          }

          return c;
        });

        setClientes(novaLista);
      });
  }

  return (

    <div
      style={{
        display: "flex",
        fontFamily: "Arial"
      }}
    >

      {/* ===== MENU ===== */}
      <div
        style={{
          width: "220px",
          height: "100vh",
          background: "#111827",
          color: "#fff",
          padding: "20px"
        }}
      >

        <h2>CRM</h2>

        <p
          style={{
            cursor: "pointer",
            marginTop: "20px"
          }}
          onClick={() => setPagina("clientes")}
        >
          👤 Clientes
        </p>

        <p
          style={{
            cursor: "pointer"
          }}
          onClick={() => setPagina("dashboard")}
        >
          📊 Dashboard
        </p>

      </div>

      {/* ===== CONTEÚDO ===== */}
      <div
        style={{
          padding: "30px",
          width: "100%",
          background: "#f3f4f6",
          minHeight: "100vh"
        }}
      >

        {/* ===== DASHBOARD ===== */}
        {pagina === "dashboard" && (

          <>
            <h1>📊 Dashboard</h1>

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                marginTop: "20px",
                width: "250px"
              }}
            >

              <h3>Total de clientes</h3>

              <p
                style={{
                  fontSize: "30px",
                  fontWeight: "bold"
                }}
              >
                {clientes.length}
              </p>

            </div>
          </>
        )}

        {/* ===== CLIENTES ===== */}
        {pagina === "clientes" && (

          <>
            <h1>👤 Clientes</h1>

            {/* inputs */}
            <div
              style={{
                marginBottom: "20px",
                marginTop: "20px"
              }}
            >

              <input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />

              <button
                onClick={adicionarCliente}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                adicionar
              </button>

            </div>

            {/* lista clientes */}
            {clientes.map((cliente) => (

              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                removerCliente={removerCliente}
                editarCliente={editarCliente}
              />

            ))}

          </>
        )}

      </div>
    </div>
  );
}