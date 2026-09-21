'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetNotationByIdQuery,
  useUpdateNotationMutation,
  useGetTaalsQuery,
} from '@/store/api';
import { DEFAULT_TAALS } from '@/data/taals';
import { Taal, NotationSection, ShabadContent } from '@/types/notation';
import { SwarKeyboard } from '@/components/notation/SwarKeyboard';
import { NotationGrid } from '@/components/notation/NotationGrid';
import { NotationSheetPreview } from '@/components/notation/NotationSheetPreview';
import { NotationNavbar } from '@/components/notation/NotationNavbar';
import { NotationAuthGuard } from '@/components/notation/NotationAuthGuard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toast } from 'sonner';
import {
  Music,
  Save,
  Eye,
  Edit3,
  ArrowLeft,
  Columns,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  Wand2,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

const RAAG_PRESETS = [
  {
    name: 'Bhupali',
    raag: 'Raag Bhupali',
    time: 'SUN SET / FIRST PART OF NIGHT',
    aroh: "S R, M' P, N S",
    avroh: "S N D P, M' G, R S",
    vaadi: 'R',
    samvaadi: 'P',
  },
  {
    name: 'Yaman',
    raag: 'Raag Yaman',
    time: 'NIGHT (1ST PAHAR)',
    aroh: "N. R G M' D N S'",
    avroh: "S' N D P M' G R S",
    vaadi: 'G',
    samvaadi: 'N',
  },
  {
    name: 'Bilawal',
    raag: 'Raag Bilawal',
    time: 'MORNING (1ST PAHAR)',
    aroh: "S R G M P D N S'",
    avroh: "S' N D P M G R S",
    vaadi: 'D',
    samvaadi: 'G',
  },
  {
    name: 'Bairagi',
    raag: 'Raag Bairagi',
    time: 'EARLY MORNING',
    aroh: "S r M P n S'",
    avroh: "S' n P M r S",
    vaadi: 'M',
    samvaadi: 'S',
  },
  {
    name: 'Kafi',
    raag: 'Raag Kafi',
    time: 'LATE EVENING',
    aroh: "S R g M P D n S'",
    avroh: "S' n D P M g R S",
    vaadi: 'P',
    samvaadi: 'R',
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditNotationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const authUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: serverTaals } = useGetTaalsQuery();
  const taalsList: Taal[] =
    serverTaals && serverTaals.length > 0 ? serverTaals : DEFAULT_TAALS;

  const { data: notation, isLoading, error } = useGetNotationByIdQuery(id, {
    skip: !authUser,
  });
  const [updateNotation, { isLoading: isUpdating }] = useUpdateNotationMutation();

  // Active Taal
  const [selectedTaalId, setSelectedTaalId] = useState<number>(1);
  const currentTaal =
    taalsList.find((t) => t.id === selectedTaalId || t.taalId === selectedTaalId) ||
    taalsList[0] ||
    DEFAULT_TAALS[0];

  // Metadata
  const [name, setName] = useState('');
  const [raag, setRaag] = useState('');
  const [time, setTime] = useState('');
  const [aroh, setAroh] = useState('');
  const [avroh, setAvroh] = useState('');
  const [vaadi, setVaadi] = useState('');
  const [samvaadi, setSamvaadi] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Active views
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('edit');
  const [activeSheetTab, setActiveSheetTab] = useState<'notation' | 'shabad'>('notation');

  // Sections and Grid Data
  const [sections, setSections] = useState<NotationSection[]>([]);

  // Shabad Data
  const [shabad, setShabad] = useState<ShabadContent>({
    title: '',
    lines: [],
  });

  // Active focused cell for Swar Keyboard
  const [activeCell, setActiveCell] = useState<{
    sectionIndex: number;
    rowIndex: number;
    matraIndex: number;
  } | null>(null);

  const [keyboardCollapsed, setKeyboardCollapsed] = useState(false);

  // Prepopulate when notation loads
  useEffect(() => {
    if (notation) {
      setName(notation.name || '');
      setRaag(notation.raag || '');
      setTime(notation.time || '');
      setAroh(notation.aroh || '');
      setAvroh(notation.avroh || '');
      setVaadi(notation.vaadi || '');
      setSamvaadi(notation.samvaadi || '');
      setIsPublic(notation.isPublic ?? true);

      if (notation.taal) {
        setSelectedTaalId(notation.taal.id || notation.taal.taalId || 1);
      }

      if (notation.sections && notation.sections.length > 0) {
        setSections(JSON.parse(JSON.stringify(notation.sections)));
      }

      if (notation.shabad) {
        setShabad(JSON.parse(JSON.stringify(notation.shabad)));
      }
    }
  }, [notation]);

  const applyPreset = (preset: typeof RAAG_PRESETS[0]) => {
    setName(preset.name.toUpperCase());
    setRaag(preset.raag);
    setTime(preset.time);
    setAroh(preset.aroh);
    setAvroh(preset.avroh);
    setVaadi(preset.vaadi);
    setSamvaadi(preset.samvaadi);
    toast.success(`Applied ${preset.name} parameters!`);
  };

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
            newSwars[matraIndex] = swar;
            return { ...row, swars: newSwars };
          }),
        };
      })
    );

    handleNextCell();
  };

  const handleNextCell = () => {
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

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a bandish title');
      return;
    }

    if (!isOwner) {
      toast.error('You do not have permission to edit this notation');
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
        taal: currentTaal,
        sections,
        shabad,
        isPublic,
      };

      await updateNotation({ id, data: payload }).unwrap();
      toast.success('Notation updated successfully!');
      router.push(`/notations/${id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update notation');
    }
  };

  const currentUserId = authUser?.id || (authUser as any)?._id;
  const notationUserId =
    typeof notation?.userId === 'object' && notation?.userId !== null
      ? (notation.userId as any)._id || (notation.userId as any).id
      : notation?.userId;

  const isOwner = Boolean(
    currentUserId &&
    notationUserId &&
    String(notationUserId) === String(currentUserId)
  );

  if (mounted && (!authUser || !isAuthenticated)) {
    return (
      <NotationAuthGuard
        title="Authentication Required"
        subtitle="Please sign in to edit your notation."
        redirectTo={`/notations/${id}/edit`}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-amber-500" size={30} />
          <p className="text-xs text-slate-500 font-bold">Loading Editor...</p>
        </div>
      </div>
    );
  }

  if (notation && !isOwner) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <NotationNavbar breadcrumbs={[{ label: 'Access Denied' }]}>
          <Link
            href={`/notations/${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
          >
            <ArrowLeft size={13} />
            <span>View Notation</span>
          </Link>
        </NotationNavbar>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mb-5 shadow-lg">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-serif">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            You do not have permission to edit this notation. Only the author who composed this Bandish can modify its notes.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link
              href={`/notations/${id}`}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              View Sheet Music
            </Link>
            <Link
              href="/notations"
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
            >
              My Notations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !notation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-serif">
          Notation Not Found
        </h2>
        <Link
          href="/notations"
          className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md"
        >
          Return to Notations
        </Link>
      </div>
    );
  }

  const activeCellLabel = activeCell
    ? `${sections[activeCell.sectionIndex]?.name || 'Section'} • Row ${activeCell.rowIndex + 1
    } • Matra ${activeCell.matraIndex + 1}`
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Navbar with Home link, Breadcrumbs, Actions and ThemeToggle */}
      <NotationNavbar
        breadcrumbs={[
          { label: name || 'Notation', href: `/notations/${id}` },
          { label: 'Edit' },
        ]}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'edit'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'preview'
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
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'split'
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
            onClick={handleUpdate}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </NotationNavbar>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div
          className={`grid gap-6 ${activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
            }`}
        >
          {/* EDITOR COLUMN */}
          {(activeTab === 'edit' || activeTab === 'split') && (
            <div className="space-y-6">
              {/* Presets & Metadata Card */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Bandish & Taal Configuration</span>
                    </h2>
                  </div>

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

                {/* Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    <Wand2 size={12} className="text-amber-500" /> Presets:
                  </span>
                  {RAAG_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all active:scale-95"
                    >
                      {p.name}
                    </button>
                  ))}
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
                      className="w-full mt-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                      className="w-full mt-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                      className="w-full mt-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Vaadi / Samvaadi
                    </label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={vaadi}
                        onChange={(e) => setVaadi(e.target.value)}
                        placeholder="V: R"
                        className="w-1/2 px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={samvaadi}
                        onChange={(e) => setSamvaadi(e.target.value)}
                        placeholder="S: P"
                        className="w-1/2 px-2.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Aroh
                    </label>
                    <input
                      type="text"
                      value={aroh}
                      onChange={(e) => setAroh(e.target.value)}
                      placeholder="S R, M' P, N S"
                      className="w-full mt-1 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Avroh
                    </label>
                    <input
                      type="text"
                      value={avroh}
                      onChange={(e) => setAvroh(e.target.value)}
                      placeholder="S N D P, M' G, R S"
                      className="w-full mt-1 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Subtabs: Sheet Music Grid vs Gurbani Shabad */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('notation')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${activeSheetTab === 'notation'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  Page 1: Sheet Music Grid ({currentTaal.matras} Matras)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSheetTab('shabad')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${activeSheetTab === 'shabad'
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
                  activeCell={activeCell}
                  onCellFocus={(sIdx, rIdx, mIdx) =>
                    setActiveCell({ sectionIndex: sIdx, rowIndex: rIdx, matraIndex: mIdx })
                  }
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
              />
            </div>
          )}
        </div>
      </main>

      {/* Swar Keyboard */}
      {(activeTab === 'edit' || activeTab === 'split') && activeSheetTab === 'notation' && (
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
