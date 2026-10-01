'use client';

import { useMemo, useRef, useState } from 'react';

// ----------------------------------------------------------------------------
// Gráfico de linha "vazado" (sem preenchimento, traço tracejado / pontilhado)
// Estética do livro: papel antigo, tintas vermelha/verde, serifas.
// Eixo X: intervalos mês a mês com detalhamento dia a dia (cada dia é um ponto).
// Topo: cards com as ESTATÍSTICAS DE PICO do período plotado
//       (os totais ficam nos cards big number do bloco "Resultados").
// ----------------------------------------------------------------------------

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const W = 460;
const H = 280;
const PAD = { t: 68, r: 34, b: 46, l: 30 };
const INNER_W = W - PAD.l - PAD.r;
const INNER_H = H - PAD.t - PAD.b;

// Faixa dos cards de pico (topo)
const CARD_Y = 4;
const CARD_H = 42;
const CARD_W = 196;
const CARD_X = [30, 234];

const TIP_W = 122;
const TIP_H = 56;

const parseDate = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return { day, month: month - 1, year };
};

const formatDate = (iso) => {
  const { day, month, year } = parseDate(iso);
  return `${day} ${MONTHS_PT[month]} ${year}`;
};

const formatDecimal = (value) => String(value ?? '-').replace('.', ',');
const formatTotal = (value) => value.toLocaleString('pt-BR');

export function GrowthChart({ data, fromDate, toDate }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const model = useMemo(() => {
    if (!data || data.length < 2) return null;

    // Série exibida no eixo (recorte de período, ex.: jan/26 a 15/jun/26)
    const series = data.filter(
      (r) => (!fromDate || r.date >= fromDate) && (!toDate || r.date <= toDate)
    );
    if (series.length < 2) return null;

    const n = series.length;

    // Picos do período plotado (estatísticas de pico nos cards do topo)
    const peakClicks = Math.max(...series.map((r) => r.clicks || 0));
    const peakImpressions = Math.max(...series.map((r) => r.impressions || 0));

    // Escalas "bonitas" derivadas dos dados exibidos
    const clicksMaxValue = Math.max(...series.map((r) => r.clicks || 0), 10);
    const imprMaxValue = Math.max(...series.map((r) => r.impressions || 0), 100);
    const clicksTop = Math.max(10, Math.ceil(clicksMaxValue / 10) * 10);
    const imprTop = Math.max(3000, Math.ceil(imprMaxValue / 3000) * 3000);

    const clicksTicks = [];
    for (let v = 0; v <= clicksTop; v += 10) clicksTicks.push(v);
    const imprStep = imprTop / 3;
    const imprTicks = [];
    for (let v = 0; v <= imprTop; v += imprStep) imprTicks.push(v);

    const xAt = (i) => PAD.l + (i * INNER_W) / (n - 1);
    const yClicks = (v) => PAD.t + INNER_H - (v / clicksTop) * INNER_H;
    const yImpr = (v) => PAD.t + INNER_H - (v / imprTop) * INNER_H;

    let clicksPath = '';
    let imprPath = '';
    series.forEach((row, i) => {
      const x = xAt(i).toFixed(2);
      clicksPath += `${i === 0 ? 'M' : 'L'}${x},${yClicks(row.clicks || 0).toFixed(2)} `;
      imprPath += `${i === 0 ? 'M' : 'L'}${x},${yImpr(row.impressions || 0).toFixed(2)} `;
    });

    // Agrupamento dia a dia -> faixas mês a mês para o eixo
    const months = [];
    series.forEach((row, i) => {
      const { month, year } = parseDate(row.date);
      const key = `${year}-${month}`;
      const last = months[months.length - 1];
      if (!last || last.key !== key) {
        months.push({ key, month, year, start: i, end: i });
      } else {
        last.end = i;
      }
    });

    return {
      n,
      series,
      peakClicks,
      peakImpressions,
      clicksTop,
      imprTop,
      clicksTicks,
      imprTicks,
      xAt,
      yClicks,
      yImpr,
      clicksPath,
      imprPath,
      months,
    };
  }, [data, fromDate, toDate]);

  if (!model) return null;

  const baselineY = PAD.t + INNER_H;

  const handleMove = (event) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * W;
    const ratio = (svgX - PAD.l) / INNER_W;
    const idx = Math.round(ratio * (model.n - 1));
    setHoverIndex(Math.min(model.n - 1, Math.max(0, idx)));
  };

  let tooltip = null;
  if (hoverIndex != null) {
    const row = model.series[hoverIndex];
    const px = model.xAt(hoverIndex);
    const py = Math.min(model.yClicks(row.clicks || 0), model.yImpr(row.impressions || 0));
    const tipX = px + 10 + TIP_W <= W - 2 ? px + 10 : px - 10 - TIP_W;
    const tipY = Math.min(Math.max(py - TIP_H - 8, PAD.t), baselineY - TIP_H);

    tooltip = { row, px, py, tipX, tipY };
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto font-serif select-none"
      onMouseMove={handleMove}
      onMouseLeave={() => setHoverIndex(null)}
      role="img"
      aria-label="Gráfico de cliques e impressões dia a dia com estatísticas de pico"
    >
      <defs>
        <filter id="growth-tip-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#2b1d10" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* CARDS DE PICO — estatísticas de pico do período plotado */}
      <g>
        {/* Pico de cliques */}
        <rect
          x={CARD_X[0]}
          y={CARD_Y}
          width={CARD_W}
          height={CARD_H}
          fill="#fdf6e3"
          fillOpacity="0.5"
          stroke="#d0c09a"
          strokeWidth="1"
        />
        <rect
          x={CARD_X[0] + 3}
          y={CARD_Y + 3}
          width={CARD_W - 6}
          height={CARD_H - 6}
          fill="none"
          stroke="#d0c09a"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <text
          x={CARD_X[0] + CARD_W / 2}
          y={CARD_Y + 21}
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#8b0000"
        >
          {formatTotal(model.peakClicks)}
        </text>
        <text
          x={CARD_X[0] + CARD_W / 2}
          y={CARD_Y + 32}
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          letterSpacing="1.5"
          fill="#3d2817"
          opacity="0.8"
        >
          PICO DE CLIQUES
        </text>

        {/* Pico de impressões */}
        <rect
          x={CARD_X[1]}
          y={CARD_Y}
          width={CARD_W}
          height={CARD_H}
          fill="#fdf6e3"
          fillOpacity="0.5"
          stroke="#d0c09a"
          strokeWidth="1"
        />
        <rect
          x={CARD_X[1] + 3}
          y={CARD_Y + 3}
          width={CARD_W - 6}
          height={CARD_H - 6}
          fill="none"
          stroke="#d0c09a"
          strokeWidth="0.6"
          opacity="0.6"
        />
        <text
          x={CARD_X[1] + CARD_W / 2}
          y={CARD_Y + 21}
          textAnchor="middle"
          fontSize="15"
          fontWeight="bold"
          fill="#006400"
        >
          {formatTotal(model.peakImpressions)}
        </text>
        <text
          x={CARD_X[1] + CARD_W / 2}
          y={CARD_Y + 32}
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="bold"
          letterSpacing="1.5"
          fill="#3d2817"
          opacity="0.8"
        >
          PICO DE IMPRESSÕES
        </text>
      </g>

      {/* Legenda das linhas */}
      <g>
        <line x1={132} x2={150} y1={57} y2={57} stroke="#8b0000" strokeWidth="1.6" strokeDasharray="6 3.5" />
        <text x={154} y={59.5} fontSize="8" fill="#3d2817">
          Cliques
        </text>
        <line x1={215} x2={233} y1={57} y2={57} stroke="#006400" strokeWidth="1.3" strokeDasharray="1.5 3" />
        <text x={237} y={59.5} fontSize="8" fill="#3d2817">
          Impressões
        </text>
      </g>

      {/* Faixas alternadas marcando o intervalo mês a mês */}
      {model.months.map((m, idx) => (
        <rect
          key={`band-${m.key}`}
          x={model.xAt(m.start)}
          y={PAD.t}
          width={Math.max(model.xAt(m.end) - model.xAt(m.start), 1)}
          height={INNER_H}
          fill="#d0c09a"
          opacity={idx % 2 === 0 ? 0.14 : 0.05}
        />
      ))}

      {/* Grade horizontal + rótulos dos eixos (esq. cliques / dir. impressões) */}
      {model.clicksTicks.map((tick) => (
        <g key={`ct-${tick}`}>
          <line
            x1={PAD.l}
            x2={W - PAD.r}
            y1={model.yClicks(tick)}
            y2={model.yClicks(tick)}
            stroke="#d0c09a"
            strokeWidth="0.6"
            strokeDasharray="1.5 3"
            opacity="0.8"
          />
          <text
            x={PAD.l - 5}
            y={model.yClicks(tick) + 2.5}
            textAnchor="end"
            fontSize="7"
            fill="#8b0000"
            opacity="0.75"
          >
            {tick}
          </text>
        </g>
      ))}
      {model.imprTicks.map((tick) => (
        <text
          key={`it-${tick}`}
          x={W - PAD.r + 5}
          y={model.yImpr(tick) + 2.5}
          textAnchor="start"
          fontSize="7"
          fill="#006400"
          opacity="0.75"
        >
          {tick >= 1000 ? `${tick / 1000}k` : tick}
        </text>
      ))}

      {/* Separadores verticais entre os meses + ticks de dia */}
      {model.months.map((m, idx) => {
        if (idx === 0) return null;
        const x = (model.xAt(m.start - 1) + model.xAt(m.start)) / 2;
        return (
          <line
            key={`sep-${m.key}`}
            x1={x}
            x2={x}
            y1={PAD.t}
            y2={baselineY + 9}
            stroke="#5c4033"
            strokeWidth="0.7"
            strokeDasharray="3 3"
            opacity="0.55"
          />
        );
      })}
      {model.series.map((row, i) => {
        const isMonthStart = model.months.some((m) => m.start === i);
        const x = model.xAt(i);
        return (
          <line
            key={`tick-${row.date}`}
            x1={x}
            x2={x}
            y1={baselineY}
            y2={baselineY + (isMonthStart ? 7 : 3)}
            stroke="#5c4033"
            strokeWidth={isMonthStart ? 0.9 : 0.5}
            opacity={isMonthStart ? 0.8 : 0.3}
          />
        );
      })}

      {/* Linha de base do eixo X */}
      <line
        x1={PAD.l}
        x2={W - PAD.r}
        y1={baselineY}
        y2={baselineY}
        stroke="#5c4033"
        strokeWidth="0.9"
        opacity="0.6"
      />

      {/* Rótulos dos meses (mês a mês) */}
      {model.months.map((m) => {
        const centerX = (model.xAt(m.start) + model.xAt(m.end)) / 2;
        return (
          <text
            key={`label-${m.key}`}
            x={centerX}
            y={baselineY + 22}
            textAnchor="middle"
            fontSize="8.5"
            fill="#3d2817"
            opacity="0.85"
          >
            {`${MONTHS_PT[m.month]}/${String(m.year).slice(2)}`}
          </text>
        );
      })}

      {/* Série: Impressões (pontilhado verde, vazada) */}
      <path
        d={model.imprPath}
        fill="none"
        stroke="#006400"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="1.5 3"
        opacity="0.8"
      />

      {/* Série: Cliques (tracejado vermelho, vazado) */}
      <path
        d={model.clicksPath}
        fill="none"
        stroke="#8b0000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="6 3.5"
      />

      {/* Crosshair + tooltip no hover (detalhe dia a dia) */}
      {tooltip && (
        <g>
          <line
            x1={tooltip.px}
            x2={tooltip.px}
            y1={PAD.t}
            y2={baselineY}
            stroke="#3d2817"
            strokeWidth="0.7"
            strokeDasharray="2 3"
            opacity="0.5"
          />
          <circle
            cx={tooltip.px}
            cy={model.yImpr(tooltip.row.impressions || 0)}
            r="3"
            fill="#fdf6e3"
            stroke="#006400"
            strokeWidth="1.4"
          />
          <circle
            cx={tooltip.px}
            cy={model.yClicks(tooltip.row.clicks || 0)}
            r="3.4"
            fill="#fdf6e3"
            stroke="#8b0000"
            strokeWidth="1.6"
          />
          <g filter="url(#growth-tip-shadow)">
            <rect
              x={tooltip.tipX}
              y={tooltip.tipY}
              width={TIP_W}
              height={TIP_H}
              rx="2"
              fill="#fdf6e3"
              stroke="#d0c09a"
            />
            <rect
              x={tooltip.tipX + 2.5}
              y={tooltip.tipY + 2.5}
              width={TIP_W - 5}
              height={TIP_H - 5}
              rx="1"
              fill="none"
              stroke="#d0c09a"
              opacity="0.6"
            />
          </g>
          <text
            x={tooltip.tipX + 8}
            y={tooltip.tipY + 14}
            fontSize="8"
            fontWeight="bold"
            fill="#3d2817"
          >
            {formatDate(tooltip.row.date)}
          </text>
          <text x={tooltip.tipX + 8} y={tooltip.tipY + 26} fontSize="7.5" fill="#8b0000">
            {`Cliques: ${tooltip.row.clicks}`}
          </text>
          <text x={tooltip.tipX + 8} y={tooltip.tipY + 37} fontSize="7.5" fill="#006400">
            {`Impressões: ${formatTotal(tooltip.row.impressions || 0)}`}
          </text>
          <text x={tooltip.tipX + 8} y={tooltip.tipY + 49} fontSize="7" fill="#5c4033">
            {`CTR ${formatDecimal(tooltip.row.ctr)} · Pos. ${formatDecimal(tooltip.row.position)}`}
          </text>
        </g>
      )}
    </svg>
  );
}
