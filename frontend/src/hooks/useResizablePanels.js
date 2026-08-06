import { useEffect, useRef, useState } from "react";

export default function useResizablePanels() {
  const containerRef = useRef(null);

  const [leftWidth, setLeftWidth] = useState(42);
  const [bottomHeight, setBottomHeight] = useState(34);

  const dragState = useRef({
    active: false,
    type: null,
  });

  function startColResize() {
    dragState.current = {
      active: true,
      type: "column",
    };
  }

  function startRowResize() {
    dragState.current = {
      active: true,
      type: "row",
    };
  }

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragState.current.active || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (dragState.current.type === "column") {
        const width = ((e.clientX - rect.left) / rect.width) * 100;

        setLeftWidth(Math.min(70, Math.max(25, width)));
      }

      if (dragState.current.type === "row") {
        const height = ((rect.bottom - e.clientY) / rect.height) * 100;

        setBottomHeight(Math.min(60, Math.max(18, height)));
      }
    }

    function stopResize() {
      dragState.current.active = false;
      dragState.current.type = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);

      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  return {
    containerRef,

    leftWidth,
    bottomHeight,

    startColResize,
    startRowResize,
  };
}
