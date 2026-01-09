import React, { useState, useEffect } from 'react';
import { Cuboid, Upload, CheckCircle2, Rotate3D, Loader2, ArrowRight, Save, Layers, Sparkles, Box, ScanEye } from 'lucide-react';

// Stages of the pipeline
type Stage = 'upload' | 'generating' | 'review' | 'export';

const ThreeDWorkflow: React.FC = () => {
  const [stage, setStage] = useState<Stage>('upload');
  const [progress, setProgress] = useState(0);
  const [checks, setChecks] = useState({
    structure: false,
    details: false,
    reflection: false
  });

  const handleStartGeneration = () => {
    setStage('generating');
    setProgress(0);
  };

  // Simulate generation progress
  useEffect(() => {
    if (stage === 'generating') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('review');
            return 100;
          }
          return prev + 2; // Slower progress
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const allChecksPassed = checks.structure && checks.details && checks.reflection;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">3D 资产转化流水线</h2>
            <p className="text-slate-500 text-sm mt-1">腾讯混元3D 引擎驱动 · 螺钿/漆器专用模型库</p>
         </div>
         <div className="flex gap-2">
            <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${stage === 'upload' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}>
                1. 视图导入
            </div>
            <ArrowRight className="text-slate-300" />
            <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${stage === 'generating' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}>
                2. 混元生成
            </div>
            <ArrowRight className="text-slate-300" />
            <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${stage === 'review' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}>
                3. 质检与导出
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Controls & Status */}
        <div className="space-y-6">
            {/* Input Section */}
            <div className={`bg-white border rounded-xl p-6 transition-all ${stage === 'upload' ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : 'border-slate-200'}`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-blue-500"/> 标准四视图输入
               </h3>
               
               <div className="grid grid-cols-2 gap-3 mb-6">
                  {['正视图', '背视图', '左视图', '右视图'].map((label, idx) => (
                    <div key={idx} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group">
                       <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform"/>
                       <span className="text-xs font-medium">{label}</span>
                    </div>
                  ))}
               </div>
               
               {stage === 'upload' && (
                 <button 
                   onClick={handleStartGeneration}
                   className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                 >
                   <Sparkles size={18} />
                   启动混元 3D 生成
                 </button>
               )}
            </div>

            {/* QC Checklist */}
            <div className={`bg-white border rounded-xl p-6 transition-all ${stage === 'review' ? 'border-blue-500 shadow-md' : 'border-slate-200 opacity-60'}`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ScanEye size={20} className={stage === 'review' ? "text-blue-500" : "text-slate-400"}/> 
                  资产质量快检
               </h3>
               <div className="space-y-3">
                  {[
                    { key: 'structure', label: '结构比例无失真' },
                    { key: 'details', label: '关键纹理细节完整' },
                    { key: 'reflection', label: '螺钿物理反光属性达标' }
                  ].map((item) => (
                    <div 
                      key={item.key}
                      onClick={() => stage === 'review' && setChecks(prev => ({...prev, [item.key]: !prev[item.key as keyof typeof checks]}))}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        checks[item.key as keyof typeof checks] 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          checks[item.key as keyof typeof checks] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                       }`}>
                          {checks[item.key as keyof typeof checks] && <CheckCircle2 size={14} />}
                       </div>
                       <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
               </div>

               {stage === 'review' && (
                 <button 
                   disabled={!allChecksPassed}
                   onClick={() => setStage('upload')} // Reset for demo
                   className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                 >
                   <Save size={18} />
                   导出通用 OBJ 资产
                 </button>
               )}
            </div>
        </div>

        {/* Right Panel: Visualization */}
        <div className="lg:col-span-2">
           <div className="bg-slate-900 rounded-2xl h-[600px] relative overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-slate-800">
              
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20" 
                   style={{
                     backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                     backgroundSize: '40px 40px'
                   }}>
              </div>

              {/* Central Visualization */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                 
                 {stage === 'upload' && (
                    <div className="text-center space-y-4 animate-fade-in">
                       <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-xl">
                          <Box size={64} className="text-slate-500" />
                       </div>
                       <p className="text-slate-400 text-lg">等待四视图输入...</p>
                    </div>
                 )}

                 {stage === 'generating' && (
                    <div className="text-center w-full max-w-md space-y-6 animate-fade-in">
                       <div className="relative w-40 h-40 mx-auto">
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
                          <div className="absolute inset-4 rounded-full bg-blue-500/10 flex items-center justify-center backdrop-blur-sm">
                             <Rotate3D size={48} className="text-blue-400 animate-bounce-slight" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-white text-xl font-bold mb-2">Tencent Hunyuan 3D 生成中...</h3>
                          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                             <div 
                               className="bg-gradient-to-r from-blue-500 to-violet-500 h-full transition-all duration-100 ease-linear"
                               style={{ width: `${progress}%` }}
                             ></div>
                          </div>
                          <p className="text-slate-400 text-sm mt-2 font-mono">{progress}% - Mesh Reconstruction</p>
                       </div>
                    </div>
                 )}

                 {stage === 'review' && (
                    <div className="relative w-full h-full flex items-center justify-center cursor-move group">
                       <div className="absolute top-6 left-6 bg-black/50 backdrop-blur px-4 py-2 rounded-lg text-white text-xs border border-white/10 font-mono">
                          Mode: PBR Render<br/>
                          Poly: 124,500<br/>
                          Material: Shell_Iridescent
                       </div>

                       {/* Simulated 3D Object (CSS) */}
                       <div className="w-64 h-64 relative preserve-3d animate-spin-slow hover:pause-animation">
                          {/* Main Cube simulating the object */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-blue-500/80 rounded-xl blur-sm opacity-50 transform translate-z-[-20px]"></div>
                          
                          {/* Front Face (Mother of Pearl texture simulation) */}
                          <div className="absolute inset-0 bg-slate-800 rounded-xl border border-white/20 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                             <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-blue-500/20 to-emerald-500/20 mix-blend-overlay"></div>
                             <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 animate-pulse-fast"></div>
                             <Cuboid size={120} className="text-white/80 drop-shadow-lg" />
                          </div>
                       </div>

                       <div className="absolute bottom-8 text-center">
                          <p className="text-slate-400 text-sm flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full backdrop-blur-sm">
                             <Rotate3D size={14} /> 拖动旋转预览
                          </p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDWorkflow;