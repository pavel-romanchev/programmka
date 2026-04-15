export interface Play {
  id: number;
  title: string;
  director: string;
  theater: string;
  duration: number;
  annotation: string;
  average_rating: number;
  actors: string[];
  image_path: string | null;
}

export interface PlayFormData {
  title: string;
  director: string;
  theater: string;
  duration: number;
  annotation: string;
  average_rating: number;
  actors: string;
  image: File | null;
}
