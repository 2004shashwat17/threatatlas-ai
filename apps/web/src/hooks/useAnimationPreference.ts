import { useEffect, useState } from 'react'

export function useAnimationPreference() {
  const [active, setActive] = useState(!document.hidden)
  const [reducedMotion, setReducedMotion] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const visibility = () => setActive(!document.hidden)
    const preference = () => setReducedMotion(query.matches)
    document.addEventListener('visibilitychange', visibility)
    query.addEventListener('change', preference)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      query.removeEventListener('change', preference)
    }
  }, [])
  return { active, reducedMotion, animate: active && !reducedMotion }
}
