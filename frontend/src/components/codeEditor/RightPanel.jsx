import React from "react";
import { GripHorizontal } from "lucide-react";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import LanguageDropdown from "./LanguageDropdown";
import CodeEditorPanel from "./CodeEditorPanel";
import TestcasePanel from "./TestcasePanel";

export default function CodePanel({
  languageId,
  setLanguageId,
  code,
  setCode,
  testcases,
  testTab,
  setTestTab,
  testCaseResults,
}) {
  return (
    <PanelGroup
      direction="vertical"
      autoSaveId="coding-editor-layout"
      className="flex-1 min-h-0"
    >
      <Panel defaultSize={72} minSize={30}>
        <div className="h-full flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-[11px] border-b border-[#1c1c1f] bg-[#0f0f11]">
            <LanguageDropdown value={languageId} onChange={setLanguageId} />
          </div>

          <CodeEditorPanel
            code={code}
            setCode={setCode}
            languageId={languageId}
          />
        </div>
      </Panel>

      <PanelResizeHandle className="h-2 shrink-0 relative group cursor-row-resize hover:bg-orange-600/20 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <GripHorizontal
            size={12}
            className="text-gray-700 group-hover:text-orange-500 transition-colors"
          />
        </div>
      </PanelResizeHandle>

      <Panel defaultSize={28} minSize={15} maxSize={60}>
        <TestcasePanel
          testcases={testcases}
          testTab={testTab}
          setTestTab={setTestTab}
          testCaseResults={testCaseResults}
        />
      </Panel>
    </PanelGroup>
  );
}
