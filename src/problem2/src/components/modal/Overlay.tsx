import React, { useEffect } from 'react'
import styled from 'styled-components'
import { motion, type Transition } from 'framer-motion'

const BodyLock = () => {
  useEffect(() => {
    if (document?.body?.style) {
      document.body.style.cssText = `overflow: hidden;`
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.cssText = `overflow: visible; overflow: overlay;`
      }
    }
    return undefined
  }, [])

  return null
}

const StyledOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: 1;
  cursor: pointer;
`

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const transition: Transition = {
  type: 'tween',
  duration: 0.33,
  ease: [0.25, 0.1, 0.25, 1],
}

const Overlay = ({ isOpen, onClick }: { isOpen?: boolean; onClick?: () => void }) => {
  return (
    <>
      {isOpen && <BodyLock />}
      <StyledOverlay
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        transition={transition}
        onClick={onClick}
      />
    </>
  )
}

export default Overlay
