import PasswordGenerator from './components/PasswordGenerator'
import { useVideoBackground } from './hooks/useVideoBackground'
import videoBkg from './assets/videobkg.mp4'

function App() {
  const { video1Ref, video2Ref, opacity1, opacity2 } = useVideoBackground({
    videoSrc: videoBkg,
    fadeOverlap: 2000,
    startTransitionBeforeEnd: 3
  });

  return (
    <>
      {/* Video Background */}
      <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden">
        <video
          ref={video1Ref}
          playsInline
          muted
          loop
          className="absolute min-w-full min-h-full object-cover"
          style={{ opacity: opacity1 }}
        >
          <source src={videoBkg} type="video/mp4" />
        </video>
        <video
          ref={video2Ref}
          playsInline
          muted
          loop
          className="absolute min-w-full min-h-full object-cover"
          style={{ opacity: opacity2 }}
        >
          <source src={videoBkg} type="video/mp4" />
        </video>
        {/* Optional overlay to ensure password generator remains readable */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen w-screen flex items-center justify-center fixed inset-0 overflow-auto">
        <div className="w-full max-w-md px-4 py-8">
          <PasswordGenerator />
        </div>
      </main>
    </>
  )
}

export default App
