'use client';

import React from 'react';
import { Taal, NotationSection, NotationRow } from '@/types/notation';
import { SwarDisplay } from '@/components/notation/SwarDisplay';
import { mapPhysicalKeyToSwar, Language } from '@/lib/swarUtils';
import { useTheme } from 'next-themes';
import {
  Plus,
  Trash2,
  Copy,
  Music,
  AlignLeft,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NotationGridProps {
  taal: Taal;
  sections: NotationSection[];
  onSectionsChange: (sections: NotationSection[]) => void;
  activeCell: { sectionIndex: number; rowIndex: number; matraIndex: number } | null;
  onCellFocus: (sectionIndex: number, rowIndex: number, matraIndex: number) => void;
  readOnly?: boolean;
  language?: Language;
}

export const NotationGrid: React.FC<NotationGridProps> = ({
  taal,
  sections,
  onSectionsChange,
  activeCell,
  onCellFocus,
  readOnly = false,
  language,
}) => {
  const matrasCount = taal.matras || 16;
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const isDark = mounted ? resolvedTheme === 'dark' || theme === 'dark' : true;

  // Vibhag boundary indices
  const vibhagEndIndices = React.useMemo(() => {
    const ends: number[] = [];
    let current = 0;
    for (const v of taal.vibhag || []) {
      current += v;
      ends.push(current - 1);
    }
    return ends;
  }, [taal.vibhag]);

  // Taali / Khali symbol
  const getMatraSymbol = (matraNum: number) => {
    if (taal.khali?.includes(matraNum)) {
      return { symbol: '0', type: 'khali' as const };
    }
    const taaliIdx = taal.taali?.indexOf(matraNum);
    if (taaliIdx !== undefined && taaliIdx !== -1) {
      return {
        symbol: taaliIdx === 0 ? 'X' : `${taaliIdx + 1}`,
        type: taaliIdx === 0 ? ('sam' as const) : ('taali' as const),
      };
    }
    return null;
  };

  // Section Operations
  const addSection = () => {
    const newSection: NotationSection = {
      id: `sec_${Date.now()}`,
      name:
        sections.length === 0
          ? 'SATHAI'
          : sections.length === 1
          ? 'ANTRA'
          : `SECTION ${sections.length + 1}`,
      rows: [
        {
          id: `row_${Date.now()}_1`,
          swars: Array(matrasCount).fill(''),
          lyrics: Array(matrasCount).fill(''),
        },
      ],
    };
    onSectionsChange([...sections, newSection]);
  };

  const removeSection = (sectionIndex: number) => {
    if (sections.length <= 1) return;
    const updated = sections.filter((_, idx) => idx !== sectionIndex);
    onSectionsChange(updated);
  };

  const updateSectionName = (sectionIndex: number, name: string) => {
    onSectionsChange(
      sections.map((sec, idx) => (idx === sectionIndex ? { ...sec, name } : sec))
    );
  };

  // Row Operations
  const addRow = (sectionIndex: number) => {
    const newRow: NotationRow = {
      id: `row_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      swars: Array(matrasCount).fill(''),
      lyrics: Array(matrasCount).fill(''),
    };
    onSectionsChange(
      sections.map((sec, idx) =>
        idx === sectionIndex ? { ...sec, rows: [...sec.rows, newRow] } : sec
      )
    );
  };

  const duplicateRow = (sectionIndex: number, rowIndex: number) => {
    onSectionsChange(
      sections.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        const currentRow = sec.rows[rowIndex];
        const duplicatedRow: NotationRow = {
          id: `row_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          swars: [...currentRow.swars],
          lyrics: [...currentRow.lyrics],
        };
        const newRows = [...sec.rows];
        newRows.splice(rowIndex + 1, 0, duplicatedRow);
        return { ...sec, rows: newRows };
      })
    );
  };

  const removeRow = (sectionIndex: number, rowIndex: number) => {
    onSectionsChange(
      sections.map((sec, sIdx) => {
        if (sIdx !== sectionIndex || sec.rows.length <= 1) return sec;
        return {
          ...sec,
          rows: sec.rows.filter((_, idx) => idx !== rowIndex),
        };
      })
    );
  };

  // Cell Updates
  const updateSwar = (
    sectionIndex: number,
    rowIndex: number,
    matraIndex: number,
    value: string
  ) => {
    onSectionsChange(
      sections.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        return {
          ...sec,
          rows: sec.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row;
            const newSwars = [...row.swars];
            newSwars[matraIndex] = value;
            return { ...row, swars: newSwars };
          }),
        };
      })
    );
  };

  const updateLyric = (
    sectionIndex: number,
    rowIndex: number,
    matraIndex: number,
    value: string
  ) => {
    onSectionsChange(
      sections.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        return {
          ...sec,
          rows: sec.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row;
            const newLyrics = [...row.lyrics];
            newLyrics[matraIndex] = value;
            return { ...row, lyrics: newLyrics };
          }),
        };
      })
    );
  };

  return (
    <div className="space-y-8 pb-36">
      {sections.map((section, sIdx) => (
        <div
          key={section.id || sIdx}
          className="group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all overflow-hidden"
        >
          {/* Glowing gradient top edge */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

          {/* Section Header Bar */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 via-white to-amber-50/30 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-slate-800/40 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Layers size={17} />
              </div>

              {readOnly ? (
                <span className="font-extrabold text-base tracking-wider uppercase text-slate-900 dark:text-slate-100">
                  {section.name}
                </span>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSectionName(sIdx, e.target.value)}
                    placeholder="SECTION NAME (e.g. SATHAI / ANTRA)"
                    className="font-extrabold text-sm sm:text-base tracking-wider uppercase bg-transparent border-b-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-500 focus:border-amber-500 focus:outline-none px-1 py-0.5 text-slate-900 dark:text-slate-100 transition-colors"
                  />
                </div>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {section.rows.length} {section.rows.length === 1 ? 'Cycle' : 'Cycles'}
              </span>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => addRow(sIdx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-95 transition-all"
                  title="Add Matra Row"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Add Cycle</span>
                </button>

                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sIdx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Section"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center min-w-[720px]">
              {/* Table Header: Taali/Khali, Matras, Theka */}
              <thead>
                {/* Taali / Khali Markers Row */}
                <tr className="bg-slate-100/60 dark:bg-slate-800/40 text-xs font-bold border-b border-slate-200/80 dark:border-slate-800">
                  <th className="w-24 px-3 py-1.5 text-left font-mono text-[10px] text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800">
                    Sign
                  </th>
                  {Array.from({ length: matrasCount }).map((_, mIdx) => {
                    const isVibhagEnd = vibhagEndIndices.includes(mIdx);
                    const marker = getMatraSymbol(mIdx + 1);

                    return (
                      <th
                        key={`sym-${mIdx}`}
                        className={`px-1 py-1.5 text-xs font-black ${
                          isVibhagEnd
                            ? 'border-r-2 border-r-amber-400/80 dark:border-r-amber-500/80'
                            : 'border-r border-slate-200/60 dark:border-slate-800/60'
                        }`}
                      >
                        {marker ? (
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-black shadow-2xs ${
                              marker.type === 'sam'
                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 ring-2 ring-amber-400/40'
                                : marker.type === 'khali'
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                            }`}
                          >
                            {marker.symbol}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                        )}
                      </th>
                    );
                  })}
                  {!readOnly && <th className="w-16"></th>}
                </tr>

                {/* Matra Numbers Row */}
                <tr className="bg-slate-50/70 dark:bg-slate-800/20 text-[11px] font-mono font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-1 text-left border-r border-slate-200 dark:border-slate-800 text-[10px] uppercase text-slate-400">
                    Matra
                  </th>
                  {Array.from({ length: matrasCount }).map((_, mIdx) => {
                    const isVibhagEnd = vibhagEndIndices.includes(mIdx);
                    return (
                      <th
                        key={`matra-${mIdx}`}
                        className={`px-1 py-1 font-mono ${
                          isVibhagEnd
                            ? 'border-r-2 border-r-amber-400/80 dark:border-r-amber-500/80'
                            : 'border-r border-slate-200/60 dark:border-slate-800/60'
                        }`}
                      >
                        {mIdx + 1}
                      </th>
                    );
                  })}
                  {!readOnly && <th></th>}
                </tr>

                {/* Theka Bols Row */}
                <tr className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 text-xs font-black text-amber-900 dark:text-amber-300 border-b-2 border-amber-300/70 dark:border-amber-700/60">
                  <th className="px-3 py-1.5 text-left border-r border-slate-200 dark:border-slate-800 font-mono text-[10px] uppercase text-amber-800/80 dark:text-amber-400">
                    Theka
                  </th>
                  {Array.from({ length: matrasCount }).map((_, mIdx) => {
                    const bol =
                      (language && taal.bol?.[mIdx]?.[language]) ||
                      taal.bol?.[mIdx]?.english ||
                      '';
                    const isVibhagEnd = vibhagEndIndices.includes(mIdx);

                    return (
                      <th
                        key={`bol-${mIdx}`}
                        className={`px-1 py-1.5 font-mono uppercase tracking-wide text-xs ${
                          isVibhagEnd
                            ? 'border-r-2 border-r-amber-400/80 dark:border-r-amber-500/80'
                            : 'border-r border-slate-200/60 dark:border-slate-800/60'
                        }`}
                      >
                        <span className="px-1.5 py-0.5 rounded bg-amber-100/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200">
                          {bol}
                        </span>
                      </th>
                    );
                  })}
                  {!readOnly && <th></th>}
                </tr>
              </thead>

              {/* Grid Rows */}
              <tbody>
                {section.rows.map((row, rIdx) => (
                  <React.Fragment key={row.id || rIdx}>
                    {/* Swar Row */}
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-3 py-2 text-left font-bold text-xs text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <div className="flex items-center gap-1.5">
                          <Music size={13} className="text-amber-500" />
                          <span>Swar</span>
                        </div>
                      </td>

                      {Array.from({ length: matrasCount }).map((_, mIdx) => {
                        const swarVal = row.swars?.[mIdx] || '';
                        const isVibhagEnd = vibhagEndIndices.includes(mIdx);
                        const isFocused =
                          activeCell?.sectionIndex === sIdx &&
                          activeCell?.rowIndex === rIdx &&
                          activeCell?.matraIndex === mIdx;

                        return (
                          <td
                            key={`swar-${mIdx}`}
                            className={`p-1 relative ${
                              isVibhagEnd
                                ? 'border-r-2 border-r-amber-400/80 dark:border-r-amber-500/80'
                                : 'border-r border-slate-200/60 dark:border-slate-800/60'
                            }`}
                          >
                            {readOnly ? (
                              <div className="py-2 px-1 font-black font-mono text-sm sm:text-base text-center tracking-wide flex items-center justify-center min-h-[38px]">
                                <SwarDisplay value={swarVal} language={language} isDarkMode={isDark} emptyPlaceholder="•" />
                              </div>
                            ) : isFocused ? (
                              <input
                                type="text"
                                value={swarVal}
                                autoFocus
                                onFocus={() => onCellFocus(sIdx, rIdx, mIdx)}
                                onKeyDown={(e) => {
                                  // Let standard navigation keys pass through
                                  if (['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                                    return;
                                  }
                                  if (e.key === 'Backspace' || e.key === 'Delete') {
                                    e.preventDefault();
                                    updateSwar(sIdx, rIdx, mIdx, '');
                                    return;
                                  }
                                  const mapped = mapPhysicalKeyToSwar(e.key, e.shiftKey);
                                  if (mapped) {
                                    e.preventDefault();
                                    updateSwar(sIdx, rIdx, mIdx, mapped);
                                    // Advance to next matra box
                                    if (mIdx < matrasCount - 1) {
                                      onCellFocus(sIdx, rIdx, mIdx + 1);
                                    } else if (rIdx < section.rows.length - 1) {
                                      onCellFocus(sIdx, rIdx + 1, 0);
                                    } else if (sIdx < sections.length - 1) {
                                      onCellFocus(sIdx + 1, 0, 0);
                                    }
                                  }
                                }}
                                onChange={(e) =>
                                  updateSwar(sIdx, rIdx, mIdx, e.target.value)
                                }
                                placeholder="—"
                                className="w-full py-2 px-1 font-black font-mono text-center text-sm sm:text-base rounded-xl transition-all duration-150 focus:outline-none bg-amber-100/95 text-slate-950 ring-2 ring-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.35)] scale-[1.05] z-10 dark:bg-slate-800/95 dark:text-white dark:ring-2 dark:ring-amber-400 dark:shadow-[0_0_16px_rgba(251,191,36,0.35)] placeholder:text-slate-400/40 dark:placeholder:text-slate-600/70 focus:placeholder:text-transparent"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => onCellFocus(sIdx, rIdx, mIdx)}
                                className="w-full py-2 px-1 font-black font-mono text-center text-sm sm:text-base rounded-xl transition-all duration-150 bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/60 flex items-center justify-center cursor-pointer min-h-[38px]"
                                title="Click to edit matra"
                              >
                                <SwarDisplay value={swarVal} language={language} isDarkMode={isDark} emptyPlaceholder="—" />
                              </button>
                            )}
                          </td>
                        );
                      })}

                      {/* Row actions */}
                      {!readOnly && (
                        <td className="px-2 py-1 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => duplicateRow(sIdx, rIdx)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                              title="Duplicate Cycle"
                            >
                              <Copy size={13} />
                            </button>
                            {section.rows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRow(sIdx, rIdx)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                                title="Delete Cycle"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Lyric Row */}
                    <tr className="border-b-2 border-slate-200/90 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-800/10">
                      <td className="px-3 py-2 text-left font-bold text-xs text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <div className="flex items-center gap-1.5">
                          <AlignLeft size={13} className="text-slate-400" />
                          <span>Lyric</span>
                        </div>
                      </td>

                      {Array.from({ length: matrasCount }).map((_, mIdx) => {
                        const lyricVal = row.lyrics?.[mIdx] || '';
                        const isVibhagEnd = vibhagEndIndices.includes(mIdx);

                        return (
                          <td
                            key={`lyric-${mIdx}`}
                            className={`p-1 ${
                              isVibhagEnd
                                ? 'border-r-2 border-r-amber-400/80 dark:border-r-amber-500/80'
                                : 'border-r border-slate-200/60 dark:border-slate-800/60'
                            }`}
                          >
                            {readOnly ? (
                              <div className="py-1.5 px-1 text-xs font-bold text-slate-800 dark:text-slate-200 text-center tracking-wide">
                                {lyricVal || (
                                  <span className="text-slate-300 dark:text-slate-700 font-normal select-none">—</span>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={lyricVal}
                                onChange={(e) =>
                                  updateLyric(sIdx, rIdx, mIdx, e.target.value)
                                }
                                placeholder="word"
                                className="w-full py-1.5 px-1 text-center text-xs font-bold text-slate-900 dark:text-slate-100 bg-transparent rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/70 focus:bg-amber-50 dark:focus:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-amber-400/90 dark:focus:ring-amber-400/90 focus:text-slate-950 dark:focus:text-white placeholder:text-slate-400/40 dark:placeholder:text-slate-600/70 focus:placeholder:text-transparent transition-all"
                              />
                            )}
                          </td>
                        );
                      })}

                      {!readOnly && <td></td>}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Add New Section button */}
      {!readOnly && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 font-bold text-sm shadow-xs transition-all active:scale-98"
          >
            <Plus size={17} />
            <span>Add New Musical Section (e.g. Antra, Taana)</span>
          </button>
        </div>
      )}
    </div>
  );
};
