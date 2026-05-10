"use client";

import { useRef, useState } from "react";

type RecorderState = "idle" | "recording" | "transcribing" | "error";

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResultAlternativeList {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike & SpeechRecognitionResultAlternativeList;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike {
  error?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
}

export function useVoiceRecorder({
  languageCode = "en-US",
  useCloudTranscription = false,
  onTranscript,
  onError
}: {
  languageCode?: string;
  useCloudTranscription?: boolean;
  onTranscript: (transcript: string) => void;
  onError: (message: string) => void;
}) {
  const [state, setState] = useState<RecorderState>("idle");
  const stateRef = useRef<RecorderState>("idle");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const restartTimerRef = useRef<number | null>(null);
  const fallbackStopTimerRef = useRef<number | null>(null);
  const manualStopRef = useRef(false);

  function setRecorderState(nextState: RecorderState) {
    stateRef.current = nextState;
    setState(nextState);
  }

  function clearTimers() {
    if (restartTimerRef.current) window.clearTimeout(restartTimerRef.current);
    if (fallbackStopTimerRef.current) window.clearTimeout(fallbackStopTimerRef.current);
    restartTimerRef.current = null;
    fallbackStopTimerRef.current = null;
  }

  async function start() {
    if (stateRef.current === "recording" || stateRef.current === "transcribing") return;

    clearTimers();
    manualStopRef.current = false;

    const SpeechRecognition = useCloudTranscription ? undefined : getSpeechRecognition();
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = languageCode;
        recognition.onresult = (event) => {
          let finalTranscript = "";
          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];
            if (result?.isFinal) finalTranscript += result[0]?.transcript || "";
          }

          const normalized = finalTranscript.trim();
          if (!normalized) return;

          manualStopRef.current = true;
          setRecorderState("transcribing");
          recognition.stop();
          onTranscript(normalized);
          window.setTimeout(() => {
            if (stateRef.current === "transcribing") setRecorderState("idle");
          }, 350);
        };
        recognition.onerror = (event) => {
          if (event.error === "no-speech" || event.error === "aborted") return;
          manualStopRef.current = true;
          setRecorderState("error");
          onError("Voice is unavailable right now, but you can continue with text.");
        };
        recognition.onend = () => {
          recognitionRef.current = null;
          if (!manualStopRef.current && stateRef.current === "recording") {
            restartTimerRef.current = window.setTimeout(() => void start(), 220);
            return;
          }
          if (stateRef.current === "recording") setRecorderState("idle");
        };
        recognitionRef.current = recognition;
        recognition.start();
        setRecorderState("recording");
        return;
      } catch {
        recognitionRef.current = null;
      }
    }

    if (typeof window === "undefined" || !navigator.mediaDevices || !window.MediaRecorder) {
      setRecorderState("error");
      onError("Voice is unavailable right now, but you can continue with text.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        clearTimers();
        stream.getTracks().forEach((track) => track.stop());
        transcribe().catch(() => {
          setRecorderState("error");
          onError("I couldn't hear that clearly. Please try again.");
        });
      };
      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setRecorderState("recording");
      fallbackStopTimerRef.current = window.setTimeout(() => stop(), 5500);
    } catch {
      setRecorderState("error");
      onError("Voice is unavailable right now, but you can continue with text.");
    }
  }

  function stop() {
    manualStopRef.current = true;
    clearTimers();

    if (recognitionRef.current) {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      try {
        recognition.stop();
      } catch {
        recognition.abort();
      }
      setRecorderState("idle");
      return;
    }

    if (mediaRecorderRef.current?.state === "recording") {
      setRecorderState("transcribing");
      mediaRecorderRef.current.stop();
      return;
    }

    setRecorderState("idle");
  }

  async function transcribe() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", blob, "pluto.webm");

    const response = await fetch("/api/voice/transcribe", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Transcription failed");
    const data = (await response.json()) as { transcript?: string };
    setRecorderState("idle");

    if (data.transcript) onTranscript(data.transcript);
    else onError("I couldn't hear that clearly. Please try again.");
  }

  function toggle() {
    if (state === "recording") stop();
    else if (state === "idle" || state === "error") void start();
  }

  return {
    state,
    isRecording: state === "recording",
    isTranscribing: state === "transcribing",
    toggle,
    start,
    stop
  };
}
