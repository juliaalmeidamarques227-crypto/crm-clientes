export default function ClienteCard({
  cliente,
  removerCliente,
  editarCliente
}) {

  return (

    <div
      style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}
    >

      <div>
        <strong>
          👤 {cliente.nome}
        </strong>

        <p
          style={{
            color: "gray",
            marginTop: "5px"
          }}
        >
          {cliente.email}
        </p>
      </div>

      <div>

        <button
          onClick={() => editarCliente(cliente)}
          style={{
            marginRight: "10px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          editar
        </button>

        <button
          onClick={() => removerCliente(cliente.id)}
          style={{
            background: "red",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          remover
        </button>

      </div>

    </div>
  );
}