import React, { ReactNode } from 'react';
import { LayoutDashboard, ShoppingBag, Users, Activity, Menu, X, Box, Radio, Grid } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'custom', label: '自定义看板', icon: Grid },
    { id: 'replay', label: '本场直播复盘', icon: Radio },
    { id: 'ecommerce', label: '电商销售分析', icon: ShoppingBag },
    { id: 'audience', label: '受众画像洞察', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-10 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 cursor-default select-none group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
             <Box size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">鲍罗万象</h1>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider">直播复盘系统</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium group relative overflow-hidden btn-interactive ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-md shadow-blue-500/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${activeTab === item.id ? 'block' : 'hidden'}`}></div>
              <item.icon size={20} className={`transition-transform duration-300 ${activeTab === item.id ? 'text-white scale-110' : 'text-slate-400 group-hover:scale-110 group-hover:text-blue-500'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-500 shadow-inner card-interactive select-none">
            <p className="font-bold text-slate-700 mb-2">系统状态</p>
            <div className="flex items-center gap-2 mb-1.5 group cursor-help">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:scale-150 transition-transform"></span>
              <span className="group-hover:text-emerald-600 transition-colors">数据流: 实时同步</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse group-hover:scale-150 transition-transform"></span>
              <span className="group-hover:text-blue-600 transition-colors">AI 引擎: 在线</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-violet-600 rounded flex items-center justify-center text-white">
             <Box size={18} />
           </div>
           <span className="font-bold text-lg text-slate-800">鲍罗万象</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2 rounded-lg hover:bg-slate-100 btn-interactive">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-4 space-y-4 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-bold shadow-sm btn-interactive ${
                 activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'
              }`}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8 relative bg-slate-50/50">
         <div className="max-w-7xl mx-auto h-full">
            {children}
         </div>
      </main>
    </div>
  );
};

export default Layout;