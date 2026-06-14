import { useMediaQuery } from 'react-responsive'

const useMatchBreakPoints = () => {
  const isMobileM = useMediaQuery({ maxWidth: 576 })
  const isMobileL = useMediaQuery({ maxWidth: 786 })
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 992 })
  const isDesktop = useMediaQuery({ minWidth: 993 })

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileM,
    isMobileL,
    isNotDesktop: isMobile || isTablet || isMobileM || isMobileL,
  }
}

export default useMatchBreakPoints
