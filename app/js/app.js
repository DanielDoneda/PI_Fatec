// ---------- PROTEÇÃO GLOBAL ----------
function id(x) { return document.getElementById(x); }
function qs(x) { return document.querySelector(x); }
function qsa(x) { return document.querySelectorAll(x); }

//-----------------------------------------------------------
// 1) MOSTRAR O NOME DO USUÁRIO NO TOPO (login)
//-----------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const elementoNome = document.getElementById("nomeUsuarioTop");

    if (elementoNome) {
        const nomeSalvo = localStorage.getItem("usuario") || "Visitante";
        elementoNome.innerText = nomeSalvo;
    }

    //-----------------------------------------------------------
    // 2) ATIVAR O MENU LATERAL (inclui abrir grupo automaticamente)
    //-----------------------------------------------------------

    const paginaAtual = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".sidebar-menu a");

    links.forEach(link => {
        const href = link.getAttribute("href");

        if (href === paginaAtual) {
            link.classList.add("active");

            // Abre o grupo se o item estiver dentro de collapse
            const submenu = link.closest(".collapse");
            if (submenu) {
                submenu.classList.add("show");
            }
        }
    });

});


// ---------------------------------------------------------
// 3) CLIENTES — APENAS SE A PÁGINA TIVER ESSA ÁREA
// ---------------------------------------------------------

if (id("listaClientes")) {

    const clientesBase = [
        { nome: "Empresa XPTO", doc: "12.345.678/0001-99", email: "contato@xpto.com", tel: "(11) 99876-5432" }
    ];

    function preencherClientes() {
        id("listaClientes").innerHTML = "";
        clientesBase.forEach((c, index) => {
            id("listaClientes").innerHTML += `
                <tr>
                    <td>${c.nome}</td>
                    <td>${c.doc}</td>
                    <td>${c.email}</td>
                    <td>${c.tel}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirCliente(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
    }

    window.salvarCliente = function () {
        clientesBase.push({
            nome: id("clienteNome").value,
            doc: id("clienteDoc").value,
            email: id("clienteEmail").value,
            tel: id("clienteTel").value
        });
        preencherClientes();
    };

    window.excluirCliente = function (index) {
        clientesBase.splice(index, 1);
        preencherClientes();
    };

    preencherClientes();
}

// ---------------------------------------------------------
// 4) USUÁRIOS — APENAS SE A PÁGINA TIVER ESSA ÁREA
// ---------------------------------------------------------

if (id("listaUsuarios")) {

    const usuariosBase = [
        { nome: "João Silva", email: "joao@empresa.com", funcao: "Administrador" },
        { nome: "Maria Costa", email: "maria@empresa.com", funcao: "Operador" }
    ];

    function preencherUsuarios() {
        id("listaUsuarios").innerHTML = "";
        usuariosBase.forEach((u, index) => {
            id("listaUsuarios").innerHTML += `
                <tr>
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.funcao}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirUsuario(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
    }

    window.salvarUsuario = function () {
        usuariosBase.push({
            nome: id("userNome").value,
            email: id("userEmail").value,
            funcao: id("userFuncao").value
        });
        preencherUsuarios();
    };

    window.excluirUsuario = function (index) {
        usuariosBase.splice(index, 1);
        preencherUsuarios();
    };

    preencherUsuarios();
}

// ---------------------------------------------------------
// 5) GRÁFICO DO DASHBOARD — APENAS NA DASHBOARD
// ---------------------------------------------------------

if (id("graficoNotas")) {
    const ctx = id("graficoNotas").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1029", "1028", "1027", "1026"],
            datasets: [{
                label: "Valor (R$)",
                data: [1280, 600, 48, 3200],
                backgroundColor: "rgba(56,115,115,0.7)",
                borderRadius: 8
            }]
        },
        options: { responsive: true }
    });
}

// ------------------------------
// NF-e – Gerenciamento de Itens
// ------------------------------
let itensNFe = [];

function adicionarItemNFe() {
    let nome = document.getElementById("itemNome").value.trim();
    let qtd = parseFloat(document.getElementById("itemQtd").value);
    let valor = parseFloat(document.getElementById("itemValor").value);

    if (!nome || qtd <= 0 || valor <= 0) {
        alert("Preencha todos os campos do item!");
        return;
    }

    itensNFe.push({
        nome,
        qtd,
        valor,
        total: qtd * valor
    });

    atualizarTabelaNFe();
}

function atualizarTabelaNFe() {
    const tbody = document.getElementById("tabelaItensNFe");
    const totalSpan = document.getElementById("nfeTotal");

    if (!tbody) return; // página não é NF-e

    tbody.innerHTML = "";

    let totalNota = 0;

    itensNFe.forEach((item, i) => {
        totalNota += item.total;

        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.qtd}</td>
                <td>R$ ${item.valor.toFixed(2)}</td>
                <td>R$ ${item.total.toFixed(2)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-danger" onclick="removerItemNFe(${i})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    totalSpan.textContent = "R$ " + totalNota.toFixed(2);
}

function removerItemNFe(index) {
    itensNFe.splice(index, 1);
    atualizarTabelaNFe();
}

// ------------------------------
// Emitir NF-e (protótipo)
// ------------------------------
function emitirNFe() {
    if (itensNFe.length === 0) {
        alert("Adicione pelo menos 1 item!");
        return;
    }

    alert("NF-e emitida com sucesso! (protótipo)");
}

// =========================
// NFS-e — Cálculos e Emissão
// =========================

function calcularNFS() {
    let valor = parseFloat(document.getElementById("nfs_servico_valor").value) || 0;
    let aliquota = parseFloat(document.getElementById("nfs_servico_aliquota").value) || 0;

    let base = valor;
    let iss = (valor * aliquota) / 100;
    let total = valor;

    document.getElementById("nfs_base").value = base.toFixed(2);
    document.getElementById("nfs_valor_iss").value = iss.toFixed(2);
    document.getElementById("nfs_total").value = total.toFixed(2);
}

// recalcula automaticamente
["nfs_servico_valor", "nfs_servico_aliquota"].forEach(id => {
    let input = document.getElementById(id);
    if (input) {
        input.addEventListener("input", calcularNFS);
    }
});

function emitirNFS() {
    alert("NFS-e emitida com sucesso! (protótipo)");
}

// =====================
// NFC-e — Lógica do Formulário
// =====================

let nfceItens = [];

function nfceAdicionarItem() {
    const produto = document.getElementById("nfceProduto").value;
    const qtd = parseFloat(document.getElementById("nfceQtd").value);
    const valor = parseFloat(document.getElementById("nfceValor").value);
    const ncm = document.getElementById("nfceNCM").value;

    if (!produto || qtd <= 0 || valor <= 0) {
        alert("Preencha os campos de produto, quantidade e valor.");
        return;
    }

    nfceItens.push({
        produto,
        qtd,
        valor,
        ncm,
        total: qtd * valor
    });

    nfceAtualizarTabela();
    nfceCalcularTotal();

    document.getElementById("nfceProduto").value = "";
    document.getElementById("nfceQtd").value = 1;
    document.getElementById("nfceValor").value = 0;
    document.getElementById("nfceNCM").value = "";
}

function nfceAtualizarTabela() {
    const tbody = document.getElementById("nfceTabelaItens");
    tbody.innerHTML = "";

    nfceItens.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.produto}</td>
                <td>${item.qtd}</td>
                <td>R$ ${item.valor.toFixed(2)}</td>
                <td>R$ ${item.total.toFixed(2)}</td>
                <td>${item.ncm}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-danger" onclick="nfceRemoverItem(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function nfceRemoverItem(index) {
    nfceItens.splice(index, 1);
    nfceAtualizarTabela();
    nfceCalcularTotal();
}

function nfceCalcularTotal() {
    const subtotal = nfceItens.reduce((acc, item) => acc + item.total, 0);
    const desconto = parseFloat(document.getElementById("nfceDesconto").value) || 0;

    document.getElementById("nfceSubtotal").value = "R$ " + subtotal.toFixed(2);
    document.getElementById("nfceTotal").value = "R$ " + (subtotal - desconto).toFixed(2);
}

function nfceEmitir() {
    if (nfceItens.length === 0) {
        alert("Adicione pelo menos um item.");
        return;
    }

    alert("NFC-e emitida com sucesso! (modo protótipo)");
}

function emitirCTe() {

    const tipo = document.getElementById("cteTipo").value;
    const natureza = document.getElementById("cteNatureza").value;
    const cfop = document.getElementById("cteCfop").value;

    const remetente = document.getElementById("cteRemetente").value;
    const destinatario = document.getElementById("cteDestinatario").value;
    const tomador = document.getElementById("cteTomador").value;

    const produto = document.getElementById("cteProduto").value;
    const valorCarga = document.getElementById("cteValorCarga").value;
    const peso = document.getElementById("ctePeso").value;

    const modal = document.getElementById("cteModal").value;
    const ufInicio = document.getElementById("cteUFInicio").value;
    const ufDestino = document.getElementById("cteUFDestino").value;

    // validação simples
    if (!tipo || !cfop || !remetente || !destinatario) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    alert("CT-e emitido com sucesso! (protótipo)");
}

// ---- MDF-e: gerenciamento de documentos e veículos ----
document.addEventListener("DOMContentLoaded", () => {

  // Helpers: selectors
  const tabelaDocumentos = document.getElementById("tabelaDocumentos");
  const tabelaVeiculos = document.getElementById("tabelaVeiculos");

  // Buttons / modals
  const btnAddDoc = document.getElementById("btnAddDoc");
  const btnAddVeic = document.getElementById("btnAddVeic");
  const btnLimparDocs = document.getElementById("btnLimparDocs");
  const btnLimparVeiculos = document.getElementById("btnLimparVeiculos");
  const btnSalvarMdfe = document.getElementById("btnSalvarMdfe");

  // Input fields (document modal)
  const docTipo = document.getElementById("docTipo");
  const docNumero = document.getElementById("docNumero");
  const docCliente = document.getElementById("docCliente");
  const docValor = document.getElementById("docValor");

  // Input fields (veiculo modal)
  const veicPlaca = document.getElementById("veicPlaca");
  const veicUF = document.getElementById("veicUF");
  const veicTransportadora = document.getElementById("veicTransportadora");
  const veicMotorista = document.getElementById("veicMotorista");

  // Arrays em memoria / localStorage
  let documentos = JSON.parse(localStorage.getItem("mdfe_documentos")) || [];
  let veiculos = JSON.parse(localStorage.getItem("mdfe_veiculos")) || [];

  // Funções para renderizar tabelas
  function renderDocumentos() {
    tabelaDocumentos.innerHTML = "";
    documentos.forEach((d, i) => {
      tabelaDocumentos.insertAdjacentHTML("beforeend", `
        <tr data-index="${i}">
          <td>${d.tipo}</td>
          <td>${escapeHtml(d.numero)}</td>
          <td>${escapeHtml(d.cliente)}</td>
          <td>R$ ${Number(d.valor).toFixed(2)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger btn-excluir-doc">Remover</button>
          </td>
        </tr>
      `);
    });
  }

  function renderVeiculos() {
    tabelaVeiculos.innerHTML = "";
    veiculos.forEach((v, i) => {
      tabelaVeiculos.insertAdjacentHTML("beforeend", `
        <tr data-index="${i}">
          <td>${escapeHtml(v.placa)}</td>
          <td>${escapeHtml(v.uf)}</td>
          <td>${escapeHtml(v.transportadora)}</td>
          <td>${escapeHtml(v.motorista)}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-danger btn-excluir-veic">Remover</button>
          </td>
        </tr>
      `);
    });
  }

  // Save to localStorage
  function persistir() {
    localStorage.setItem("mdfe_documentos", JSON.stringify(documentos));
    localStorage.setItem("mdfe_veiculos", JSON.stringify(veiculos));
  }

  // Escapar HTML (simples)
  function escapeHtml(str = "") {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // Adicionar Documento
  btnAddDoc && btnAddDoc.addEventListener("click", () => {
    const tipo = docTipo.value;
    const numero = docNumero.value.trim();
    const cliente = docCliente.value.trim();
    const valor = parseFloat(docValor.value || 0);

    if (!numero) {
      alert("Informe o número/chave do documento.");
      return;
    }

    documentos.push({ tipo, numero, cliente, valor });
    persistir();
    renderDocumentos();

    // limpa modal e fecha
    docNumero.value = "";
    docCliente.value = "";
    docValor.value = "";
    // fecha modal bootstrap
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddDocumento"));
    modal && modal.hide();
  });

  // Adicionar Veículo
  btnAddVeic && btnAddVeic.addEventListener("click", () => {
    const placa = veicPlaca.value.trim();
    const uf = veicUF.value.trim();
    const transportadora = veicTransportadora.value.trim();
    const motorista = veicMotorista.value.trim();

    if (!placa) {
      alert("Informe a placa do veículo.");
      return;
    }

    veiculos.push({ placa, uf, transportadora, motorista });
    persistir();
    renderVeiculos();

    veicPlaca.value = "";
    veicUF.value = "";
    veicTransportadora.value = "";
    veicMotorista.value = "";

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddVeiculo"));
    modal && modal.hide();
  });

  // Delegation: remover documento
  tabelaDocumentos.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("btn-excluir-doc")) {
      const row = ev.target.closest("tr");
      const idx = Number(row.dataset.index);
      if (confirm("Remover documento?")) {
        documentos.splice(idx, 1);
        persistir();
        renderDocumentos();
      }
    }
  });

  // Delegation: remover veículo
  tabelaVeiculos.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("btn-excluir-veic")) {
      const row = ev.target.closest("tr");
      const idx = Number(row.dataset.index);
      if (confirm("Remover veículo?")) {
        veiculos.splice(idx, 1);
        persistir();
        renderVeiculos();
      }
    }
  });

  // Limpar listas
  btnLimparDocs && btnLimparDocs.addEventListener("click", () => {
    if (confirm("Remover todos os documentos vinculados?")) {
      documentos = [];
      persistir();
      renderDocumentos();
    }
  });

  btnLimparVeiculos && btnLimparVeiculos.addEventListener("click", () => {
    if (confirm("Remover todos os veículos?")) {
      veiculos = [];
      persistir();
      renderVeiculos();
    }
  });

  // Salvar MDF-e (monta objeto e salva em localStorage 'mdfe_salvos' como array)
  btnSalvarMdfe && btnSalvarMdfe.addEventListener("click", () => {
    const mdfe = {
      numero: document.getElementById("mdfeNumero").value.trim(),
      data: document.getElementById("mdfeData").value,
      emitente: document.getElementById("mdfeEmitente").value.trim(),
      modalidade: document.getElementById("mdfeModalidade").value,
      modal: document.getElementById("mdfeModal").value,
      transportador: document.getElementById("mdfeTransportador").value.trim(),
      carga: document.getElementById("mdfeCarga").value.trim(),
      peso: parseFloat(document.getElementById("mdfePeso").value || 0),
      valor: parseFloat(document.getElementById("mdfeValor").value || 0),
      documentos,
      veiculos,
      criadoEm: new Date().toISOString()
    };

    // validações básicas
    if (!mdfe.numero || !mdfe.emitente) {
      alert("Preencha ao menos o Número do MDF-e e o Emitente.");
      return;
    }

    let salvos = JSON.parse(localStorage.getItem("mdfe_salvos")) || [];
    salvos.push(mdfe);
    localStorage.setItem("mdfe_salvos", JSON.stringify(salvos));

    alert("MDF-e salvo (local) com sucesso!");
  });

  // Inicial render
  renderDocumentos();
  renderVeiculos();
});
