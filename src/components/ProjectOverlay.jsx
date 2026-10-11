// src/components/ProjectOverlay.jsx
// Livro aberto das páginas de projeto.
// - DESKTOP (md+): spread clássico de 2 páginas (capa | contexto+resultados+
//   gráfico) com lombada central — layout original, inalterado.
// - MOBILE (<md): livro em RETRATO (aspect 21/29) exibindo UMA PÁGINA POR VEZ,
//   com textos maiores e paginação no rodapé (‹ pág. X de Y ›) — o spread
//   duplo ficava minúsculo na tela do celular.
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GrowthChart } from './GrowthChart';

const ROMANOS = ['I', 'II', 'III', 'IV'];

export function ProjectOverlay({ activeProject, onClose }) {
  const [mobilePage, setMobilePage] = useState(0);

  // O componente fica montado mesmo fechado (return null renderiza nada);
  // garante que cada abertura de livro comece na pág. I.
  useEffect(() => {
    setMobilePage(0);
  }, [activeProject]);

  if (!activeProject) return null;

  const temGrafico = Boolean(activeProject.hasDataTable && activeProject.tableData);
  const totalPaginas = temGrafico ? 3 : 2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed top-0 left-0 w-screen h-screen z-[999] grid place-items-center bg-black/90 backdrop-blur-sm p-3 md:p-4 overflow-hidden"
      >
        {/* CAMADA 1: CAPA DURA (Couro) — animação de abertura do livro.
            O tamanho/aspect vêm das versões mobile/desktop renderizadas dentro. */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: 20, y: 50 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 20, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          onClick={(e) => e.stopPropagation()}
          className="relative m-auto w-auto h-auto"
        >
          {/* Botão Fechar */}
          <button 
            onClick={onClose}
            className="absolute -top-3 -right-3 bg-[#8b0000] text-[#fdf6e3] w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-red-700 hover:scale-110 transition-all z-50 border-2 border-[#3d2817]"
          >
            ✕
          </button>

          {/* ============ MOBILE (<md): LIVRO RETRATO — 1 PÁGINA POR VEZ ============ */}
          <div
            className="md:hidden aspect-[21/29] max-w-[95vw] max-h-[86vh] w-auto h-auto flex bg-[#2a1a10] rounded-md shadow-2xl p-2"
            style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* CAMADA 2: O MIOLO (página única) */}
            <div className="flex-1 flex flex-col bg-[#fdf6e3] rounded-sm shadow-inner relative overflow-hidden border border-[#d4c5a3]">
              <div className="absolute top-1 bottom-1 -left-1 w-1 bg-[#e6dbbf] border-r border-[#d4c5a3] rounded-l-sm opacity-50" />
              <div className="absolute top-1 bottom-1 -right-1 w-1 bg-[#e6dbbf] border-l border-[#d4c5a3] rounded-r-sm opacity-50" />

              <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden text-[#2b1d10] p-4 md:p-5">
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }}></div>

                <div className="relative z-10 flex-1 min-h-0 flex flex-col border-2 border-double border-[#d0c09a] p-4">
                  {/* Conteúdo da página ativa (entrance deslizante a cada virada) */}
                  <motion.div
                    key={mobilePage}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="flex-1 min-h-0 flex flex-col"
                  >
                    {mobilePage === 0 && <CapaMobile project={activeProject} />}
                    {mobilePage === 1 && <ContextoMobile project={activeProject} />}
                    {mobilePage === 2 && <GraficoMobile project={activeProject} />}
                  </motion.div>

                  {/* RODAPÉ: paginação (setas ‹ › + indicador romano) */}
                  <div className="mt-3 pt-2 border-t border-[#d0c09a] flex items-center justify-between select-none">
                    <button
                      type="button"
                      aria-label="Página anterior"
                      onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
                      disabled={mobilePage === 0}
                      className="w-9 h-9 flex items-center justify-center border border-[#d0c09a] bg-[#fdf6e3] text-[#5c4033] font-bold text-lg leading-none rounded-sm hover:bg-[#d0c09a]/50 transition-colors disabled:opacity-30 disabled:hover:bg-[#fdf6e3]"
                    >
                      ‹
                    </button>
                    <span className="font-serif text-[10px] tracking-[0.25em] uppercase opacity-60">
                      pág. {ROMANOS[mobilePage]} de {ROMANOS[totalPaginas - 1]}
                    </span>
                    <button
                      type="button"
                      aria-label="Próxima página"
                      onClick={() => setMobilePage((p) => Math.min(totalPaginas - 1, p + 1))}
                      disabled={mobilePage === totalPaginas - 1}
                      className="w-9 h-9 flex items-center justify-center border border-[#d0c09a] bg-[#fdf6e3] text-[#5c4033] font-bold text-lg leading-none rounded-sm hover:bg-[#d0c09a]/50 transition-colors disabled:opacity-30 disabled:hover:bg-[#fdf6e3]"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ DESKTOP (md+): SPREAD DE 2 PÁGINAS (layout original) ============ */}
          <div
            className="relative w-auto h-auto max-w-[95vw] max-h-[90vh] aspect-[42/27] hidden md:flex bg-[#2a1a10] rounded-md shadow-2xl p-1 md:p-3"
            style={{
               backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* CAMADA 2: O MIOLO (Páginas) */}
            <div className="flex-1 flex bg-[#fdf6e3] rounded-sm shadow-inner relative overflow-hidden border border-[#d4c5a3]">
                
                <div className="absolute top-1 bottom-1 -left-1 w-1 bg-[#e6dbbf] border-r border-[#d4c5a3] rounded-l-sm opacity-50" />
                <div className="absolute top-1 bottom-1 -right-1 w-1 bg-[#e6dbbf] border-l border-[#d4c5a3] rounded-r-sm opacity-50" />

                {/* PÁGINA ESQUERDA */}
                <div className="flex-1 h-full flex flex-col relative overflow-hidden text-[#2b1d10] pl-6 pr-4 py-6 md:pl-10 md:pr-6 md:py-10">
                  <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }}></div>
                  
                  <div className="relative z-10 flex flex-col h-full w-full border-2 border-double border-[#d0c09a] p-4 md:p-6">
                      <div className="w-full flex justify-center items-center pb-2 opacity-60">
                          <span className="font-serif text-[10px] tracking-[0.3em] font-bold">~ {activeProject.year} ~</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-center items-center text-center">
                          <span className="block text-[9px] font-bold tracking-[0.2em] uppercase opacity-50 mb-4">Registro de Projeto</span>
                          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight font-serif text-[#3d2817] mb-6 px-4">
                              {activeProject.title}
                          </h1>
                          <div className="w-8 h-1 bg-[#8b0000] mx-auto mb-6"></div>
                          <div className="font-serif text-sm italic opacity-80 px-6">
                              "Solução desenvolvida para {activeProject.company}"
                          </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[#d0c09a] flex justify-between text-xs font-serif opacity-70 w-full">
                          <span>Função:</span>
                          <span className="font-bold">Analista de SEO</span>
                      </div>
                  </div>
                  <div className="w-full text-center mt-1 opacity-50 font-serif text-[10px]">pág. I</div>
                </div>

                {/* LOMBADA CENTRAL */}
                <div className="w-0 relative z-20">
                    <div className="absolute inset-y-0 -left-8 w-16 bg-gradient-to-r from-transparent via-[rgba(60,40,20,0.15)] to-transparent pointer-events-none"></div>
                    <div className="absolute inset-y-4 left-0 w-[1px] bg-[#d0c09a]"></div>
                </div>

                {/* PÁGINA DIREITA */}
                <div className="flex-1 h-full flex flex-col relative overflow-hidden text-[#2b1d10] pl-4 pr-6 py-6 md:pl-6 md:pr-10 md:py-10">
                  <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }}></div>

                  <div className="relative z-10 flex flex-col h-full w-full">
                      <div className="w-full flex justify-center items-center pb-4 opacity-60">
                          <span className="font-serif text-[10px] tracking-[0.3em] font-bold">~ CONTEXTO ~</span>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar text-left px-2">
                          {/* Texto de conteúdo: Literata (font-literata); demais
                              textos (títulos, rótulos, rodapé) mantêm o serif padrão.
                              Capitular ocupa exatamente 2 linhas: line-height = 2×
                              a linha do parágrafo (leading-relaxed: 26px em md → 52;
                              22,75px base → 45,5) e font-size ≈ linha/0,87 para a
                              baseline cair na base da 2ª linha (métricas Literata:
                              cap 0,70em, asc 1,18, desc 0,31). */}
                          <p className="first-letter:text-[52px] first-letter:leading-[45.5px] md:first-letter:text-[60px] md:first-letter:leading-[52px] first-letter:font-bold first-letter:text-[#8b0000] first-letter:mr-1 first-letter:float-left text-sm md:text-base leading-relaxed font-literata opacity-90 mb-6 pr-2">
                              {activeProject.description}
                          </p>

                          <div className="border-t-2 border-b-2 border-[#d0c09a] py-4 my-4 mx-2">
                              <h4 className="text-center text-[9px] font-bold uppercase tracking-widest mb-3 opacity-70">Resultados</h4>
                              <div className="flex justify-around items-stretch gap-3">
                                  <div className="flex-1 relative border border-[#d0c09a] bg-white/20 py-3 px-2 text-center">
                                      <div className="absolute inset-[3px] border border-[#d0c09a] opacity-50 pointer-events-none"></div>
                                      <span className="block text-[27px] lg:text-4xl xl:text-[45px] font-bold text-[#8b0000] font-serif leading-none mb-2">{activeProject.stats.metricOneValue}</span>
                                      <span className="block text-[8px] uppercase font-bold text-[#5c4033] tracking-widest">{activeProject.stats.metricOneLabel}</span>
                                  </div>
                                  <div className="flex-1 relative border border-[#d0c09a] bg-white/20 py-3 px-2 text-center">
                                      <div className="absolute inset-[3px] border border-[#d0c09a] opacity-50 pointer-events-none"></div>
                                      <span className="block text-[27px] lg:text-4xl xl:text-[45px] font-bold text-[#006400] font-serif leading-none mb-2">{activeProject.stats.metricTwoValue}</span>
                                      <span className="block text-[8px] uppercase font-bold text-[#5c4033] tracking-widest">{activeProject.stats.metricTwoLabel}</span>
                                  </div>
                              </div>
                          </div>

                          {activeProject.hasDataTable && activeProject.tableData && (
                            <div className="mt-6 border-t-2 border-b-2 border-[#d0c09a] py-4 my-4 mx-2">
                                <h4 className="text-center text-[9px] font-bold uppercase tracking-widest mb-3 opacity-70 text-[#3d2817]">
                                  Diário de Crescimento Orgânico
                                </h4>
                                <div className="border border-[#d0c09a] rounded-sm bg-white/20 px-2 py-2">
                                  <GrowthChart data={activeProject.tableData} fromDate={activeProject.chartFrom} toDate={activeProject.chartTo} />
                                </div>
                                <p className="text-center text-[8px] italic opacity-50 font-serif mt-2">
                                  Cliques e impressões diárias · Google Search Console
                                </p>
                            </div>
                          )}
                      </div>
                      <div className="w-full text-center mt-1 opacity-50 font-serif text-[10px]">pág. II</div>
                  </div>
                </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Conteúdos da versão MOBILE (uma página por vez — fontes maiores, já que a
// página ocupa a tela inteira em vez de metade de um spread minúsculo).
// ---------------------------------------------------------------------------

function CapaMobile({ project }) {
  return (
    <>
      <div className="w-full flex justify-center items-center pb-2 opacity-60">
        <span className="font-serif text-[11px] tracking-[0.3em] font-bold">~ {project.year} ~</span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <span className="block text-[10px] font-bold tracking-[0.25em] uppercase opacity-50 mb-3">Registro de Projeto</span>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight font-serif text-[#3d2817] mb-5 px-2">
          {project.title}
        </h1>
        <div className="w-10 h-1 bg-[#8b0000] mx-auto mb-5"></div>
        <div className="font-serif text-base italic opacity-80 px-4">
          "Solução desenvolvida para {project.company}"
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-[#d0c09a] flex justify-between text-xs font-serif opacity-70 w-full">
        <span>Função:</span>
        <span className="font-bold">Analista de SEO</span>
      </div>
    </>
  );
}

// Bloco de estatísticas "Resultados" — reaproveitado pelas páginas mobile.
// `compacto` reduz números e paddings para caber junto do gráfico (pág. III).
function ResultadosMobile({ project, compacto = false }) {
  return (
    <div className={`border-t-2 border-b-2 border-[#d0c09a] ${compacto ? 'py-2 my-2' : 'py-3 my-3'}`}>
      <h4 className="text-center text-[9px] font-bold uppercase tracking-widest mb-3 opacity-70">Resultados</h4>
      <div className="flex justify-around items-stretch gap-2">
        <div className={`flex-1 relative border border-[#d0c09a] bg-white/20 text-center px-2 ${compacto ? 'py-2' : 'py-3'}`}>
          <div className="absolute inset-[3px] border border-[#d0c09a] opacity-50 pointer-events-none"></div>
          <span className={`block font-bold text-[#8b0000] font-serif leading-none mb-2 ${compacto ? 'text-[26px]' : 'text-[32px]'}`}>{project.stats.metricOneValue}</span>
          <span className="block text-[9px] uppercase font-bold text-[#5c4033] tracking-widest">{project.stats.metricOneLabel}</span>
        </div>
        <div className={`flex-1 relative border border-[#d0c09a] bg-white/20 text-center px-2 ${compacto ? 'py-2' : 'py-3'}`}>
          <div className="absolute inset-[3px] border border-[#d0c09a] opacity-50 pointer-events-none"></div>
          <span className={`block font-bold text-[#006400] font-serif leading-none mb-2 ${compacto ? 'text-[26px]' : 'text-[32px]'}`}>{project.stats.metricTwoValue}</span>
          <span className="block text-[9px] uppercase font-bold text-[#5c4033] tracking-widest">{project.stats.metricTwoLabel}</span>
        </div>
      </div>
    </div>
  );
}

function ContextoMobile({ project }) {
  // Com gráfico (H2bet), os Resultados vão para a página do gráfico (pág. III);
  // sem gráfico (Seubet), ficam aqui na página do CONTEXTO.
  const temGrafico = Boolean(project.hasDataTable && project.tableData);

  return (
    <>
      <div className="w-full flex justify-center items-center pb-2 opacity-60">
        <span className="font-serif text-[11px] tracking-[0.3em] font-bold">~ CONTEXTO ~</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar text-left pr-1">
        {/* Capitular de 2 linhas (mesma fórmula validada do spread: linha base
            = 16px × 1,625 = 26px → cap 2×26 = leading 52 / font ≈ 60px) */}
        <p className="first-letter:text-[60px] first-letter:leading-[52px] first-letter:font-bold first-letter:text-[#8b0000] first-letter:mr-1 first-letter:float-left text-base leading-relaxed font-literata opacity-90 mb-5">
          {project.description}
        </p>

        {!temGrafico && <ResultadosMobile project={project} />}
      </div>
    </>
  );
}

function GraficoMobile({ project }) {
  return (
    <>
      <div className="w-full flex justify-center items-center pb-2 opacity-60">
        <span className="font-serif text-[11px] tracking-[0.3em] font-bold">~ DIÁRIO ~</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar text-left pr-1">
        {/* Estatísticas no topo desta página (pedido: Resultados e gráfico na
            MESMA página mobile) — versão compacta do bloco */}
        <ResultadosMobile project={project} compacto />

        <div className="mt-3">
          <h4 className="text-center text-[10px] font-bold uppercase tracking-widest mb-3 opacity-70 text-[#3d2817]">
            Diário de Crescimento Orgânico
          </h4>
          <div className="border border-[#d0c09a] rounded-sm bg-white/20 px-2 py-2">
            <GrowthChart data={project.tableData} fromDate={project.chartFrom} toDate={project.chartTo} />
          </div>
          <p className="text-center text-[9px] italic opacity-50 font-serif mt-2">
            Cliques e impressões diárias · Google Search Console
          </p>
        </div>
      </div>
    </>
  );
}
