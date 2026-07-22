import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = content.replace("""import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';""", """import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';""")

# Replace components
start_marker = "const StatCard = "
end_marker = "// --- VIEWS ---\nconst DashboardHome"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find("};\n\nconst GestaoView =") + 3
    
    old_block = content[start_idx:end_idx]
    
    new_block = """const AreaChartWidget = ({ metaViagem }: { metaViagem: number }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 h-full flex flex-col min-h-[400px]">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-6 flex-shrink-0">Projeção de Gastos</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(val) => `R$${val}`} width={60} />
            <Tooltip 
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
              formatter={(value: any) => [formatCurrency(Number(value)), 'Acumulado']}
            />
            <ReferenceLine y={metaViagem} stroke="#253D2C" strokeDasharray="3 3" label={{ position: 'top', value: 'Meta', fill: '#253D2C', fontSize: 11 }} />
            <Area type="monotone" dataKey="acumulado" stroke="#2E6F40" strokeWidth={3} fill="#CFFFDC" fillOpacity={0.5} activeDot={{ r: 6, fill: '#2E6F40', stroke: '#fff', strokeWidth: 2 }} />
          </RechartsAreaChart>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* LINHA SUPERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuperMetaCard 
          current={totalEmCaixa} 
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
            <span className="text-2xl font-bold text-[#2E6F40] mt-1">{formatCurrency(totalEmCaixa)}</span>
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
            <AreaChartWidget metaViagem={state.tripGoal} />
          </div>
        </div>
      </div>
    </div>
  );
};
"""
    content = content[:start_idx] + new_block + content[end_idx:]

with open('app/page.tsx', 'w') as f:
    f.write(content)

print("done")
