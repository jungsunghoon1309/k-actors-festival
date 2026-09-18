/* =====================================================
   K-Actors Festival 2026 — Backend API (Express)
   - GET  /api/health    : 서버 상태
   - GET  /api/comments  : 댓글 목록
   - POST /api/comments  : 댓글 등록
   - 그 외 경로는 정적 사이트(index.html 등) 서빙
   저장소: Supabase(env 설정 시) 또는 메모리(기본)
===================================================== */

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ===== Supabase 연결 (선택적) ===== */
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    const { createClient } = require("@supabase/supabase-js");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  } catch (e) {
    console.error("Supabase init failed:", e.message);
    supabase = null;
  }
}

const storageMode = supabase ? "supabase" : "memory";

/* ===== 메모리 저장소 (Supabase 미설정 시 폴백) ===== */
const memoryComments = [];
let memoryId = 1;

/* ===== 유효성 검사 ===== */
function validateComment(body) {
  if (!body || typeof body !== "object") return "요청 본문이 없습니다.";
  const nickname = String(body.nickname || "").trim();
  const message = String(body.message || "").trim();
  if (nickname.length < 1 || nickname.length > 20)
    return "닉네임은 1~20자여야 합니다.";
  if (message.length < 1 || message.length > 500)
    return "내용은 1~500자여야 합니다.";
  return null;
}

/* ===== 헬스 체크 ===== */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "k-actors-festival-backend",
    storage: storageMode,
    time: new Date().toISOString(),
  });
});

/* ===== 댓글 목록 ===== */
app.get("/api/comments", async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return res.json({ ok: true, storage: storageMode, comments: data });
    }
    return res.json({
      ok: true,
      storage: storageMode,
      comments: memoryComments.slice(0, 50),
    });
  } catch (e) {
    console.error("GET /api/comments error:", e.message);
    return res.status(503).json({
      ok: false,
      error: "데이터베이스 연결 오류: " + e.message,
    });
  }
});

/* ===== 댓글 등록 ===== */
app.post("/api/comments", async (req, res) => {
  const invalid = validateComment(req.body);
  if (invalid) return res.status(400).json({ ok: false, error: invalid });

  const nickname = String(req.body.nickname).trim();
  const message = String(req.body.message).trim();

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("comments")
        .insert({ nickname, message })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ ok: true, comment: data });
    }

    const comment = {
      id: memoryId++,
      nickname,
      message,
      created_at: new Date().toISOString(),
    };
    memoryComments.unshift(comment);
    return res.status(201).json({ ok: true, comment });
  } catch (e) {
    console.error("POST /api/comments error:", e.message);
    return res.status(503).json({
      ok: false,
      error: "데이터베이스 연결 오류: " + e.message,
    });
  }
});

/* ===== 정적 사이트 서빙 (같은 폴더의 index.html 등) ===== */
const publicDir = __dirname;
app.use(express.static(publicDir, { extensions: ["html"] }));

/* SPA가 아니므로 404는 기본 처리 */
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`K-Actors Festival backend running on port ${PORT}`);
  console.log(`Storage mode: ${storageMode}`);
});
