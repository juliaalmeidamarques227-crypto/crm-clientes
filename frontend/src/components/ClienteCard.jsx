export default function ClienteCard({ cliente }) {
    return (
        <div style={styles.card}>
            <h3 style={styles.name}>{cliente.nome}</h3>
            <p style={styles.text}>{cliente.email}</p>
            <p style={styles.text}>{cliente.telefone}</p>
        </div>
    );
}

const styles = {
    card: {
        background: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    name: {
        margin: "0 0 10px 0",
    },
    text: {
        margin: "5px 0",
        color: "#1f1b1b",
    }
};