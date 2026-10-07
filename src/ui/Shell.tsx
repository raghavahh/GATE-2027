import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Logo } from './bits';
import { toggleTheme, useStore } from '../lib/store';

const nav = [
  { to: '/papers', label: 'Papers' },
  { to: '/pyq', label: 'PYQs' },
  { to: '/guide', label: 'How to prepare' },
];

export function Shell() {
  const { theme } = useStore();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-shell items-center gap-6 px-4 sm:px-6">
          <Link to="/" aria-label="GATE A–Z home"><Logo /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => `rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ${isActive ? 'text-ink bg-raised' : 'text-sub hover:text-ink'}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="grid h-9 w-9 place-items-center rounded-lg text-sub hover:bg-raised hover:text-ink" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button type="button" className="btn-ghost h-9 px-3" onClick={() => alert('Sign in with Google opens with payments.')}>Sign in</button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden" aria-label="Main">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-raised text-ink' : 'text-sub'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-shell flex-col gap-4 px-4 py-8 text-sm text-sub sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo small />
          <p className="max-w-md text-xs text-mute">Not affiliated with IISc, the IITs or the GATE organisers. Videos belong to their creators and play through YouTube's official player.</p>
        </div>
      </footer>
    </div>
  );
}
