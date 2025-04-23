import PasswordGenerator from './components/PasswordGenerator'
import { useVideoBackground } from './hooks/useVideoBackground'
import videoBkg from './assets/videobkg.mp4'

function App() {
  const { video1Ref, video2Ref, isFirstVideoActive, transitionClasses } = useVideoBackground({
    videoSrc: videoBkg,
    transitionDuration: 2000,
    startTransitionBeforeEnd: 2
  });

  return (
    <>
      {/* Video Background */}
      <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden">
        <video
          ref={video1Ref}
          playsInline
          muted
          className={`${transitionClasses} ${isFirstVideoActive ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={videoBkg} type="video/mp4" />
        </video>
        <video
          ref={video2Ref}
          playsInline
          muted
          className={`${transitionClasses} ${isFirstVideoActive ? 'opacity-0' : 'opacity-100'}`}
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
