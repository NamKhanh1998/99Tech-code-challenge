import React from 'react'
import styled, { keyframes } from 'styled-components'
import { theme } from '@/config'

// Circle Animation
const dash = keyframes`
  0% {
    stroke-dashoffset: 157;
  }
  100% {
    stroke-dashoffset: 0;
  }
`

// Checkmark Animation
const dashCheck = keyframes`
  0% {
    stroke-dashoffset: 50;
  }
  100% {
    stroke-dashoffset: 0;
  }
`

// Styled SVG Wrapper
const CheckmarkWrapper = styled.svg`
  width: 80px;
  height: 80px;
  display: block;
`

// Styled Path
const Path = styled.path`
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke: ${({ color }) => color ?? theme.colors.checkmark};

  &.circle {
    stroke-dasharray: 157;
    stroke-dashoffset: 157;
    animation: ${dash} 0.9s ease-in-out forwards;
  }

  &.check {
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
    animation: ${dashCheck} 0.5s 0.4s ease-in-out forwards;
  }
`

// Component
const AnimatedCheckmark = ({ color = theme.colors.checkmark }: { color?: string }) => {
  return (
    <CheckmarkWrapper viewBox="0 0 52 52">
      {/* Circle */}
      <Path
        className="circle"
        d="M26,2 a24,24 0 1,1 -0.1,0"
        color={color}
      />
      {/* Checkmark */}
      <Path
        className="check"
        d="M15 26 L22 33 L37 18"
        color={color}
      />
    </CheckmarkWrapper>
  )
}

export default AnimatedCheckmark
