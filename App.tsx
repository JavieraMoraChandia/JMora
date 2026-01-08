
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Pictogram, Category, SavedPhrase } from './types';
import { PICTOGRAMS } from './constants';
import PictogramTile from './components/PictogramTile';
import { translatePictograms, generateSpeech, decodeAudioData } from './services/gemini';

const App: React.FC = () => {
  const [selectedSequence, setSelectedSequence] = useState<Pictogram[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.NEEDS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [customPictograms, setCustomPictograms] = useState<Pictogram[]>([]);
  
  const [isAddingPictogram, setIsAddingPictogram] = useState(false);
  const [newPicLabel, setNewPicLabel] = useState('');
  const [newPicEmoji, setNewPicEmoji] = useState('');
  const [newPicCategory, setNewPicCategory] = useState<Category>(Category.ACTIONS);

  const audioContextRef = useRef<AudioContext | null>(null);
  const translationTimeoutRef = useRef<number | null>(null);

  const allPictograms = useMemo(() => [...PICTOGRAMS, ...customPictograms], [customPictograms]);

  useEffect(() => {
    const storedPhrases = localStorage.getItem('aac_saved_phrases');
    if (storedPhrases) try { setSavedPhrases(JSON.parse(storedPhrases)); } catch (e) {}
    const storedCustom = localStorage.getItem('aac_custom_pictograms');
    if (storedCustom) try { setCustomPictograms(JSON.parse(storedCustom)); } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('aac_saved_phrases', JSON.stringify(savedPhrases));
  }, [savedPhrases]);

  useEffect(() => {
    localStorage.setItem('aac_custom_pictograms', JSON.stringify(customPictograms));
  }, [customPictograms]);

  // Real-time translation logic
  useEffect(() => {
    if (translationTimeoutRef.current) window.clearTimeout(translationTimeoutRef.current);

    if (selectedSequence.length > 0) {
      setIsTranslating(true);
      translationTimeoutRef.current = window.setTimeout(async () => {
        const labels = selectedSequence.map(p => p.label);
        const sentence = await translatePictograms(labels);
        setTranslatedText(sentence);
        setIsTranslating(false);
      }, 800);
    } else {
      setTranslatedText(null);
      setIsTranslating(false);
    }

    return () => {
      if (translationTimeoutRef.current) window.clearTimeout(translationTimeoutRef.current);
    };
  }, [selectedSequence]);

  const handleAddPictogram = (p: Pictogram) => {
    setSelectedSequence(prev => [...prev, p]);
  };

  const handleRemovePictogram = (index: number) => {
    setSelectedSequence(prev => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setSelectedSequence([]);
  };

  const handleSpeak = async () => {
    if (!translatedText) return;
    setIsProcessing(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioData = await generateSpeech(translatedText);
      const buffer = await decodeAudioData(audioData, audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveCurrentPhrase = () => {
    if (selectedSequence.length === 0 || !translatedText) return;
    const newPhrase: SavedPhrase = {
      id: Date.now().toString(),
      text: translatedText,
      pictograms: [...selectedSequence],
      timestamp: Date.now()
    };
    setSavedPhrases(prev => [newPhrase, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-800 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Voz Inteligente
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Asistente Personal</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddingPictogram(true)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-slate-200"
        >
          <span>➕</span> <span className="hidden sm:inline">Nuevo Icono</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
        {/* Sidebar Categories */}
        <aside className="w-full md:w-56 bg-slate-50 border-r border-slate-100 overflow-x-auto md:overflow-y-auto p-3 flex md:flex-col gap-2 scrollbar-hide">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 md:w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 font-semibold flex items-center gap-3 ${
                activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              <span className="text-lg opacity-80">{cat === Category.FAVORITES ? '⭐' : '📁'}</span>
              <span className="text-sm">{cat}</span>
              {cat === Category.FAVORITES && savedPhrases.length > 0 && (
                <span className="ml-auto bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {savedPhrases.length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Pictogram Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-white relative">
          {activeCategory === Category.FAVORITES ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPhrases.length === 0 ? (
                <div className="col-span-full py-32 text-center opacity-30 flex flex-col items-center">
                  <span className="text-6xl mb-4">⭐</span>
                  <p className="text-lg font-medium text-slate-400">Aún no tienes frases guardadas</p>
                </div>
              ) : (
                savedPhrases.map((phrase) => (
                  <div
                    key={phrase.id}
                    onClick={() => { setSelectedSequence(phrase.pictograms); setTranslatedText(phrase.text); }}
                    className="group relative flex flex-col p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-xl"
                  >
                    <div className="flex gap-2 mb-3">
                      {phrase.pictograms.slice(0, 4).map((p, idx) => (
                        <span key={idx} className="text-2xl bg-white p-2 rounded-xl shadow-sm border border-slate-100">{p.emoji}</span>
                      ))}
                    </div>
                    <p className="text-slate-800 font-bold leading-snug">{phrase.text}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSavedPhrases(prev => prev.filter(p => p.id !== phrase.id)); }}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >🗑️</button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {allPictograms.filter(p => p.category === activeCategory).map(p => (
                <div key={p.id} className="relative group animate-in fade-in zoom-in-95 duration-300">
                  <PictogramTile pictogram={p} onClick={handleAddPictogram} />
                  {p.id.startsWith('custom_') && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCustomPictograms(prev => prev.filter(cp => cp.id !== p.id)); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-md border-2 border-white"
                    >✕</button>
                  )}
                </div>
              ))}
              <button 
                onClick={() => { setNewPicCategory(activeCategory); setIsAddingPictogram(true); }}
                className="aspect-square flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all group"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Crear</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Builder Bar (Floating Style) */}
      <footer className="bg-white border-t border-slate-100 p-6 z-30 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Selected Area */}
          <div className="min-h-[100px] bg-slate-50 rounded-[2.5rem] border border-slate-100 p-4 flex flex-wrap gap-3 items-center shadow-inner relative overflow-hidden">
            {selectedSequence.length === 0 && (
              <p className="w-full text-center text-slate-300 font-medium italic animate-pulse">Selecciona pictogramas para empezar...</p>
            )}
            {selectedSequence.map((p, i) => (
              <div key={`${p.id}-${i}`} className="animate-in slide-in-from-right-4 duration-200">
                <div className="relative group">
                  <div className={`p-3 rounded-2xl ${p.color} shadow-md transition-transform active:scale-90 flex items-center gap-2 cursor-pointer`} onClick={() => handleRemovePictogram(i)}>
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">{p.label}</span>
                  </div>
                  <button onClick={() => handleRemovePictogram(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] shadow-lg border-2 border-white hidden group-hover:flex items-center justify-center">✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Translation Result */}
          <div className="h-16 flex items-center justify-center relative">
            {isTranslating ? (
              <div className="flex items-center gap-2 text-indigo-600 font-medium animate-pulse">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                <span className="ml-2">Pensando la frase...</span>
              </div>
            ) : translatedText ? (
              <div className="bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-indigo-700 font-semibold text-lg italic">"{translatedText}"</p>
                <button 
                  onClick={handleSaveCurrentPhrase}
                  className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                  title="Guardar en favoritos"
                >⭐</button>
              </div>
            ) : null}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button 
              onClick={handleClear} 
              disabled={selectedSequence.length === 0}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all disabled:opacity-30 flex items-center gap-2"
            >
              LIMPIAR
            </button>
            <button
              onClick={handleSpeak}
              disabled={!translatedText || isProcessing || isTranslating}
              className={`flex-1 py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all ${
                !translatedText || isProcessing || isTranslating 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 shadow-indigo-500/20'
              }`}
            >
              {isProcessing ? 'GENERANDO VOZ...' : <><span className="text-2xl">🔊</span> HABLAR FRASE</>}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isAddingPictogram && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Nuevo Icono</h2>
              <button onClick={() => setIsAddingPictogram(false)} className="text-slate-400 hover:text-slate-600 text-3xl transition-colors">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newPicLabel || !newPicEmoji) return;
              const newPic: Pictogram = { id: `custom_${Date.now()}`, label: newPicLabel, emoji: newPicEmoji, category: newPicCategory, color: 'bg-indigo-600 text-white' };
              setCustomPictograms(prev => [...prev, newPic]);
              setIsAddingPictogram(false);
              setNewPicLabel(''); setNewPicEmoji('');
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">¿Qué es?</label>
                <input 
                  type="text" required value={newPicLabel} onChange={e => setNewPicLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ej: Play Station"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Icono (Emoji)</label>
                <input 
                  type="text" required value={newPicEmoji} onChange={e => setNewPicEmoji(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-center text-4xl focus:border-indigo-500 outline-none transition-all"
                  placeholder="🎮"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                <select 
                  value={newPicCategory} onChange={e => setNewPicCategory(e.target.value as Category)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:border-indigo-500 outline-none transition-all appearance-none"
                >
                  {Object.values(Category).filter(c => c !== Category.FAVORITES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-5 rounded-2xl font-black text-white shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
                CREAR ICONO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
