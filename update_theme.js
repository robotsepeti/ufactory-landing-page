// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Header section of catalog
code = code.replace(
  '<section id=\"katalog\" className=\"py-24 bg-slate-950 min-h-screen relative overflow-hidden\">',
  '<section id=\"katalog\" className=\"py-24 bg-slate-50 min-h-screen relative overflow-hidden\">'
);
code = code.replace(
  '<div className=\"absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent bg-[length:20px_20px]\"></div>',
  '<div className=\"absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-300 via-transparent to-transparent bg-[length:20px_20px]\"></div>'
);
code = code.replace(
  '<h2 className=\"text-4xl md:text-5xl font-black text-white mb-6\">Teknik Özellikler ve Payload Bilgileri</h2>',
  '<h2 className=\"text-4xl md:text-5xl font-black text-slate-900 mb-6\">Teknik Özellikler ve Payload Bilgileri</h2>'
);
code = code.replace(
  '<p className=\"text-slate-400 text-lg max-w-2xl mx-auto mb-10\">',
  '<p className=\"text-slate-600 text-lg max-w-2xl mx-auto mb-10\">'
);
code = code.replace(
  '<div className=\"inline-flex flex-wrap justify-center gap-2 bg-slate-900 rounded-3xl p-1.5 border border-slate-800\">',
  '<div className=\"inline-flex flex-wrap justify-center gap-2 bg-white rounded-3xl p-1.5 border border-slate-200 shadow-sm\">'
);
code = code.replace(
  'text-slate-400 hover:text-white',
  'text-slate-600 hover:text-slate-900'
);

// 2. Grid view cards
code = code.replace(
  /className=\"group cursor-pointer rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-orange-500\/50 transition-all duration-500 hover:shadow-\[0_0_40px_rgba\(249,115,22,0\.15\)\] flex flex-col h-\[520px\]\"/g,
  'className=\"group cursor-pointer rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] flex flex-col h-[520px]\"'
);
code = code.replace(
  /className=\"h-\[55%\] relative overflow-hidden bg-slate-950 flex items-center justify-center\"/g,
  'className=\"h-[55%] relative overflow-hidden bg-slate-100 flex items-center justify-center\"'
);
code = code.replace(
  /className=\"absolute top-4 right-4 bg-slate-950\/50 backdrop-blur-md border border-white\/10 text-white text-\[10px\] font-bold px-3 py-1\.5 rounded-full z-20 tracking-widest uppercase\"/g,
  'className=\"absolute top-4 right-4 bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full z-20 tracking-widest uppercase shadow-sm\"'
);
code = code.replace(
  /className=\"absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center\"/g,
  'className=\"absolute inset-0 w-full h-full bg-white flex items-center justify-center\"'
);
code = code.replace(
  /className=\"absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10\"/g,
  'className=\"absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-transparent z-10\"'
);
code = code.replace(
  /className=\"p-8 h-\[45%\] flex flex-col justify-between bg-slate-900\"/g,
  'className=\"p-8 h-[45%] flex flex-col justify-between bg-white\"'
);
code = code.replace(
  /className=\"text-2xl font-bold text-white mb-2\">\{product\.name\}<\/h3>/g,
  'className=\"text-2xl font-bold text-slate-900 mb-2\">{product.name}</h3>'
);
code = code.replace(
  /className=\"text-slate-400 text-sm line-clamp-3 leading-relaxed\">\{product\.description\}<\/p>/g,
  'className=\"text-slate-600 text-sm line-clamp-3 leading-relaxed\">{product.description}</p>'
);
code = code.replace(
  /className=\"flex items-center text-orange-500 font-bold text-sm mt-4 group-hover:text-white transition-colors uppercase tracking-wider\"/g,
  'className=\"flex items-center text-orange-500 font-bold text-sm mt-4 group-hover:text-orange-600 transition-colors uppercase tracking-wider\"'
);

// 3. Detailed View
code = code.replace(
  /className=\"bg-slate-900 rounded-\[2\.5rem\] border border-slate-800 overflow-hidden shadow-2xl shadow-black\/40 relative\"/g,
  'className=\"bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/60 relative\"'
);
code = code.replace(
  /className=\"absolute top-6 left-6 z-30 w-12 h-12 bg-slate-950\/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-all duration-300 border border-white\/10 shadow-lg hover:shadow-orange-500\/30 hover:scale-110\"/g,
  'className=\"absolute top-6 left-6 z-30 w-12 h-12 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-900 hover:text-white hover:bg-orange-500 transition-all duration-300 border border-slate-200 shadow-lg hover:shadow-orange-500/30 hover:scale-110\"'
);
code = code.replace(
  /className=\"relative h-\[400px\] sm:h-\[500px\] lg:h-auto lg:min-h-\[800px\] bg-slate-950 flex flex-col overflow-hidden\"/g,
  'className=\"relative h-[400px] sm:h-[500px] lg:h-auto lg:min-h-[800px] bg-slate-100 flex flex-col overflow-hidden\"'
);
code = code.replace(
  /className=\"w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center\"/g,
  'className=\"w-full h-full bg-slate-100 flex items-center justify-center\"'
);
code = code.replace(
  /className=\"absolute inset-0 bg-gradient-to-t from-slate-950\/80 via-transparent to-transparent z-10 pointer-events-none\"/g,
  'className=\"absolute inset-0 bg-gradient-to-t from-slate-200/80 via-transparent to-transparent z-10 pointer-events-none\"'
);
code = code.replace(
  /className=\"text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-\[0_2px_20px_rgba\(0,0,0,0\.5\)\]\"/g,
  'className=\"text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight drop-shadow-sm\"'
);
code = code.replace(
  /className=\"flex gap-2 p-3 bg-slate-950 border-t border-slate-800\/50 overflow-x-auto\"/g,
  'className=\"flex gap-2 p-3 bg-slate-100 border-t border-slate-200 overflow-x-auto\"'
);
code = code.replace(
  /className=\"p-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col relative bg-slate-900 lg:max-h-\[800px\] lg:overflow-y-auto\"/g,
  'className=\"p-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col relative bg-white lg:max-h-[800px] lg:overflow-y-auto\"'
);
code = code.replace(
  /className=\"text-base text-slate-400 leading-relaxed mb-8\"/g,
  'className=\"text-base text-slate-600 leading-relaxed mb-8\"'
);
code = code.replace(
  /className=\"bg-slate-950\/50 border border-slate-800 p-4 rounded-2xl group hover:border-orange-500\/30 transition-all duration-300 hover:bg-slate-950\/80\"/g,
  'className=\"bg-slate-50 border border-slate-200 p-4 rounded-2xl group hover:border-orange-500/30 transition-all duration-300 hover:bg-orange-50/50\"'
);
code = code.replace(
  /className=\"text-lg font-black text-white\">\{value\}<\/p>/g,
  'className=\"text-lg font-black text-slate-900\">{value}</p>'
);
code = code.replace(
  /className=\"flex items-center gap-3 text-slate-300 text-sm font-medium bg-slate-800\/30 px-4 py-3\.5 rounded-xl border border-slate-800\/50 hover:border-orange-500\/20 transition-colors\"/g,
  'className=\"flex items-center gap-3 text-slate-700 text-sm font-medium bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200 hover:border-orange-500/20 transition-colors\"'
);
code = code.replace(
  /className=\"bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 flex-1 flex justify-center items-center gap-2\"/g,
  'className=\"bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-200 transition-all duration-300 flex-1 flex justify-center items-center gap-2\"'
);
code = code.replace(
  /className=\"h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-4\"/g,
  'className=\"h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-4\"'
);

// 4. Software Section & Safety
code = code.replace(
  /className=\"mt-6 bg-slate-900 p-6 rounded-3xl text-white\"/g,
  'className=\"mt-6 bg-slate-100 p-6 rounded-3xl text-slate-900\"'
);
code = code.replace(
  /className=\"text-sm text-slate-400\">Sabit hatlar için/g,
  'className=\"text-sm text-slate-600\">Sabit hatlar için'
);

// 5. Case Studies Section
code = code.replace(
  /className=\"py-24 bg-slate-900 relative overflow-hidden\"/g,
  'className=\"py-24 bg-white relative overflow-hidden border-t border-slate-200\"'
);
code = code.replace(
  /className=\"absolute top-0 right-0 w-1\/2 h-full bg-slate-950 skew-x-\[-15deg\] transform origin-bottom -z-10 opacity-50\"/g,
  'className=\"absolute top-0 right-0 w-1/2 h-full bg-slate-50 skew-x-[-15deg] transform origin-bottom -z-10 opacity-50\"'
);
code = code.replace(
  /className=\"text-4xl md:text-5xl font-black text-white leading-tight mb-6\">Hangi Sektörler/g,
  'className=\"text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6\">Hangi Sektörler'
);
code = code.replace(
  /className=\"text-slate-400 max-w-md mt-6 lg:mt-0 font-medium\">Farklı sektörlerden/g,
  'className=\"text-slate-600 max-w-md mt-6 lg:mt-0 font-medium\">Farklı sektörlerden'
);
code = code.replace(
  /className=\"bg-slate-800\/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors group\"/g,
  'className=\"bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 rounded-3xl hover:border-orange-500/30 transition-colors group\"'
);
code = code.replace(
  /className=\"text-2xl font-bold text-white\"/g,
  'className=\"text-2xl font-bold text-slate-900\"'
);
code = code.replace(
  /className=\"text-slate-400 mb-6 line-clamp-3\"/g,
  'className=\"text-slate-600 mb-6 line-clamp-3\"'
);

// 6. Timeline Wrapper
code = code.replace(
  /className=\"py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900\"/g,
  'className=\"py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200\"'
);
code = code.replace(
  /className=\"text-4xl md:text-5xl font-black text-white mb-6\">UFactory & Robotsepeti Tarihçesi<\/h2>/g,
  'className=\"text-4xl md:text-5xl font-black text-slate-900 mb-6\">UFactory & Robotsepeti Tarihçesi</h2>'
);
code = code.replace(
  /className=\"text-lg text-slate-400 max-w-2xl mx-auto\">2013/g,
  'className=\"text-lg text-slate-600 max-w-2xl mx-auto\">2013'
);

// 7. Advantages Section
code = code.replace(
  /className=\"py-24 bg-slate-950 relative overflow-hidden border-t border-white\/5\"/g,
  'className=\"py-24 bg-white relative overflow-hidden border-t border-slate-200\"'
);
code = code.replace(
  /className=\"absolute inset-0 bg-\[radial-gradient\(ellipse_at_center,_var\(--tw-gradient-stops\)\)\] from-slate-900 via-slate-950 to-slate-950 z-0\"/g,
  'className=\"absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white z-0\"'
);
code = code.replace(
  /className=\"text-4xl md:text-5xl font-black text-white mb-6 leading-tight\">/g,
  'className=\"text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight\">'
);
code = code.replace(
  /className=\"text-lg text-slate-400 max-w-3xl mx-auto\">Türkiye tek yetkili/g,
  'className=\"text-lg text-slate-600 max-w-3xl mx-auto\">Türkiye tek yetkili'
);
code = code.replace(
  /className=\"bg-slate-900\/50 border border-slate-800 p-8 rounded-3xl\"/g,
  'className=\"bg-slate-50 border border-slate-200 p-8 rounded-3xl\"'
);
code = code.replace(
  /className=\"text-xl font-bold text-white mb-4\"/g,
  'className=\"text-xl font-bold text-slate-900 mb-4\"'
);
code = code.replace(
  /className=\"text-slate-400\">Tüm uFactory xArm/g,
  'className=\"text-slate-600\">Tüm uFactory xArm'
);
code = code.replace(
  /className=\"text-slate-400\">Alanında uzman mühendislik/g,
  'className=\"text-slate-600\">Alanında uzman mühendislik'
);
code = code.replace(
  /className=\"text-slate-400\">Yerel stok yönetimi/g,
  'className=\"text-slate-600\">Yerel stok yönetimi'
);

// 8. Footer Section
code = code.replace(
  /className=\"bg-slate-950 text-slate-400 py-16 border-t border-slate-900\"/g,
  'className=\"bg-slate-50 text-slate-600 py-16 border-t border-slate-200\"'
);
code = code.replace(
  /className=\"bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 lg:p-16 mb-16 flex flex-col lg:flex-row items-center justify-between border border-slate-700 shadow-2xl\"/g,
  'className=\"bg-gradient-to-r from-white to-slate-100 rounded-3xl p-10 lg:p-16 mb-16 flex flex-col lg:flex-row items-center justify-between border border-slate-200 shadow-xl shadow-slate-200/50\"'
);
code = code.replace(
  /className=\"text-3xl font-black text-white mb-4\"/g,
  'className=\"text-3xl font-black text-slate-900 mb-4\"'
);
code = code.replace(
  /className=\"flex items-center gap-2\"><CheckCircle2 className=\"text-orange-500\" size=\{18\}\/> TL, USD, EUR Kur Esnekliği<\/li>/g,
  '<li className=\"flex items-center gap-2 text-slate-700\"><CheckCircle2 className=\"text-orange-500\" size={18}/> TL, USD, EUR Kur Esnekliği</li>'
);
code = code.replace(
  /className=\"flex items-center gap-2\"><CheckCircle2 className=\"text-orange-500\" size=\{18\}\/> Doğrudan Yerel Stok ve Yedek Parça<\/li>/g,
  '<li className=\"flex items-center gap-2 text-slate-700\"><CheckCircle2 className=\"text-orange-500\" size={18}/> Doğrudan Yerel Stok ve Yedek Parça</li>'
);
code = code.replace(
  /className=\"flex items-center gap-2\"><CheckCircle2 className=\"text-orange-500\" size=\{18\}\/> Seed Robotics & Unitree Multidisipliner Entegrasyon<\/li>/g,
  '<li className=\"flex items-center gap-2 text-slate-700\"><CheckCircle2 className=\"text-orange-500\" size={18}/> Seed Robotics & Unitree Multidisipliner Entegrasyon</li>'
);
code = code.replace(
  /className=\"flex items-center gap-2\"><CheckCircle2 className=\"text-orange-500\" size=\{18\}\/> B2B Mühendislik Desteği & Kurulum<\/li>/g,
  '<li className=\"flex items-center gap-2 text-slate-700\"><CheckCircle2 className=\"text-orange-500\" size={18}/> B2B Mühendislik Desteği & Kurulum</li>'
);
code = code.replace(
  /className=\"flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-12 mb-12\"/g,
  'className=\"flex flex-col md:flex-row justify-between items-center border-b border-slate-300 pb-12 mb-12\"'
);
code = code.replace(
  /className=\"h-10 w-px bg-white\/20\"/g,
  'className=\"h-10 w-px bg-slate-300\"'
);
code = code.replace(
  /className=\"block font-bold text-lg text-white tracking-wider\"/g,
  'className=\"block font-bold text-lg text-slate-900 tracking-wider\"'
);
code = code.replace(
  /className=\"text-white font-bold mb-6 uppercase tracking-wider\"/g,
  'className=\"text-slate-900 font-bold mb-6 uppercase tracking-wider\"'
);
code = code.replace(
  /className=\"font-bold text-white\">Telefon:/g,
  'className=\"font-bold text-slate-900\">Telefon:'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log('Update Complete.');
