/**
 * API Layer - Communication avec le backend Payload CMS
 * Le frontend est totalement autonome et communique via REST API
 */

import type { User as CommonUser } from '@/types/common';

export const API_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:4200/api';

// Utiliser le type User de common pour la cohérence
export type User = CommonUser;

// Type de base pour les réponses paginées
export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Types de base pour les entités
export interface Formation {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  slug?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RendezVous {
  id: string;
  title: string;
  description?: string;
  date: string;
  duration?: number;
  contact?: Contact | string;
  formation?: Formation | string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

// Options de fetch génériques
interface FetchOptions {
  limit?: number;
  page?: number;
  sort?: string;
  where?: Record<string, any>;
}

/**
 * Fonction générique de fetch avec gestion d'erreurs
 * ⚠️ IMPORTANT: credentials: 'include' est OBLIGATOIRE pour envoyer les cookies d'authentification
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include', // ⚠️ CRITIQUE: envoie et reçoit les cookies
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        throw new Error('Non authentifié - Veuillez vous connecter');
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Erreur lors de l'appel à ${url}:`, error);
    throw error;
  }
}

/**
 * FORMATIONS
 */
export async function fetchFormations(options?: FetchOptions): Promise<PaginatedResponse<Formation>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.page) params.append('page', String(options.page));
  if (options?.sort) params.append('sort', options.sort);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<PaginatedResponse<Formation>>(`/formations${query}`, {
    cache: 'no-store',
  });
}

export async function fetchFormationById(id: string): Promise<Formation> {
  return apiFetch<Formation>(`/formations/${id}`);
}

export async function fetchFormationBySlug(slug: string): Promise<Formation> {
  return apiFetch<Formation>(`/formations?where[slug][equals]=${slug}`);
}

export async function createFormation(data: Partial<Formation>): Promise<Formation> {
  return apiFetch<Formation>('/formations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFormation(id: string, data: Partial<Formation>): Promise<Formation> {
  return apiFetch<Formation>(`/formations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteFormation(id: string): Promise<void> {
  return apiFetch<void>(`/formations/${id}`, {
    method: 'DELETE',
  });
}

/**
 * CONTACTS
 */
export async function fetchContacts(options?: FetchOptions): Promise<PaginatedResponse<Contact>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.page) params.append('page', String(options.page));

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<PaginatedResponse<Contact>>(`/contacts${query}`, {
    cache: 'no-store',
  });
}

export async function fetchContactById(id: string): Promise<Contact> {
  return apiFetch<Contact>(`/contacts/${id}`);
}

export async function createContact(data: Partial<Contact>): Promise<Contact> {
  return apiFetch<Contact>('/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
  return apiFetch<Contact>(`/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteContact(id: string): Promise<void> {
  return apiFetch<void>(`/contacts/${id}`, {
    method: 'DELETE',
  });
}

/**
 * RENDEZ-VOUS
 */
export async function fetchRendezVous(options?: FetchOptions): Promise<PaginatedResponse<RendezVous>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.page) params.append('page', String(options.page));

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<PaginatedResponse<RendezVous>>(`/rendez-vous${query}`, {
    cache: 'no-store',
  });
}

export async function fetchRendezVousById(id: string): Promise<RendezVous> {
  return apiFetch<RendezVous>(`/rendez-vous/${id}`);
}

export async function createRendezVous(data: Partial<RendezVous>): Promise<RendezVous> {
  return apiFetch<RendezVous>('/rendez-vous', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRendezVous(id: string, data: Partial<RendezVous>): Promise<RendezVous> {
  return apiFetch<RendezVous>(`/rendez-vous/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteRendezVous(id: string): Promise<void> {
  return apiFetch<void>(`/rendez-vous/${id}`, {
    method: 'DELETE',
  });
}

/**
 * AUTHENTIFICATION
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    credentials: 'include',
  });
}

export async function logout(): Promise<void> {
  return apiFetch<void>('/users/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>('/users/me', {
    credentials: 'include',
  });
}

/**
 * Vérifie si un email existe déjà dans la base de données
 */
export async function checkEmailExists(email: string): Promise<{ exists: boolean; needsAuth: boolean }> {
  try {
    const response = await fetch(
      `${API_URL}/users?where[email][equals]=${encodeURIComponent(email)}`,
      {
        credentials: 'include', // ⚠️ CRITIQUE
      }
    );

    if (response.status === 403 || response.status === 401) {
      return { exists: false, needsAuth: true };
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return { exists: data.totalDocs > 0, needsAuth: false };
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email:', error);
    return { exists: false, needsAuth: true };
  }
}

/**
 * USERS MANAGEMENT
 */
export async function fetchUsers(options?: FetchOptions): Promise<PaginatedResponse<User>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.page) params.append('page', String(options.page));
  if (options?.sort) params.append('sort', options.sort);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<PaginatedResponse<User>>(`/users${query}`, {
    cache: 'no-store',
    credentials: 'include',
  });
}

export async function fetchUserById(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`, {
    credentials: 'include',
  });
}

export async function createUser(data: Partial<User> & { password: string }): Promise<User> {
  return apiFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return apiFetch<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
  });
}

export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

/**
 * HEALTH CHECK
 */
export async function checkBackendHealth(): Promise<{ status: string; message?: string }> {
  try {
    return await apiFetch<{ status: string; message?: string }>('/health');
  } catch (error) {
    return { status: 'error', message: 'Backend inaccessible' };
  }
}
