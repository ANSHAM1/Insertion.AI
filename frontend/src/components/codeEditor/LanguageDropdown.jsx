import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

import { LANGUAGES } from "../../constants/codeTemplates";

export default function LanguageDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const current = LANGUAGES.find((lang) => lang.id === value) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center justify-between
          min-w-[165px]
          px-3 py-2
          bg-[#121214]
          border border-[#232326]
          hover:border-[#35353a]
          hover:bg-[#171719]
          rounded-md
          text-sm
          transition-colors
          select-none
        "
      >
        <div className="flex items-center gap-2.5">
          <span
            className="
              w-10
              rounded
              bg-orange-500/10
              text-orange-400
              text-[10px]
              font-mono
              font-semibold
              text-center
              py-0.5
              tracking-wide
            "
          >
            {current.ext}
          </span>

          <span className="text-gray-200">{current.label}</span>
        </div>

        <ChevronDown
          size={15}
          className={`text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute left-0 top-full mt-2
            w-64
            max-h-80
            overflow-y-auto
            themed-scrollbar

            bg-[#111113]
            border border-[#232326]
            rounded-md
            shadow-2xl
            z-50
            py-1
          "
        >
          {LANGUAGES.map((lang) => {
            const selected = lang.id === value;

            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  onChange(lang.id);
                  setOpen(false);
                }}
                className={`
                  w-full
                  flex items-center justify-between
                  px-3 py-2.5
                  text-left
                  transition-colors

                  ${
                    selected
                      ? "bg-orange-500/10 text-white"
                      : "text-gray-400 hover:bg-[#1a1a1c] hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`
                      w-10
                      rounded
                      text-center
                      text-[10px]
                      font-mono
                      font-semibold
                      py-0.5

                      ${
                        selected
                          ? "bg-orange-500/15 text-orange-400"
                          : "bg-white/5 text-gray-500"
                      }
                    `}
                  >
                    {lang.ext}
                  </span>

                  <span className="text-sm">{lang.label}</span>
                </div>

                {selected && (
                  <CheckCircle2
                    size={15}
                    className="text-orange-500 shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
