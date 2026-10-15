import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CheckedDocument, UploadDraft } from "./types.js";

function detach(request: XMLHttpRequest) {
  request.onload = request.onerror = request.onabort = request.ontimeout = null;
  request.upload.onprogress = null;
}

function checkedDocument(value: unknown): value is CheckedDocument {
  if (!value || typeof value !== "object") return false;
  const document = value as CheckedDocument;
  return (
    typeof document.id === "string" &&
    document.id.length > 0 &&
    Number.isInteger(document.pageCount) &&
    document.pageCount > 0 &&
    typeof document.excerpt === "string" &&
    Array.isArray(document.pages) &&
    document.pages.length === document.pageCount &&
    document.pages.every(
      (page) =>
        page &&
        Number.isInteger(page.page) &&
        page.page > 0 &&
        typeof page.text === "string",
    ) &&
    Array.isArray(document.extraction) &&
    document.extraction.every(
      (page) =>
        page &&
        Number.isInteger(page.page) &&
        page.page > 0 &&
        typeof page.method === "string",
    )
  );
}

export function useDocumentUpload({
  draft,
  onDraftChange,
  maxBytes,
  blocked,
}: {
  draft: UploadDraft;
  onDraftChange: Dispatch<SetStateAction<UploadDraft>>;
  maxBytes: number;
  blocked: boolean;
}) {
  const { file, uploaded } = draft;
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewState, setPreviewState] = useState<{
    file: File;
    url: string;
  } | null>(null);
  const mounted = useRef(false);
  const fileVersion = useRef(0);
  const request = useRef<XMLHttpRequest | null>(null);
  const current = useRef({ blocked, file });
  current.current = { blocked, file };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      fileVersion.current++;
      if (request.current) {
        detach(request.current);
        request.current.abort();
        request.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewState(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewState({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pickFile = useCallback(
    async (candidate?: File) => {
      if (current.current.blocked || request.current) return;
      const version = ++fileVersion.current;
      setError("");
      if (!candidate) return;
      if (
        !candidate.name.toLowerCase().endsWith(".pdf") ||
        (candidate.type && candidate.type !== "application/pdf")
      ) {
        setError("Choose a PDF document.");
        return;
      }
      if (!candidate.size) {
        setError("This PDF is empty. Choose another file.");
        return;
      }
      if (candidate.size > maxBytes) {
        setError(
          `This PDF exceeds the ${maxBytes / 1000000} MB limit. Choose a smaller file.`,
        );
        return;
      }
      try {
        const header = new TextDecoder().decode(
          await candidate.slice(0, 5).arrayBuffer(),
        );
        if (
          !mounted.current ||
          version !== fileVersion.current ||
          current.current.blocked ||
          request.current
        )
          return;
        if (header !== "%PDF-") {
          setError("This file’s contents are not a PDF.");
          return;
        }
        setProgress(0);
        onDraftChange((previous) => ({
          ...previous,
          file: candidate,
          uploaded: null,
        }));
      } catch {
        if (mounted.current && version === fileVersion.current)
          setError("This file couldn’t be read. Try selecting it again.");
      }
    },
    [maxBytes, onDraftChange],
  );

  const cancel = useCallback(() => {
    const active = request.current;
    if (!active) return;
    detach(active);
    request.current = null;
    active.abort();
    if (mounted.current) {
      setBusy(false);
      setProgress(0);
      setError("Upload cancelled. Choose or retry your PDF.");
    }
  }, []);

  const removeFile = useCallback(() => {
    fileVersion.current++;
    cancel();
    setError("");
    setProgress(0);
    setDrag(false);
    onDraftChange((previous) => ({ ...previous, file: null, uploaded: null }));
  }, [cancel, onDraftChange]);

  const upload = useCallback(() => {
    const selectedFile = current.current.file;
    if (!selectedFile || current.current.blocked || request.current) return;
    fileVersion.current++;
    const active = new XMLHttpRequest();
    request.current = active;
    const isCurrent = () => mounted.current && request.current === active;
    const finish = (message = "") => {
      if (!isCurrent()) return;
      detach(active);
      request.current = null;
      setBusy(false);
      setError(message);
      if (message) setProgress(0);
    };
    setBusy(true);
    setProgress(0);
    setError("");
    active.upload.onprogress = (event) => {
      if (isCurrent() && event.lengthComputable)
        setProgress(Math.round((event.loaded / event.total) * 100));
    };
    active.onload = () => {
      if (!isCurrent()) return;
      try {
        const result: unknown = JSON.parse(active.responseText);
        if (active.status < 200 || active.status >= 300) {
          const message = (result as { error?: unknown } | null)?.error;
          finish(
            typeof message === "string"
              ? message
              : "Document checking failed. Try again.",
          );
          return;
        }
        if (!checkedDocument(result)) {
          finish(
            "Document checking returned an incomplete response. Your PDF is still selected; try again.",
          );
          return;
        }
        onDraftChange((previous) =>
          previous.file === selectedFile
            ? { ...previous, uploaded: result }
            : previous,
        );
        setProgress(100);
        finish();
      } catch {
        finish(
          "Document checking was interrupted. Your PDF is still selected; try again.",
        );
      }
    };
    active.onerror = () =>
      finish(
        "The upload was interrupted. Your selected file is still here; retry when connected.",
      );
    active.onabort = () =>
      finish("Upload cancelled. Choose or retry your PDF.");
    active.ontimeout = () =>
      finish(
        "Document checking took too long. Your PDF is still selected; try again.",
      );
    try {
      active.open("POST", "/api/research/documents");
      active.timeout = 120000;
      const form = new FormData();
      form.append("file", selectedFile);
      active.send(form);
    } catch {
      finish(
        "Document checking couldn’t start. Your PDF is still selected; try again.",
      );
    }
  }, [onDraftChange]);

  return {
    file,
    uploaded,
    preview: previewState?.file === file ? previewState.url : "",
    drag,
    setDrag,
    progress,
    busy,
    error,
    pickFile,
    upload,
    cancel,
    removeFile,
  };
}
