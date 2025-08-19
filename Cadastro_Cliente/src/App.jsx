import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [idade, setIdade] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState("cadastro"); // Estado para controlar a página atual

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
    setPaginaAtual("cadastro"); // Redireciona para a página de cadastro ao editar
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

  // Renderizar conteúdo com base na página atual
  const renderizarConteudo = () => {
    switch (paginaAtual) {
      case "cadastro":
        return (
          <div className="pagina">
            <h1>Cadastro de Usuários</h1>
            <div className="formulario">
              <div className="input-form">
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
              </div>
              <button onClick={adicionarOuEditarUsuario}>
                {editIndex !== null ? "Atualizar" : "Adicionar"}
              </button>
              {erro && <p className="erro">{erro}</p>}
            </div>
          </div>
        );
      case "lista":
        return (
          <div className="pagina">
            <h1>Lista de Clientes</h1>
            <div className="filtro">
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            {usuariosFiltrados.length > 0 ? (
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
                        <button onClick={() => editarUsuario(index)}>
                          Editar
                        </button>
                        <button onClick={() => removerUsuario(index)}>
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="sem-dados">Nenhum cliente cadastrado.</p>
            )}
          </div>
        );
      case "promocoes":
        return (
          <div className="pagina">
            <h1>Promoções</h1>
            <div className="promocoes">
              <h2>Ofertas Especiais</h2>
              <div className="oferta">
                <h3>Desconto para Compras no PIX</h3>
                <p>
                  Clientes com pagamentos efetuados no PIX ganham 3% de desconto
                  em todos os serviços!
                </p>
              </div>
              <div className="oferta">
                <h3>Brinde ao Comprar</h3>
                <p>
                  Para clientes que comprar duas pizzas grandes recebe, um
                  refrigerante 2L.
                </p>
              </div>
              <div className="oferta">
                <h3>Cuidado Senior</h3>
                <p>
                  Clientes acima de 40 anos têm frete grátis para qualquer
                  endereço.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="App">
      <nav className="menu-superior">
        <ul>
          <li>
            <button
              className={paginaAtual === "cadastro" ? "ativo" : ""}
              onClick={() => setPaginaAtual("cadastro")}
            >
              Cadastro
            </button>
          </li>
          <li>
            <button
              className={paginaAtual === "lista" ? "ativo" : ""}
              onClick={() => setPaginaAtual("lista")}
            >
              Lista de Clientes
            </button>
          </li>
          <li>
            <button
              className={paginaAtual === "promocoes" ? "ativo" : ""}
              onClick={() => setPaginaAtual("promocoes")}
            >
              Promoções
            </button>
          </li>
        </ul>
      </nav>

      <div className="container">{renderizarConteudo()}</div>
    </div>
  );
}

export default App;
