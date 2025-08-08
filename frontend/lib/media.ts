// /frontend/lib/media.ts
import { authService } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadImage(file: File) {
  const token = authService.getToken();
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/api/media/upload`, {
    method: "POST",
    headers: { token: token || "" },
    body: form
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Upload failed");
  }
  return res.json();
}

export async function listMedia() {
  const token = authService.getToken();
  const res = await fetch(`${API_URL}/api/media/`, {
    headers: { token: token || "" }
  });
  if (!res.ok) throw new Error("Failed to list media");
  return res.json();
}

export async function deleteMedia(id: number) {
  const token = authService.getToken();
  const res = await fetch(`${API_URL}/api/media/${id}`, {
    method: "DELETE",
    headers: { token: token || "" }
  });
  if (!res.ok) throw new Error("Failed to delete media");
  return res.json();
}
