import { useState, useEffect } from "react";
function App() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [idade, setIdade] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [busca, setBusca] = useState("");
  // Carregar usuários do localStorage ao iniciar
  useEffect(() => {
    const dados = localStorage.getItem("usuarios");
    if (dados) {
      setUsuarios(JSON.parse(dados));
    }
  }, []);
  // Atualizar localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);
  const adicionarOuEditarUsuario = () => {
    if (nome === "" || sobrenome === "" || idade === "") {
      setErro("Por favor, preencha todos os campos!");
      return;
    }
    if (isNaN(idade) || Number(idade) <= 0) {
      setErro("Digite uma idade válida!");
      return;
    }
    const usuario = { nome, sobrenome, idade: Number(idade) };

    if (editIndex !== null) {
      const novosUsuarios = [...usuarios];
      novosUsuarios[editIndex] = usuario;
      setUsuarios(novosUsuarios);
      setEditIndex(null);
    } else {
      setUsuarios([...usuarios, usuario]);
    }
    setNome("");
    setSobrenome("");
    setIdade("");
    setErro("");
  };
  const editarUsuario = (index) => {
    const usuario = usuarios[index];
    setNome(usuario.nome);
    setSobrenome(usuario.sobrenome);
    setIdade(usuario.idade);
    setEditIndex(index);
  };
  const removerUsuario = (index) => {
    const novosUsuarios = usuarios.filter((_, i) => i !== index);
    setUsuarios(novosUsuarios);
    if (editIndex === index) {
      setNome("");
      setSobrenome("");
      setIdade("");
      setEditIndex(null);
    }
  };
  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  );
  const corPorIdade = (idade) => {
    if (idade < 18) return "#f9c74f";
    if (idade <= 40) return "#90be6d";
    return "#f94144";
  };
  return (
    <div className="container">
      <h1>Cadastro de Usuários</h1>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Sobrenome"
        value={sobrenome}
        onChange={(e) => setSobrenome(e.target.value)}
      />
      <input
        type="number"
        placeholder="Idade"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
      />
      <button onClick={adicionarOuEditarUsuario}>
        {editIndex !== null ? "Atualizar" : "Adicionar"}
      </button>
      {erro && <p className="erro">{erro}</p>}
      <div className="filtro">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      {usuariosFiltrados.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sobrenome</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario, index) => (
              <tr
                key={index}
                style={{ backgroundColor: corPorIdade(usuario.idade) }}
              >
                <td>{usuario.nome}</td>
                <td>{usuario.sobrenome}</td>
                <td>{usuario.idade}</td>
                <td>
                  <button onClick={() => editarUsuario(index)}>Editar</button>
                  <button onClick={() => removerUsuario(index)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default App;
