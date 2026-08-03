import React, { useEffect, useRef, useState } from "react";
import { Minus, Square, X, Copy } from "lucide-react";

export default function TitleBar({ title = "Insertion.AI" }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const winRef = useRef(null);
  const isTauri =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

  useEffect(() => {
    if (!isTauri) return;
    let unlisten;
    (async () => {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      const win = getCurrentWindow();
      winRef.current = win;
      setIsMaximized(await win.isMaximized());
      unlisten = await win.onResized(async () => {
        setIsMaximized(await win.isMaximized());
      });
    })();
    return () => unlisten?.();
  }, [isTauri]);

  const handleMinimize = () => {
    if (isTauri && winRef.current) return winRef.current.minimize();
    window.blur();
  };

  const handleMaximize = () => {
    if (isTauri && winRef.current) return winRef.current.toggleMaximize();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleClose = () => {
    if (isTauri && winRef.current) return winRef.current.close();
    window.close();
    setTimeout(() => {
      if (!window.closed) {
        // eslint-disable-next-line no-alert
        window.confirm(
          "This tab was not opened by a script, so the browser will not allow closing it automatically. Close it manually?",
        );
      }
    }, 150);
  };

  return (
    <div
      data-tauri-drag-region
      className="h-9 shrink-0 flex items-center justify-between bg-[#0f0f11] border-b border-[#1c1c1f] select-none"
    >
      <div className="flex items-center gap-[3px] pl-4" data-tauri-drag-region>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] h-4 bg-[#2b2b30] rounded-full"
            style={{
              transform: "rotate(45deg)",
              opacity: 1 - i * 0.008,
            }}
          />
        ))}
      </div>

      <div className="flex items-stretch h-full">
        <button
          onClick={handleMinimize}
          title="Minimize"
          className="w-11 h-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleMaximize}
          title={isMaximized ? "Restore" : "Maximize"}
          className="w-11 h-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          {isMaximized ? <Copy size={12} /> : <Square size={11} />}
        </button>
        <button
          onClick={handleClose}
          title="Close"
          className="w-11 h-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-colors"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
