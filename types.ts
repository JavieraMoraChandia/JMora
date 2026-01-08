
export enum Category {
  ACTIONS = 'Acciones',
  FOOD = 'Comida',
  EMOTIONS = 'Emociones',
  PEOPLE = 'Personas',
  PLACES = 'Lugares',
  NEEDS = 'Necesidades',
  TIME = 'Tiempo',
  OBJECTS = 'Objetos',
  FAVORITES = 'Favoritos'
}

export interface Pictogram {
  id: string;
  label: string;
  emoji: string;
  category: Category;
  color: string;
}

export interface SavedPhrase {
  id: string;
  text: string;
  pictograms: Pictogram[];
  timestamp: number;
}

export interface Message {
  text: string;
  audioUrl?: string;
  isBot: boolean;
  timestamp: Date;
}
