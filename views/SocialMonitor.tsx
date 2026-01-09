import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine, ComposedChart
} from 'recharts';
import { 
  Clock, ScanFace, Gift, TrendingUp, TrendingDown, Users, 
  MousePointerClick, AlertCircle, Play, Pause, ChevronRight
} from 'lucide-react';
import { generateInsights } from '../services/geminiService';

// Mock Data optimized for the specific scenario
const generateLiveSessionData = () => {
  const data = [];
  const totalMinutes = 120; // 2 hour live
  
  for (let i = 0; i <= totalMinutes; i += 5) {
    let traffic = 2000 + Math.random() * 500 + (i < 30 ? i * 50 : 0); // Ramp up
    let conversion = 2.5 + Math.random() * 0.5;

    // Scenario: Mid-stream dip (fatigue)
    if (i > 60 && i < 90) {
      conversion -= 1.2; 
      traffic -= 300;
    }

    // Scenario: AR Launch impact (e.g., at min 40)
    if (i === 40 || i === 45) {
       traffic += 800;
       conversion += 1.5;
    }

    // Scenario: Lucky Bag (福袋) at the end (min 100)
    if (i >= 100) {
      traffic += 1500; // Huge traffic spike
      conversion += 2.0; // Conversion spike
    }

    data.push({
      time: `${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`,
      minute: i,
      traffic: Math.floor(traffic),
      conversion: parseFloat(conversion.toFixed(2)),
      arActive: i >= 40 && i <= 50,
      luckyBag: i >= 100 && i <= 110,
    });
  }
  return data;
};

const LiveReplay: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  useEffect(() => {
    // Initial load animation
    const fullData = generateLiveSessionData();
    setData(fullData);
    setPlayIndex(fullData.length);
  }, []);

  // Animation logic for "Replay" mode
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayIndex(prev => {
          if (prev >= data.length) {
            setIsPlaying(false);
            return data.length;
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data]);

  const displayedData = data.slice(0, playIndex);

  const metrics = [
    {
      id: 'retention',
      title: '平均停留时长',
      value: '2.5',
      unit: 'min',
      trend: '+40%',
      trendUp: true,
      icon: Clock,
      desc: '高于行业均值 (1.8min)',
      color: 'from-emerald-500 to-teal-400',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600'
    },
    {
      id: 'ar',
      title: 'AR 试戴互动率',
      value: '15.2',
      unit: '%',
      trend: '+8.5%',
      trendUp: true,
      icon: ScanFace,
      desc: '本场核心互动亮点',
      color: 'from-violet-500 to-purple-500',
      bg: 'bg-violet-50',
      text: 'text-violet-600'
    },
    {
      id: 'luckybag',
      title: '福袋挽留转化',
      value: 'High',
      unit: '',
      trend: 'Effective',
      trendUp: true,
      icon: Gift,
      desc: '下播前成功拉回流量',
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50',
      text: 'text-pink-600'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
        <div>
           <div className="flex items-center gap-2 mb-1 cursor-default group">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 uppercase tracking-wide group-hover:bg-red-500 group-hover:text-white transition-colors">Live Replay</span>
              <span className="text-slate-400 text-sm font-mono hover:text-slate-600 transition-colors">ID: #88392024</span>
           </div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tight cursor-default hover:text-blue-600 transition-colors">螺钿非遗专场 · 数据复盘</h2>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => { setPlayIndex(0); setIsPlaying(true); }}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold btn-interactive shadow-sm border ${
               isPlaying 
                 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-100' 
                 : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-blue-300 hover:text-blue-600'
             }`}
           >
             {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
             {isPlaying ? '复盘回放中...' : '播放数据回放'}
           </button>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div 
            key={m.id}
            onClick={() => setActiveHighlight(activeHighlight === m.id ? null : m.id)}
            className={`relative overflow-hidden rounded-2xl p-6 card-interactive border group ${
               activeHighlight === m.id 
                 ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-400 bg-blue-50/10' 
                 : 'bg-white border-slate-100'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
             <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20`}></div>
             
             <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${m.bg} ${m.text} transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                   <m.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${m.trendUp ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-red-50 text-red-600'}`}>
                   {m.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                   {m.trend}
                </div>
             </div>
             
             <div className="relative z-10">
                <p className="text-slate-500 font-medium text-sm mb-1 group-hover:text-slate-600">{m.title}</p>
                <div className="flex items-baseline gap-1">
                   <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 transition-all">{m.value}</h3>
                   <span className="text-slate-400 font-bold">{m.unit}</span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100 group-hover:border-slate-200 group-hover:bg-white transition-colors">
                  {m.desc}
                </p>
             </div>
             
             {/* Interaction Hint */}
             <div className={`absolute bottom-4 right-4 text-slate-300 transition-all duration-300 ${activeHighlight === m.id ? 'opacity-100 text-blue-500 scale-125' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}`}>
                <MousePointerClick size={16} />
             </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col card-interactive">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h3 className="text-lg font-bold text-slate-800">流量与转化全景趋势</h3>
                  <p className="text-sm text-slate-400">分钟级数据 | 双轴分析</p>
               </div>
               <div className="flex items-center gap-4 text-xs font-bold cursor-default">
                  <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 transition-colors tag-interactive">
                     <span className="w-3 h-3 rounded-full bg-blue-500"></span> 在线人数
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 transition-colors tag-interactive">
                     <span className="w-3 h-3 rounded-full bg-orange-400"></span> 转化率(CVR)
                  </div>
               </div>
            </div>

            <div className="flex-1 min-h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={displayedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                     <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                     <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                     <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} unit="%" />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ fontWeight: 600 }}
                        labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
                     />
                     
                     {/* Areas where specific events happened */}
                     {activeHighlight === 'ar' && (
                        <ReferenceLine x="00:40" stroke="#8b5cf6" strokeDasharray="3 3" label={{ position: 'top', value: 'AR互动开启', fill: '#8b5cf6', fontSize: 12 }} />
                     )}
                     {activeHighlight === 'luckybag' && (
                        <ReferenceLine x="01:40" stroke="#ec4899" strokeDasharray="3 3" label={{ position: 'top', value: '福袋发放', fill: '#ec4899', fontSize: 12 }} />
                     )}

                     <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="traffic" 
                        name="实时在线"
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#colorTraffic)" 
                        animationDuration={500}
                     />
                     <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="conversion" 
                        name="转化率"
                        stroke="#fb923c" 
                        strokeWidth={3}
                        dot={false}
                        animationDuration={500}
                     />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Insights & Key Highlights */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden card-interactive group ring-1 ring-white/20">
               <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
                  <ScanFace size={120} />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md shadow-inner group-hover:bg-white/30 transition-colors">
                        <TrendingUp size={16} className="text-white" />
                     </span>
                     <span className="font-bold text-indigo-100 uppercase text-xs tracking-wider">Engagement Insight</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">AR 互动效果显著</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed opacity-90 mb-4">
                     通过“虚拟试戴”功能，用户平均停留时长显著提升至 <span className="font-bold text-white bg-white/20 px-1 rounded hover:bg-white/30 cursor-default transition-colors tag-interactive">2.5分钟</span>，远超行业均值。
                  </p>
                  
                  <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors cursor-default">
                     <div>
                        <div className="text-xs text-indigo-200">互动点击率</div>
                        <div className="text-lg font-bold">15.2%</div>
                     </div>
                     <div className="h-8 w-px bg-white/20"></div>
                     <div>
                        <div className="text-xs text-indigo-200">转化贡献</div>
                        <div className="text-lg font-bold">+8.5%</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative card-interactive group">
               <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-2xl transition-all group-hover:w-2"></div>
               <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Gift size={18} className="text-pink-500 group-hover:scale-125 group-hover:rotate-12 transition-transform"/> 策略复盘
               </h3>
               <div className="space-y-4">
                  <div className="flex gap-3 group/item">
                     <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-slate-300 group-hover/item:bg-slate-400 transition-colors"></div>
                     </div>
                     <div>
                        <p className="text-sm text-slate-600 font-medium group-hover/item:text-slate-900 transition-colors">中期疲软预警</p>
                        <p className="text-xs text-slate-400 mt-1">直播进行至60-90分钟时，流量与转化出现明显下滑。</p>
                     </div>
                  </div>
                  <div className="flex gap-3 group/item">
                     <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-pulse"></div>
                     </div>
                     <div>
                        <p className="text-sm text-slate-800 font-bold group-hover/item:text-pink-600 transition-colors">福袋策略生效</p>
                        <p className="text-xs text-slate-500 mt-1">
                           运营团队在 <span className="text-pink-600 font-bold">01:40</span> 发放高价值福袋，成功拉回在线人数，并带动尾盘转化率回升。
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LiveReplay;