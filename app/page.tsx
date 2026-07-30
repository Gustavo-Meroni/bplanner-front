"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  PieChart, 
  Plus, 
  Trash2, 
  Check, 
  Wallet, 
  Target, 
  CalendarDays,
  Menu,
  X
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import { motion, AnimatePresence } from 'motion/react';

// --- HELPERS ---
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// --- TYPES ---
type Item = {
  id: string;
  name: string;
  value: number;
  checked: boolean;
  mes?: string;
};

type Category = {
  id: string;
  name: string;
  items: Item[];
};

type Profile = {
  id: string;
  name: string;
  limit: number;
  categories: Category[];
};

type Aporte = {
  id: string;
  descricao: string;
  valor: number;
  data: string;
};

type AppState = {
  tripGoal: number;
  aportes: Aporte[];
  profiles: Profile[];
};

type ViewState = 'home' | 'gestao';

const mesesViagem = ['Jul/2026', 'Ago/2026', 'Set/2026', 'Out/2026', 'Nov/2026', 'Dez/2026', 'Jan/2027', 'Fev/2027'];

// --- INITIAL STATE ---
const INITIAL_STATE: AppState = {
  tripGoal: 3720.00,
  aportes: [{ id: '1', descricao: 'Saldo Inicial (Julho)', valor: 900.00, data: new Date().toISOString() }],
  profiles: [
    {
      id: 'p1',
      name: 'Planejamento Gu',
      limit: 1200,
      categories: [
        {
          id: 'c1',
          name: 'Agosto/2026',
          items: [
            { id: 'i1', name: 'Airbnb', value: 131.66, checked: false },
            { id: 'i2', name: 'Investimento', value: 200.00, checked: false },
            { id: 'i3', name: 'Reposição Reserva', value: 266.00, checked: false }
          ]
        }
      ]
    },
    {
      id: 'p2',
      name: 'Planejamento Rafa',
      limit: 500,
      categories: [
        {
          id: 'c2',
          name: 'Agosto/2026',
          items: [
            { id: 'i5', name: 'Airbnb', value: 131.66, checked: false }
          ]
        }
      ]
    }
  ]
};

// --- SHARED COMPONENTS ---
const InlineNumberEdit = ({ value, onSave, className = '' }: { value: number, onSave: (val: number) => void, className?: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const parsed = parseFloat(tempValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onSave(parsed);
    } else {
      setTempValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-slate-400 text-sm font-normal">R$</span>
        <input
          ref={inputRef}
          type="number"
          step="0.01"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-24 px-1 py-0 border-b-2 border-[#2E6F40] bg-white outline-none text-[#253D2C] font-medium"
        />
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer hover:bg-slate-100 px-1.5 py-0.5 rounded-md transition-colors ${className}`}
      onClick={() => {
        setTempValue(value.toString());
        setIsEditing(true);
      }}
    >
      {formatCurrency(value)}
    </div>
  );
};

const InlineTextEdit = ({ value, onSave, className = '', placeholder = 'Nome' }: { value: string, onSave: (val: string) => void, className?: string, placeholder?: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (tempValue.trim()) {
      onSave(tempValue.trim());
    } else {
      setTempValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-1 py-0 border-b-2 border-[#2E6F40] bg-white outline-none text-[#253D2C] font-medium"
      />
    );
  }

  return (
    <div 
      className={`cursor-pointer hover:bg-slate-100 px-1 py-0.5 rounded-md transition-colors truncate ${className}`}
      onClick={() => {
        setTempValue(value);
        setIsEditing(true);
      }}
      title="Clique para editar"
    >
      {value || <span className="text-slate-400 italic">{placeholder}</span>}
    </div>
  );
};

// --- UI COMPONENTS ---
const Sidebar = ({ currentView, onViewChange, isMobileOpen, setMobileOpen }: { currentView: ViewState, onViewChange: (v: ViewState) => void, isMobileOpen: boolean, setMobileOpen: (v: boolean) => void }) => {
  const navItems = [
    { id: 'home' as ViewState, label: 'Dashboard', icon: Home },
    { id: 'gestao' as ViewState, label: 'Gestão de Gastos', icon: PieChart },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#253D2C] to-[#2E6F40] rounded-xl shadow-md text-white">
                <Target size={22} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#253D2C]">BA <span className="text-[#2E6F40]">2026</span></h2>
            </div>
            <button className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    active 
                      ? 'bg-[#2E6F40] text-white font-semibold shadow-sm border border-[#253D2C]/10' 
                      : 'text-slate-500 hover:bg-[#CFFFDC]/50 hover:text-[#253D2C] font-medium'
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? 'text-white' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#CFFFDC] flex items-center justify-center text-[#2E6F40] font-bold text-xs">GR</div>
                <div className="text-sm font-semibold text-[#253D2C]">Casal Planejador</div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-bold text-slate-500">STATUS: POUPANDO</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const BarChartWidget = ({ metaViagem, data }: { metaViagem: number, data: any[] }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 h-full flex flex-col min-h-[400px]">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-6 flex-shrink-0">Aportes Mensais</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `R$${val}`} width={60} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
              formatter={(value: any) => [formatCurrency(Number(value)), 'Valor']}
            />
            <ReferenceLine y={metaViagem} stroke="#253D2C" strokeDasharray="3 3" label={{ position: 'top', value: 'Meta', fill: '#253D2C', fontSize: 11 }} />
            <Bar dataKey="acumulado" fill="#2E6F40" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SuperMetaCard = ({ current, goal, onUpdateGoal }: { current: number, goal: number, onUpdateGoal: (v: number) => void }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-between h-full transition-shadow hover:shadow-md min-h-[160px]">
      <div>
         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
           Meta da Viagem (Essencial)
         </span>
         <div className="text-4xl font-black tracking-tight text-[#253D2C] mt-2">
           <InlineNumberEdit value={goal} onSave={onUpdateGoal} className="-ml-1.5" />
         </div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#2E6F40] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs font-medium text-slate-500">
           Faltam <span className="font-semibold text-slate-700">{formatCurrency(remaining)}</span> para atingir a meta
        </div>
      </div>
    </div>
  );
};

const DespesasPanel = ({ totalPagas, totalDevido, activeMonth }: { totalPagas: number, totalDevido: number, activeMonth: string }) => {
  const percentage = totalDevido > 0 ? Math.round((totalPagas / totalDevido) * 100) : 100;
  
  let strokeColor = "#2E6F40";
  let bgColor = "#f1f5f9"; // slate-100
  let textColor = "text-[#2E6F40]";
  
  if (percentage < 100 && totalDevido > 0) {
    strokeColor = "#e2a7a4";
    textColor = "text-[#c27b78]";
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-8 h-full transition-shadow hover:shadow-md min-h-[160px]">
      {/* SVG Donut */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={bgColor}
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-xl font-bold ${textColor}`}>{percentage}%</span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
           Progresso do Mês • {activeMonth}
         </span>
         <div className="mt-2 space-y-1">
           <div className="text-2xl font-bold text-[#253D2C]">{formatCurrency(totalPagas)}</div>
           <div className="text-sm font-medium text-slate-400">de {formatCurrency(totalDevido)}</div>
         </div>
      </div>
    </div>
  );
};

// --- VIEWS ---
const DashboardHome = ({ state, totalEmCaixa, onUpdateTripGoal, activeMonth }: { state: AppState, totalEmCaixa: number, onUpdateTripGoal: (v: number) => void, activeMonth: string }) => {
  let totalPagas = 0;
  let totalDevido = 0;
  const todosRecentes: {id: string, name: string, value: number, profileName: string}[] = [];

  state.profiles.forEach(p => p.categories.forEach(c => c.items.forEach(i => {
    const itemMes = i.mes || 'Ago/2026';
    if (itemMes === activeMonth) {
      totalDevido += i.value;
      if (i.checked) {
        totalPagas += i.value;
      }
    }
    if (i.checked) {
      todosRecentes.push({...i, profileName: p.name});
    }
  })));

  const recentes = todosRecentes.reverse();
  const valorLazer = Math.max(totalEmCaixa - state.tripGoal, 0);

  const chartData = mesesViagem.map((mes) => {
    const aportesNoMes = (state.aportes || []).filter(a => {
      if (!a.data) return mes === 'Jul/2026';
      const d = new Date(a.data);
      const mName = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()];
      return `${mName}/${d.getFullYear()}` === mes;
    });
    const somaMes = aportesNoMes.reduce((sum, a) => sum + a.valor, 0);
    return { name: mes.split('/')[0], acumulado: somaMes };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* LINHA SUPERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuperMetaCard 
          current={Math.min(totalEmCaixa, state.tripGoal)} 
          goal={state.tripGoal} 
          onUpdateGoal={onUpdateTripGoal}
        />
        <DespesasPanel 
          totalPagas={totalPagas}
          totalDevido={totalDevido}
          activeMonth={activeMonth}
        />
      </div>

      {/* LINHA INFERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna Esquerda: 25% */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center items-start min-h-[120px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total em Caixa (Lazer)</span>
            <span className="text-2xl font-bold text-[#2E6F40] mt-1">{formatCurrency(valorLazer)}</span>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden min-h-[240px]">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-5 flex-shrink-0">Últimos Pagamentos</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {recentes.slice(0, 3).length === 0 ? (
                <div className="text-sm text-slate-400 italic mt-2">Nenhum item marcado ainda.</div>
              ) : (
                recentes.slice(0, 3).map((item, idx) => (
                  <div key={item.id + idx} className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center min-w-0">
                      <span className="text-sm font-medium text-[#253D2C] truncate">{item.name}</span>
                      <span className="text-sm font-semibold text-[#2E6F40] flex-shrink-0 pl-2">{formatCurrency(item.value)}</span>
                    </div>
                    <span className="text-xs text-slate-400 truncate">{item.profileName}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Coluna Direita: 75% */}
        <div className="lg:col-span-3 flex">
          <div className="flex-1 w-full min-h-[360px] lg:min-h-0">
            <BarChartWidget metaViagem={state.tripGoal} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const GestaoView = ({ state, updateProfile, addAporte, deleteAporte, updateCategoryName, addCategory, deleteCategory, addItem, updateItem, deleteItem, activeMonth, setActiveMonth }: any) => {
  const [novoAporteDesc, setNovoAporteDesc] = useState('');
  const [novoAporteValor, setNovoAporteValor] = useState('');
  
  const calculateProfileTotal = (profile: Profile) => {
    return profile.categories.reduce((acc, cat) => {
      return acc + cat.items.reduce((itemAcc, item) => {
        const itemMes = item.mes || 'Ago/2026';
        return itemMes === activeMonth ? itemAcc + item.value : itemAcc;
      }, 0);
    }, 0);
  };

  const handleAddAporte = () => {
    if (!novoAporteDesc.trim() || !novoAporteValor) return;
    const val = parseFloat(novoAporteValor);
    if (isNaN(val) || val <= 0) return;
    addAporte(novoAporteDesc, val);
    setNovoAporteDesc('');
    setNovoAporteValor('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Cofre da Viagem */}
      <section className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200">
         <h2 className="text-xl font-bold text-[#253D2C] tracking-tight mb-4">Cofre da Viagem</h2>
         <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-[#CFFFDC]/30 border border-[#CFFFDC]/50 rounded-2xl">
               <div className="flex-1 w-full">
                 <input 
                   type="text" 
                   placeholder="Descrição (ex: Agosto - Gustavo)" 
                   className="w-full px-3 py-2 bg-white border border-[#68BA7F]/30 rounded-xl outline-none focus:border-[#2E6F40] text-sm text-[#253D2C]"
                   value={novoAporteDesc}
                   onChange={(e) => setNovoAporteDesc(e.target.value)}
                 />
               </div>
               <div className="flex w-full sm:w-auto items-center gap-3">
                 <div className="relative w-full sm:w-32">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                   <input 
                     type="number" 
                     placeholder="0.00" 
                     className="w-full pl-8 pr-3 py-2 bg-white border border-[#68BA7F]/30 rounded-xl outline-none focus:border-[#2E6F40] text-sm text-[#2E6F40] font-bold"
                     value={novoAporteValor}
                     onChange={(e) => setNovoAporteValor(e.target.value)}
                   />
                 </div>
                 <button 
                   onClick={handleAddAporte}
                   className="px-4 py-2 bg-[#2E6F40] text-white rounded-xl hover:bg-[#253D2C] transition-colors font-semibold text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
                 >
                   <Plus size={16} /> Adicionar
                 </button>
               </div>
            </div>
            
            <div className="space-y-2 mt-4">
               {(state.aportes || []).map((aporte: Aporte) => (
                 <div key={aporte.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#CFFFDC] flex items-center justify-center text-[#2E6F40]">
                       <Wallet size={16} />
                     </div>
                     <span className="text-sm font-semibold text-[#253D2C]">{aporte.descricao}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-sm font-bold text-[#2E6F40]">{formatCurrency(aporte.valor)}</span>
                     <button 
                       onClick={() => deleteAporte(aporte.id)}
                       className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
               ))}
               {(!state.aportes || state.aportes.length === 0) && (
                 <div className="text-sm text-slate-400 italic text-center p-4">Nenhum aporte registrado.</div>
               )}
            </div>
         </div>
      </section>

      {/* Tabs de Meses */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
        {mesesViagem.map(m => (
          <button
            key={m}
            onClick={() => setActiveMonth(m)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeMonth === m
                ? 'bg-[#2E6F40] text-white shadow-md'
                : 'bg-white text-slate-500 hover:bg-[#CFFFDC]/50 border border-slate-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {state.profiles.map((profile: Profile) => {
        const profileTotal = calculateProfileTotal(profile);
        const percentage = Math.min((profileTotal / profile.limit) * 100, 100);
        const isOverLimit = profileTotal > profile.limit;

        return (
          <section key={profile.id} className="flex flex-col bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Profile Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-[#253D2C] tracking-tight">{profile.name}</h2>
                <div className="text-right flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                   <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Teto</span>
                   <InlineNumberEdit 
                     value={profile.limit} 
                     onSave={(val) => updateProfile(profile.id, (p: Profile) => ({ ...p, limit: val }))}
                     className="text-sm font-bold text-[#253D2C] bg-transparent -mr-1.5"
                   />
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                 <div className="flex justify-between text-sm items-end">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-xs">
                       Cadastrado
                    </span>
                    <span className={`text-xl font-black ${isOverLimit ? 'text-red-500' : 'text-[#253D2C]'}`}>
                       {formatCurrency(profileTotal)}
                    </span>
                 </div>
                 <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${isOverLimit ? 'bg-red-500' : 'bg-[#68BA7F]'}`}
                      style={{ width: `${percentage}%` }}
                    />
                 </div>
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 sm:p-6 space-y-6">
              {profile.categories.map((category: Category) => (
                <div key={category.id} className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden group/cat">
                  {/* Category Header */}
                  <div className="bg-slate-50/40 px-5 py-4 flex items-center justify-between border-b border-slate-100">
                     <InlineTextEdit 
                        value={category.name} 
                        onSave={(val) => updateCategoryName(profile.id, category.id, val)}
                        className="font-bold text-[#253D2C] text-sm sm:text-base -ml-1.5"
                     />
                     <div className="flex items-center gap-1 sm:opacity-0 group-hover/cat:opacity-100 transition-opacity">
                       <button 
                         onClick={() => addItem(profile.id, category.id)}
                         className="p-2 text-[#2E6F40] hover:bg-[#CFFFDC] rounded-xl transition-colors"
                         title="Adicionar Item"
                       >
                         <Plus size={16} strokeWidth={2.5} />
                       </button>
                       <button 
                         onClick={() => deleteCategory(profile.id, category.id)}
                         className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                         title="Excluir Subcategoria"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                  </div>
                  
                  {/* Items List */}
                  <div className="divide-y divide-slate-50">
                     {category.items.filter((i: Item) => (i.mes || 'Ago/2026') === activeMonth).length === 0 ? (
                       <div className="p-6 text-center text-sm text-slate-400 italic">
                         Nenhum item adicionado nesta subcategoria para {activeMonth}.
                       </div>
                     ) : (
                       category.items.filter((i: Item) => (i.mes || 'Ago/2026') === activeMonth).map((item: Item) => {
                         const isChecked = item.checked;
                         return (
                           <div key={item.id} className={`flex items-center px-4 sm:px-5 py-3.5 gap-3 group/item transition-colors hover:bg-slate-50/50`}>
                             {/* Checkbox */}
                             <button
                               onClick={() => updateItem(profile.id, category.id, item.id, (i: Item) => ({ ...i, checked: !i.checked }))}
                               className={`w-6 h-6 rounded-md flex-shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${
                                 isChecked 
                                 ? 'bg-[#2E6F40] border-[#2E6F40] text-white shadow-sm' 
                                 : 'border-slate-300 text-transparent hover:border-[#68BA7F] bg-white'
                               }`}
                             >
                               <Check size={14} strokeWidth={3} />
                             </button>
                             
                             {/* Name */}
                             <div className="flex-1 min-w-0 flex items-center">
                                <InlineTextEdit 
                                   value={item.name} 
                                   onSave={(val) => updateItem(profile.id, category.id, item.id, (i: Item) => ({ ...i, name: val }))}
                                   className={`flex-1 text-sm sm:text-base font-medium ${isChecked ? 'text-slate-400 line-through' : 'text-[#253D2C]'}`}
                                />
                             </div>

                             {/* Value & Actions */}
                             <div className="flex items-center gap-2">
                                <InlineNumberEdit 
                                   value={item.value} 
                                   onSave={(val) => updateItem(profile.id, category.id, item.id, (i: Item) => ({ ...i, value: val }))}
                                   className={`text-sm sm:text-base font-bold ${isChecked ? 'text-slate-400' : 'text-[#253D2C]'}`}
                                />
                                <button 
                                   onClick={() => deleteItem(profile.id, category.id, item.id)}
                                   className="p-1.5 sm:p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors sm:opacity-0 group-hover/item:opacity-100"
                                >
                                   <Trash2 size={16} />
                                </button>
                             </div>
                           </div>
                         );
                       })
                     )}
                  </div>
                </div>
              ))}

              <button 
                onClick={() => addCategory(profile.id)}
                className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-[#2E6F40] border border-dashed border-slate-300 hover:border-[#68BA7F] hover:bg-[#CFFFDC]/30 rounded-3xl transition-all"
              >
                 <Plus size={18} strokeWidth={2.5} />
                 ADICIONAR SUBCATEGORIA
              </button>
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function MainApp() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [activeMonth, setActiveMonth] = useState<string>('Ago/2026');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('ba2026_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.profiles) {
          parsed.profiles.forEach((p: any) => {
            if (p.id === 'p1') p.name = 'Planejamento Gu';
            if (p.id === 'p2') p.name = 'Planejamento Rafa';
          });
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ba2026_state', JSON.stringify(state));
    }
  }, [state, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f4fcf6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2E6F40] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate totals
  const aportes = state.aportes || [];
  let totalEmCaixa = aportes.reduce((acc, aporte) => acc + aporte.valor, 0);

  // State mutations
  const handleUpdateTripGoal = (val: number) => setState(s => ({ ...s, tripGoal: val }));
  
  const handleAddAporte = (descricao: string, valor: number) => {
    setState(s => ({
      ...s,
      aportes: [...(s.aportes || []), { id: generateId(), descricao, valor, data: new Date().toISOString() }]
    }));
  };
  
  const handleDeleteAporte = (id: string) => {
    setState(s => ({
      ...s,
      aportes: (s.aportes || []).filter(a => a.id !== id)
    }));
  };

  const updateProfile = (profileId: string, updater: (p: Profile) => Profile) => {
    setState(s => ({ ...s, profiles: s.profiles.map(p => p.id === profileId ? updater(p) : p) }));
  };

  const addCategory = (profileId: string) => {
    updateProfile(profileId, p => ({ ...p, categories: [...p.categories, { id: generateId(), name: 'Nova Subcategoria', items: [] }] }));
  };
  
  const deleteCategory = (profileId: string, categoryId: string) => {
    updateProfile(profileId, p => ({ ...p, categories: p.categories.filter(c => c.id !== categoryId) }));
  };
  
  const updateCategoryName = (profileId: string, categoryId: string, name: string) => {
    updateProfile(profileId, p => ({ ...p, categories: p.categories.map(c => c.id === categoryId ? { ...c, name } : c) }));
  };

  const addItem = (profileId: string, categoryId: string) => {
    updateProfile(profileId, p => ({ ...p, categories: p.categories.map(c => c.id === categoryId ? { ...c, items: [...c.items, { id: generateId(), name: 'Novo Item', value: 0, checked: false, mes: activeMonth }] } : c) }));
  };

  const updateItem = (profileId: string, categoryId: string, itemId: string, updater: (item: Item) => Item) => {
    updateProfile(profileId, p => ({ ...p, categories: p.categories.map(c => c.id === categoryId ? { ...c, items: c.items.map(i => i.id === itemId ? updater(i) : i) } : c) }));
  };

  const deleteItem = (profileId: string, categoryId: string, itemId: string) => {
    updateProfile(profileId, p => ({ ...p, categories: p.categories.map(c => c.id === categoryId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c) }));
  };

  return (
    <div className="flex h-screen bg-[#f4fcf6] font-sans text-[#253D2C] overflow-hidden selection:bg-[#CFFFDC]">
      <Sidebar 
        currentView={activeView} 
        onViewChange={setActiveView} 
        isMobileOpen={isMobileOpen} 
        setMobileOpen={setIsMobileOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#2E6F40] rounded-lg text-white">
              <Target size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[#253D2C]">BA 2026</span>
          </div>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-[#253D2C]">
              {activeView === 'home' ? 'Visão Geral' : 'Gestão de Gastos'}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {activeView === 'home' ? 'Acompanhe o progresso da sua poupança e metas.' : 'Organize seus gastos e planeje os próximos meses.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'home' ? (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <DashboardHome 
                  state={state} 
                  totalEmCaixa={totalEmCaixa} 
                  onUpdateTripGoal={handleUpdateTripGoal}
                  activeMonth={activeMonth}
                />
              </motion.div>
            ) : (
              <motion.div
                key="gestao"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <GestaoView 
                  state={state}
                  addAporte={handleAddAporte}
                  deleteAporte={handleDeleteAporte}
                  updateProfile={updateProfile}
                  updateCategoryName={updateCategoryName}
                  addCategory={addCategory}
                  deleteCategory={deleteCategory}
                  addItem={addItem}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                  activeMonth={activeMonth}
                  setActiveMonth={setActiveMonth}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

