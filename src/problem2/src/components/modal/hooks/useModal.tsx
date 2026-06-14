import React, { useCallback, useMemo, useState } from "react";

type UseModalReturn = readonly [
  () => void, // onOpen
  () => void, // onDismiss
  React.ReactElement<any, string | React.JSXElementConstructor<any>> | null,
];

export function useModal(modalElement: React.JSX.Element, callBack?: () => void): UseModalReturn {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);

  const onDismiss = useCallback(() => {
    setOpen(false);
    callBack?.();
  }, [callBack]);

  const injectElement = useMemo(() => {
    return React.cloneElement(modalElement, {
      open,
      setOpen,
      callBack: onDismiss,
    });
  }, [modalElement, open, setOpen, onDismiss]);

  return [onOpen, onDismiss, injectElement] as const;
}
