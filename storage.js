const STORAGE_KEY = "meuTreinoHistorico";

function carregarHistorico() {
  const dados = localStorage.getItem(STORAGE_KEY);

  if (!dados) {
    return {};
  }

  return JSON.parse(dados);
}

function salvarHistorico(historico) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(historico)
  );
}

function registrarSerie({
  treino,
  exercicio,
  serie,
  repeticoes,
  peso
}) {
  const historico = carregarHistorico();

  const hoje = new Date()
    .toISOString()
    .split("T")[0];

  if (!historico[hoje]) {
    historico[hoje] = {
      treinos: {}
    };
  }

  if (!historico[hoje].treinos[treino]) {
    historico[hoje].treinos[treino] = {
      inicio: new Date().toISOString(),
      exercicios: {}
    };
  }

  const treinoHoje =
    historico[hoje].treinos[treino];

  if (!treinoHoje.exercicios[exercicio]) {
    treinoHoje.exercicios[exercicio] = {
      series: []
    };
  }

  treinoHoje.exercicios[exercicio].series.push({
    serie,
    repeticoes,
    peso,
    horario: new Date().toISOString()
  });

  salvarHistorico(historico);
}
