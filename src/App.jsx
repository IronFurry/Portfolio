import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OpeningSequence } from './components/OpeningSequence/OpeningSequence';
import { HeroScene } from './components/HeroScene/HeroScene';
import { AboutPage } from './pages/AboutPage/AboutPage';
import { ArtifactsPage } from './pages/ArtifactsPage/ArtifactsPage';
import { FuturePage } from './pages/FuturePage/FuturePage';
import { ContactPage } from './pages/ContactPage/ContactPage';
import { FullscreenTransition } from './components/FullscreenTransition/FullscreenTransition';

const getRoute = () => {
  if (typeof window === 'undefined') return 'home';

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(window.location.search);
  const scene = params.get('scene');
  const hash = window.location.hash;

  if (path === '/artifacts' || scene === 'artifacts' || hash === '#artifacts') return 'artifacts';
  if (path === '/about' || scene === 'about') return 'about';
  if (path === '/future' || scene === 'future' || hash === '#future') return 'future';
  if (path === '/contact' || scene === 'contact' || hash === '#contact') return 'contact';
  return 'home';
};

export default function App() {
  const initialRoute = getRoute();

  const [archiveEntered, setArchiveEntered] = useState(() => initialRoute !== 'home');
  const [currentPage, setCurrentPage] = useState(initialRoute);
  const currentPageRef = useRef(initialRoute);

  const setPage = useCallback((page) => {
    currentPageRef.current = page;
    setCurrentPage(page);
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');

  // Keep browser Back/Forward navigation in sync with the cinematic app shell.
  useEffect(() => {
    const handlePopState = () => {
      const route = getRoute();
      currentPageRef.current = route;
      setCurrentPage(route);
      setArchiveEntered(route !== 'home' || window.location.search.includes('scene=hero'));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((page, message, { replace = false } = {}) => {
    const path = page === 'artifacts' ? '/artifacts' : page === 'about' ? '/about' : page === 'future' ? '/future' : page === 'contact' ? '/contact' : '/';

    setTransitionMsg(message);
    setIsTransitioning(true);

    const commit = () => {
      if (replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }

      setArchiveEntered(true);
      setPage(page);
      window.scrollTo(0, 0);

      window.setTimeout(() => setIsTransitioning(false), 220);
    };

    window.setTimeout(commit, 380);
  }, [setPage]);

  const handleEnterArchive = useCallback(() => {
    // The opening sequence enters the hero, not the artifact archive.
    window.history.replaceState({}, '', '/');
    setArchiveEntered(true);
    setPage('home');
  }, [setPage]);

  const handleResetToIntro = useCallback(() => {
    window.history.replaceState({}, '', '/');
    setArchiveEntered(false);
    setPage('home');
  }, [setPage]);

  const handleNavigateToAbout = useCallback(() => {
    navigate('about', 'VISITING ABOUT ARCHIVE...');
  }, [navigate]);

  const handleNavigateToArtifacts = useCallback(() => {
    navigate('artifacts', 'ACCESSING ARTIFACT ARCHIVE...');
  }, [navigate]);

  const handleNavigateToFuture = useCallback(() => {
    navigate('future', 'ACCESSING FUTURE PROJECTION...');
  }, [navigate]);

  const handleNavigateToContact = useCallback(() => {
    navigate('contact', 'ESTABLISHING COMMUNICATION CHANNEL...');
  }, [navigate]);

  const handleNavigateToHome = useCallback(() => {
    navigate('home', 'RETURNING TO HERO SPACE...');
  }, [navigate]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#030405',
        overflowX: 'hidden'
      }}
    >
      {!archiveEntered ? (
        <OpeningSequence onEnterArchive={handleEnterArchive} />
      ) : currentPage === 'artifacts' ? (
        <ArtifactsPage
          onNavigateHome={handleNavigateToHome}
          onNavigateAbout={handleNavigateToAbout}
          onNavigateFuture={handleNavigateToFuture}
          onNavigateContact={handleNavigateToContact}
        />
      ) : currentPage === 'about' ? (
        <AboutPage
          onNavigateHome={handleNavigateToHome}
          onNavigateArtifacts={handleNavigateToArtifacts}
          onNavigateFuture={handleNavigateToFuture}
          onNavigateContact={handleNavigateToContact}
        />
      ) : currentPage === 'future' ? (
        <FuturePage
          onNavigateHome={handleNavigateToHome}
          onNavigateAbout={handleNavigateToAbout}
          onNavigateArtifacts={handleNavigateToArtifacts}
          onNavigateContact={handleNavigateToContact}
        />
      ) : currentPage === 'contact' ? (
        <ContactPage
          onNavigateHome={handleNavigateToHome}
          onNavigateAbout={handleNavigateToAbout}
          onNavigateArtifacts={handleNavigateToArtifacts}
          onNavigateFuture={handleNavigateToFuture}
        />
      ) : (
        <HeroScene
          onReplayIntro={handleResetToIntro}
          onNavigateToAbout={handleNavigateToAbout}
          onNavigateToArtifacts={handleNavigateToArtifacts}
          onNavigateToFuture={handleNavigateToFuture}
          onNavigateToContact={handleNavigateToContact}
        />
      )}

      <AnimatePresence>
        {isTransitioning && (
          <FullscreenTransition message={transitionMsg} />
        )}
      </AnimatePresence>
    </div>
  );
}
