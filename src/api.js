import { getToken, clearToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

async function apiFetch(url, options = {}) {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    clearToken();
    alert("👋Looks like your session ended. Please login to get back in.")
    window.location.href = "/";
    return null;
  }

  return res;
}

export async function getHistory() {
  const res = await apiFetch(`${API_URL}/chat`, { method: "GET" });
  if (!res) return [];
  return res.json();
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiFetch(`${API_URL}/chat/file`, {
    method: "POST",
    body: formData,
  });

  if (!res) throw new Error("File upload failed");
  return res.json(); // { file_id, file_type, extension, filename }
}

// Step 2: send message with optional file metadata
export async function sendMessage(userMessage, fileMeta, onChunk, onEnd) {
  const body = {
    prompt: userMessage,
  };

  if (fileMeta) {
    body.file = {
      file_id: fileMeta.file_id,
      file_type: fileMeta.file_type,
      extension: fileMeta.extension,
      filename: fileMeta.filename,
    };
  }

  const res = await apiFetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res || !res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);

        if (data.type === "chat" || data.type === "file") {
          for (const char of data.chunk) {
            await new Promise((r) => setTimeout(r, 15));
            onChunk(char);
          }
        }

        if (data.type === "image" && data.status === "processing") {
          onChunk("[Generating image...]");
        }

        if (data.type === "end") {
          onEnd(data.fileb64 || null);
        }
      } catch (err) {
        console.warn("Failed to parse:", line, err);
      }
    }
  }
}

export async function getProfile() {
  const res = await apiFetch(`${AUTH_URL}/v1/user/me`);
  if (!res) return null;
  const data = await res.json();
  return { status: res.status, data };
}
