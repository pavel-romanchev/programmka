import { Play, PlayFormData } from '../types';

const API_BASE = 'http://localhost:8000';

export async function getAllPlays(): Promise<Play[]> {
  const response = await fetch(`${API_BASE}/api/plays`);
  if (!response.ok) throw new Error('Failed to fetch plays');
  return response.json();
}

export async function getPlayById(id: number): Promise<Play> {
  const response = await fetch(`${API_BASE}/api/plays/${id}`);
  if (!response.ok) throw new Error('Failed to fetch play');
  return response.json();
}

export async function searchPlays(title: string): Promise<Play[]> {
  const response = await fetch(`${API_BASE}/api/plays/search?title=${encodeURIComponent(title)}`);
  if (!response.ok) throw new Error('Failed to search plays');
  return response.json();
}

export async function createPlay(data: PlayFormData): Promise<Play> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('director', data.director);
  formData.append('theater', data.theater);
  formData.append('duration', data.duration.toString());
  formData.append('annotation', data.annotation);
  formData.append('average_rating', data.average_rating.toString());
  formData.append('actors', data.actors);
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`${API_BASE}/api/plays`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create play');
  return response.json();
}

export function getImageUrl(path: string | null): string {
  if (!path) return '/placeholder.png';
  return `${API_BASE}${path}`;
}
