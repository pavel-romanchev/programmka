import { Article, ArticleFormData, PaginatedArticles } from '../types';

const API_BASE = 'http://localhost:8000';

export async function getArticles(page: number = 1): Promise<PaginatedArticles> {
  const response = await fetch(`${API_BASE}/api/articles?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch articles');
  return response.json();
}

export async function getArticleById(id: number): Promise<Article> {
  const response = await fetch(`${API_BASE}/api/articles/${id}`);
  if (!response.ok) throw new Error('Failed to fetch article');
  return response.json();
}

export async function createArticle(data: ArticleFormData): Promise<Article> {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.subtitle) {
    formData.append('subtitle', data.subtitle);
  }
  formData.append('content', data.content);
  if (data.play_id !== null) {
    formData.append('play_id', data.play_id.toString());
  }
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`${API_BASE}/api/articles`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create article');
  return response.json();
}

export async function deleteArticle(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete article');
}

export async function updateArticle(id: number, data: ArticleFormData): Promise<Article> {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.subtitle) {
    formData.append('subtitle', data.subtitle);
  }
  formData.append('content', data.content);
  if (data.play_id !== null) {
    formData.append('play_id', data.play_id.toString());
  }
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`${API_BASE}/api/articles/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to update article');
  return response.json();
}

export function getArticleImageUrl(path: string | null): string {
  if (!path) return '/placeholder.png';
  return `${API_BASE}${path}`;
}
