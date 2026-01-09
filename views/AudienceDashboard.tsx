import React, { useState, useEffect } from 'react';
import { KEYWORDS, AudienceData } from '../types';
import { generateAudienceData } from '../services/mockDataService';
import { AudienceRadar } from '../components/Charts';
import { User, Heart, MapPin, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AudienceDashboard: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('螺钿');
  const [audienceData, setAudienceData] = useState<AudienceData[]>([]);

  useEffect(() => {
    setAudienceData(generateAudienceData(selectedKeyword));
  }, [selectedKeyword]);

  const activeProfile = audienceData.length > 0 ? audienceData[0] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm card-interactive">
        <div>
           <h2 className="text-xl font-bold text-slate-800 mb-1">受众画像洞察</h2>
           <p className="text-slate-500 text-sm">基于全网交互数据分析</p>
        </div>
        <select 
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg block w-40 p-2.5 outline-none font-medium select-focus"
          >
            {KEYWORDS.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Persona Card */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-6 text-center relative overflow-hidden shadow-lg shadow-indigo-500/20 text-white card-interactive group cursor-default">
           <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
              <Zap size={100} />
           </div>
           
           <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4 border-4 border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <User size={40} className="text-white" />
           </div>
           <h3 className="text-xl font-bold mb-1 group-hover:text-violet-100 transition-colors">核心人群画像</h3>
           <p className="text-indigo-200 font-medium mb-8 text-sm bg-black/10 inline-block px-3 py-1 rounded-full border border-white/5 tag-interactive">
              "{(activeProfile?.ageGroup === '18-24') ? 'Z世代潮流先锋' : '新中产文化爱好者'}"
           </p>
           
           <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors tag-interactive">
                <span className="text-xs text-indigo-200 block mb-1">主要年龄段</span>
                <span className="text-white font-bold text-lg">{activeProfile?.ageGroup}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors tag-interactive">
                <span className="text-xs text-indigo-200 block mb-1">性别偏好</span>
                <span className="text-white font-bold text-lg">{activeProfile?.genderRatio.female}% 女性</span>
              </div>
           </div>
           
           <div className="mt-6 text-left">
              <span className="text-xs text-indigo-200 block mb-2">兴趣标签</span>
              <div className="flex flex-wrap gap-2">
                 {activeProfile?.topInterests.map(i => (
                   <span key={i} className="px-2 py-1 bg-white text-indigo-700 rounded-md text-xs font-bold tag-interactive shadow-sm">{i}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Age Distribution Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive">
           <h3 className="text-lg font-bold text-slate-800 mb-6">年龄分布</h3>
           <ResponsiveContainer width="100%" height={250}>
             <BarChart data={audienceData}>
               <XAxis dataKey="ageGroup" stroke="#64748b" tickLine={false} axisLine={false} />
               <YAxis stroke="#64748b" tickLine={false} axisLine={false} hide />
               <Tooltip 
                 cursor={{fill: 'transparent'}}
                 contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                 itemStyle={{ color: '#334155' }}
               />
               <Bar dataKey="percentage" name="占比 (%)" radius={[8, 8, 8, 8]} barSize={50}>
                 {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'][index % 4]} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Radar Chart */}
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive">
            <h3 className="text-lg font-bold text-slate-800 mb-4">人群特征雷达图</h3>
            {activeProfile && <AudienceRadar data={activeProfile} />}
         </div>

         {/* Geo & Preferences */}
         <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive group">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <MapPin className="text-red-500 group-hover:bounce-slight" size={18}/> 地域分布 Top 5
               </h3>
               <div className="space-y-4">
                  {['广东', '江苏', '浙江', '上海', '四川'].map((city, idx) => (
                    <div key={city} className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-default tag-interactive">
                       <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-bold">{idx + 1}</span>
                       <span className="flex-1 text-sm text-slate-700 font-medium">{city}</span>
                       <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div style={{width: `${100 - idx * 15}%`}} className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Heart className="text-pink-500" size={18}/> 内容形式偏好
               </h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-pink-50 rounded-xl border border-pink-100 hover:bg-pink-100 hover:border-pink-200 transition-all cursor-default tag-interactive">
                    <div className="text-3xl font-extrabold text-pink-600 mb-1">68%</div>
                    <div className="text-xs font-bold text-pink-400">偏好 短视频展示</div>
                 </div>
                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all cursor-default tag-interactive">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">24%</div>
                    <div className="text-xs font-bold text-blue-400">偏好 图文笔记</div>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AudienceDashboard;