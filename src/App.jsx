import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, DownloadSimple, X } from '@phosphor-icons/react';
import { PhotoTrail } from './PhotoTrail.jsx';
import { projects } from './projects.js';
import rawContent from './content.json';
import { sitePath, assetData, appRoute } from './site-paths.js';
const content = assetData(rawContent);

const caseChapters = [
  { id: 'case-product-review', page: 3, label: 'Product audit', offset: '37.5%' },
  { id: 'case-user-research', page: 5, label: 'User research' },
  { id: 'case-competitive-analysis', page: 8, label: 'Competitive analysis' },
  { id: 'case-design-strategy', page: 11, label: 'Design strategy' },
  { id: 'case-design-solutions', page: 12, label: 'Design solutions' },
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

function LocalLink({ href, children, onClick, ...props }) {
  href = sitePath(href);
  return <a href={href} {...props} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onClick?.(event);
    if (window.location.pathname + window.location.hash === href) {
      scrollToSection(href.split('#')[1] || 'top');
      return;
    }
    window.history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }}>{children}</a>;
}

function Downloads() {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const trigger = useRef(null);
  const root = useRef(null);
  const suppressFocus = useRef(false);
  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const deferClose = () => { timer.current = setTimeout(() => { if (!root.current?.contains(document.activeElement)) setOpen(false); }, 160); };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return <div className="downloads" ref={root} onMouseEnter={show} onMouseLeave={deferClose}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { suppressFocus.current = true; trigger.current?.focus(); setOpen(false); } }}>
    <button ref={trigger} className="download-trigger" aria-expanded={open} aria-controls="download-options"
      onFocus={() => { if (suppressFocus.current) { suppressFocus.current = false; return; } show(); }} onClick={show}>Download PDF<ArrowDown size={14} weight="light" aria-hidden="true" /></button>
    <div className="download-dropdown" id="download-options" role="group" aria-label="PDF downloads" hidden={!open}>
      <a href={content.resumePdf} download="Xuanzhu-Zhao-Resume.pdf"><span>Resume</span><DownloadSimple size={18} weight="light" aria-hidden="true" /></a>
      {content.portfolioPdf ? <a href={content.portfolioPdf} download="Xuanzhu-Zhao-Portfolio.pdf"><span>Portfolio</span><DownloadSimple size={18} weight="light" aria-hidden="true" /></a>
        : <span className="download-unavailable" aria-disabled="true"><span>Portfolio</span><small>Coming soon</small></span>}
    </div>
  </div>;
}

function Header({ worksPage }) {
  return <header className="site-header">
    <LocalLink className="wordmark" href="/" aria-label="Zhao Xuanzhu home">Zhao Xuanzhu</LocalLink>
    <nav className="main-nav" aria-label="Main navigation"><LocalLink href="/works" aria-current={worksPage ? 'page' : undefined}>Work</LocalLink><LocalLink href="/#about">About</LocalLink></nav>
    <Downloads />
  </header>;
}

function ContactFooter() {
  return <footer className="site-footer page-gutter" id="contact" aria-labelledby="contact-title">
    <p>Contact</p><h2 className="footer-contact" id="contact-title">Let’s talk.</h2>
    <div className="contact-details">
      <div><span className="contact-label">Name</span><p className="chinese-name" lang="zh-CN">赵轩竹</p></div>
      <div><span className="contact-label">QQ Email</span><a href="mailto:2324240590@qq.com">2324240590@qq.com<ArrowUpRight size={18} weight="light" aria-hidden="true" /></a></div>
      <div><span className="contact-label">Phone</span><a href="tel:+8619857118776">+86 198 5711 8776<ArrowUpRight size={18} weight="light" aria-hidden="true" /></a></div>
    </div>
    <div className="footer-bottom"><span>Xuanzhu Zhao</span><a href="#top">Back to top<ArrowUpRight size={13} weight="light" aria-hidden="true" /></a></div>
  </footer>;
}

function CaseContents() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(caseChapters[0].id);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const section = document.getElementById('work');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      setVisible(rect.top < innerHeight * .6 && rect.bottom > innerHeight * .4);
      let current = caseChapters[0].id;
      for (const chapter of caseChapters) {
        if (document.getElementById(chapter.id)?.getBoundingClientRect().top <= innerHeight * .35) current = chapter.id;
      }
      setActive(current);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, []);
  return <aside className={`case-contents${visible ? ' is-visible' : ''}${expanded ? ' is-expanded' : ''}`} aria-label="Case study contents" inert={!visible}>
    <LocalLink className="case-back-top" href="/#top" aria-label="Back to website top"><ArrowUp size={20} weight="light" aria-hidden="true" /></LocalLink>
    <button className="contents-toggle" aria-expanded={expanded} aria-controls="case-chapter-links" onClick={() => setExpanded(value => !value)}>Contents <span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <nav id="case-chapter-links" aria-label="Project chapters" onClick={() => setExpanded(false)}>
      {caseChapters.map((chapter, index) => <LocalLink key={chapter.id} href={`/#${chapter.id}`} aria-current={active === chapter.id ? 'location' : undefined}><span className="chapter-number">0{index + 1}</span><span>{chapter.label}</span></LocalLink>)}
    </nav>
  </aside>;
}

function FeaturedCase() {
  const container = useRef(null);
  const reader = useRef(null);
  const [activePage, setActivePage] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const project = content.featuredCase;
  const pageGroups = [];
  project.pages.forEach((page, index) => {
    const item = { page, index };
    if (page.joinPrevious && pageGroups.length) pageGroups[pageGroups.length - 1].push(item);
    else pageGroups.push([item]);
  });
  useEffect(() => {
    if (activePage === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    reader.current?.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activePage]);
  useEffect(() => {
    const host = container.current;
    if (!host || !project.pages.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    host.dataset.revealReady = 'true';
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.dataset.visible = 'true'; observer.unobserve(entry.target); } });
    }, { threshold: .03, rootMargin: '0px 0px 50px 0px' });
    host.querySelectorAll('.case-page').forEach(page => observer.observe(page));
    return () => observer.disconnect();
  }, [project.pages.length]);
  return <section className={`featured-case page-gutter${project.pages.length ? ' has-case' : ''}`} id="work" aria-labelledby="work-title">
    <div className="section-heading featured-heading"><h2 id="work-title">Selected work</h2></div>
    {!project.pages.length && <div className="case-intro"><p className="eyebrow">01 / {project.subtitle}</p><h3>{project.title}</h3><p>{project.description}</p></div>}
    {project.pages.length > 0 && <div className="case-reading-info"><h3>{project.title}</h3></div>}
    {project.pages.length > 0 && <CaseContents />}
    {project.pages.length ? <div className="case-pages" ref={container}>
      {pageGroups.map(group => <div className={`case-page${group.length > 1 ? ' is-joined' : ''}`} key={group[0].page.src} data-page-group={group.map(item => item.index + 1).join('-')}>
        {group.map(({ page, index }) => <figure className="case-sheet" key={page.src} data-page-number={index + 1} id={caseChapters.find(chapter => chapter.page === index + 1 && !chapter.offset)?.id}>
        {caseChapters.filter(chapter => chapter.page === index + 1 && chapter.offset).map(chapter => <span key={chapter.id} id={chapter.id} className="case-chapter-marker" style={{ top: chapter.offset }} aria-hidden="true" />)}
        <button className="case-page-link" onClick={() => { setZoomed(false); setActivePage(index); }} aria-label={`View page ${index + 1} of ${project.pages.length} in full size`} title={`View page ${String(index + 1).padStart(2, '0')} in full size`}>
          <img src={page.src} srcSet={page.srcSet} sizes="(max-width:650px) calc(100vw - 24px), (min-width:2061px) 1360px, 66vw" width={page.width} height={page.height} alt={page.alt || `${project.title} — case study page ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
        </button>
        </figure>)}
      </div>)}
    </div> : <div className="case-coming"><p>Full case study coming soon.</p><LocalLink href="/works">Explore selected projects<ArrowUpRight size={18} weight="light" aria-hidden="true" /></LocalLink></div>}
    <dialog ref={reader} className="case-reader" aria-label="Case study page reader" onClose={() => setActivePage(null)} onClick={event => { if (event.target === event.currentTarget) reader.current?.close(); }}>
      {activePage !== null && <div className="case-reader-content">
        <div className="case-reader-toolbar"><span>Page {String(activePage + 1).padStart(2, '0')} / {project.pages.length}</span><div><button className="reader-zoom" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? 'Fit width' : 'Zoom in'}</button><button className="reader-close" onClick={() => reader.current?.close()} aria-label="Close page reader"><X size={22} weight="light" /></button></div></div>
        <div className={`case-reader-scroll${zoomed ? ' is-zoomed' : ''}`} tabIndex={0} aria-label="Scrollable original image">
          <img src={project.pages[activePage].original || project.pages[activePage].src} width={project.pages[activePage].width} height={project.pages[activePage].height} alt={project.pages[activePage].alt} style={zoomed ? { width: Math.min(project.pages[activePage].width, Math.max(1400, Math.min(1720, window.innerWidth - 32) * 1.7)) } : undefined} />
        </div>
      </div>}
    </dialog>
  </section>;
}

function About() {
  return <section className="about-section page-gutter" id="about" aria-labelledby="about-title">
    <div className="about-intro"><h2 id="about-title">About</h2><div>
      <p className="about-statement">Turning ideas<br />into experiences.</p>
      <p className="about-description">I’m Xuanzhu, an interaction design master’s student at Zhejiang University, based in Hangzhou. My work moves between AI-assisted tools, digital products, and expressive interactions.</p>
      <p className="about-description">I care about what people are trying to do, and the small details that make an experience feel clear. Through research, interface design, and prototyping, I turn abstract ideas into something people can use and feel.</p>
    </div></div>
    <div className="about-details"><div className="detail-group"><h3>Education</h3>
      <div className="detail-row"><p>Zhejiang University<span>Master’s in Art &amp; Design · Interaction Design</span></p><span className="detail-date">2025 — 2028 <small>Expected</small></span></div>
      <div className="detail-row"><p>Zhejiang University<span>Bachelor’s in Art &amp; Technology</span></p><span className="detail-date">2021 — 2025</span></div>
    </div><div className="detail-group"><h3>Practice</h3><p className="practice-list">Interaction design<br />User research<br />Interface &amp; visual design<br />Motion &amp; prototyping<br />AI-assisted workflows</p><p className="tools">Figma · Photoshop · Illustrator · Cinema 4D · AI Studio</p></div></div>
  </section>;
}

function Home() {
  return <>
    <section className="hero" id="top" aria-labelledby="hero-title" data-photo-count="12">
      <PhotoTrail />
      <div className="hero-copy"><h1 id="hero-title" aria-label="Xuanzhu Zhao"><span>Xuanzhu</span><span>Zhao</span></h1>
        <p>Interaction &amp; experience designer.<br />I turn complex ideas into clear, thoughtful experiences — through research, visual design, and prototyping.</p>
      </div>
      <a className="scroll-cue" href="#work" aria-label="Scroll to selected work"><ArrowDown size={26} weight="thin" aria-hidden="true" /></a>
    </section>
    <FeaturedCase /><About />
  </>;
}

function ProjectCard({ project, onOpen }) {
  return <button className={`project project-${project.id}`} onClick={() => onOpen(project)} aria-label={`View ${project.title} overview`}>
    <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
    <span className="project-caption"><span className="project-title">{project.title}</span><span className="project-subtitle">{project.subtitle}</span></span>
    <span className="project-open"><ArrowUpRight size={24} weight="light" aria-hidden="true" /></span>
  </button>;
}

function Works({ onOpen }) {
  return <section className="works-page page-gutter" id="top" aria-labelledby="works-page-title">
    <div className="works-page-heading"><h1 id="works-page-title">Work</h1><p>Selected projects / 04</p></div>
    <p className="works-preview-label">Preview covers — project visuals coming soon</p>
    <div className="masonry"><div className="masonry-column"><ProjectCard project={projects[0]} onOpen={onOpen} /><ProjectCard project={projects[2]} onOpen={onOpen} /></div>
      <div className="masonry-column"><ProjectCard project={projects[1]} onOpen={onOpen} /><ProjectCard project={projects[3]} onOpen={onOpen} /></div></div>
  </section>;
}

export function App() {
  const [route, setRoute] = useState(() => appRoute(window.location.pathname, window.location.hash));
  const worksPage = route.split('#')[0].replace(/\/+$/, '') === '/works';
  const [project, setProject] = useState(null);
  const dialog = useRef(null);
  useEffect(() => {
    const update = () => setRoute(appRoute(window.location.pathname, window.location.hash));
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  useLayoutEffect(() => {
    const jump = () => {
      const id = window.location.hash.slice(1);
      if (id) scrollToSection(id);
    };
    if (window.location.hash) jump();
    else window.scrollTo({ top: 0, behavior: 'auto' });
    window.addEventListener('hashchange', jump);
    window.addEventListener('pageshow', jump);
    return () => { window.removeEventListener('hashchange', jump); window.removeEventListener('pageshow', jump); };
  }, [route]);
  useEffect(() => { document.title = 'ZXZ | portfolio'; }, [worksPage]);
  useEffect(() => { if (project) dialog.current?.showModal(); document.body.style.overflow = project ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [project]);
  return <>
    <a className="skip-link" href={worksPage ? '#works-page-title' : '#work'}>Skip to selected work</a>
    <Header worksPage={worksPage} />
    <main>{worksPage ? <Works onOpen={setProject} /> : <Home />}<ContactFooter /></main>
    <dialog ref={dialog} className="content-dialog project-dialog" onClose={() => setProject(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-labelledby="project-dialog-title">
      {project && <div className="dialog-content"><button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close project overview"><X size={24} weight="light" /></button>
        <p className="eyebrow">Project overview / {project.date}</p><h2 id="project-dialog-title">{project.title}</h2><p className="dialog-lead">{project.introduction}</p><p className="dialog-role">{project.role}</p>
        <ul className="project-details">{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul>{project.id === 'travel' && content.featuredCase.pages.length ? <p className="preview-note">The gallery cover is an illustrative preview. <LocalLink href="/#work" onClick={() => dialog.current?.close()}>Read the full case study<ArrowUpRight size={14} aria-hidden="true" /></LocalLink></p> : <p className="preview-note">The gallery cover is an illustrative preview. Original project visuals and the full case study will be added later.</p>}</div>}
    </dialog>
  </>;
}
