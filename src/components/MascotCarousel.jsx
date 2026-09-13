import { useEffect, useState } from 'react'

// Mismos 2 personajes repetidos para llenar los 4 "roles" (centro, izquierda,
// derecha, atrás) que usa la animación de TOONHUB.
const MASCOTS = [
  { src: 'https://res.cloudinary.com/msprqskb/image/upload/v1789276539/MascotaV2LYS.png', scale: 1.4 },
  { src: 'https://res.cloudinary.com/msprqskb/image/upload/v1789277395/MascotaV2.png', scale: 1 },
]

const SLIDES = [MASCOTS[0], MASCOTS[1], MASCOTS[0], MASCOTS[1]]

export default function MascotCarousel({ interval = 3200 }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  const center = activeIndex
  const left = (activeIndex + 3) % SLIDES.length
  const right = (activeIndex + 1) % SLIDES.length
  const back = (activeIndex + 2) % SLIDES.length

  const roleFor = (index) =>
    index === center ? 'center' : index === left ? 'left' : index === right ? 'right' : 'back'

  const roleStyles = (role) => {
    const common = {
      position: 'absolute',
      aspectRatio: '0.62 / 1',
      transition:
        'left 650ms cubic-bezier(0.4,0,0.2,1), transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1)',
      willChange: 'transform, filter, opacity, left',
    }

    if (role === 'center') {
      return {
        ...common,
        left: '50%',
        transform: 'translateX(-50%)',
        height: isMobile ? '55%' : '88%',
        bottom: 0,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
      }
    }
    if (role === 'left') {
      return {
        ...common,
        left: isMobile ? '16%' : '22%',
        transform: 'translateX(-50%) scale(0.9)',
        height: isMobile ? '26%' : '40%',
        bottom: isMobile ? '6%' : '8%',
        filter: 'blur(2px)',
        opacity: 0.55,
        zIndex: 10,
      }
    }
    if (role === 'right') {
      return {
        ...common,
        left: isMobile ? '84%' : '82%',
        transform: 'translateX(-50%) scale(0.9)',
        height: isMobile ? '26%' : '40%',
        bottom: isMobile ? '6%' : '8%',
        filter: 'blur(2px)',
        opacity: 0.55,
        zIndex: 10,
      }
    }
    return {
      ...common,
      left: '50%',
      transform: 'translateX(-50%) scale(0.85)',
      height: isMobile ? '20%' : '32%',
      bottom: isMobile ? '6%' : '8%',
      filter: 'blur(4px)',
      opacity: 0.4,
      zIndex: 5,
    }
  }

  return (
    <div className="mascot-carousel">
      {SLIDES.map(({ src, scale }, index) => (
        <div key={`${src}-${index}`} style={roleStyles(roleFor(index))}>
          <img
            src={src}
            alt="Mascota Leña y Sabores"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              display: 'block',
              transform: `scale(${scale})`,
              transformOrigin: 'bottom center',
            }}
          />
        </div>
      ))}
    </div>
  )
}
