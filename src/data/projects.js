import { getH2betBlogData } from './h2betBlogData';

const tableData = getH2betBlogData();
const totalClicks = tableData.reduce((sum, row) => sum + row.clicks, 0);
const totalImpressions = tableData.reduce((sum, row) => sum + row.impressions, 0);

export const projects = [
  {
    id: 'h2bet-blog',
    title: 'H2bet: Projeto e Resultados',
    spineTitle: 'H2bet', // Título reduzido para a lombada do livro
    company: 'H2bet',
    year: '2025 - 2026',
    color: '#005f73',
    description: 'A principal dor do H2bet era a ausência de posicionamento non-branded. A iniciativa de blog, da qual fui responsável pela arquitetura e estilização completa, começou a gerar tráfego orgânico escalável através de um espaço otimizado e conteúdos estratégicos pensados em posicionamento online.',
    stats: {
      metricOneValue: totalClicks.toLocaleString('pt-BR'),
      metricOneLabel: 'Total de Cliques',
      metricTwoValue: totalImpressions.toLocaleString('pt-BR'),
      metricTwoLabel: 'Total de Impr.'
    },
    hasDataTable: true,
    chartFrom: '2026-01-01', // Eixo do gráfico inicia em jan/26 (nov–dez/25 fora do eixo)
    chartTo: '2026-06-15', // Eixo do gráfico encerra em 15/jun (16–18/jun fora do eixo)
    tableData
  }
];
