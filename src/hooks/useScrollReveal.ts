'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    // Small delay to let the new page render its .reveal elements
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      )

      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }, 50)

    return () => clearTimeout(timeout)
  }, [pathname])
}
