export interface TaalBol {
  matra: number;
  english: string;
  hindi: string;
  punjabi: string;
}

export interface TaalName {
  english: string;
  hindi?: string;
  punjabi?: string;
}

export interface Taal {
  id?: number;
  taalId?: number;
  _id?: string;
  name: TaalName;
  matras: number;
  vibhag: number[];
  taali: number[];
  khali: number[];
  bol: TaalBol[];
  fullBol?: {
    english?: string;
    hindi?: string;
    punjabi?: string;
  };
  laya?: string[];
  isActive?: boolean;
}

export interface NotationRow {
  id: string;
  swars: string[];
  lyrics: string[];
}

export interface NotationSection {
  id: string;
  name: string;
  rows: NotationRow[];
}

export interface ShabadLine {
  gurmukhi: string;
  transliteration: string;
  translation: string;
}

export interface ShabadContent {
  title?: string;
  lines: ShabadLine[];
}

export interface NotationItem {
  _id: string;
  id?: string;
  userId: string | { _id: string; userName?: string; profileImage?: string };
  name: string;
  raag?: string;
  time?: string;
  aroh?: string;
  avroh?: string;
  vaadi?: string;
  samvaadi?: string;
  octavesInfo?: string;
  taal: Taal;
  sections: NotationSection[];
  shabad?: ShabadContent;
  shareId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotationPayload {
  name: string;
  raag?: string;
  time?: string;
  aroh?: string;
  avroh?: string;
  vaadi?: string;
  samvaadi?: string;
  octavesInfo?: string;
  taal: Taal;
  sections: NotationSection[];
  shabad?: ShabadContent;
  isPublic?: boolean;
}

export interface NotationsListResponse {
  success: boolean;
  notations: NotationItem[];
  total: number;
  page: number;
  totalPages: number;
}
