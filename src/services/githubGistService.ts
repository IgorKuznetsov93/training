import { GIST_DESCRIPTION, GIST_FILENAME } from '../constants/sync.constants';
import type {
  GitHubErrorDTO,
  GitHubGistDTO,
  GitHubUserDTO,
  SyncDataDTO,
} from '../types/sync.types';

const API_BASE = 'https://api.github.com';

function createHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json()) as GitHubErrorDTO;
    throw new Error(error.message || `GitHub API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function validateToken(token: string): Promise<GitHubUserDTO> {
  const response = await fetch(`${API_BASE}/user`, {
    headers: createHeaders(token),
  });
  return parseResponse<GitHubUserDTO>(response);
}

export async function findExistingGist(token: string): Promise<GitHubGistDTO | null> {
  const response = await fetch(`${API_BASE}/gists?per_page=100`, {
    headers: createHeaders(token),
  });
  const gists = await parseResponse<GitHubGistDTO[]>(response);
  return (
    gists.find(
      (gist) =>
        gist.description === GIST_DESCRIPTION && gist.files[GIST_FILENAME] !== undefined,
    ) ?? null
  );
}

export async function fetchGist(token: string, gistId: string): Promise<GitHubGistDTO> {
  const response = await fetch(`${API_BASE}/gists/${gistId}`, {
    headers: createHeaders(token),
  });
  return parseResponse<GitHubGistDTO>(response);
}

export function parseSyncData(gist: GitHubGistDTO): SyncDataDTO {
  const raw = gist.files[GIST_FILENAME]?.content;
  if (!raw) {
    return createEmptySyncData();
  }
  try {
    const parsed = JSON.parse(raw) as SyncDataDTO;
    if (parsed.version !== 1 || !parsed.overrides) {
      return createEmptySyncData();
    }
    return parsed;
  } catch {
    return createEmptySyncData();
  }
}

export function createEmptySyncData(): SyncDataDTO {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    overrides: {},
  };
}

export async function createGist(token: string, data: SyncDataDTO): Promise<GitHubGistDTO> {
  const response = await fetch(`${API_BASE}/gists`, {
    method: 'POST',
    headers: {
      ...createHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });
  return parseResponse<GitHubGistDTO>(response);
}

export async function updateGist(
  token: string,
  gistId: string,
  data: SyncDataDTO,
): Promise<GitHubGistDTO> {
  const response = await fetch(`${API_BASE}/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      ...createHeaders(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });
  return parseResponse<GitHubGistDTO>(response);
}
