const base = import.meta.env.BASE_URL;

export default function Slide01Title() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex"
      style={{ background: 'var(--slide-bg)' }}
    >
      {/* Left: wordmark + subtitle */}
      <div
        className="flex flex-col justify-center"
        style={{ width: '60%', padding: '8vh 8vw' }}
      >
        <div
          style={{
            width: '3.5vw',
            height: '0.35vh',
            background: 'var(--slide-primary)',
            marginBottom: '3.5vh',
          }}
        />
        <h1
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '7.5vw',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: 'var(--slide-text)',
            marginBottom: '3.5vh',
            textWrap: 'balance',
          }}
        >
          VideoForge
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body-family)',
            fontSize: '2.3vw',
            fontWeight: 400,
            lineHeight: 1.45,
            color: 'var(--slide-muted)',
            maxWidth: '34vw',
            textWrap: 'pretty',
          }}
        >
          AI-powered video creation — from idea to finished YouTube video in one place.
        </p>
        <div
          style={{
            marginTop: '5vh',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2vw',
          }}
        >
          <div
            style={{
              width: '0.5vw',
              height: '0.5vw',
              borderRadius: '50%',
              background: 'var(--slide-primary)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '1.6vw',
              fontWeight: 400,
              color: 'var(--slide-accent)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            2026
          </span>
        </div>
      </div>

      {/* Right: hero image panel */}
      <div
        className="relative overflow-hidden"
        style={{ width: '40%' }}
      >
        <img
          src={`${base}hero.jpg`}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          alt="Abstract geometric pattern"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(109, 40, 217, 0.15)' }}
        />
        {/* Bottom violet stripe for accent */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '0.6vh', background: 'var(--slide-primary)' }}
        />
      </div>

      {/* Bottom-left footnote */}
      <div
        className="absolute"
        style={{
          bottom: '4vh',
          left: '8vw',
          fontFamily: 'var(--font-body-family)',
          fontSize: '1.5vw',
          color: 'var(--slide-muted)',
          opacity: 0.6,
        }}
      >
        Personal AI Studio
      </div>
    </div>
  );
}
