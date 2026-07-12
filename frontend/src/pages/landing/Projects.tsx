import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Sparkles, Check, Github, ExternalLink, ArrowRight, Server, Database, Code, Globe } from 'lucide-react';
import { Card } from '../../components/common/Card';
import heroCampus from '../../assets/images/hero_campus.png';

export const Projects: React.FC = () => {
  const projectsList = [
    {
      id: 'vidyasanchar',
      isFlagship: true,
      name: 'VidyaSanchar ERP',
      tagline: 'Flagship Project — Educational Enterprise Management',
      desc: 'A comprehensive, multi-tenant school ERP solution built to digitize and automate daily operations in Indian academic institutions. Handles student files, monthly tuition ledgers, period timetables, examination grades, and real-time alerts.',
      image: heroCampus,
      techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'Docker'],
      features: [
        'Granular Role-Based Access Control (RBAC) with HTTP-only cookie JWTs',
        'Normalized Relational database with dual-ledger student billing systems',
        'Automatic library late-return fine calculator and ISBN transactions',
        'Dynamic exam scheduling, passing criteria maps, and CBSE card printouts',
        'Sleek visual parent portals displaying real-time attendance grids'
      ],
      github: 'https://github.com/nikhilbhadauriya/vidyasanchar-erp',
      demo: '/'
    },
    {
      id: 'classhub',
      isFlagship: false,
      name: 'ClassHub Manager',
      tagline: 'Real-time Classroom Board',
      desc: 'An interactive virtual classroom workspace enabling instructors to host live quizzes, dispatch immediate assignments, and maintain active chat boards with students.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'JWT Auth'],
      features: [
        'Low-latency socket connections with live typing presence logs',
        'Auto-graded student quizzes with instant statistical performance reports',
        'Granular permission scopes for instructors and enrolled students',
        'Drag-and-drop file attachment system backed by AWS S3 buckets'
      ],
      github: 'https://github.com/nikhilbhadauriya/classhub',
      demo: '#classhub'
    },
    {
      id: 'eduvault',
      isFlagship: false,
      name: 'EduVault Library Ledger',
      tagline: 'Microservice Ledger API',
      desc: 'A lightweight fast microservice designed to handle high-frequency book borrows, inventory indexing, barcode searches, and automatic WhatsApp reminders for return times.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600',
      techStack: ['Python', 'FastAPI', 'SQLite', 'Docker', 'Redis', 'Twilio API'],
      features: [
        'FastAPI OpenAPI documentation with structured request schemas',
        'Redis cache layers caching popular ISBN book catalogs',
        'Twilio WhatsApp cron queues alerting borrowers 24 hours prior to due dates',
        'Containerized multi-stage Docker build files compiling to 45MB image size'
      ],
      github: 'https://github.com/nikhilbhadauriya/eduvault',
      demo: '#eduvault'
    }
  ];

  return (
    <div className="layout-container py-8 sm:py-12 space-y-14 relative text-left">
      {/* Background Ambient Decorative Lights */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />
      <div className="absolute top-[40%] right-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none dark:block hidden" />

      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span>Portfolio Showcase</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight Outfit text-foreground">Featured Software Projects</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-semibold">
          Explore production-grade platforms, APIs, and microservices crafted with robust engineering and modern design.
        </p>
      </section>

      {/* Projects Stack */}
      <section className="space-y-12">
        {projectsList.map((project) => (
          <Card 
            key={project.id}
            glowOnHover={project.isFlagship}
            className={`p-6 sm:p-10 relative overflow-hidden transition-all duration-300 ${
              project.isFlagship 
                ? 'border-primary/40 shadow-md shadow-primary/5 ring-1 ring-primary/10' 
                : 'border-border/80'
            }`}
          >
            {project.isFlagship && (
              <span className="absolute top-4 right-4 bg-primary/15 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-primary/30 shadow-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Flagship Platform
              </span>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Product Info: Span 7 */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block font-sans">
                    {project.tagline}
                  </span>
                  <h3 className="font-extrabold text-2xl sm:text-3xl Outfit text-foreground leading-tight">
                    {project.name}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {project.desc}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 rounded-lg bg-background border border-border/80 text-xs font-bold text-foreground/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Features list */}
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Architectural Milestones</h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm">
                    {project.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start">
                        <Check className="h-4.5 w-4.5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground/90 font-semibold">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA links */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl text-xs font-bold tracking-wide transition-all border border-border bg-card hover:bg-muted/70 h-10 px-5 gap-2 shadow-sm"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  {project.isFlagship ? (
                    <Link
                      to={project.demo}
                      className="inline-flex items-center justify-center rounded-xl text-xs font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-10 px-5 gap-2 shadow-sm shadow-primary/10"
                    >
                      <Globe className="h-4 w-4" />
                      Live Platform Demo
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={project.demo}
                      className="inline-flex items-center justify-center rounded-xl text-xs font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-95 h-10 px-5 gap-2 shadow-sm shadow-primary/10"
                      onClick={() => alert('Simulated external live workspace. Codebase is production-ready!')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Workspace Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Image Preview: Span 5 */}
              <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-border/80 shadow-md">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10" />
                <img
                  src={project.image}
                  alt={`${project.name} UI Preview`}
                  className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 filter saturate-90"
                />
              </div>

            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};
