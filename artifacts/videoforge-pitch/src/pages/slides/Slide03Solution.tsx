export default function Slide03Solution() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex"
      style={{ background: 'var(--slide-bg)' }}
    >
      {/* Left: text */}
      <div
        className="flex flex-col justify-center"
        style={{ width: '52%', padding: '8vh 8vw' }}
      >
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
            fontSize: '3.8vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--slide-text)',
            marginBottom: '3.5vh',
            textWrap: 'balance',
          }}
        >
          Introducing VideoForge
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body-family)',
            fontSize: '2.2vw',
            fontWeight: 400,
            lineHeight: 1.55,
            color: 'var(--slide-muted)',
            textWrap: 'pretty',
          }}
        >
          A single app that takes you from a YouTube URL or topic all the way to a downloadable MP4 — script, voiceover, stock footage, captions, and render included.
        </p>
      </div>

      {/* Right: App mockup panel */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '48%',
          background: 'var(--slide-primary)',
          padding: '6vh 4vw',
        }}
      >
        {/* CSS dark app window mockup */}
        <div
          style={{
            width: '100%',
            maxWidth: '36vw',
            background: '#0e0e0f',
            borderRadius: '1vw',
            overflow: 'hidden',
            boxShadow: '0 2vh 5vw rgba(0,0,0,0.5)',
          }}
        >
          {/* Window chrome */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5vw',
              padding: '1.2vh 1.5vw',
              background: '#1a1a1d',
              borderBottom: '1px solid #2a2a2e',
            }}
          >
            <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '0.7vw', height: '0.7vw', borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, marginLeft: '1vw' }}>
              <div style={{ height: '1.2vh', background: '#2a2a2e', borderRadius: '0.3vw', width: '60%' }} />
            </div>
          </div>
          {/* Sidebar + content */}
          <div style={{ display: 'flex', height: '42vh' }}>
            {/* Sidebar */}
            <div style={{ width: '22%', background: '#141416', padding: '2vh 1vw', borderRight: '1px solid #2a2a2e' }}>
              <div style={{ height: '1.2vh', background: '#6d28d9', borderRadius: '0.2vw', marginBottom: '2vh', width: '80%' }} />
              <div style={{ height: '1vh', background: '#2a2a2e', borderRadius: '0.2vw', marginBottom: '1.5vh', width: '90%' }} />
              <div style={{ height: '1vh', background: '#2a2a2e', borderRadius: '0.2vw', marginBottom: '1.5vh', width: '70%' }} />
              <div style={{ height: '1vh', background: '#2a2a2e', borderRadius: '0.2vw', marginBottom: '1.5vh', width: '80%' }} />
              <div style={{ height: '1vh', background: '#2a2a2e', borderRadius: '0.2vw', width: '60%' }} />
            </div>
            {/* Main content */}
            <div style={{ flex: 1, padding: '2vh 1.5vw' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1vh 1vw', marginBottom: '2vh' }}>
                <div style={{ height: '5vh', background: '#1e1e22', borderRadius: '0.3vw', borderTop: '2px solid #6d28d9' }} />
                <div style={{ height: '5vh', background: '#1e1e22', borderRadius: '0.3vw', borderTop: '2px solid #2a2a2e' }} />
                <div style={{ height: '5vh', background: '#1e1e22', borderRadius: '0.3vw', borderTop: '2px solid #2a2a2e' }} />
              </div>
              <div style={{ height: '1vh', background: '#2a2a2e', borderRadius: '0.2vw', marginBottom: '1.5vh', width: '75%' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5vh 1vw' }}>
                <div style={{ height: '8vh', background: '#1e1e22', borderRadius: '0.3vw', padding: '1.2vh 1vw' }}>
                  <div style={{ height: '1vh', background: '#6d28d9', borderRadius: '0.2vw', width: '50%', marginBottom: '1vh' }} />
                  <div style={{ height: '0.8vh', background: '#2a2a2e', borderRadius: '0.2vw', width: '80%' }} />
                </div>
                <div style={{ height: '8vh', background: '#1e1e22', borderRadius: '0.3vw', padding: '1.2vh 1vw' }}>
                  <div style={{ height: '1vh', background: '#3a1060', borderRadius: '0.2vw', width: '40%', marginBottom: '1vh' }} />
                  <div style={{ height: '0.8vh', background: '#2a2a2e', borderRadius: '0.2vw', width: '70%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
