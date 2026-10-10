// src/components/ControlsHint.jsx
// Aviso fixo de funcionalidades da cena 3D — estética do projeto:
// papel antigo (#fdf6e3), moldura dupla (#d0c09a), serifas e tintas
// do livro (#8b0000 / #006400 / #5c4033).
// Ícones de mouse desenhados em SVG (leitura visual):
//   scroll → roda destacada + setas ⇕ (zoom)
//   M1     → botão esquerdo pressionado + setas ↔ (arrastar/ângulo)
//   clique → botão esquerdo + ondas de pulso (abrir livro)
//   tecla R → keycap com a letra R (volta ao ângulo inicial)
// pointer-events-none para nunca bloquear o OrbitControls/canvas.

const MOUSE_BODY =
  'M13 1.5 C7 1.5 2.5 6 2.5 11.5 L2.5 18 C2.5 26 7 32.5 13 32.5 C19 32.5 23.5 26 23.5 18 L23.5 11.5 C23.5 6 19 1.5 13 1.5 Z';
const LEFT_BUTTON = 'M13 1.5 C7 1.5 2.5 6 2.5 11.5 H13 Z';

function MouseIcon({ variant }) {
  const pressed = variant === 'm1' || variant === 'click';

  return (
    <svg viewBox="0 0 34 34" className="w-[20px] h-[20px] shrink-0" aria-hidden="true">
      {/* corpo do mouse */}
      <path d={MOUSE_BODY} fill="#fdf6e3" stroke="#5c4033" strokeWidth="1.7" />
      {/* botão esquerdo pressionado */}
      {pressed && <path d={LEFT_BUTTON} fill="#8b0000" opacity="0.85" />}
      {/* divisão dos botões */}
      <path d="M2.5 11.5 H23.5 M13 1.5 V11.5" fill="none" stroke="#5c4033" strokeWidth="1.4" />
      {/* roda de scroll */}
      <rect
        x="11"
        y="4"
        width="4"
        height="7"
        rx="2"
        fill={variant === 'scroll' ? '#006400' : '#fdf6e3'}
        stroke="#5c4033"
        strokeWidth="1.4"
      />

      {/* glifo lateral de cada ação */}
      {variant === 'scroll' && (
        <path
          d="M29 4.5 V11.5 M26.8 6.7 L29 4.5 L31.2 6.7 M26.8 9.3 L29 11.5 L31.2 9.3"
          fill="none"
          stroke="#006400"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {variant === 'm1' && (
        <path
          d="M26 19.5 H32 M26 19.5 L28 17.5 M26 19.5 L28 21.5 M32 19.5 L30 17.5 M32 19.5 L30 21.5"
          fill="none"
          stroke="#8b0000"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {variant === 'click' && (
        <path
          d="M26.5 4.5 A 4 4 0 0 1 26.5 11.5 M29 3 A 6.5 6.5 0 0 1 29 13"
          fill="none"
          stroke="#8b0000"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// Tecla física (keycap) — a mesma leitura visual dos ícones de mouse:
// face superior com a letra e aresta inferior simulando a profundidade.
function KeycapIcon() {
  return (
    <svg viewBox="0 0 34 34" className="w-[20px] h-[20px] shrink-0" aria-hidden="true">
      {/* corpo da tecla */}
      <rect x="5" y="4" width="24" height="26" rx="4.5" fill="#fdf6e3" stroke="#5c4033" strokeWidth="1.7" />
      {/* face superior (topo da tecla) */}
      <rect x="7.5" y="6.5" width="19" height="15" rx="2.5" fill="none" stroke="#5c4033" strokeWidth="1.1" opacity="0.55" />
      {/* aresta inferior (profundidade) */}
      <path d="M9 26 H25" fill="none" stroke="#5c4033" strokeWidth="1.1" opacity="0.4" strokeLinecap="round" />
      {/* letra */}
      <text
        x="17"
        y="14"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
        fontFamily="serif"
        fill="#8b0000"
      >
        R
      </text>
    </svg>
  );
}

export function ControlsHint() {
  const items = [
    { variant: 'scroll', key: 'Scroll', action: 'zoom' },
    { variant: 'm1', key: 'M1 + arrastar', action: 'ângulo' },
    { variant: 'click', key: 'Clique', action: 'abrir livro' },
    { variant: 'key', key: 'Tecla R', action: 'ângulo inicial' },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-10 pointer-events-none font-serif select-none">
      <div className="relative border border-[#d0c09a] bg-[#fdf6e3]/90 px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-[3px] border border-[#d0c09a] opacity-50"></div>
        <div className="relative">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#8b0000] mb-2">
            Controles
          </div>
          <ul className="text-[10px] uppercase tracking-wider text-[#3d2817] space-y-1.5">
            {items.map((it) => (
              <li key={it.key} className="flex items-center gap-1.5 whitespace-nowrap">
                {it.variant === 'key' ? <KeycapIcon /> : <MouseIcon variant={it.variant} />}
                <span className="font-bold text-[#5c4033]">{it.key}</span>
                <span className="text-[#8b0000] px-0.5">—</span>
                {it.action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
