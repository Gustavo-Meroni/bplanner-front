import { useEffect, useState } from 'react';

/** true quando a media query casa. Começa false no servidor, para não divergir na hidratação. */
export function useMediaQuery(consulta: string) {
  const [casa, setCasa] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(consulta);
    setCasa(mq.matches);
    const aoMudar = (e: MediaQueryListEvent) => setCasa(e.matches);
    mq.addEventListener('change', aoMudar);
    return () => mq.removeEventListener('change', aoMudar);
  }, [consulta]);

  return casa;
}
