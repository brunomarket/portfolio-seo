import { motion, AnimatePresence } from 'framer-motion';

export function ProjectOverlay({ activeProject, onClose }) {
  if (!activeProject) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed top-0 left-0 w-screen h-screen z-[999] grid place-items-center bg-black/90 backdrop-blur-sm p-4 overflow-hidden"
      >
        {/* --- CAMADA 1: A CAPA DURA (O "Couro" do livro) --- */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: 20, y: 50 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 20, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          onClick={(e) => e.stopPropagation()}
          // Adicionamos padding (p-1 md:p-2) para a capa "sobrar" nas bordas
          className="relative m-auto w-auto h-auto max-w-[95vw] max-h-[90vh] aspect-[42/27] flex bg-[#2a1a10] rounded-md shadow-2xl p-1 md:p-3"
          style={{
             // Textura de couro para a capa
             backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
          }}
        >
          {/* Botão Fechar (Agora fica na capa, fora das páginas) */}
          <button 
            onClick={onClose}
            className="absolute -top-3 -right-3 bg-[#8b0000] text-[#fdf6e3] w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-red-700 hover:scale-110 transition-all z-50 border-2 border-[#3d2817]"
          >
            ✕
          </button>

          {/* --- CAMADA 2: O MIOLO (As Páginas de Papel) --- */}
          {/* Aqui começa o livro de papel que fizemos antes */}
          <div className="flex-1 flex bg-[#fdf6e3] rounded-sm shadow-inner relative overflow-hidden border border-[#d4c5a3]">
              
              {/* Detalhes Físicos (Espessura das folhas) */}
              <div className="absolute top-1 bottom-1 -left-1 w-1 bg-[#e6dbbf] border-r border-[#d4c5a3] rounded-l-sm opacity-50" />
              <div className="absolute top-1 bottom-1 -right-1 w-1 bg-[#e6dbbf] border-l border-[#d4c5a3] rounded-r-sm opacity-50" />

              {/* === PÁGINA ESQUERDA === */}
              <div className="flex-1 h-full flex flex-col relative overflow-hidden text-[#2b1d10] pl-6 pr-4 py-6 md:pl-10 md:pr-6 md:py-10">
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }}></div>
                
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
                        <span>Stack Principal:</span>
                        <span className="font-bold">Next.js • SEO</span>
                    </div>
                </div>
                <div className="w-full text-center mt-1 opacity-50 font-serif text-[10px]">pág. I</div>
              </div>

              {/* === LOMBADA CENTRAL === */}
              <div className="w-0 relative z-20">
                <div className="absolute inset-y-0 -left-8 w-16 bg-gradient-to-r from-transparent via-[rgba(60,40,20,0.15)] to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-4 left-0 w-[1px] bg-[#d0c09a]"></div>
              </div>

              {/* === PÁGINA DIREITA === */}
              <div className="flex-1 h-full flex flex-col relative overflow-hidden text-[#2b1d10] pl-4 pr-6 py-6 md:pl-6 md:pr-10 md:py-10">
                <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
                      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard-flat.png")' }}></div>

                <div className="relative z-10 flex flex-col h-full w-full">
                    <div className="w-full flex justify-center items-center pb-4 opacity-60">
                        <span className="font-serif text-[10px] tracking-[0.3em] font-bold">~ TÉCNICA ~</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar text-left px-2">
                        <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#8b0000] first-letter:mr-1 first-letter:float-left text-sm md:text-base leading-relaxed font-serif opacity-90 mb-6 pr-2">
                            {activeProject.description}
                        </p>

                        <div className="border-t-2 border-b-2 border-[#d0c09a] py-4 my-4 mx-2">
                            <h4 className="text-center text-[9px] font-bold uppercase tracking-widest mb-3 opacity-70">Resultados</h4>
                            <div className="flex justify-around items-center">
                                <div className="text-center">
                                    <span className="block text-xl md:text-2xl font-bold text-[#8b0000] font-serif">{activeProject.stats.lcp}</span>
                                    <span className="text-[8px] uppercase font-bold text-[#5c4033] tracking-wider">LCP Score</span>
                                </div>
                                <div className="h-6 w-[1px] bg-[#d0c09a]"></div>
                                <div className="text-center">
                                    <span className="block text-xl md:text-2xl font-bold text-[#006400] font-serif">{activeProject.stats.traffic}</span>
                                    <span className="text-[8px] uppercase font-bold text-[#5c4033] tracking-wider">Tráfego</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full text-center mt-1 opacity-50 font-serif text-[10px]">pág. II</div>
                </div>
              </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}