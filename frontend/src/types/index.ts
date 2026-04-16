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
