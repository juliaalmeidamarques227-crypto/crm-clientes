import { useEffect, useState } from "react";
import api from "../services/api";

function Clientes() {
    const [clientes, setClientes] = useState([]);

 // Cliente selecionado
const [clienteAtivo, setClienteAtivo] = useState(null);
const [enderecos, setEnderecos] = useState([]);

// Cadastro de cliente
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [telefone, setTelefone] = useState("");

// Edição de cliente
const [modoEdicao, setModoEdicao] = useState(false);
const [nomeEdicao, setNomeEdicao] = useState("");
const [emailEdicao, setEmailEdicao] = useState("");
const [telefoneEdicao, setTelefoneEdicao] = useState("");

// Cadastro de endereço
const [rua, setRua] = useState("");
const [numero, setNumero] = useState("");
const [cidade, setCidade] = useState("");
const [estadoUf, setEstadoUf] = useState("");

// Edição de endereço
const [enderecoEditando, setEnderecoEditando] = useState(null);
const [ruaEdicao, setRuaEdicao] = useState("");
const [numeroEdicao, setNumeroEdicao] = useState("");
const [cidadeEdicao, setCidadeEdicao] = useState("");
const [estadoEdicao, setEstadoEdicao] = useState("");

// Busca todos os clientes ao abrir a página
    useEffect(() => {
        carregarClientes();
    }, []);



    async function carregarClientes() {
        try {
            const res = await api.get("/clientes");
            setClientes(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function criarCliente(e) {
        e.preventDefault();

        if (!nome || !email || !telefone) return;

        try {
            await api.post("/clientes", {
    nome,
    email,
    telefone
});

carregarClientes();

            setNome("");
            setEmail("");
            setTelefone("");
        } catch (err) {
            console.log(err);
        }
    }
    async function deletarEndereco(id) {
    try {
        await api.delete(`/enderecos/${id}`);

        carregarEnderecos(clienteAtivo.id);

    } catch (err) {
        console.log(err);
    }
}
    async function deletarCliente(id) {
        try {
            await api.delete(`/clientes/${id}`);

            setClientes((prev) => prev.filter((c) => c.id !== id));

            if (clienteAtivo?.id === id) {
                setClienteAtivo(null);
                setEnderecos([]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    function abrirCliente(cliente) {
        setClienteAtivo(cliente);
        carregarEnderecos(cliente.id);
    }

    async function carregarEnderecos(clienteId) {
        try {
            const res = await api.get(`/clientes/${clienteId}/enderecos`);
            setEnderecos(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function criarEndereco() {
        if (!clienteAtivo) return;
        if (!rua || !numero || !cidade || !estadoUf) return;

        try {
            await api.post("/enderecos", {
                rua,
                numero,
                cidade,
                estado: estadoUf,
                cliente_id: clienteAtivo.id
            });

            carregarEnderecos(clienteAtivo.id);

            setRua("");
            setNumero("");
            setCidade("");
            setEstadoUf("");
        } catch (err) {
            console.log(err);
        }
    }
    function iniciarEdicao() {
    if (!clienteAtivo) return;

    setNomeEdicao(clienteAtivo.nome);
    setEmailEdicao(clienteAtivo.email);
    setTelefoneEdicao(clienteAtivo.telefone);

    setModoEdicao(true);
}

async function salvarEdicao() {
    try {
        await api.put(`/clientes/${clienteAtivo.id}`, {
            nome: nomeEdicao,
            email: emailEdicao,
            telefone: telefoneEdicao
        });

        setClientes((prev) =>
            prev.map((c) =>
                c.id === clienteAtivo.id
                    ? {
                        ...c,
                        nome: nomeEdicao,
                        email: emailEdicao,
                        telefone: telefoneEdicao
                    }
                    : c
            )
        );

        setClienteAtivo({
            ...clienteAtivo,
            nome: nomeEdicao,
            email: emailEdicao,
            telefone: telefoneEdicao
        });

        setModoEdicao(false);

    } catch (err) {
        console.log(err);
    }
}

function iniciarEdicaoEndereco(endereco) {

    setEnderecoEditando(endereco);

    setRuaEdicao(endereco.rua);
    setNumeroEdicao(endereco.numero);
    setCidadeEdicao(endereco.cidade);
    setEstadoEdicao(endereco.estado);
}
async function salvarEdicaoEndereco() {

    try {

        await api.put(`/enderecos/${enderecoEditando.id}`, {
            rua: ruaEdicao,
            numero: numeroEdicao,
            cidade: cidadeEdicao,
            estado: estadoEdicao,
            cliente_id: clienteAtivo.id
        });

        carregarEnderecos(clienteAtivo.id);

        setEnderecoEditando(null);

    } catch (err) {
        console.log(err);
    }
}
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>CRM de Clientes</h1>

            {/* FORM */}
            <form onSubmit={criarCliente} style={styles.form}>
                <input style={styles.input} placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                <input style={styles.input} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input style={styles.input} placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

                <button style={styles.addBtn}>Cadastrar</button>
            </form>

            <div style={styles.layout}>

                {/* LISTA */}
                <div style={styles.left}>
                    <h3 style={styles.subtitle}>Clientes</h3>

                    {clientes.map((c) => (
                        <div key={c.id} style={styles.card}>
                            <h4 style={styles.cardTitle}>{c.nome}</h4>
                            <p style={styles.text}>{c.email}</p>

                            <div style={styles.actions}>
                                <button style={styles.viewBtn} onClick={() => abrirCliente(c)}>
                                    Abrir
                                </button>

                                <button style={styles.deleteBtn} onClick={() => deletarCliente(c.id)}>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DETALHE */}
                <div style={styles.right}>
                    {clienteAtivo ? (
                        <>
                            <h2 style={styles.titleBox}>{clienteAtivo.nome}</h2>
                            <p style={styles.text}>{clienteAtivo.email}</p>
                            <p style={styles.text}>{clienteAtivo.telefone}</p>
                            <button
                            style={styles.viewBtn}
                            onClick={iniciarEdicao}
                        >
                            Editar Cliente
                        </button>
                        {modoEdicao && (
    <div style={{ marginTop: "15px" }}>

        <input
            style={styles.inputDark}
            value={nomeEdicao}
            onChange={(e) => setNomeEdicao(e.target.value)}
        />

        <input
            style={styles.inputDark}
            value={emailEdicao}
            onChange={(e) => setEmailEdicao(e.target.value)}
        />

        <input
            style={styles.inputDark}
            value={telefoneEdicao}
            onChange={(e) => setTelefoneEdicao(e.target.value)}
        />

        <button
            style={styles.addBtn}
            onClick={salvarEdicao}
        >
            Salvar Alterações
        </button>
    </div>
)}
                            <hr style={styles.hr} />

                            <h3>Endereços</h3>

                            {enderecos.length === 0 ? (
                                <p style={styles.text}>Nenhum endereço</p>
                            ) : (
                               enderecos.map((e) => (
    <div key={e.id} style={{ marginBottom: "10px" }}>

        <p style={styles.text}>
            {e.rua}, {e.numero} - {e.cidade}/{e.estado}
        </p>

<button
    style={styles.viewBtn}
    onClick={() => iniciarEdicaoEndereco(e)}
>
    Editar
</button>
        <button
            style={styles.deleteBtn}
            onClick={() => deletarEndereco(e.id)}
        >
            Excluir
        </button>

    </div>
))
                            )}
                            {enderecoEditando && (
    <div>

        <h4>Editar endereço</h4>

        <input
            style={styles.inputDark}
            value={ruaEdicao}
            onChange={(e) => setRuaEdicao(e.target.value)}
        />

        <input
            style={styles.inputDark}
            value={numeroEdicao}
            onChange={(e) => setNumeroEdicao(e.target.value)}
        />

        <input
            style={styles.inputDark}
            value={cidadeEdicao}
            onChange={(e) => setCidadeEdicao(e.target.value)}
        />

        <input
            style={styles.inputDark}
            value={estadoEdicao}
            onChange={(e) => setEstadoEdicao(e.target.value)}
        />

        <button
            style={styles.addBtn}
            onClick={salvarEdicaoEndereco}
        >
            Salvar Endereço
        </button>

        <hr style={styles.hr} />
    </div>
)}
                            <hr style={styles.hr} />

                            <h4>Novo endereço</h4>

                            <input style={styles.inputDark} placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} />
                            <input style={styles.inputDark} placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
                            <input style={styles.inputDark} placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                            <input style={styles.inputDark} placeholder="Estado" value={estadoUf} onChange={(e) => setEstadoUf(e.target.value)} />

                            <button style={styles.addBtn} onClick={criarEndereco}>
                                Adicionar endereço
                            </button>
                        </>
                    ) : (
                        <p style={styles.text}>Selecione um cliente</p>
                    )}
                </div>

            </div>
        </div>
    );
}

/* ===== DARK STYLE ===== */
const styles = {
    container: {
        padding: "30px",
        fontFamily: "Arial",
        background: "#091e6a",
        minHeight: "100vh",
        color: "#fff"
    },

    title: {
        textAlign: "center",
        marginBottom: "20px"
    },

    subtitle: {
        marginBottom: "10px"
    },

    form: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "20px"
    },

    layout: {
        display: "flex",
        gap: "20px"
    },

    left: {
        width: "40%"
    },

    right: {
        width: "60%",
        background: "#355383",
        padding: "20px",
        borderRadius: "10px"
    },

    card: {
        background: "#959ba6",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "10px"
    },

    cardTitle: {
        margin: "0 0 5px 0"
    },

    text: {
        color: "#e5ebef"
    },

    actions: {
        display: "flex",
        gap: "5px",
        marginTop: "10px"
    },

    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        outline: "none"
    },

    inputDark: {
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#08132a",
        color: "#ece6e6",
        marginBottom: "5px",
        width: "100%"
    },

    addBtn: {
        background: "#22c55e",
        color: "#000",
        border: "none",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "5px"
    },

    viewBtn: {
        background: "#3b82f6",
        color: "#fff",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    deleteBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    titleBox: {
        marginBottom: "12px"
    },

    hr: {
        border: "1px solid #334155",
        margin: "15px 0"
    }
};

export default Clientes;