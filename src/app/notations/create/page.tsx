'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTaalsQuery, useCreateNotationMutation } from '@/store/api';
import { DEFAULT_TAALS } from '@/data/taals';
import { Taal, NotationSection, ShabadContent } from '@/types/notation';
import { SwarKeyboard } from '@/components/notation/SwarKeyboard';
import { NotationGrid } from '@/components/notation/NotationGrid';
import { NotationSheetPreview } from '@/components/notation/NotationSheetPreview';
import { NotationNavbar } from '@/components/notation/NotationNavbar';
import { NotationAuthGuard } from '@/components/notation/NotationAuthGuard';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setLanguage, Language } from '@/store/languageSlice';
import { SwarDisplay } from '@/components/notation/SwarDisplay';
import { SwarInputField } from '@/components/notation/SwarInputField';
import {
  mapPhysicalKeyToSwar,
  normalizeSwarInput,
  formatPhraseToLanguage,
  formatSwarToLanguage,
} from '@/lib/swarUtils';
import { toast } from 'sonner';
import {
  Music,
  Save,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Columns,
  Layers,
  Languages,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function CreateNotationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Taals Query
  const { data: serverTaals } = useGetTaalsQuery();
  const taalsList: Taal[] =
    serverTaals && serverTaals.length > 0 ? serverTaals : DEFAULT_TAALS;
  const [createNotation, { isLoading: isSaving }] = useCreateNotationMutation();

  if (mounted && (!authUser || !isAuthenticated)) {
    return (
      <NotationAuthGuard
        title="Composer Studio Sign In Required"
        subtitle="Please sign in to compose, format, and save new Bandish notations to your personal library."
        redirectTo="/notations/create"
      />
    );
  }

  // Active Taal
  const [selectedTaalId, setSelectedTaalId] = useState<number>(1);
  const currentTaal =
    taalsList.find((t) => t.id === selectedTaalId || t.taalId === selectedTaalId) ||
    taalsList[0] ||
    DEFAULT_TAALS[0];

  // Metadata
  const [name, setName] = useState('BHUPALI');
  const [raag, setRaag] = useState('Raag Bhupali');
  const [time, setTime] = useState('SUN SET');
  const [aroh, setAroh] = useState("S R, M' P, N S");
  const [avroh, setAvroh] = useState("S N D P, M' G, R S");
  const [vaadi, setVaadi] = useState('R');
  const [samvaadi, setSamvaadi] = useState('P');
  const [isPublic, setIsPublic] = useState(true);

  // View states
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('edit');
  const [activeSheetTab, setActiveSheetTab] = useState<'notation' | 'shabad'>('notation');

  // Sections
  const [sections, setSections] = useState<NotationSection[]>(() => [
    {
      id: 'sec_sathai',
      name: 'SATHAI',
      rows: [
        {
          id: 'row_1',
          swars: Array(16).fill(''),
          lyrics: Array(16).fill(''),
        },
        {
          id: 'row_2',
          swars: Array(16).fill(''),
          lyrics: Array(16).fill(''),
        },
      ],
    },
    {
      id: 'sec_antra',
      name: 'ANTRA',
      rows: [
        {
          id: 'row_3',
          swars: Array(16).fill(''),
          lyrics: Array(16).fill(''),
        },
      ],
    },
  ]);

  // Shabad
  const [shabad, setShabad] = useState<ShabadContent>({
    title: 'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
    lines: [
      {
        gurmukhi: 'ਤੂਹੀ ਨਾਮੁ ਧਿਆਈਐ ਹਰਿ ਗੁਣ ਗਾਈਐ ॥',
        transliteration: 'Tuhi Naam Dhiaaiye Har Gun Gaaiye',
        translation: "Meditate on the Lord's Name, and sing the Praises of the Lord.",
      },
    ],
  });

  // Focused target for Swar Keyboard ('grid' | 'vaadi' | 'samvaadi' | 'aroh' | 'avroh')
  const [activeInputTarget, setActiveInputTarget] = useState<
    'grid' | 'vaadi' | 'samvaadi' | 'aroh' | 'avroh'
  >('grid');

  // Input refs for direct focus & cursor manipulation
  const vaadiInputRef = useRef<HTMLInputElement>(null);
  const samvaadiInputRef = useRef<HTMLInputElement>(null);
  const arohInputRef = useRef<HTMLInputElement>(null);
  const avrohInputRef = useRef<HTMLInputElement>(null);

  // Focused cell for Swar Keyboard in grid
  const [activeCell, setActiveCell] = useState<{
    sectionIndex: number;
    rowIndex: number;
    matraIndex: number;
  } | null>(null);

  const [keyboardCollapsed, setKeyboardCollapsed] = useState(false);

  // Physical Keyboard Handlers for Classical Notation Fields (Task 2)
  const handleKeyDownVaadi = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const swar = mapPhysicalKeyToSwar(e.key, e.shiftKey);
    if (swar) {
      e.preventDefault();
      setVaadi(normalizeSwarInput(swar));
    }
  };

  const handleKeyDownSamvaadi = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const swar = mapPhysicalKeyToSwar(e.key, e.shiftKey);
    if (swar) {
      e.preventDefault();
      setSamvaadi(normalizeSwarInput(swar));
    }
  };

  const handleKeyDownPhrase = (
    e: React.KeyboardEvent<HTMLInputElement>,
    getter: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', ' ', ','].includes(e.key)) return;
    const swar = mapPhysicalKeyToSwar(e.key, e.shiftKey);
    if (swar) {
      e.preventDefault();
      const input = e.currentTarget;
      const start = input.selectionStart ?? getter.length;
      const end = input.selectionEnd ?? getter.length;
      const before = getter.substring(0, start);
      const after = getter.substring(end);
      const needsSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith(',');
      const inserted = (needsSpace ? ' ' : '') + swar + ' ';
      const nextVal = normalizeSwarInput(before + inserted + after);
      setter(nextVal);
      const newPos = start + inserted.length;
      setTimeout(() => {
        input.setSelectionRange(newPos, newPos);
      }, 0);
    }
  };

  // Convert all notation notes to target script (English, Hindi, Punjabi)
  const convertNotationToScript = (targetLang: Language) => {
    setVaadi((prev) => formatSwarToLanguage(prev, targetLang));
    setSamvaadi((prev) => formatSwarToLanguage(prev, targetLang));
    setAroh((prev) => formatPhraseToLanguage(prev, targetLang));
    setAvroh((prev) => formatPhraseToLanguage(prev, targetLang));
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        rows: sec.rows.map((row) => ({
          ...row,
          swars: row.swars.map((sw) => formatSwarToLanguage(sw, targetLang)),
        })),
      }))
    );
    dispatch(setLanguage(targetLang));
    toast.success(`Converted notation to ${targetLang.toUpperCase()} script!`);
  };

  // When taal changes, adjust matra count in rows
  const handleTaalChange = (newTaalId: number) => {
    setSelectedTaalId(newTaalId);
    const newTaal =
      taalsList.find((t) => t.id === newTaalId || t.taalId === newTaalId) ||
      taalsList[0];
    const newMatras = newTaal.matras || 16;

    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        rows: sec.rows.map((row) => ({
          ...row,
          swars: Array.from({ length: newMatras }, (_, i) => row.swars[i] || ''),
          lyrics: Array.from({ length: newMatras }, (_, i) => row.lyrics[i] || ''),
        })),
      }))
    );
  };

  // Swar Keyboard Actions
  const handleInsertSwar = (swar: string) => {
    // 1. VAADI
    if (activeInputTarget === 'vaadi') {
      setVaadi(normalizeSwarInput(swar));
      if (vaadiInputRef.current) {
        vaadiInputRef.current.focus();
      }
      return;
    }

    // 2. SAMVAADI
    if (activeInputTarget === 'samvaadi') {
      setSamvaadi(normalizeSwarInput(swar));
      if (samvaadiInputRef.current) {
        samvaadiInputRef.current.focus();
      }
      return;
    }

    // 3. AROH
    if (activeInputTarget === 'aroh') {
      const input = arohInputRef.current;
      if (input) {
        const start = input.selectionStart ?? aroh.length;
        const end = input.selectionEnd ?? aroh.length;
        const before = aroh.substring(0, start);
        const after = aroh.substring(end);
        const needsSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith(',');
        const inserted = (needsSpace ? ' ' : '') + swar + ' ';
        const nextValue = normalizeSwarInput(before + inserted + after);
        setAroh(nextValue);
        const newPos = start + inserted.length;
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(newPos, newPos);
        }, 0);
      } else {
        const needsSpace = aroh.length > 0 && !aroh.endsWith(' ') && !aroh.endsWith(',');
        setAroh((prev) => normalizeSwarInput(prev + (needsSpace ? ' ' : '') + swar + ' '));
      }
      return;
    }

    // 4. AVROH
    if (activeInputTarget === 'avroh') {
      const input = avrohInputRef.current;
      if (input) {
        const start = input.selectionStart ?? avroh.length;
        const end = input.selectionEnd ?? avroh.length;
        const before = avroh.substring(0, start);
        const after = avroh.substring(end);
        const needsSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith(',');
        const inserted = (needsSpace ? ' ' : '') + swar + ' ';
        const nextValue = normalizeSwarInput(before + inserted + after);
        setAvroh(nextValue);
        const newPos = start + inserted.length;
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(newPos, newPos);
        }, 0);
      } else {
        const needsSpace = avroh.length > 0 && !avroh.endsWith(' ') && !avroh.endsWith(',');
        setAvroh((prev) => normalizeSwarInput(prev + (needsSpace ? ' ' : '') + swar + ' '));
      }
      return;
    }

    // 5. GRID (DEFAULT)
    if (!activeCell) {
      setActiveCell({ sectionIndex: 0, rowIndex: 0, matraIndex: 0 });
      return;
    }

    const { sectionIndex, rowIndex, matraIndex } = activeCell;
    setSections((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        return {
          ...sec,
          rows: sec.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row;
            const newSwars = [...row.swars];
            newSwars[matraIndex] = normalizeSwarInput(swar);
            return { ...row, swars: newSwars };
          }),
        };
      })
    );

    handleNextCell();
  };

  const handleNextCell = () => {
    if (activeInputTarget === 'vaadi') {
      setActiveInputTarget('samvaadi');
      samvaadiInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'samvaadi') {
      setActiveInputTarget('aroh');
      arohInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'aroh') {
      setActiveInputTarget('avroh');
      avrohInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'avroh') {
      setActiveInputTarget('grid');
      setActiveCell({ sectionIndex: 0, rowIndex: 0, matraIndex: 0 });
      return;
    }

    if (!activeCell) return;
    const { sectionIndex, rowIndex, matraIndex } = activeCell;
    const matrasCount = currentTaal.matras || 16;

    if (matraIndex < matrasCount - 1) {
      setActiveCell({ sectionIndex, rowIndex, matraIndex: matraIndex + 1 });
    } else if (rowIndex < sections[sectionIndex].rows.length - 1) {
      setActiveCell({ sectionIndex, rowIndex: rowIndex + 1, matraIndex: 0 });
    } else if (sectionIndex < sections.length - 1) {
      setActiveCell({ sectionIndex: sectionIndex + 1, rowIndex: 0, matraIndex: 0 });
    }
  };

  const handlePrevCell = () => {
    if (activeInputTarget === 'samvaadi') {
      setActiveInputTarget('vaadi');
      vaadiInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'aroh') {
      setActiveInputTarget('samvaadi');
      samvaadiInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'avroh') {
      setActiveInputTarget('aroh');
      arohInputRef.current?.focus();
      return;
    }

    if (!activeCell) return;
    const { sectionIndex, rowIndex, matraIndex } = activeCell;
    const matrasCount = currentTaal.matras || 16;

    if (matraIndex > 0) {
      setActiveCell({ sectionIndex, rowIndex, matraIndex: matraIndex - 1 });
    } else if (rowIndex > 0) {
      setActiveCell({ sectionIndex, rowIndex: rowIndex - 1, matraIndex: matrasCount - 1 });
    } else if (sectionIndex > 0) {
      const prevSec = sections[sectionIndex - 1];
      setActiveCell({
        sectionIndex: sectionIndex - 1,
        rowIndex: prevSec.rows.length - 1,
        matraIndex: matrasCount - 1,
      });
    }
  };

  const handleBackspace = () => {
    if (activeInputTarget === 'vaadi') {
      setVaadi('');
      vaadiInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'samvaadi') {
      setSamvaadi('');
      samvaadiInputRef.current?.focus();
      return;
    }
    if (activeInputTarget === 'aroh') {
      const input = arohInputRef.current;
      if (input) {
        const start = input.selectionStart ?? aroh.length;
        const end = input.selectionEnd ?? aroh.length;
        if (start === end) {
          if (start === 0) return;
          let before = aroh.substring(0, start);
          const after = aroh.substring(end);
          if (before.endsWith(' ')) {
            before = before.trimEnd();
          }
          const lastSpaceIdx = before.lastIndexOf(' ');
          const newBefore = lastSpaceIdx === -1 ? '' : before.substring(0, lastSpaceIdx + 1);
          const nextVal = newBefore + after;
          setAroh(nextVal);
          const newPos = newBefore.length;
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(newPos, newPos);
          }, 0);
        } else {
          const before = aroh.substring(0, start);
          const after = aroh.substring(end);
          setAroh(before + after);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, start);
          }, 0);
        }
      } else {
        const trimmed = aroh.trimEnd();
        const lastSpace = trimmed.lastIndexOf(' ');
        setAroh(lastSpace === -1 ? '' : trimmed.substring(0, lastSpace + 1));
      }
      return;
    }
    if (activeInputTarget === 'avroh') {
      const input = avrohInputRef.current;
      if (input) {
        const start = input.selectionStart ?? avroh.length;
        const end = input.selectionEnd ?? avroh.length;
        if (start === end) {
          if (start === 0) return;
          let before = avroh.substring(0, start);
          const after = avroh.substring(end);
          if (before.endsWith(' ')) {
            before = before.trimEnd();
          }
          const lastSpaceIdx = before.lastIndexOf(' ');
          const newBefore = lastSpaceIdx === -1 ? '' : before.substring(0, lastSpaceIdx + 1);
          const nextVal = newBefore + after;
          setAvroh(nextVal);
          const newPos = newBefore.length;
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(newPos, newPos);
          }, 0);
        } else {
          const before = avroh.substring(0, start);
          const after = avroh.substring(end);
          setAvroh(before + after);
          setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, start);
          }, 0);
        }
      } else {
        const trimmed = avroh.trimEnd();
        const lastSpace = trimmed.lastIndexOf(' ');
        setAvroh(lastSpace === -1 ? '' : trimmed.substring(0, lastSpace + 1));
      }
      return;
    }

    if (!activeCell) return;
    const { sectionIndex, rowIndex, matraIndex } = activeCell;
    setSections((prev) =>
      prev.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        return {
          ...sec,
          rows: sec.rows.map((row, rIdx) => {
            if (rIdx !== rowIndex) return row;
            const newSwars = [...row.swars];
            newSwars[matraIndex] = '';
            return { ...row, swars: newSwars };
          }),
        };
      })
    );
    handlePrevCell();
  };

  // Shabad Helpers
  const addShabadLine = () => {
    setShabad((prev) => ({
      ...prev,
      lines: [
        ...(prev.lines || []),
        { gurmukhi: '', transliteration: '', translation: '' },
      ],
    }));
  };

  const updateShabadLine = (
    index: number,
    field: 'gurmukhi' | 'transliteration' | 'translation',
    val: string
  ) => {
    setShabad((prev) => ({
      ...prev,
      lines: (prev.lines || []).map((line, i) =>
        i === index ? { ...line, [field]: val } : line
      ),
    }));
  };

  const removeShabadLine = (index: number) => {
    setShabad((prev) => ({
      ...prev,
      lines: (prev.lines || []).filter((_, i) => i !== index),
    }));
  };

  // Save Notation
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a bandish title');
      return;
    }

    if (!authUser) {
      toast.error('Please log in to save notations to your library');
      router.push('/login?redirectTo=/notations/create');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        raag: raag.trim(),
        time: time.trim(),
        aroh: aroh.trim(),
        avroh: avroh.trim(),
        vaadi: vaadi.trim(),
        samvaadi: samvaadi.trim(),
        octavesInfo: 'Low/Cyan, Mid/Black, High/Red',
        taal: currentTaal,
        sections,
        shabad,
        isPublic,
      };

      const result = await createNotation(payload).unwrap();
      toast.success('Notation saved to your library!');
      router.push(`/notations/${result._id}`);
    } catch (err: any) {
      console.error('Save notation failed', err);
      toast.error(err?.data?.message || 'Failed to save notation');
    }
  };

  const activeCellLabel = useMemo(() => {
    if (activeInputTarget === 'vaadi') return 'Input: Vaadi (वादी)';
    if (activeInputTarget === 'samvaadi') return 'Input: Samvaadi (संवादी)';
    if (activeInputTarget === 'aroh') return 'Input: Aroh (आरोह)';
    if (activeInputTarget === 'avroh') return 'Input: Avroh (अवरोह)';
    if (activeCell) {
      return `${sections[activeCell.sectionIndex]?.name || 'Section'} • Row ${
        activeCell.rowIndex + 1
      } • Matra ${activeCell.matraIndex + 1}`;
    }
    return undefined;
  }, [activeInputTarget, activeCell, sections]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar with Home link, Breadcrumbs, Actions and ThemeToggle */}
      <NotationNavbar breadcrumbs={[{ label: 'Studio' }]}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 size={13} />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye size={13} />
              <span>Sheet PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'split'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Columns size={13} />
              <span>Split View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </NotationNavbar>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div
          className={`grid gap-6 ${
            activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* EDITOR COLUMN */}
          {(activeTab === 'edit' || activeTab === 'split') && (
            <div className="space-y-6">
              {/* Presets & Metadata Card */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                {/* Header & Quick Presets */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Bandish & Taal Configuration</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure Raag parameters, Matras, and Taal
                    </p>
                  </div>

                  {/* Taal Selector Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                      Taal:
                    </label>
                    <select
                      value={selectedTaalId}
                      onChange={(e) => handleTaalChange(Number(e.target.value))}
                      className="px-3 py-1.5 text-xs font-extrabold rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
                    >
                      {taalsList.map((t) => (
                        <option key={t.id || t._id} value={t.id || t.taalId}>
                          {t.name.english} ({t.matras} Matras)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Script Switcher & Sheet Port Tool (Task 3) */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Languages size={13} className="text-amber-500" /> Script:
                    </span>
                    <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => dispatch(setLanguage('english'))}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          currentLanguage === 'english'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(setLanguage('hindi'))}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          currentLanguage === 'hindi'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        🇮🇳 हिंदी
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch(setLanguage('punjabi'))}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          currentLanguage === 'punjabi'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        ੴ ਪੰਜਾਬੀ
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => convertNotationToScript(currentLanguage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-all active:scale-95 shadow-2xs"
                    title="Convert all current sheet notes and phrases to the selected script"
                  >
                    <RefreshCw size={12} /> Convert Sheet Notes to {currentLanguage.toUpperCase()}
                  </button>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Title
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. BHUPALI"
                      className="w-full mt-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Raag
                    </label>
                    <input
                      type="text"
                      value={raag}
                      onChange={(e) => setRaag(e.target.value)}
                      placeholder="e.g. Raag Bhupali"
                      className="w-full mt-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Time (Pahar)
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. SUN SET"
                      className="w-full mt-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Vaadi / Samvaadi
                      </label>
                      {(activeInputTarget === 'vaadi' || activeInputTarget === 'samvaadi') && (
                        <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1 animate-pulse">
                          <Sparkles size={9} />
                          {activeInputTarget === 'vaadi' ? 'Vaadi (Swar)' : 'Samvaadi (Swar)'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <SwarInputField
                        ref={vaadiInputRef}
                        value={vaadi}
                        onChange={setVaadi}
                        onFocus={() => {
                          setActiveInputTarget('vaadi');
                          setKeyboardCollapsed(false);
                        }}
                        onClick={() => {
                          setActiveInputTarget('vaadi');
                          setKeyboardCollapsed(false);
                        }}
                        placeholder="V: R"
                        singleNote={true}
                        isActive={activeInputTarget === 'vaadi'}
                        language={currentLanguage}
                        className={`w-1/2 px-2.5 py-1 text-xs font-bold rounded-xl border transition-all ${
                          activeInputTarget === 'vaadi'
                            ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-within:ring-2 focus-within:ring-amber-500'
                        }`}
                      />
                      <SwarInputField
                        ref={samvaadiInputRef}
                        value={samvaadi}
                        onChange={setSamvaadi}
                        onFocus={() => {
                          setActiveInputTarget('samvaadi');
                          setKeyboardCollapsed(false);
                        }}
                        onClick={() => {
                          setActiveInputTarget('samvaadi');
                          setKeyboardCollapsed(false);
                        }}
                        placeholder="S: P"
                        singleNote={true}
                        isActive={activeInputTarget === 'samvaadi'}
                        language={currentLanguage}
                        className={`w-1/2 px-2.5 py-1 text-xs font-bold rounded-xl border transition-all ${
                          activeInputTarget === 'samvaadi'
                            ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-within:ring-2 focus-within:ring-amber-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Aroh
                      </label>
                      {activeInputTarget === 'aroh' && (
                        <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1 animate-pulse">
                          <Sparkles size={9} />
                          Editing Aroh via Swar Keyboard
                        </span>
                      )}
                    </div>
                    <SwarInputField
                      ref={arohInputRef}
                      value={aroh}
                      onChange={setAroh}
                      onFocus={() => {
                        setActiveInputTarget('aroh');
                        setKeyboardCollapsed(false);
                      }}
                      onClick={() => {
                        setActiveInputTarget('aroh');
                        setKeyboardCollapsed(false);
                      }}
                      placeholder="S R, M' P, N S"
                      singleNote={false}
                      isActive={activeInputTarget === 'aroh'}
                      language={currentLanguage}
                      className={`w-full mt-1 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
                        activeInputTarget === 'aroh'
                          ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-within:ring-2 focus-within:ring-amber-500'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        Avroh
                      </label>
                      {activeInputTarget === 'avroh' && (
                        <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 flex items-center gap-1 animate-pulse">
                          <Sparkles size={9} />
                          Editing Avroh via Swar Keyboard
                        </span>
                      )}
                    </div>
                    <SwarInputField
                      ref={avrohInputRef}
                      value={avroh}
                      onChange={setAvroh}
                      onFocus={() => {
                        setActiveInputTarget('avroh');
                        setKeyboardCollapsed(false);
                      }}
                      onClick={() => {
                        setActiveInputTarget('avroh');
                        setKeyboardCollapsed(false);
                      }}
                      placeholder="S N D P, M' G, R S"
                      singleNote={false}
                      isActive={activeInputTarget === 'avroh'}
                      language={currentLanguage}
                      className={`w-full mt-1 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
                        activeInputTarget === 'avroh'
                          ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-within:ring-2 focus-within:ring-amber-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Subtabs: Sheet Music Grid vs Gurbani Shabad */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('notation')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                    activeSheetTab === 'notation'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Page 1: Sheet Music Grid ({currentTaal.matras} Matras)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('shabad')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${
                    activeSheetTab === 'shabad'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Page 2: Gurbani Shabad / Lyrics
                </button>
              </div>

              {/* SHEET TAB 1: Matra Grid */}
              {activeSheetTab === 'notation' && (
                <NotationGrid
                  taal={currentTaal}
                  sections={sections}
                  onSectionsChange={setSections}
                  activeCell={activeInputTarget === 'grid' ? activeCell : null}
                  onCellFocus={(sIdx, rIdx, mIdx) => {
                    setActiveInputTarget('grid');
                    setActiveCell({ sectionIndex: sIdx, rowIndex: rIdx, matraIndex: mIdx });
                  }}
                  language={currentLanguage}
                />
              )}

              {/* SHEET TAB 2: Gurbani Shabad */}
              {activeSheetTab === 'shabad' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 pb-36">
                  <div>
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1.5">
                      Shabad Title / Manglacharan
                    </label>
                    <input
                      type="text"
                      value={shabad.title || ''}
                      onChange={(e) => setShabad({ ...shabad, title: e.target.value })}
                      placeholder="e.g. ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥"
                      className="w-full px-4 py-2.5 text-sm sm:text-base font-serif font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Shabad Verses (Gurmukhi, Transliteration, Translation)
                      </span>
                      <button
                        type="button"
                        onClick={addShabadLine}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 shadow-2xs"
                      >
                        <Plus size={14} /> Add Verse
                      </button>
                    </div>

                    {shabad.lines?.map((line, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                            Verse #{idx + 1}
                          </span>
                          {(shabad.lines?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => removeShabadLine(idx)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                              title="Delete Verse"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500">
                            Gurmukhi Text
                          </label>
                          <input
                            type="text"
                            value={line.gurmukhi}
                            onChange={(e) =>
                              updateShabadLine(idx, 'gurmukhi', e.target.value)
                            }
                            placeholder="ਤੂਹੀ ਨਾਮੁ ਧਿਆਈਐ..."
                            className="w-full mt-1 px-3 py-2 text-base font-serif font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500">
                            English Transliteration
                          </label>
                          <input
                            type="text"
                            value={line.transliteration}
                            onChange={(e) =>
                              updateShabadLine(idx, 'transliteration', e.target.value)
                            }
                            placeholder="Tuhi Naam Dhiaaiye..."
                            className="w-full mt-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500">
                            English Translation
                          </label>
                          <textarea
                            rows={2}
                            value={line.translation}
                            onChange={(e) =>
                              updateShabadLine(idx, 'translation', e.target.value)
                            }
                            placeholder="Meditate on the Lord's Name..."
                            className="w-full mt-1 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PREVIEW COLUMN */}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div className="w-full flex justify-center pb-28">
              <NotationSheetPreview
                title={name}
                raag={raag}
                time={time}
                aroh={aroh}
                avroh={avroh}
                vaadi={vaadi}
                samvaadi={samvaadi}
                taal={currentTaal}
                sections={sections}
                shabad={shabad}
                showPrintActions={true}
                language={currentLanguage}
              />
            </div>
          )}
        </div>
      </main>

      {/* Swar Keyboard Dock */}
      {(activeTab === 'edit' || activeTab === 'split') && (activeSheetTab === 'notation' || activeInputTarget !== 'grid') && (
        <SwarKeyboard
          onInsertSwar={handleInsertSwar}
          onBackspace={handleBackspace}
          onNextCell={handleNextCell}
          onPrevCell={handlePrevCell}
          activeCellLabel={activeCellLabel}
          isCollapsed={keyboardCollapsed}
          onToggleCollapse={() => setKeyboardCollapsed(!keyboardCollapsed)}
        />
      )}
    </div>
  );
}
