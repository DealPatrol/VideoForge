export default function Slide09NoKeys() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col justify-center"
      style={{ background: 'var(--slide-violet-light)', padding: '8vh 10vw' }}
    >
      {/* Centered header */}
      <div style={{ textAlign: 'center', marginBottom: '6vh' }}>
        <div
          style={{
            width: '3.5vw',
            height: '0.35vh',
            background: 'var(--slide-primary)',
            margin: '0 auto 2.5vh',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '3.8vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--slide-text)',
            textWrap: 'balance',
          }}
        >
          Works Without Any API Keys
        </h2>
      </div>

      {/* 2×2 grid centered */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3vh 5vw',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2.5vh 2vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2.1vw', fontWeight: 700, color: 'var(--slide-primary)', marginBottom: '1vh', lineHeight: 1.2 }}>
            Zero-commitment exploration
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            Every feature has realistic mock/demo fallbacks built in
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '2.5vh 2vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2.1vw', fontWeight: 700, color: 'var(--slide-primary)', marginBottom: '1vh', lineHeight: 1.2 }}>
            No API credits burned
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            Explore the full workflow before committing a single API credit
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '2.5vh 2vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2.1vw', fontWeight: 700, color: 'var(--slide-primary)', marginBottom: '1vh', lineHeight: 1.2 }}>
            Upgrade when ready
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            Add OpenAI and Pexels keys in Settings when you're ready to go live
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '2.5vh 2vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2.1vw', fontWeight: 700, color: 'var(--slide-primary)', marginBottom: '1vh', lineHeight: 1.2 }}>
            Fully personal
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            No signup, no billing, no multi-tenancy — personal tool, full control
          </p>
        </div>
      </div>
    </div>
  );
}
