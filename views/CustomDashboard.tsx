import React, { useState, useEffect, useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { 
  GripHorizontal, X, Plus, Layout as LayoutIcon, Lock, Unlock, 
  Clock, ScanFace, Gift, TrendingUp, TrendingDown, ShoppingCart, Tag, Zap, MapPin
} from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CategorySalesPie, AudienceRadar } from '../components/Charts';
import { generateSalesData, generateAudienceData } from '../services/mockDataService';

const ResponsiveGridLayout = WidthProvider(Responsive);

// --- Reusable Widget Components ---

// 1. Live Trend Chart Widget
const LiveTrendWidget = () => {
  // Simplified mock data generator for the widget
  const data = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    traffic: 2000 + Math.random() * 1000 + (i > 15 ? 1500 : 0),
    conversion: 2.0 + Math.random() * 1.5 + (i > 15 ? 1.5 : 0),
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
         <h4 className="text-sm font-bold text-slate-700">实时流量转化趋势</h4>
         <div className="flex gap-2 text-[10px]">
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>在线</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400"></div>转化</span>
         </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorTrafficWidget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#cbd5e1" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }} />
            <Area yAxisId="left" type="monotone" dataKey="traffic" stroke="#3b82f6" fill="url(#colorTrafficWidget)" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#fb923c" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 2. Metric Card Widget
const MetricWidget = ({ title, value, unit, trend, icon: Icon, colorClass, bgClass }: any) => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${bgClass}`}>
        <Icon size={20} className={colorClass} />
      </div>
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{trend}</span>
    </div>
    <div>
      <p className="text-slate-500 text-xs font-medium">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <span className="text-xs text-slate-400 font-bold">{unit}</span>
      </div>
    </div>
  </div>
);

// 3. Audience Radar Widget
const AudienceRadarWidget = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { setData(generateAudienceData('螺钿')); }, []);
  
  if (data.length === 0) return null;

  return (
    <div className="h-full flex flex-col">
       <h4 className="text-sm font-bold text-slate-700 mb-2">核心人群特征</h4>
       <div className="flex-1 min-h-0">
          <AudienceRadar data={data[0]} />
       </div>
    </div>
  );
};

// 4. Sales Pie Widget
const SalesPieWidget = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { setData(generateSalesData('非遗')); }, []);

  return (
    <div className="h-full flex flex-col">
       <h4 className="text-sm font-bold text-slate-700 mb-2">品类销售占比</h4>
       <div className="flex-1 min-h-0">
          <CategorySalesPie data={data} />
       </div>
    </div>
  );
};

// --- Main Layout Component ---

const initialLayouts = {
  lg: [
    { i: 'retention', x: 0, y: 0, w: 1, h: 1 },
    { i: 'ar', x: 1, y: 0, w: 1, h: 1 },
    { i: 'luckybag', x: 2, y: 0, w: 1, h: 1 },
    { i: 'sales_total', x: 3, y: 0, w: 1, h: 1 },
    { i: 'trend_chart', x: 0, y: 1, w: 3, h: 2 },
    { i: 'sales_pie', x: 3, y: 1, w: 1, h: 2 },
    { i: 'audience_radar', x: 0, y: 3, w: 2, h: 2 },
    { i: 'persona_text', x: 2, y: 3, w: 2, h: 2 },
  ]
};

const CustomDashboard: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [layouts, setLayouts] = useState(initialLayouts);

  // Use onLayoutChange to update state with all layouts
  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const widgetWrapperClass = `bg-white rounded-xl border p-4 shadow-sm h-full overflow-hidden flex flex-col transition-all duration-200 ${
    isEditMode ? 'border-blue-400 border-dashed cursor-move select-none hover:bg-blue-50/20' : 'border-slate-200 card-interactive'
  }`;

  return (
    <div className="space-y-6 pb-10">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-slide-up">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <LayoutIcon className="text-blue-500" /> 自定义看板
          </h2>
          <p className="text-slate-500 text-sm">拖拽、缩放、组合您的专属数据视图</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setIsEditMode(!isEditMode)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
               isEditMode 
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
             }`}
           >
             {isEditMode ? <><Unlock size={18} /> 完成编辑</> : <><Lock size={18} /> 编辑布局</>}
           </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="animate-fade-in">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={140}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          onLayoutChange={onLayoutChange}
          margin={[16, 16]}
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
        >
          {/* 1. Retention Metric */}
          <div key="retention">
            <div className={widgetWrapperClass}>
              {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
              <MetricWidget 
                title="平均停留时长" 
                value="2.5" 
                unit="min" 
                trend="+40%" 
                icon={Clock} 
                colorClass="text-emerald-600" 
                bgClass="bg-emerald-50" 
              />
            </div>
          </div>

          {/* 2. AR Metric */}
          <div key="ar">
            <div className={widgetWrapperClass}>
              {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
              <MetricWidget 
                title="AR 试戴互动率" 
                value="15.2" 
                unit="%" 
                trend="+8.5%" 
                icon={ScanFace} 
                colorClass="text-violet-600" 
                bgClass="bg-violet-50" 
              />
            </div>
          </div>

          {/* 3. Lucky Bag Metric */}
          <div key="luckybag">
            <div className={widgetWrapperClass}>
              {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
              <MetricWidget 
                title="福袋转化效能" 
                value="High" 
                unit="" 
                trend="Effective" 
                icon={Gift} 
                colorClass="text-pink-600" 
                bgClass="bg-pink-50" 
              />
            </div>
          </div>

          {/* 4. Sales Total Metric */}
          <div key="sales_total">
            <div className={widgetWrapperClass}>
              {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
              <MetricWidget 
                title="本场预估GMV" 
                value="¥85W" 
                unit="" 
                trend="+18%" 
                icon={ShoppingCart} 
                colorClass="text-blue-600" 
                bgClass="bg-blue-50" 
              />
            </div>
          </div>

          {/* 5. Main Trend Chart */}
          <div key="trend_chart">
            <div className={widgetWrapperClass}>
               {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
               <LiveTrendWidget />
            </div>
          </div>

          {/* 6. Sales Pie */}
          <div key="sales_pie">
            <div className={widgetWrapperClass}>
               {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
               <SalesPieWidget />
            </div>
          </div>

          {/* 7. Audience Radar */}
          <div key="audience_radar">
            <div className={widgetWrapperClass}>
               {isEditMode && <div className="drag-handle absolute top-2 right-2 text-blue-400 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
               <AudienceRadarWidget />
            </div>
          </div>

          {/* 8. Text Persona Widget */}
          <div key="persona_text">
            <div className={`${widgetWrapperClass} bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none`}>
               {isEditMode && <div className="drag-handle absolute top-2 right-2 text-white/50 z-50 cursor-grab active:cursor-grabbing"><GripHorizontal size={16}/></div>}
               <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                     <Zap size={18} className="text-yellow-300" />
                     <h4 className="font-bold text-white/90">AI 智能洞察</h4>
                  </div>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                     核心人群锁定 <span className="font-bold text-white">18-24岁 Z世代</span>。
                     <br/>
                     <br/>
                     非遗文化与潮流盲盒的跨界结合是本次高转化率的关键驱动力。
                  </p>
                  <div className="flex gap-2 mt-auto">
                     <span className="px-2 py-1 bg-white/10 rounded text-xs">螺钿工艺</span>
                     <span className="px-2 py-1 bg-white/10 rounded text-xs">国潮</span>
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 opacity-10">
                  <ScanFace size={100} />
               </div>
            </div>
          </div>

        </ResponsiveGridLayout>
      </div>

      {isEditMode && (
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-slide-up z-50">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium">编辑模式已开启：请拖拽调整位置或拉伸改变大小</span>
         </div>
      )}
    </div>
  );
};

export default CustomDashboard;