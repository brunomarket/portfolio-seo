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
    color: '#2d008e', // Roxo-azulado vivo (testado após #150C28 ficar escuro demais)
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
  },
  {
    id: 'seubet-blog',
    title: 'Seubet: GEO e Conteúdo com IA',
    spineTitle: 'Seubet', // Título reduzido para a lombada do livro
    company: 'Seubet',
    year: '2025 - 2026',
    color: '#2e7d32', // Verde do livro na estante (mesma estética do H2bet)
    description: 'O blog da Seubet precisava escalar conteúdo orgânico sem o custo crescente de uma equipe de redação. Pesquisei e apliquei estratégias de GEO (Generative Engine Optimization), viabilizando conteúdo da marca gerado 100% por IA e posicionado organicamente — o que eliminou a necessidade de redator dedicado. Para fechar o ciclo de SEO, produzi relatórios semanais de performance cruzando tráfego orgânico, posicionamento de conteúdos e volume de depósitos, orientando as decisões de conteúdo.',
    stats: {
      metricOneValue: '100%',
      metricOneLabel: 'Conteúdo com IA',
      metricTwoValue: '0',
      metricTwoLabel: 'Redatores dedicados'
    }
    // Sem hasDataTable/tableData: sem dados de GSC para este projeto,
    // o bloco "Diário de Crescimento Orgânico" não é renderizado.
  }
];
