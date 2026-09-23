'use client';

import React from 'react';
import { Taal, NotationSection, ShabadContent } from '@/types/notation';
import { SwarDisplay } from '@/components/notation/SwarDisplay';
import { Language } from '@/lib/swarUtils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Printer, Download, Sparkles, Music, Share2, BookOpen, Languages } from 'lucide-react';

interface NotationSheetPreviewProps {
  title: string;
  raag?: string;
  time?: string;
  aroh?: string;
  avroh?: string;
  vaadi?: string;
  samvaadi?: string;
  taal: Taal;
  sections: NotationSection[];
  shabad?: ShabadContent;
  showPrintActions?: boolean;
  showScriptSwitcher?: boolean;
  language?: Language;
}

export const NotationSheetPreview: React.FC<NotationSheetPreviewProps> = ({
  title,
  raag,
  time,
  aroh,
  avroh,
  vaadi,
  samvaadi,
  taal,
  sections,
  shabad,
  showPrintActions = true,
  showScriptSwitcher = true,
  language,
}) => {
  const reduxLang = useSelector((state: RootState) => state.language);
  const [currentLang, setCurrentLang] = React.useState<Language>(
    language || reduxLang || 'english'
  );

  React.useEffect(() => {
    if (language) {
      setCurrentLang(language);
    }
  }, [language]);

  const matrasCount = taal.matras || 16;

  // Vibhag dividers
  const vibhagEndIndices = React.useMemo(() => {
    const ends: number[] = [];
    let current = 0;
    for (const v of taal.vibhag || []) {
      current += v;
      ends.push(current - 1);
    }
    return ends;
  }, [taal.vibhag]);

  const getMatraSymbol = (matraNum: number) => {
    if (taal.khali?.includes(matraNum)) {
      return { symbol: '0', type: 'khali' };
    }
    const taaliIdx = taal.taali?.indexOf(matraNum);
    if (taaliIdx !== undefined && taaliIdx !== -1) {
      return {
        symbol: taaliIdx === 0 ? 'X' : `${taaliIdx + 1}`,
        type: taaliIdx === 0 ? 'sam' : 'taali',
      };
    }
    return null;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Floating Action Bar / Script Switcher */}
      {(showScriptSwitcher || showPrintActions) && (
        <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-3 no-print bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                Sheet Music Publication Preview
              </span>
              <span className="block text-[11px] text-slate-400">
                Export & view in English, Hindi, or Punjabi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Script / Language Switcher */}
            {showScriptSwitcher && (
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1">
                  <Languages size={13} className="text-amber-500" />
                  Script:
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentLang('english')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    currentLang === 'english'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLang('hindi')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    currentLang === 'hindi'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  🇮🇳 हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLang('punjabi')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    currentLang === 'punjabi'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  ੴ ਪੰਜਾਬੀ
                </button>
              </div>
            )}

            {showPrintActions && (
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Printer size={16} />
                <span>Print / Save PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .sheet-page {
            box-shadow: none !important;
            border: 2px solid #000000 !important;
            padding: 12mm 10mm !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-after: always !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}</style>

      {/* PAGE 1: Sheet Music */}
      <div className="sheet-page w-full max-w-4xl bg-white text-black p-8 sm:p-12 rounded-3xl border-2 border-slate-900 shadow-2xl mb-10 font-sans relative overflow-hidden">
        {/* Subtle decorative inner corner borders */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

        {/* Header section matching reference PDF */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            {/* Left metadata */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-black tracking-wider uppercase text-slate-950 font-serif">
                {title || raag || 'BANDISH NOTATION'}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-900 pt-1 font-medium">
                {time && (
                  <div>
                    <span className="font-extrabold text-slate-950">
                      {currentLang === 'punjabi' ? 'ਸਮਾਂ – ' : currentLang === 'hindi' ? 'समय – ' : 'TIME – '}
                    </span>
                    <span className="uppercase font-semibold">{time}</span>
                  </div>
                )}
                {aroh && (
                  <div className="sm:col-span-2">
                    <span className="font-extrabold text-slate-950">
                      {currentLang === 'punjabi' ? 'ਆਰੋਹ – ' : currentLang === 'hindi' ? 'आरोह – ' : 'AROH – '}
                    </span>
                    <span className="font-mono font-bold tracking-wide">
                      {aroh.split(/([,\s]+)/).map((seg, i) =>
                        !seg.trim() || seg === ',' ? (
                          seg
                        ) : (
                          <SwarDisplay key={i} value={seg} isDarkMode={false} language={currentLang} />
                        )
                      )}
                    </span>
                  </div>
                )}
                {avroh && (
                  <div className="sm:col-span-2">
                    <span className="font-extrabold text-slate-950">
                      {currentLang === 'punjabi' ? 'ਅਵਰੋਹ – ' : currentLang === 'hindi' ? 'अवरोह – ' : 'AVROH – '}
                    </span>
                    <span className="font-mono font-bold tracking-wide">
                      {avroh.split(/([,\s]+)/).map((seg, i) =>
                        !seg.trim() || seg === ',' ? (
                          seg
                        ) : (
                          <SwarDisplay key={i} value={seg} isDarkMode={false} language={currentLang} />
                        )
                      )}
                    </span>
                  </div>
                )}
                {vaadi && (
                  <div>
                    <span className="font-extrabold text-slate-950">
                      {currentLang === 'punjabi' ? 'ਵਾਦੀ – ' : currentLang === 'hindi' ? 'वादी – ' : 'VAADI – '}
                    </span>
                    <span className="font-bold">
                      <SwarDisplay value={vaadi} isDarkMode={false} language={currentLang} />
                    </span>
                  </div>
                )}
                {samvaadi && (
                  <div>
                    <span className="font-extrabold text-slate-950">
                      {currentLang === 'punjabi' ? 'ਸੰਵਾਦੀ – ' : currentLang === 'hindi' ? 'संवादी – ' : 'SAMVAADI – '}
                    </span>
                    <span className="font-bold">
                      <SwarDisplay value={samvaadi} isDarkMode={false} language={currentLang} />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Octaves Legend & Taal */}
            <div className="flex flex-col items-start sm:items-end text-xs space-y-2.5">
              <div className="bg-slate-50 border-2 border-slate-800 rounded-xl px-3.5 py-2 shadow-xs">
                <span className="font-black text-slate-900 block mb-0.5 text-[10px] uppercase tracking-widest text-center sm:text-right">
                  {currentLang === 'punjabi' ? 'ਸਪਤਕ' : currentLang === 'hindi' ? 'सप्तक' : 'OCTAVES'}
                </span>
                <div className="flex items-center gap-2 font-black text-xs">
                  <span style={{ color: '#0284c7' }} className="px-1.5 py-0.5 rounded bg-sky-50">
                    {currentLang === 'punjabi' ? 'ਮੰਦਰ' : currentLang === 'hindi' ? 'मंद्र' : 'LOW'}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span style={{ color: '#000000' }} className="px-1.5 py-0.5 rounded bg-slate-100">
                    {currentLang === 'punjabi' ? 'ਮੱਧ' : currentLang === 'hindi' ? 'मध्य' : 'MID'}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span style={{ color: '#dc2626' }} className="px-1.5 py-0.5 rounded bg-red-50">
                    {currentLang === 'punjabi' ? 'ਤਾਰ' : currentLang === 'hindi' ? 'तार' : 'HIGH'}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-black text-base uppercase text-slate-950 tracking-wider">
                  {taal.name?.[currentLang] || taal.name?.english || 'TAAL'}
                </div>
                <div className="text-[11px] text-slate-700 font-mono font-bold">
                  {matrasCount} {currentLang === 'punjabi' ? 'ਮਾਤਰਾ' : currentLang === 'hindi' ? 'मात्रा' : 'Matras'} ({taal.vibhag?.join(' | ')})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Music Notation Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            {/* Header: Theka, Matras, Taali/Khali */}
            <thead>
              {/* Theka Bols row */}
              <tr className="border-t-2 border-b border-slate-900 bg-slate-100/90 text-slate-950">
                <th className="w-16 px-1.5 py-2 text-left text-[11px] font-black uppercase tracking-wider border-r-2 border-slate-900 font-mono">
                  {currentLang === 'punjabi' ? 'ਠੇਕਾ' : currentLang === 'hindi' ? 'ठेका' : 'Theka'}
                </th>
                {Array.from({ length: matrasCount }).map((_, mIdx) => {
                  const bol = (taal.bol?.[mIdx] && taal.bol[mIdx][currentLang]) || taal.bol?.[mIdx]?.english || '';
                  const isVibhagEnd = vibhagEndIndices.includes(mIdx);
                  return (
                    <th
                      key={`bol-${mIdx}`}
                      className={`px-1 py-1.5 text-xs font-black uppercase font-mono ${
                        isVibhagEnd
                          ? 'border-r-2 border-slate-900'
                          : 'border-r border-slate-300'
                      }`}
                    >
                      {bol}
                    </th>
                  );
                })}
              </tr>

              {/* Matra Numbers & Taali/Khali */}
              <tr className="border-b-2 border-slate-900 bg-slate-50 text-slate-800">
                <th className="px-1.5 py-1 text-left text-[10px] font-bold border-r-2 border-slate-900 font-mono">
                  {currentLang === 'punjabi' ? 'ਮਾਤਰਾ' : currentLang === 'hindi' ? 'मात्रा' : 'Matra'}
                </th>
                {Array.from({ length: matrasCount }).map((_, mIdx) => {
                  const isVibhagEnd = vibhagEndIndices.includes(mIdx);
                  const marker = getMatraSymbol(mIdx + 1);
                  return (
                    <th
                      key={`matra-num-${mIdx}`}
                      className={`px-1 py-1 font-mono text-[11px] font-bold ${
                        isVibhagEnd
                          ? 'border-r-2 border-slate-900'
                          : 'border-r border-slate-300'
                      }`}
                    >
                      <div>{mIdx + 1}</div>
                      {marker && (
                        <div
                          className={`text-[11px] font-black leading-tight ${
                            marker.type === 'sam'
                              ? 'text-amber-600 font-black'
                              : marker.type === 'khali'
                              ? 'text-indigo-600'
                              : 'text-orange-600'
                          }`}
                        >
                          {marker.symbol}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Sections & Cycles */}
            <tbody>
              {sections.map((section, sIdx) => (
                <React.Fragment key={section.id || sIdx}>
                  {/* Section Label Header */}
                  <tr>
                    <td
                      colSpan={matrasCount + 1}
                      className="text-left font-black text-xs uppercase tracking-widest px-3 py-2 bg-slate-200/80 border-t-2 border-b-2 border-slate-900 text-slate-950 font-serif"
                    >
                      {section.name}
                    </td>
                  </tr>

                  {/* Section Rows */}
                  {section.rows.map((row, rIdx) => (
                    <React.Fragment key={row.id || rIdx}>
                      {/* Swar row */}
                      <tr className="border-b border-slate-200">
                        <td className="px-1.5 py-2 text-left text-[11px] font-bold text-slate-700 border-r-2 border-slate-900 bg-slate-50">
                          {currentLang === 'punjabi' ? 'ਸਵਰ' : currentLang === 'hindi' ? 'स्वर' : 'Swar'}
                        </td>
                        {Array.from({ length: matrasCount }).map((_, mIdx) => {
                          const swarVal = row.swars?.[mIdx] || '';
                          const isVibhagEnd = vibhagEndIndices.includes(mIdx);

                          return (
                            <td
                              key={`p-swar-${mIdx}`}
                              className={`px-1 py-2 font-black text-sm sm:text-base tracking-wide ${
                                isVibhagEnd
                                  ? 'border-r-2 border-slate-900'
                                  : 'border-r border-slate-300'
                              }`}
                            >
                              <SwarDisplay value={swarVal} isDarkMode={false} emptyPlaceholder="—" language={currentLang} />
                            </td>
                          );
                        })}
                      </tr>

                      {/* Lyric row */}
                      <tr className="border-b-2 border-slate-900 bg-slate-50/30">
                        <td className="px-1.5 py-2 text-left text-[11px] font-bold text-slate-700 border-r-2 border-slate-900 bg-slate-50">
                          {currentLang === 'punjabi' ? 'ਬੋਲ' : currentLang === 'hindi' ? 'बोल' : 'Bol'}
                        </td>
                        {Array.from({ length: matrasCount }).map((_, mIdx) => {
                          const lyricVal = row.lyrics?.[mIdx] || '';
                          const isVibhagEnd = vibhagEndIndices.includes(mIdx);

                          return (
                            <td
                              key={`p-lyric-${mIdx}`}
                              className={`px-1 py-2 text-xs font-bold text-slate-900 ${
                                isVibhagEnd
                                  ? 'border-r-2 border-slate-900'
                                  : 'border-r border-slate-300'
                              }`}
                            >
                              {lyricVal || '—'}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Page 1 Footer */}
        <div className="mt-8 pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
          <span>Raag Vidyalaya • Gurmat Sangeet Academy</span>
          <span>Page 1 of {shabad?.lines?.length ? '2' : '1'}</span>
        </div>
      </div>

      {/* PAGE 2: Gurbani Shabad / Lyrics */}
      {shabad && (shabad.title || (shabad.lines && shabad.lines.length > 0)) && (
        <div className="sheet-page page-break w-full max-w-4xl bg-white text-black p-8 sm:p-12 rounded-3xl border-2 border-slate-900 shadow-2xl font-sans relative overflow-hidden">
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

          {/* Shabad Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-8 text-center space-y-2">
            <div className="text-3xl sm:text-4xl text-amber-600 font-serif font-black">
              ੴ
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-950 font-serif">
              {shabad.title || `${title || 'Bandish'} — Gurbani Shabad / Lyrics`}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {raag ? `${raag} • ` : ''}
              {taal.name?.english} ({matrasCount} Matras)
            </p>
          </div>

          {/* Verses Container */}
          <div className="space-y-6">
            {shabad.lines?.map((line, lIdx) => (
              <div
                key={lIdx}
                className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/60 space-y-2.5 text-center sm:text-left"
              >
                {/* Gurmukhi Line */}
                {line.gurmukhi && (
                  <div className="font-extrabold text-lg sm:text-xl text-slate-950 font-serif leading-relaxed">
                    {line.gurmukhi}
                  </div>
                )}

                {/* Transliteration */}
                {line.transliteration && (
                  <div className="text-sm sm:text-base text-amber-800 italic font-medium">
                    {line.transliteration}
                  </div>
                )}

                {/* Translation */}
                {line.translation && (
                  <div className="text-xs sm:text-sm text-slate-700 font-sans border-t border-slate-200/80 pt-2 leading-relaxed">
                    {line.translation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Page 2 Footer */}
          <div className="mt-12 pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
            <span>Raag Vidyalaya • Sacred Gurbani Sheet Music</span>
            <span>Page 2 of 2</span>
          </div>
        </div>
      )}
    </div>
  );
};
