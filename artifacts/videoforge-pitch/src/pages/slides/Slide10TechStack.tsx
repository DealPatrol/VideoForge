export default function Slide10TechStack() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{ background: 'var(--slide-bg)', padding: '7vh 8vw' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '5vh' }}>
        <div
          style={{
            width: '3.5vw',
            height: '0.35vh',
            background: 'var(--slide-primary)',
            marginBottom: '2.5vh',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '4vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--slide-text)',
          }}
        >
          Tech Stack
        </h2>
      </div>

      {/* 2-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 6vw',
          flex: 1,
        }}
      >
        {/* Left column */}
        <div style={{ borderRight: '1px solid var(--slide-border)', paddingRight: '4vw' }}>
          <p
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '1.5vw',
              fontWeight: 500,
              color: 'var(--slide-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '3vh',
            }}
          >
            Client + Server
          </p>

          <div style={{ marginBottom: '3vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.6vh' }}>Frontend</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>React + Vite + Tailwind CSS v4, TanStack Query, wouter</p>
          </div>

          <div style={{ marginBottom: '3vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.6vh' }}>Backend</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>Express 5, Node.js 24, TypeScript end-to-end</p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.6vh' }}>Database</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>PostgreSQL + Drizzle ORM (Replit-managed)</p>
          </div>
        </div>

        {/* Right column */}
        <div style={{ paddingLeft: '0' }}>
          <p
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '1.5vw',
              fontWeight: 500,
              color: 'var(--slide-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '3vh',
            }}
          >
            AI + Integrations
          </p>

          <div style={{ marginBottom: '3vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.6vh' }}>AI</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>OpenAI GPT-4o-mini (text) + TTS-1 (audio)</p>
          </div>

          <div style={{ marginBottom: '3vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.6vh' }}>Stock</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>Pexels API with full mock fallback</p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.6vh' }}>API contracts</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>OpenAPI spec + Orval codegen</p>
          </div>
        </div>
      </div>
    </div>
  );
}
