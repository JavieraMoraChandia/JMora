
import { Category, Pictogram } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ACTIONS]: 'bg-blue-600 text-white',
  [Category.FOOD]: 'bg-emerald-600 text-white',
  [Category.EMOTIONS]: 'bg-amber-500 text-white',
  [Category.PEOPLE]: 'bg-purple-600 text-white',
  [Category.PLACES]: 'bg-orange-600 text-white',
  [Category.NEEDS]: 'bg-rose-600 text-white',
  [Category.TIME]: 'bg-cyan-600 text-white',
  [Category.OBJECTS]: 'bg-slate-600 text-white',
  [Category.FAVORITES]: 'bg-yellow-500 text-black',
};

export const PICTOGRAMS: Pictogram[] = [
  // Needs
  { id: 'need_1', label: 'Ayuda', emoji: '🆘', category: Category.NEEDS, color: 'bg-rose-600 text-white' },
  { id: 'need_2', label: 'Baño', emoji: '🚻', category: Category.NEEDS, color: 'bg-rose-600 text-white' },
  { id: 'need_3', label: 'Dolor', emoji: '🤕', category: Category.NEEDS, color: 'bg-rose-600 text-white' },
  { id: 'need_4', label: 'Sed', emoji: '🥤', category: Category.NEEDS, color: 'bg-rose-600 text-white' },
  
  // Actions
  { id: 'act_1', label: 'Quiero', emoji: '🙋‍♂️', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_2', label: 'Comer', emoji: '🍽️', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_3', label: 'Beber', emoji: '🧃', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_4', label: 'Jugar', emoji: '🎮', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_5', label: 'Dormir', emoji: '😴', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_6', label: 'Ir', emoji: '🚶‍♂️', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_7', label: 'Escuchar', emoji: '🎧', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },
  { id: 'act_8', label: 'Ver', emoji: '📺', category: Category.ACTIONS, color: 'bg-blue-600 text-white' },

  // Food
  { id: 'food_1', label: 'Manzana', emoji: '🍎', category: Category.FOOD, color: 'bg-emerald-600 text-white' },
  { id: 'food_2', label: 'Pan', emoji: '🍞', category: Category.FOOD, color: 'bg-emerald-600 text-white' },
  { id: 'food_3', label: 'Agua', emoji: '💧', category: Category.FOOD, color: 'bg-emerald-600 text-white' },
  { id: 'food_4', label: 'Leche', emoji: '🥛', category: Category.FOOD, color: 'bg-emerald-600 text-white' },
  { id: 'food_5', label: 'Galleta', emoji: '🍪', category: Category.FOOD, color: 'bg-emerald-600 text-white' },

  // Emotions
  { id: 'emo_1', label: 'Feliz', emoji: '😊', category: Category.EMOTIONS, color: 'bg-amber-500 text-white' },
  { id: 'emo_2', label: 'Triste', emoji: '😢', category: Category.EMOTIONS, color: 'bg-amber-500 text-white' },
  { id: 'emo_3', label: 'Enojado', emoji: '😠', category: Category.EMOTIONS, color: 'bg-amber-500 text-white' },
  { id: 'emo_4', label: 'Cansado', emoji: '🥱', category: Category.EMOTIONS, color: 'bg-amber-500 text-white' },

  // People
  { id: 'peo_1', label: 'Mamá', emoji: '👩', category: Category.PEOPLE, color: 'bg-purple-600 text-white' },
  { id: 'peo_2', label: 'Papá', emoji: '👨', category: Category.PEOPLE, color: 'bg-purple-600 text-white' },
  { id: 'peo_3', label: 'Profesor', emoji: '👨‍🏫', category: Category.PEOPLE, color: 'bg-purple-600 text-white' },
  { id: 'peo_4', label: 'Amigo', emoji: '🧑‍🤝‍🧑', category: Category.PEOPLE, color: 'bg-purple-600 text-white' },

  // Places
  { id: 'pla_1', label: 'Casa', emoji: '🏠', category: Category.PLACES, color: 'bg-orange-600 text-white' },
  { id: 'pla_2', label: 'Escuela', emoji: '🏫', category: Category.PLACES, color: 'bg-orange-600 text-white' },
  { id: 'pla_3', label: 'Parque', emoji: '🌳', category: Category.PLACES, color: 'bg-orange-600 text-white' },

  // Objects
  { id: 'obj_1', label: 'Libro', emoji: '📖', category: Category.OBJECTS, color: 'bg-slate-600 text-white' },
  { id: 'obj_2', label: 'Teléfono', emoji: '📱', category: Category.OBJECTS, color: 'bg-slate-600 text-white' },
  { id: 'obj_3', label: 'Computadora', emoji: '💻', category: Category.OBJECTS, color: 'bg-slate-600 text-white' },
  { id: 'obj_4', label: 'Pelota', emoji: '⚽', category: Category.OBJECTS, color: 'bg-slate-600 text-white' },

  // Time
  { id: 'tim_1', label: 'Ahora', emoji: '⏰', category: Category.TIME, color: 'bg-cyan-600 text-white' },
  { id: 'tim_2', label: 'Después', emoji: '⏳', category: Category.TIME, color: 'bg-cyan-600 text-white' },
];
