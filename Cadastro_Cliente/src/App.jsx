import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const validarNome = /^[a-zA-ZÀ-ú\s]+$/;
  const validarIdade = /^[\d\s]+$/;
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [idade, setIdade] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState("cadastro");

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
    if (isNaN(idade) || Number(idade) <= 0 || !validarIdade.test(idade)) {
      setErro("Digite uma idade válida!");
      return;
    }

    if (!validarNome.test(nome) || !validarNome.test(sobrenome)) {
      setErro("Digite apenas letras nos campos de nome e sobrenome!");
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
    setPaginaAtual("cadastro");
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
    if (idade < 18) return "#FFE082"; // Amarelo claro - mais jovem
    if (idade <= 40) return "#A5D6A7"; // Verde claro - adulto
    return "#EF9A9A"; // Vermelho claro - mais experiente
  };

  // Renderizar conteúdo com base na página atual
  const renderizarConteudo = () => {
    switch (paginaAtual) {
      case "cadastro":
        return (
          <div className="pagina">
            <h1>
              <span className="pizza-icon">🍕</span> Cadastro de Clientes
            </h1>
            <div className="formulario">
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
                {editIndex !== null ? "Atualizar Cliente" : "Adicionar Cliente"}
              </button>
              {erro && <p className="erro">{erro}</p>}
            </div>
          </div>
        );
      case "lista":
        return (
          <div className="pagina">
            <h1>
              <span className="pizza-icon">🍕</span> Lista de Clientes
            </h1>
            <div className="filtro">
              <input
                type="text"
                placeholder="Buscar cliente por nome..."
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
            <h1>
              <span className="pizza-icon">🍕</span> Promoções Especiais
            </h1>
            <div className="promocoes">
              <h2>Ofertas da Pizzaria</h2>
              <div className="oferta">
                <h3>🍕 Pizza Jovem (menores de 18 anos)</h3>
                <p>
                  15% de desconto em qualquer pizza média + refrigerante grátis!
                </p>
              </div>
              <div className="oferta">
                <h3>🍕 Pizza Família (18-40 anos)</h3>
                <p>
                  Pizza grande com borda recheada + 2 refrigerantes por apenas
                  R$ 49,90.
                </p>
              </div>
              <div className="oferta">
                <h3>🍕 Pizza Sênior (maiores de 40 anos)</h3>
                <p>
                  Toda terça-feira: pizza grande com 30% de desconto + sobremesa
                  grátis!
                </p>
              </div>
              <div className="oferta destaque">
                <h3>⭐ Oferta Especial da Casa</h3>
                <p>
                  Todo cliente cadastrado ganha 10% de desconto na primeira
                  compra!
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
        <div className="logo">
          <span className="pizza-icon">🍕</span> Pizzaria Bella Senai
        </div>
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
              Clientes
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
