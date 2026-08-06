import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, GripVertical } from "lucide-react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { getCurrentWindow } from "@tauri-apps/api/window";

import TitleBar from "../components/TitleBar";

import EditorTopBar from "../components/codeEditor/EditorTopBar";
import LeftPanel from "../components/codeEditor/LeftPanel";
import CodePanel from "../components/codeEditor/RightPanel";
import SubmitResultModal from "../components/codeEditor/SubmitResultModal";

import {
  LANGUAGES,
  LANGUAGE_MAP,
  getStarterTemplate,
} from "../constants/codeTemplates";

import { useApp } from "../context/AppContext";

export default function CodeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { codingQuestions, metadata, metadataLoading, getCodingMetadata } =
    useApp();

  const [languageId, setLanguageId] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState("");

  const [tab, setTab] = useState("description");
  const [testTab, setTestTab] = useState(0);

  const [focusMode, setFocusMode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startedAtRef = useRef(new Date());

  const question = useMemo(() => {
    return (
      codingQuestions
        ?.flatMap((group) =>
          (group.questions ?? []).map((question) => ({
            ...question,
            generated_date: group.generated_date,
          })),
        )
        .find((question) => question.question_id === id) ?? null
    );
  }, [codingQuestions, id]);

  const totalSeconds = question?.time_limit ?? 20 * 60;

  const toggleFullscreen = useCallback(async () => {
    const appWindow = getCurrentWindow();

    const fullscreen = await appWindow.isFullscreen();

    await appWindow.setFullscreen(!fullscreen);

    setFocusMode(!fullscreen);
  }, []);

  useEffect(() => {
    setElapsedSeconds(0);
  }, [question?.question_id]);

  useEffect(() => {
    if (showSubmitModal) return;

    const id = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= totalSeconds) {
          clearInterval(id);

          handleRunAndEvaluate();

          return totalSeconds;
        }

        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [totalSeconds, showSubmitModal]);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    let unlistenResize;
    let unlistenMove;

    async function syncFullscreen() {
      setFocusMode(await appWindow.isFullscreen());
    }

    (async () => {
      unlistenResize = await appWindow.onResized(syncFullscreen);
      unlistenMove = await appWindow.onMoved(syncFullscreen);

      syncFullscreen();
    })();

    return () => {
      unlistenResize?.();
      unlistenMove?.();
    };
  }, []);

  const starterTemplate = useMemo(() => {
    if (!question) return "";

    return getStarterTemplate(languageId, question.title);
  }, [question, languageId]);

  useEffect(() => {
    if (!question) return;

    setCode(starterTemplate);
    setTestTab(0);

    startedAtRef.current = new Date();
  }, [question, starterTemplate]);

  useEffect(() => {
    return () => {
      getCurrentWindow()
        .isFullscreen()
        .then((fullscreen) => {
          if (fullscreen) {
            return getCurrentWindow().setFullscreen(false);
          }
        })
        .catch(() => {});
    };
  }, []);

  const goBack = useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();

      if (await appWindow.isFullscreen()) {
        await appWindow.setFullscreen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowSubmitModal(false);
      navigate("/coding");
    }
  }, [navigate]);

  if (!question) {
    return (
      <div className="fixed inset-0 bg-[#0b0b0d] text-gray-200 flex flex-col items-center justify-center gap-3 z-50">
        <p className="text-sm text-gray-500">Problem not found.</p>

        <button
          onClick={goBack}
          className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"
        >
          <ArrowLeft size={16} />
          Back to Coding
        </button>
      </div>
    );
  }

  const testcases = question.testcases ?? [];

  const lastResultIsCurrent = metadata?.question_id === question.question_id;

  const handleRun = async () => {
    // TODO: run public test cases
  };

  const handleSubmit = async () => {
    setShowSubmitModal(true);

    const startedAt = startedAtRef.current;
    const submittedAt = new Date();

    const frontendMeta = {
      question_id: question.question_id,
      language: LANGUAGE_MAP[languageId],

      started_at: startedAt.toISOString(),
      submitted_at: submittedAt.toISOString(),

      time_taken: Math.max(0, Math.round((submittedAt - startedAt) / 1000)),

      passed_public_tests: testcases.map((tc) => ({
        testcase: tc,
        passed: false,
      })),
    };

    await getCodingMetadata(
      question,
      question.generated_date,
      code,
      frontendMeta,
    );
  };

  const handleRunAndEvaluate = async () => {
    await handleRun();

    await handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-[#0b0b0d] text-gray-200 flex flex-col z-50">
      <TitleBar title={`InsertionAI — ${question.title}`} />

      <EditorTopBar
        question={question}
        navigate={navigate}
        elapsedSeconds={elapsedSeconds}
        totalSeconds={totalSeconds}
        onRun={handleRun}
        onSubmit={handleSubmit}
        focusMode={focusMode}
        toggleFullscreen={toggleFullscreen}
        setFocusMode={setFocusMode}
      />

      <PanelGroup
        direction="horizontal"
        autoSaveId="coding-layout"
        className="flex-1 min-h-0"
      >
        <Panel defaultSize={42} minSize={25} maxSize={65} className="min-h-0">
          <LeftPanel
            tab={tab}
            setTab={setTab}
            question={question}
            metadata={metadata}
            lastResultIsCurrent={lastResultIsCurrent}
          />
        </Panel>

        <PanelResizeHandle className="w-2 shrink-0 relative group cursor-col-resize hover:bg-orange-600/20 transition-colors">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <GripVertical
              size={12}
              className="text-gray-700 group-hover:text-orange-500 transition-colors"
            />
          </div>
        </PanelResizeHandle>

        <Panel minSize={35} className="min-h-0">
          <CodePanel
            languageId={languageId}
            setLanguageId={setLanguageId}
            code={code}
            setCode={setCode}
            testcases={testcases}
            testTab={testTab}
            setTestTab={setTestTab}
          />
        </Panel>
      </PanelGroup>

      {showSubmitModal && (
        <SubmitResultModal
          loading={metadataLoading}
          metadata={lastResultIsCurrent ? metadata : null}
          onClose={goBack}
        />
      )}
    </div>
  );
}