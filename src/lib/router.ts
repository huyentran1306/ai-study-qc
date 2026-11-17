import { useEffect, useState } from 'react';

/** Tiny hash router — works on GitHub Pages without server rewrites. */
export type Route =
  | { name: 'home' }
  | { name: 'stage'; id: string }
  | { name: 'labs' }
  | { name: 'lab'; id: string }
  | { name: 'prompts' }
  | { name: 'interview' };

export const parseHash = (hash: string): Route => {
  const [head, id] = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (head === 'stage' && id) return { name: 'stage', id };
  if (head === 'lab' && id) return { name: 'lab', id };
  if (head === 'labs') return { name: 'labs' };
  if (head === 'prompts') return { name: 'prompts' };
  if (head === 'interview') return { name: 'interview' };
  return { name: 'home' };
};

export const href = (path: string) => `#/${path.replace(/^\//, '')}`;

export const navigate = (path: string) => {
  window.location.hash = href(path);
};

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
};
