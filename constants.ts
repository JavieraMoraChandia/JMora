
import { Category, Pictogram } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ACTIONS]: 'bg-blue-100 border-blue-300 text-blue-800',
  [Category.FOOD]: 'bg-green-100 border-green-300 text-green-800',
  [Category.EMOTIONS]: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  [Category.PEOPLE]: 'bg-purple-100 border-purple-300 text-purple-800',
  [Category.PLACES]: 'bg-orange-100 border-orange-300 text-orange-800',
  [Category.NEEDS]: 'bg-red-100 border-red-300 text-red-800',
  [Category.TIME]: 'bg-teal-100 border-teal-300 text-teal-800',
  [Category.OBJECTS]: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  [Category.FAVORITES]: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

export const PICTOGRAMS: Pictogram[] = [
  // Needs
  { id: 'need_1', label: 'Ayuda', emoji: '🆘', category: Category.NEEDS, color: 'bg-red-500 text-white' },
  { id: 'need_2', label: 'Baño', emoji: '🚻', category: Category.NEEDS, color: 'bg-red-500 text-white' },
  { id: 'need_3', label: 'Dolor', emoji: '🤕', category: Category.NEEDS, color: 'bg-red-500 text-white' },
  { id: 'need_4', label: 'Sed', emoji: '🥤', category: Category.NEEDS, color: 'bg-red-500 text-white' },
  
  // Actions
  { id: 'act_1', label: 'Quiero', emoji: '🙋‍♂️', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_2', label: 'Comer', emoji: '🍽️', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_3', label: 'Beber', emoji: '🧃', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_4', label: 'Jugar', emoji: '🎮', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_5', label: 'Dormir', emoji: '😴', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_6', label: 'Ir', emoji: '🚶‍♂️', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_7', label: 'Escuchar', emoji: '🎧', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },
  { id: 'act_8', label: 'Ver', emoji: '📺', category: Category.ACTIONS, color: 'bg-blue-500 text-white' },

  // Food
  { id: 'food_1', label: 'Manzana', emoji: '🍎', category: Category.FOOD, color: 'bg-green-500 text-white' },
  { id: 'food_2', label: 'Pan', emoji: '🍞', category: Category.FOOD, color: 'bg-green-500 text-white' },
  { id: 'food_3', label: 'Agua', emoji: '💧', category: Category.FOOD, color: 'bg-green-500 text-white' },
  { id: 'food_4', label: 'Leche', emoji: '🥛', category: Category.FOOD, color: 'bg-green-500 text-white' },
  { id: 'food_5', label: 'Galleta', emoji: '🍪', category: Category.FOOD, color: 'bg-green-500 text-white' },

  // Emotions
  { id: 'emo_1', label: 'Feliz', emoji: '😊', category: Category.EMOTIONS, color: 'bg-yellow-500 text-white' },
  { id: 'emo_2', label: 'Triste', emoji: '😢', category: Category.EMOTIONS, color: 'bg-yellow-500 text-white' },
  { id: 'emo_3', label: 'Enojado', emoji: '😠', category: Category.EMOTIONS, color: 'bg-yellow-500 text-white' },
  { id: 'emo_4', label: 'Cansado', emoji: '🥱', category: Category.EMOTIONS, color: 'bg-yellow-500 text-white' },

  // People
  { id: 'peo_1', label: 'Mamá', emoji: '👩', category: Category.PEOPLE, color: 'bg-purple-500 text-white' },
  { id: 'peo_2', label: 'Papá', emoji: '👨', category: Category.PEOPLE, color: 'bg-purple-500 text-white' },
  { id: 'peo_3', label: 'Profesor', emoji: '👨‍🏫', category: Category.PEOPLE, color: 'bg-purple-500 text-white' },
  { id: 'peo_4', label: 'Amigo', emoji: '🧑‍🤝‍🧑', category: Category.PEOPLE, color: 'bg-purple-500 text-white' },

  // Places
  { id: 'pla_1', label: 'Casa', emoji: '🏠', category: Category.PLACES, color: 'bg-orange-500 text-white' },
  { id: 'pla_2', label: 'Escuela', emoji: '🏫', category: Category.PLACES, color: 'bg-orange-500 text-white' },
  { id: 'pla_3', label: 'Parque', emoji: '🌳', category: Category.PLACES, color: 'bg-orange-500 text-white' },

  // Objects
  { id: 'obj_1', label: 'Libro', emoji: '📖', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_2', label: 'Teléfono', emoji: '📱', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_3', label: 'Computadora', emoji: '💻', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_4', label: 'Pelota', emoji: '⚽', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_5', label: 'Lápiz', emoji: '✏️', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_6', label: 'Llaves', emoji: '🔑', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_7', label: 'Mochila', emoji: '🎒', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },
  { id: 'obj_8', label: 'Tablet', emoji: '📟', category: Category.OBJECTS, color: 'bg-indigo-500 text-white' },

  // Time
  { id: 'tim_1', label: 'Ahora', emoji: '⏰', category: Category.TIME, color: 'bg-teal-500 text-white' },
  { id: 'tim_2', label: 'Después', emoji: '⏳', category: Category.TIME, color: 'bg-teal-500 text-white' },
];
