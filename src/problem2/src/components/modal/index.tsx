import { AnimatePresence, LazyMotion, motion } from "framer-motion";
import React, { FC, PropsWithChildren } from "react";
import { useKeyPressEvent } from "react-use";
import styled from "styled-components";
import Overlay from "./Overlay";
import { StyledModalWrapper } from "./styles";

// Lazy-load framer-motion's domMax feature bundle so it's excluded from the initial JS bundle and only downloaded when a modal first renders.
const DomMax = () => import("./motionDomMax").then((mod) => mod.default);

type ModalV2Props = PropsWithChildren<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  callBack?: () => void;
  closeOnOverlayClick?: boolean;
  useModalBottomSheet?: boolean;
}>;

const ChildrenContainer = styled(motion.div)`
  position: relative;
  width: fit-content;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const ModalV2: FC<ModalV2Props> = ({ open, setOpen, children, callBack, closeOnOverlayClick = true }) => {
  useKeyPressEvent("Escape", () => {
    callBack?.();
    setOpen?.(false);
  });

  return (
    <LazyMotion features={DomMax}>
      <AnimatePresence mode="wait">
        {open && (
          <StyledModalWrapper>
            <Overlay
              isOpen={open}
              onClick={() => {
                if (closeOnOverlayClick) {
                  setOpen?.(false);
                  callBack?.();
                }
              }}
            />

            <ChildrenContainer
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: {
                  opacity: 0,
                  scale: 0.8,
                  y: 20,
                },
                animate: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.0, 1],
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 0.9,
                  y: 10,
                  transition: {
                    duration: 0.2,
                    ease: [0.25, 0.1, 0.0, 1],
                  },
                },
              }}
            >
              {children}
            </ChildrenContainer>
          </StyledModalWrapper>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default ModalV2;
