import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import ProjectIndex from '@/components/ProjectIndex';
import WordMorph from '@/components/WordMorph';
import Practice from '@/components/Practice';
import Layers from '@/components/Layers';
import Honors from '@/components/Honors';
import Interlude from '@/components/Interlude';
import ProjectGrid from '@/components/ProjectGrid';
import Clients from '@/components/Clients';
import Studio from '@/components/Studio';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <div className="gridlines" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <main id="main">
        <Hero />
        <Manifesto />
        <ProjectIndex />
        <WordMorph />
        <Practice />
        <Layers />
        <Honors />
        <Interlude />
        <ProjectGrid />
        <Clients />
        <Studio />
      </main>
      <Footer />
    </>
  );
}
