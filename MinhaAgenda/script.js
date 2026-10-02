// ======================================================
// AGENDA FIBRASOL
// ======================================================


// ======================================================
// DADOS
// ======================================================

let compromissos =
    JSON.parse(
        localStorage.getItem("compromissos")
    ) || [];


let indiceEditando = null;


let dataCalendario =
    new Date();


let filtroAtual =
    "Todas";


// ======================================================
// SALVAR COMPROMISSOS
// ======================================================

function salvarCompromissos() {

    localStorage.setItem(
        "compromissos",
        JSON.stringify(compromissos)
    );
}


// ======================================================
// MOSTRAR CALENDÁRIO
// ======================================================

function mostrarCalendario() {

    const ano =
        dataCalendario.getFullYear();

    const mes =
        dataCalendario.getMonth();


    const nomesMeses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];


    document
        .getElementById("mes-ano")
        .textContent =
        `${nomesMeses[mes]} ${ano}`;


    const diasCalendario =
        document.getElementById(
            "dias-calendario"
        );


    diasCalendario.innerHTML = "";


    const primeiroDia =
        new Date(
            ano,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        );


    const diaInicio =
        primeiroDia.getDay();


    const quantidadeDias =
        ultimoDia.getDate();


    // ==================================================
    // ESPAÇOS
    // ==================================================

    for (
        let i = 0;
        i < diaInicio;
        i++
    ) {

        const espaco =
            document.createElement("div");

        espaco.classList.add(
            "dia",
            "vazio"
        );

        diasCalendario.appendChild(
            espaco
        );
    }


    // ==================================================
    // DIAS
    // ==================================================

    for (
        let dia = 1;
        dia <= quantidadeDias;
        dia++
    ) {

        const elementoDia =
            document.createElement("div");


        elementoDia.classList.add(
            "dia"
        );


        const dataFormatada =
            `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;


        elementoDia.innerHTML = `
            <div class="numero-dia">
                ${dia}
            </div>
        `;


        // ==============================================
        // HOJE
        // ==============================================

        const hoje =
            new Date();


        const mesmoDia =

            dia === hoje.getDate() &&

            mes === hoje.getMonth() &&

            ano === hoje.getFullYear();


        if (mesmoDia) {

            elementoDia.classList.add(
                "hoje"
            );
        }


        // ==============================================
        // COMPROMISSOS
        // ==============================================

        const compromissosDoDia =
            compromissos.filter(
                compromisso => {

                    const categoria =
                        compromisso.categoria ||
                        "Trabalho";

                    const pertenceAoFiltro =
                        filtroAtual === "Todas" ||
                        categoria === filtroAtual;

                    return (
                        compromisso.data === dataFormatada &&
                        pertenceAoFiltro
                    );
                }
            );


        // ==============================================
        // QUANTIDADE
        // ==============================================

        if (
            compromissosDoDia.length > 0
        ) {

            const quantidade =
                document.createElement("div");


            quantidade.classList.add(
                "quantidade-compromissos"
            );


            quantidade.textContent =
                `📌 ${compromissosDoDia.length} compromisso${compromissosDoDia.length > 1 ? "s" : ""}`;


            elementoDia.appendChild(
                quantidade
            );
        }


        // ==============================================
        // EVENTOS
        // ==============================================

        compromissosDoDia.forEach(
            compromisso => {

                const evento =
                    document.createElement("div");


                evento.classList.add(
                    "evento"
                );


                evento.textContent =
                    `🕐 ${compromisso.horario} - ${compromisso.titulo}`;


                evento.onclick =
                    function(event) {

                        event.stopPropagation();


                        const indice =
                            compromissos.indexOf(
                                compromisso
                            );


                        editarCompromisso(
                            indice
                        );
                    };


                elementoDia.appendChild(
                    evento
                );

            }
        );


        // ==============================================
        // CLICAR NO DIA
        // ==============================================

        elementoDia.onclick =
            function() {


                document
                    .querySelectorAll(
                        ".dia.selecionado"
                    )
                    .forEach(
                        diaSelecionado => {

                            diaSelecionado
                                .classList
                                .remove(
                                    "selecionado"
                                );
                        }
                    );


                elementoDia.classList.add(
                    "selecionado"
                );


                mostrarCompromissosDoDia(
                    dataFormatada
                );


                document
                    .getElementById("data")
                    .value =
                    dataFormatada;


                document
                    .querySelector(".formulario")
                    .scrollIntoView({
                        behavior: "smooth"
                    });


                document
                    .getElementById("titulo")
                    .focus();

            };


        diasCalendario.appendChild(
            elementoDia
        );

    }


    // ==================================================
    // SELECIONAR HOJE
    // ==================================================

    const hojeAtual =
        new Date();


    if (

        hojeAtual.getFullYear() === ano &&

        hojeAtual.getMonth() === mes

    ) {

        const dias =
            document.querySelectorAll(
                ".dia:not(.vazio)"
            );


        dias.forEach(
            diaElemento => {

                const numero =
                    parseInt(
                        diaElemento
                            .querySelector(
                                ".numero-dia"
                            )
                            .textContent
                    );


                if (
                    numero === hojeAtual.getDate()
                ) {

                    diaElemento.classList.add(
                        "selecionado"
                    );
                }

            }
        );

    }

}


// ======================================================
// MÊS ANTERIOR
// ======================================================

function mesAnterior() {

    dataCalendario.setMonth(
        dataCalendario.getMonth() - 1
    );


    mostrarCalendario();
}


// ======================================================
// PRÓXIMO MÊS
// ======================================================

function proximoMes() {

    dataCalendario.setMonth(
        dataCalendario.getMonth() + 1
    );


    mostrarCalendario();
}


// ======================================================
// ADICIONAR / EDITAR
// ======================================================

function adicionarCompromisso() {

    const titulo =
        document
            .getElementById("titulo")
            .value
            .trim();


    const data =
        document
            .getElementById("data")
            .value;


    const horario =
        document
            .getElementById("horario")
            .value;


    const categoria =
        document
            .getElementById("categoria")
            .value;


    // ==================================================
    // VALIDAÇÃO
    // ==================================================

    if (
        titulo === "" ||
        data === "" ||
        horario === ""
    ) {

        alert(
            "⚠️ Preencha título, data e horário!"
        );

        return;
    }


    // Se não escolher categoria
    const categoriaFinal =
        categoria || "Trabalho";


    // ==================================================
    // EDITANDO
    // ==================================================

    if (
        indiceEditando !== null
    ) {

        compromissos[
            indiceEditando
        ].titulo =
            titulo;


        compromissos[
            indiceEditando
        ].data =
            data;


        compromissos[
            indiceEditando
        ].horario =
            horario;


        compromissos[
            indiceEditando
        ].categoria =
            categoriaFinal;


        indiceEditando =
            null;


        salvarCompromissos();

        mostrarCompromissos();

        mostrarCalendario();

        limparFormulario();

        return;
    }


    // ==================================================
    // NOVO COMPROMISSO
    // ==================================================

    const compromisso = {

        titulo:
            titulo,

        data:
            data,

        horario:
            horario,

        categoria:
            categoriaFinal

    };


    compromissos.push(
        compromisso
    );


    salvarCompromissos();

    mostrarCompromissos();

    mostrarCalendario();

    limparFormulario();
}


// ======================================================
// MOSTRAR COMPROMISSOS
// ======================================================

function mostrarCompromissos() {

    const lista =
        document.getElementById(
            "lista-compromissos"
        );


    lista.innerHTML = "";


    const compromissosOrdenados =
        compromissos

            .map(
                (
                    compromisso,
                    indiceOriginal
                ) => ({

                    ...compromisso,

                    indiceOriginal:
                        indiceOriginal,

                    categoria:
                        compromisso.categoria ||
                        "Trabalho"

                })
            )

            .filter(
                compromisso => {

                    return (

                        filtroAtual === "Todas" ||

                        compromisso.categoria ===
                            filtroAtual

                    );

                }
            )

            .sort(
                (a, b) => {

                    const dataA =
                        `${a.data} ${a.horario}`;


                    const dataB =
                        `${b.data} ${b.horario}`;


                    return dataA.localeCompare(
                        dataB
                    );
                }
            );


    // ==================================================
    // NENHUM RESULTADO
    // ==================================================

    if (
        compromissosOrdenados.length === 0
    ) {

        lista.innerHTML = `

            <div class="compromisso">

                <strong>
                    📭 Nenhum compromisso encontrado.
                </strong>

                <br>

                Não existem compromissos para
                o filtro selecionado.

            </div>

        `;

        return;
    }


    // ==================================================
    // CRIAR LISTA
    // ==================================================

    compromissosOrdenados.forEach(
        compromisso => {

            const item =
                document.createElement("div");


            item.classList.add(
                "compromisso"
            );


            item.innerHTML = `

                <strong>
                    ${compromisso.titulo}
                </strong>

                <br>

                📅 ${formatarData(
                    compromisso.data
                )}

                <br>

                🕐 ${compromisso.horario}

                <br>

                <span class="tag-categoria">
                    🏷️ ${compromisso.categoria}
                </span>

                <br><br>

                <button
                    class="botao-editar"
                    onclick="editarCompromisso(${compromisso.indiceOriginal})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="botao-excluir"
                    onclick="excluirCompromisso(${compromisso.indiceOriginal})"
                >
                    🗑️ Excluir
                </button>

            `;


            lista.appendChild(
                item
            );

        }
    );
}


// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data) {

    if (!data) {
        return "";
    }


    const partes =
        data.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ======================================================
// EXCLUIR
// ======================================================

function excluirCompromisso(
    indice
) {

    const confirmar =
        confirm(
            "⚠️ Tem certeza que deseja excluir este compromisso?"
        );


    if (!confirmar) {
        return;
    }


    compromissos.splice(
        indice,
        1
    );


    salvarCompromissos();

    mostrarCompromissos();

    mostrarCalendario();


    const data =
        document
            .getElementById("data")
            .value;


    if (data !== "") {

        mostrarCompromissosDoDia(
            data
        );
    }
}


// ======================================================
// EDITAR
// ======================================================

function editarCompromisso(
    indice
) {

    const compromisso =
        compromissos[indice];


    if (!compromisso) {
        return;
    }


    indiceEditando =
        indice;


    document
        .getElementById("titulo")
        .value =
        compromisso.titulo;


    document
        .getElementById("data")
        .value =
        compromisso.data;


    document
        .getElementById("horario")
        .value =
        compromisso.horario;


    document
        .getElementById("categoria")
        .value =
        compromisso.categoria ||
        "Trabalho";


    document
        .getElementById(
            "botao-compromisso"
        )
        .textContent =
        "💾 Salvar alteração";


    document
        .getElementById(
            "titulo-formulario"
        )
        .textContent =
        "✏️ Editando compromisso";


    document
        .getElementById(
            "botao-cancelar"
        )
        .style.display =
        "block";


    document
        .querySelector(".formulario")
        .scrollIntoView({
            behavior: "smooth"
        });


    document
        .getElementById("titulo")
        .focus();
}


// ======================================================
// CANCELAR EDIÇÃO
// ======================================================

function cancelarEdicao() {

    indiceEditando =
        null;


    limparFormulario();
}


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

function limparFormulario() {

    document
        .getElementById("titulo")
        .value =
        "";


    document
        .getElementById("data")
        .value =
        "";


    document
        .getElementById("horario")
        .value =
        "";


    document
        .getElementById("categoria")
        .value =
        "";


    document
        .getElementById(
            "botao-compromisso"
        )
        .textContent =
        "➕ Adicionar compromisso";


    document
        .getElementById(
            "titulo-formulario"
        )
        .textContent =
        "➕ Novo compromisso";


    document
        .getElementById(
            "botao-cancelar"
        )
        .style.display =
        "none";
}


// ======================================================
// VOLTAR PARA HOJE
// ======================================================

function voltarParaHoje() {

    dataCalendario =
        new Date();


    filtroAtual =
        "Todas";


    atualizarTextoFiltro();


    mostrarCalendario();


    const hoje =
        new Date();


    const dataHoje =
        `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;


    mostrarCompromissosDoDia(
        dataHoje
    );


    marcarMenuAtivo(
        "menu-hoje"
    );


    document
        .querySelector(".calendario")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// COMPROMISSOS DO DIA
// ======================================================

function mostrarCompromissosDoDia(
    dataSelecionada
) {

    const lista =
        document.getElementById(
            "lista-dia-selecionado"
        );


    const titulo =
        document.getElementById(
            "titulo-dia-selecionado"
        );


    const compromissosDoDia =
        compromissos.filter(
            compromisso =>
                compromisso.data ===
                dataSelecionada
        );


    lista.innerHTML = "";


    const partesData =
        dataSelecionada.split("-");


    const dataBrasileira =
        `${partesData[2]}/${partesData[1]}/${partesData[0]}`;


    titulo.textContent =
        `📅 Compromissos de ${dataBrasileira}`;


    if (
        compromissosDoDia.length === 0
    ) {

        lista.innerHTML =
            "<p>Nenhum compromisso para este dia.</p>";

        return;
    }


    compromissosDoDia.forEach(
        compromisso => {

            const item =
                document.createElement("div");


            item.classList.add(
                "compromisso-dia-item"
            );


            item.innerHTML = `

                <strong>
                    ${compromisso.titulo}
                </strong>

                <br>

                🕐 ${compromisso.horario}

                <br>

                🏷️ ${
                    compromisso.categoria ||
                    "Trabalho"
                }

            `;


            item.onclick =
                function() {

                    const indice =
                        compromissos.indexOf(
                            compromisso
                        );


                    editarCompromisso(
                        indice
                    );
                };


            lista.appendChild(
                item
            );

        }
    );
}


// ======================================================
// MENU - AGENDA
// ======================================================

function irParaAgenda() {

    filtroAtual =
        "Todas";


    atualizarTextoFiltro();

    mostrarCalendario();

    mostrarCompromissos();


    marcarMenuAtivo(
        "menu-agenda"
    );


    document
        .getElementById(
            "area-agenda"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// MENU - COMPROMISSOS
// ======================================================

function irParaCompromissos() {

    marcarMenuAtivo(
        "menu-compromissos"
    );


    document
        .getElementById(
            "area-compromissos"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// MENU - CATEGORIAS
// ======================================================

function abrirCategorias() {

    marcarMenuAtivo(
        "menu-categorias"
    );


    document
        .getElementById(
            "area-categorias"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// MENU - CONFIGURAÇÕES
// ======================================================

function abrirConfiguracoes() {

    marcarMenuAtivo(
        "menu-configuracoes"
    );


    document
        .getElementById(
            "area-configuracoes"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// MARCAR MENU ATIVO
// ======================================================

function marcarMenuAtivo(
    id
) {

    document
        .querySelectorAll(".item-menu")
        .forEach(
            item => {

                item.classList.remove(
                    "ativo"
                );

            }
        );


    const itemAtivo =
        document.getElementById(id);


    if (itemAtivo) {

        itemAtivo.classList.add(
            "ativo"
        );
    }
}


// ======================================================
// FILTRAR CATEGORIA
// ======================================================

function filtrarCategoria(
    categoria
) {

    filtroAtual =
        categoria;


    atualizarTextoFiltro();


    mostrarCompromissos();

    mostrarCalendario();


    marcarMenuAtivo(
        "menu-categorias"
    );


    document
        .getElementById(
            "area-compromissos"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// MOSTRAR TODAS
// ======================================================

function mostrarTodasCategorias() {

    filtroAtual =
        "Todas";


    atualizarTextoFiltro();


    mostrarCompromissos();

    mostrarCalendario();


    document
        .getElementById(
            "area-categorias"
        )
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ======================================================
// TEXTO DO FILTRO
// ======================================================

function atualizarTextoFiltro() {

    const elemento =
        document.getElementById(
            "filtro-categoria"
        );


    if (!elemento) {
        return;
    }


    if (
        filtroAtual === "Todas"
    ) {

        elemento.textContent =
            "📋 Todas as categorias";

        return;
    }


    elemento.textContent =
        `🏷️ Filtro atual: ${filtroAtual}`;
}


// ======================================================
// LIMPAR TODOS OS COMPROMISSOS
// ======================================================

function limparTodosCompromissos() {

    if (
        compromissos.length === 0
    ) {

        alert(
            "📭 Não existem compromissos para apagar."
        );

        return;
    }


    const confirmar =
        confirm(
            "⚠️ ATENÇÃO!\n\nTem certeza que deseja apagar TODOS os compromissos da agenda?"
        );


    if (!confirmar) {
        return;
    }


    compromissos =
        [];


    salvarCompromissos();


    indiceEditando =
        null;


    limparFormulario();


    mostrarCalendario();

    mostrarCompromissos();


    const hoje =
        new Date();


    const dataHoje =
        `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;


    mostrarCompromissosDoDia(
        dataHoje
    );


    alert(
        "✅ Todos os compromissos foram removidos."
    );
}


// ======================================================
// INICIAR A AGENDA
// ======================================================

mostrarCalendario();

mostrarCompromissos();


const hojeInicial =
    new Date();


const dataHojeInicial =
    `${hojeInicial.getFullYear()}-${String(hojeInicial.getMonth() + 1).padStart(2, "0")}-${String(hojeInicial.getDate()).padStart(2, "0")}`;


mostrarCompromissosDoDia(
    dataHojeInicial
);


atualizarTextoFiltro();