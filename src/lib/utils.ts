import { ParsedRepo } from '../types';

export function parseRepo(input: string): ParsedRepo | null {
  const trimmed = input.trim().replace(/\/$/, '').replace(/\.git$/, '');
  if (!trimmed) return null;

  // Full GitHub URL: https://github.com/owner/repo
  const urlMatch = trimmed.match(/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/);
  if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };

  // Short form: owner/repo
  const shortMatch = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };

  return null;
}

export function avatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E293B&color=06B6D4&bold=true`;
}
