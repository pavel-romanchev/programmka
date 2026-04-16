export interface ActorEntry {
  role: string;
  actor: string;
}

export interface Play {
  id: number;
  title: string;
  director: string;
  theater: string;
  duration: number;
  annotation: string;
  average_rating: number;
  actors: ActorEntry[];
  image_path: string | null;
}

export interface PlayFormData {
  title: string;
  director: string;
  theater: string;
  duration: number;
  annotation: string;
  average_rating: number;
  actors: ActorEntry[];
  image: File | null;
}

export interface Article {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  image_path: string | null;
  play_id: number | null;
  created_at: string;
}

export interface ArticleListItem {
  id: number;
  title: string;
  subtitle: string | null;
  image_path: string | null;
  created_at: string;
}

export interface PaginatedArticles {
  items: ArticleListItem[];
  total: number;
  page: number;
  pages: number;
}

export interface ArticleFormData {
  title: string;
  subtitle: string;
  content: string;
  play_id: number | null;
  image: File | null;
}
