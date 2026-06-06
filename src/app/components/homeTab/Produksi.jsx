"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useState, useEffect } from "react";
import { 
  RiRefreshLine, 
  RiLineChartLine, 
  RiPulseLine, 
  RiCalendarLine,
  RiBarChartGroupedLine,
  RiFilter3Line
} from "react-icons/ri";

export default function ProduksiTab() {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("hari_ini"); // hari_ini, bulan_ini, sd_hari_ini
  const [selectedAfdeling, setSelectedAfdeling] = useState("SEMUA AFDELING");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/get-spreadsheet");
      const data = await res.json();
      setRawData(data);
    } catch (err) {
      console.error("Gagal fetch data produksi:", err);
    } finally {
      setLoading(false);
    }
  };

  const parseNum = (val) => {
    if (val === null || val === undefined) return 0;
    const strVal = String(val).trim();
    if (!strVal) return 0;
    const clean = strVal.replace(/\./g, "").replace(",", ".");
    return parseFloat(clean) || 0;
  };

  const getStatusColor = (percent) => {
    const p = parseNum(percent);
    if (p >= 100) return { bg: "bg-emerald-600", text: "text-emerald-600", hex: "#10b981", bar: "bg-emerald-500" };
    if (p > 80) return { bg: "bg-amber-500", text: "text-amber-500", hex: "#f59e0b", bar: "bg-amber-500" };
    return { bg: "bg-red-500", text: "text-red-500", hex: "#ef4444", bar: "bg-red-500" };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-500">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase text-[10px] tracking-[0.2em]">Sinkronisasi Data...</p>
      </div>
    );
  }

  const currentData = rawData?.[viewType] || [];
  
  // Get unique afdeling list
  const afdelingList = ["SEMUA AFDELING", ...new Set(currentData.map(item => item.afdeling))];

  // Filtered data for chart
  const filteredData = selectedAfdeling === "SEMUA AFDELING" 
    ? currentData 
    : currentData.filter(item => item.afdeling === selectedAfdeling);

  const chartData = filteredData.map(item => ({
    name: item.afdeling,
    aktual: parseNum(item.realisasi),
    target: parseNum(item.target),
    persen: parseNum(item.persen)
  }));

  // Logic for KPI stats based on filter
  const activeStatSource = selectedAfdeling === "SEMUA AFDELING" 
    ? rawData?.total?.[viewType] 
    : currentData.find(item => item.afdeling === selectedAfdeling);

  const stats = [
    { 
      label: selectedAfdeling === "SEMUA AFDELING" ? `TOTAL PRODUKSI (${viewType.replace(/_/g, ' ').toUpperCase()})` : `PRODUKSI ${selectedAfdeling}`, 
      value: `${activeStatSource?.realisasi || '0'} Kg`, 
      target: `Target: ${activeStatSource?.target || '0'} Kg`, 
      percent: activeStatSource?.persen || "0", 
      icon: <RiPulseLine /> 
    },
    { 
      label: "PERIODE DATA", 
      value: rawData?.tanggal || "-", 
      target: "Update Terakhir", 
      percent: 100, 
      icon: <RiCalendarLine /> 
    },
    { 
      label: "PENCAPAIAN", 
      value: `${activeStatSource?.persen || '0'}%`, 
      target: selectedAfdeling === "SEMUA AFDELING" ? "Rata-rata Gabungan" : "Terhadap Target RKAP", 
      percent: parseNum(activeStatSource?.persen), 
      icon: <RiLineChartLine /> 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const colors = getStatusColor(stat.percent);
          return (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-emerald-200 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl ${colors.text} group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-tighter shadow-sm ${colors.bg} text-white`}>
                    {stat.percent}%
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{stat.target}</p>
              </div>
              
              <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                  <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${colors.bar}`}
                      style={{ width: `${Math.min(parseNum(stat.percent), 100)}%` }}
                  ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <RiBarChartGroupedLine className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Evaluasi Produksi</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perbandingan Realisasi vs Target RKAP</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Afdeling Filter */}
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex-1 md:flex-none">
              <RiFilter3Line className="text-slate-400" />
              <select 
                value={selectedAfdeling}
                onChange={(e) => setSelectedAfdeling(e.target.value)}
                className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-slate-600 focus:ring-0 cursor-pointer"
              >
                {afdelingList.map(afdeling => (
                  <option key={afdeling} value={afdeling}>{afdeling}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex-1 md:flex-none">
              {[
                { id: "hari_ini", label: "Harian" },
                { id: "bulan_ini", label: "Bulanan" },
                { id: "sd_hari_ini", label: "Kumulatif" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewType(tab.id)}
                  className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    viewType === tab.id
                      ? "bg-white text-emerald-600 shadow-md shadow-emerald-900/5 border border-emerald-50"
                      : "text-slate-400 hover:text-emerald-600 hover:bg-white/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button 
              onClick={fetchData} 
              disabled={loading}
              className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-100"
            >
              <RiRefreshLine className={`text-xl ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="w-full h-[350px] md:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                barGap={4}
                barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                dy={15}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 10 }}
                contentStyle={{ 
                    borderRadius: '20px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                    padding: '12px 16px',
                    fontSize: '12px'
                }}
                itemStyle={{ fontWeight: 700, padding: '2px 0' }}
                labelStyle={{ fontWeight: 900, marginBottom: '8px', color: '#1e293b', fontSize: '13px' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ 
                    paddingBottom: '40px', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em' 
                }}
              />
              <Bar 
                dataKey="aktual" 
                name="Realisasi" 
                radius={[8, 8, 8, 8]} 
                minPointSize={5}
                className="hover:opacity-80 transition-opacity"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.persen).hex} />
                ))}
              </Bar>
              <Bar 
                dataKey="target" 
                fill="#e2e8f0" 
                name="Target" 
                radius={[8, 8, 8, 8]} 
                minPointSize={2}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
