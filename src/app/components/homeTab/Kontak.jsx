import { 
  RiBuildingLine, 
  RiPhoneLine, 
  RiMailSendLine, 
  RiTimeLine,
  RiTeamLine,
  RiMailLine
} from "react-icons/ri";

export default function KontakTab() {
  const contacts = [
    { label: "Alamat Kantor Pusat", value: "Jl. Perkebunan Raya No.123, Desa Glantangan, Kec. Banyuwangi, Jawa Timur 68416", icon: <RiBuildingLine /> },
    { label: "Telepon", value: "+62 333 412 888", icon: <RiPhoneLine /> },
    { label: "Email", value: "info@kebunglantangan.co.id", icon: <RiMailSendLine /> },
    { label: "Jam Operasional", value: "Senin - Jumat: 07:00 - 16:00 WIB", icon: <RiTimeLine /> },
  ];

  const team = [
    { name: "Drs. Suharto, M.Agr", role: "Direktur Utama", email: "suharto@kebunglantangan.co.id", initial: "S" },
    { name: "Ir. Ahmad Fauzi", role: "Manajer Kebun", email: "afauzi@kebunglantangan.co.id", initial: "A" },
    { name: "Siti Aminah, S.E.", role: "Kepala Administrasi", email: "siti.a@kebunglantangan.co.id", initial: "S" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Contact Info Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-fit">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <RiCustomerService2Line className="text-xl" />
          </div>
          Hubungi Kami
        </h2>
        
        <div className="space-y-6">
          {contacts.map((contact, idx) => (
            <div key={idx} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:scale-110 transition-all duration-300">
                {contact.icon}
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{contact.label}</p>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">{contact.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder for Socials or Map mini */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-100 border-dashed">
            <p className="text-xs text-slate-400 font-medium text-center italic leading-relaxed">
                Kami siap melayani kebutuhan informasi dan kerjasama strategis Anda demi kemajuan sektor perkebunan nasional.
            </p>
        </div>
      </div>

      {/* Team Management Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-fit">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <RiTeamLine className="text-xl" />
          </div>
          Tim Manajemen
        </h2>
        
        <div className="space-y-4">
          {team.map((member, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-emerald-50/50 transition-all duration-300 group border border-transparent hover:border-emerald-100">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-900/10">
                {member.initial}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 leading-none mb-1.5">{member.name}</h4>
                <p className="text-[11px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">{member.role}</p>
                <p className="text-[10px] text-slate-400 font-medium">{member.email}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors">
                  <RiMailLine className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { RiCustomerService2Line } from "react-icons/ri";
