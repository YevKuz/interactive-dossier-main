import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Check, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dossierCopy } from '@/lib/dossier-copy';
import stairs from '@/assets/perspective-stairs.jpg';
import perspectiveTest from '@/assets/perspective-stairs.svg';

const cvEnUrl = `${import.meta.env.BASE_URL}CVs/en.html`;
const cvCsUrl = `${import.meta.env.BASE_URL}CVs/cz.html`;

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Evgeny Kuzmin — Beyond the CV' },
    { name: 'description', content: 'A thinker before a job title. Explore Evgeny Kuzmin’s perspective, international experience, and ambitions in finance, strategy, and entrepreneurship.' },
    { property: 'og:title', content: 'Evgeny Kuzmin — Beyond the CV' },
    { property: 'og:description', content: 'You’ve seen the CV. Here’s what doesn’t fit on it. A personal dossier about perspective, people, and the next question.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [language, setLanguage] = useState<'en' | 'cs'>('en');
  const [selected, setSelected] = useState<number | null>(null);
  const questionPanelRef = useRef<HTMLDivElement>(null);
  const perspectiveRevealRef = useRef<HTMLDivElement>(null);
  const hasPerspectiveSelection = useRef(false);
  const t = dossierCopy[language];
  const cvUrl = language === 'en' ? cvEnUrl : cvCsUrl;
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    let target: HTMLDivElement | null = null;
    let block: ScrollLogicalPosition = 'start';
    if (selected !== null) {
      hasPerspectiveSelection.current = true;
      target = perspectiveRevealRef.current;
    } else if (hasPerspectiveSelection.current) {
      hasPerspectiveSelection.current = false;
      target = questionPanelRef.current;
      block = 'center';
    }
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const offset = block === 'center' ? (window.innerHeight - rect.height) / 2 : 90;
      window.scrollTo({ top: rect.top + window.scrollY - offset, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);
  return <>
    <header className="site-header">
      <a href="#top" className="wordmark" aria-label="Evgeny Kuzmin"><span className="monogram">EK</span><div><div className="brand-name">Evgeny Kuzmin</div><div className="brand-sub">{t.dossier}</div></div></a>
      <div className="header-right">
        <nav className="desktop-nav" aria-label={language === 'en' ? 'Main navigation' : 'Hlavní navigace'}><a href="#perspective">{t.perspective}</a><a href="#context">{t.context}</a><a href="#next">{t.next}</a></nav>
        <div className="language-switch" aria-label={language === 'en' ? 'Language' : 'Jazyk'}><Button variant="ghost" className="language-button" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</Button><span className="text-muted-foreground text-xs">/</span><Button variant="ghost" className="language-button" aria-label="Čeština" aria-pressed={language === 'cs'} onClick={() => setLanguage('cs')}>CZ</Button></div>
        <Button variant="outline" className="header-talk" asChild><a href="#contact">{t.talk}<ArrowUpRight /></a></Button>
      </div>
    </header>
    <main>
      <section className="hero" id="top">
        <img src={stairs} alt="" width={1920} height={1024} className="hero-image" fetchPriority="high" />
        <div className="hero-content"><p className="hero-intro">{t.intro}</p><h1>{t.headline.split('|').flatMap((part, i) => i === 0 ? [part] : [<br className="mobile-break" key={`b${i}`} />, part])}</h1><p className="hero-thinker">{t.thinker}</p><p className="hero-lead">{t.lead}</p><div className="hero-actions"><Button asChild className="intro-link"><a href="#perspective">{t.explore}<ArrowDownRight /></a></Button><Button asChild variant="outline" className="hero-cv"><a href={cvUrl} target="_blank" rel="noopener noreferrer">{t.cv}<Download /></a></Button></div></div>
        <div className="hero-bottom"><span className="eyebrow">{t.location}</span><ArrowDown /></div>
      </section>
      <div className="thread-strip">{t.fields.map(field => <span key={field}>{field}</span>)}</div>
      <section className="section" id="perspective">
        <div className="section-heading"><div><div className="eyebrow section-label">{t.sectionOne}</div><h2>{t.question}</h2></div><p>{t.questionSub}</p></div>
        <div className="perspective-grid"><div><img src={perspectiveTest} alt={t.imageAlt} width={1100} height={1000} loading="lazy" className="question-image" /><div className="image-caption"><span>FIG. 01 — {language === 'en' ? 'A DIFFERENT PERSPECTIVE' : 'JINÝ POHLED'}</span><span>EK / 01</span></div></div>
          <div ref={questionPanelRef} className="question-panel"><h3>{language === 'en' ? 'What do you see?' : 'Co vidíte vy?'}</h3><div className="answer-list">{t.options.map((option, i) => <Button variant="outline" key={i} className="answer-button" aria-pressed={selected === i} aria-controls="perspective-reveal" onClick={() => setSelected(i)}><span className="answer-label"><span className="answer-number">0{i + 1}</span>{option}</span>{selected === i ? <Check /> : <ArrowUpRight />}</Button>)}</div><p className="question-note">{t.noRight}</p></div>
        </div>
        <div ref={perspectiveRevealRef} id="perspective-reveal" aria-live="polite">{selected !== null && <div className="reveal"><div className="eyebrow section-label">{t.myAnswer}</div><p className="chosen-perspective">{t.interpretations[selected]}</p><h3>{t.revealTitle}</h3><p>{t.reveal}</p><Button variant="ghost" className="reset-button" onClick={() => setSelected(null)}><RotateCcw />{t.change}</Button></div>}</div>
      </section>
      <section className="section context-section" id="context"><div className="context-grid"><div><div className="eyebrow section-label">{t.sectionTwo}</div><h2>{t.storyTitle}</h2><div className="story-copy"><p>{t.story}</p><p>{t.storySecond}</p><p>{t.storyThird}</p></div><blockquote className="story-quote">{t.quote}</blockquote></div><div className="facts"><div className="eyebrow">{t.factsLabel}</div>{t.facts.map(fact => <article key={fact.title} className="fact"><div className="fact-label">{fact.label}</div><h3>{fact.title}</h3><p>{fact.detail}</p></article>)}</div></div></section>
      <section className="section ambition-section" id="next"><div className="section-heading"><div><div className="eyebrow section-label">{t.sectionThree}</div><h2>{t.ambitionTitle}</h2></div><p>{t.ambitionIntro}</p></div><div className="ambition-grid">{t.ambitions.map(item => <article className="ambition" key={item.number}><span className="ambition-number">{item.number} /</span><h3>{item.title}</h3><div className="ambition-field">{item.text}</div><p>{item.detail}</p></article>)}</div></section>
      <section className="contact-section" id="contact"><div className="eyebrow section-label">{t.contactLabel}</div><div className="contact-grid"><div><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-links"><Button asChild className="contact-primary"><a href="mailto:yevgeniku@gmail.com">{t.email}<ArrowUpRight /></a></Button><Button asChild variant="link" className="contact-secondary"><a href="https://www.linkedin.com/in/evgenykuzminfinance/" target="_blank" rel="noopener noreferrer">{t.linkedin}<ArrowUpRight /></a></Button></div></div></section>
    </main>
    <footer className="footer"><span>© {new Date().getFullYear()} Evgeny Kuzmin</span><span className="eyebrow">{t.footer}</span><a className="footer-cv" href={cvUrl} target="_blank" rel="noopener noreferrer">{t.cv}<Download /></a></footer>
  </>;
}
