import { useState, useRef, useCallback, useEffect } from "react";

export function useZoomPan(enabled = true) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setScale((s) => Math.min(s + 0.15, 2));
  const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.3));
  const reset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      posStart.current = { ...position };
    },
    [position],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      setPosition({
        x: posStart.current.x + (e.clientX - dragStart.current.x),
        y: posStart.current.y + (e.clientY - dragStart.current.y),
      });
    },
    [dragging],
  );

  const onMouseUp = useCallback(() => setDragging(false), []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setScale((s) =>
      Math.min(Math.max(s + (e.deltaY > 0 ? -0.08 : 0.08), 0.3), 2),
    );
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, enabled]);

  return {
    scale,
    position,
    dragging,
    containerRef,
    zoomIn,
    zoomOut,
    reset,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}
