import React, { useState, useEffect } from 'react';
import { KEYWORDS, SalesData, KeywordAnalysis } from '../types';
import { generateSalesData, generateCommentKeywords } from '../services/mockDataService';
import { CategorySalesPie, PlatformComparisonBar } from '../components/Charts';
import { ShoppingCart, Tag, AlertCircle, TrendingUp } from 'lucide-react';

const EcommerceAnalysis: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('非遗'); 
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [commentKeywords, setCommentKeywords] = useState<KeywordAnalysis[]>([]);

  useEffect(() => {
    const sales = generateSalesData(selectedKeyword);
    const comments = generateCommentKeywords(selectedKeyword);
    setSalesData(sales);
    setCommentKeywords(comments);
  }, [selectedKeyword]);

  const totalRevenue = salesData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalUnits = salesData.reduce((acc, curr) => acc + curr.units, 0);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm card-interactive">
        <div>
           <h2 className="text-xl font-bold text-slate-800 mb-1">电商数据分析</h2>
           <p className="text-slate-500 text-sm">覆盖 抖音商城 / 天猫京东 / 微店</p>
        </div>
        <select 
            value={selectedKeyword}
            onChange={(e) => setSelectedKeyword(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg block w-40 p-2.5 outline-none font-medium select-focus"
          >
            {KEYWORDS.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 flex items-center justify-between text-white shadow-lg shadow-blue-500/20 card-interactive group">
             <div>
                <p className="text-blue-100 text-sm mb-1 font-medium group-hover:text-white transition-colors">总销售额 (预估)</p>
                <h3 className="text-3xl font-bold">¥ {totalRevenue.toLocaleString()}</h3>
                <div className="mt-2 text-xs bg-white/20 w-fit px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                   <TrendingUp size={12}/>
                   环比增长 18%
                </div>
             </div>
             <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <ShoppingCart className="text-white w-8 h-8" />
             </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm card-interactive group">
             <div>
                <p className="text-slate-500 text-sm mb-1 font-medium group-hover:text-slate-800 transition-colors">总销量 (件)</p>
                <h3 className="text-3xl font-bold text-slate-800">{totalUnits.toLocaleString()}</h3>
                <div className="mt-2 text-xs text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded flex items-center gap-1 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                   <TrendingUp size={12}/>
                   库存周转率优
                </div>
             </div>
             <div className="p-4 bg-emerald-50 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <Tag className="text-emerald-500 w-8 h-8" />
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive">
           <h3 className="text-lg font-bold text-slate-800 mb-4">各品类销售占比</h3>
           <CategorySalesPie data={salesData} />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive">
           <h3 className="text-lg font-bold text-slate-800 mb-4">分平台销售表现</h3>
           <PlatformComparisonBar data={salesData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Comment Keywords */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive">
            <h3 className="text-lg font-bold text-slate-800 mb-6">用户评论高频词云</h3>
            <div className="flex flex-wrap gap-3">
               {commentKeywords.map((kw, idx) => (
                  <span 
                    key={idx}
                    className={`px-4 py-2 rounded-full text-sm font-bold tag-interactive shadow-sm hover:shadow-md ${
                       kw.sentiment === 'positive' 
                         ? 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:text-blue-700'
                         : 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 hover:text-red-600'
                    }`}
                    style={{ fontSize: Math.max(12, 20 - idx * 0.8) }} 
                  >
                    {kw.word} <span className="opacity-60 text-xs ml-1 font-normal">{kw.count}</span>
                  </span>
               ))}
            </div>
         </div>
         
         {/* Price Distribution */}
         <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm card-interactive group">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500 group-hover:rotate-12 transition-transform"/>
              价格区间洞察
            </h3>
            <div className="space-y-6">
              <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                   <div className="text-xs font-bold inline-block text-slate-600">低价位 (0-100¥)</div>
                   <div className="text-xs font-bold inline-block text-slate-600">45%</div>
                 </div>
                 <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
                   <div style={{ width: "45%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 group-hover:bg-blue-400 transition-colors duration-300"></div>
                 </div>
              </div>

              <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                   <div className="text-xs font-bold inline-block text-slate-600">中价位 (101-500¥)</div>
                   <div className="text-xs font-bold inline-block text-slate-600">35%</div>
                 </div>
                 <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
                   <div style={{ width: "35%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-violet-500 group-hover:bg-violet-400 transition-colors duration-300"></div>
                 </div>
              </div>

              <div className="relative pt-1">
                 <div className="flex mb-2 items-center justify-between">
                   <div className="text-xs font-bold inline-block text-slate-600">高价位 (500¥+)</div>
                   <div className="text-xs font-bold inline-block text-slate-600">20%</div>
                 </div>
                 <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
                   <div style={{ width: "20%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 group-hover:bg-amber-400 transition-colors duration-300"></div>
                 </div>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-100 font-medium group-hover:bg-amber-100 group-hover:border-amber-200 transition-colors">
                 💡 提示: 螺钿/漆器类非遗产品在500元+区间溢价能力最强，但转化周期较长。
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EcommerceAnalysis;