
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Pictogram, Category, SavedPhrase } from './types';
import { PICTOGRAMS } from './constants';
import PictogramTile from './components/PictogramTile';
import { translatePictograms, generateSpeech, decodeAudioData } from './services/gemini';

const App: React.FC = () => {
  const [selectedSequence, setSelectedSequence] = useState<Pictogram[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.NEEDS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [customPictograms, setCustomPictograms] = useState<Pictogram[]>([]);
  
  // Modal state
  const [isAddingPictogram, setIsAddingPictogram] = useState(false);
  const [newPicLabel, setNewPicLabel] = useState('');
  const [newPicEmoji, setNewPicEmoji] = useState('');
  const [newPicCategory, setNewPicCategory] = useState<Category>(Category.ACTIONS);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Combine default and custom pictograms
  const allPictograms = useMemo(() => {
    return [...PICTOGRAMS, ...customPictograms];
  }, [customPictograms]);

  // Load data from localStorage
  useEffect(() => {
    const storedPhrases = localStorage.getItem('aac_saved_phrases');
    if (storedPhrases) {
      try { setSavedPhrases(JSON.parse(storedPhrases)); } catch (e) { console.error(e); }
    }
    const storedCustom = localStorage.getItem('aac_custom_pictograms');
    if (storedCustom) {
      try { setCustomPictograms(JSON.parse(storedCustom)); } catch (e) { console.error(e); }
    }
  }, []);

  // Persist data
  useEffect(() => {
    localStorage.setItem('aac_saved_phrases', JSON.stringify(savedPhrases));
  }, [savedPhrases]);

  useEffect(() => {
    localStorage.setItem('aac_custom_pictograms', JSON.stringify(customPictograms));
  }, [customPictograms]);

  const handleAddPictogram = (p: Pictogram) => {
    setSelectedSequence(prev => [...prev, p]);
    setTranslatedText(null);
  };

  const handleRemovePictogram = (index: number) => {
    setSelectedSequence(prev => prev.filter((_, i) => i !== index));
    setTranslatedText(null);
  };

  const handleClear = () => {
    setSelectedSequence([]);
    setTranslatedText(null);
  };

  const handleCreatePictogram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPicLabel || !newPicEmoji) return;

    const newPic: Pictogram = {
      id: `custom_${Date.now()}`,
      label: newPicLabel,
      emoji: newPicEmoji,
      category: newPicCategory,
      color: 'bg-indigo-500 text-white', // Custom color for user-created ones
    };

    setCustomPictograms(prev => [...prev, newPic]);
    setIsAddingPictogram(false);
    setNewPicLabel('');
    setNewPicEmoji('');
    setActiveCategory(newPicCategory);
  };

  const handleDeleteCustomPictogram = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este pictograma?')) {
      setCustomPictograms(prev => prev.filter(p => p.id !== id));
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

  const handleDeleteSavedPhrase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPhrases(prev => prev.filter(p => p.id !== id));
  };

  const handleLoadSavedPhrase = (phrase: SavedPhrase) => {
    setSelectedSequence(phrase.pictograms);
    setTranslatedText(phrase.text);
  };

  const handleSpeak = async () => {
    if (selectedSequence.length === 0) return;
    setIsProcessing(true);
    try {
      let sentence = translatedText;
      if (!sentence) {
        const labels = selectedSequence.map(p => p.label);
        sentence = await translatePictograms(labels);
        setTranslatedText(sentence);
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioData = await generateSpeech(sentence!);
      const buffer = await decodeAudioData(audioData, audioContextRef.current);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el mensaje.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden relative">
      {/* Header */}
      <header className="bg-white border-b p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span>🗣️</span> Pictogramas
        </h1>
        <button 
          onClick={() => setIsAddingPictogram(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-semibold shadow-sm"
        >
          <span>➕</span> Nuevo Pictograma
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Categories */}
        <aside className="w-full md:w-48 bg-white border-r overflow-y-auto p-2 space-y-2 flex md:block">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium relative whitespace-nowrap md:whitespace-normal ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                {cat === Category.FAVORITES ? '⭐' : ''} {cat}
              </span>
              {cat === Category.FAVORITES && savedPhrases.length > 0 && (
                <span className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {savedPhrases.length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Pictogram Grid */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
          {activeCategory === Category.FAVORITES ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPhrases.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-400">
                  <span className="text-4xl block mb-4">⭐</span>
                  No hay frases favoritas.
                </div>
              ) : (
                savedPhrases.map((phrase) => (
                  <button
                    key={phrase.id}
                    onClick={() => handleLoadSavedPhrase(phrase)}
                    className="flex flex-col p-4 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-yellow-400 transition-all text-left relative group"
                  >
                    <div className="flex gap-1 mb-2 overflow-hidden">
                      {phrase.pictograms.slice(0, 5).map((p, idx) => (
                        <span key={idx} className="text-xl" title={p.label}>{p.emoji}</span>
                      ))}
                    </div>
                    <p className="font-semibold text-slate-800 line-clamp-2">{phrase.text}</p>
                    <button
                      onClick={(e) => handleDeleteSavedPhrase(phrase.id, e)}
                      className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    >🗑️</button>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 justify-items-center">
              {allPictograms.filter(p => p.category === activeCategory).map(p => (
                <div key={p.id} className="relative group">
                  <PictogramTile pictogram={p} onClick={handleAddPictogram} />
                  {p.id.startsWith('custom_') && (
                    <button 
                      onClick={(e) => handleDeleteCustomPictogram(p.id, e)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-xs"
                    >✕</button>
                  )}
                </div>
              ))}
              {/* Add Tile inline for current category */}
              <button 
                onClick={() => {
                  setNewPicCategory(activeCategory);
                  setIsAddingPictogram(true);
                }}
                className="w-24 h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all"
              >
                <span className="text-2xl mb-1">➕</span>
                <span className="text-xs font-semibold">Añadir</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Builder Bar */}
      <footer className="bg-white border-t p-4 md:p-6 shadow-2xl z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          <div className="min-h-[90px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-3 flex flex-wrap gap-2 items-center overflow-x-auto">
            {selectedSequence.length === 0 && <p className="text-slate-400 text-center w-full text-sm">Frase vacía...</p>}
            {selectedSequence.map((p, i) => (
              <div key={`${p.id}-${i}`} className="relative group shrink-0">
                <PictogramTile pictogram={p} size="sm" onClick={() => handleRemovePictogram(i)} />
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                  onClick={(e) => { e.stopPropagation(); handleRemovePictogram(i); }}
                >✕</button>
              </div>
            ))}
          </div>

          {translatedText && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <p className="text-blue-900 font-semibold text-base flex-1 text-center">"{translatedText}"</p>
              <button onClick={handleSaveCurrentPhrase} className="ml-4 p-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full shadow-sm">⭐</button>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleClear} className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all">LIMPIAR</button>
            <button
              onClick={handleSpeak}
              disabled={selectedSequence.length === 0 || isProcessing}
              className={`flex-[2] py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
                isProcessing || selectedSequence.length === 0 ? 'bg-slate-300' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? '...' : <><span className="text-xl">🔊</span> HABLAR</>}
            </button>
          </div>
        </div>
      </footer>

      {/* Create Pictogram Modal */}
      {isAddingPictogram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Crear Pictograma</h2>
              <button onClick={() => setIsAddingPictogram(false)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>
            <form onSubmit={handleCreatePictogram} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Nombre / Etiqueta</label>
                <input 
                  type="text" required value={newPicLabel} onChange={e => setNewPicLabel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Ej: Hamburguesa"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Emoji</label>
                <input 
                  type="text" required value={newPicEmoji} onChange={e => setNewPicEmoji(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-2xl text-center"
                  placeholder="🍔"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Categoría</label>
                <select 
                  value={newPicCategory} onChange={e => setNewPicCategory(e.target.value as Category)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all appearance-none bg-slate-50"
                >
                  {Object.values(Category).filter(c => c !== Category.FAVORITES).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all">
                  GUARDAR PICTOGRAMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
