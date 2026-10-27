// 토큰은 이 모듈의 변수(브라우저 메모리)에만 보관합니다. localStorage·sessionStorage는 쓰지 않습니다.
let session = { accessToken: "", user: null };
export const getSession = () => session;
export function clearSession() {
  session = { accessToken: "", user: null };
}
// FE-02: 토큰이 있을 때만 Bearer 헤더를 만듭니다. ("Bearer undefined" 방지)
function authorizationHeaders() {
  return session.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};
}
// FE-03: 서버의 JSON code에 맞춰 화면 안내 문구를 정합니다.
const guides = {
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
  TOKEN_REQUIRED: "로그인이 필요합니다. 로그인한 뒤 다시 시도하세요.",
  INVALID_TOKEN: "로그인 정보가 유효하지 않습니다. 다시 로그인하세요.",
  TOKEN_EXPIRED: "로그인 시간이 만료되었습니다. 다시 로그인하세요.",
  FORBIDDEN: "본인이 작성한 공략만 수정·삭제할 수 있습니다.",
  NOT_FOUND: "해당 공략을 찾을 수 없습니다. 목록을 새로 불러왔습니다.",
};
export async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authorizationHeaders(),
      ...options.headers,
    },
  });
  // 204는 본문이 없으므로 JSON을 파싱하지 않습니다.
  const data =
    response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    // 401은 토큰이 없거나 더 이상 쓸 수 없다는 뜻이므로 로그인 상태를 해제합니다.
    // 403은 인증은 유효하므로 로그인 상태를 유지합니다.
    if (response.status === 401) clearSession();
    const error = new Error(
      response.status === 400
        ? `입력을 확인하세요: ${data.message || "잘못된 요청입니다."}`
        : guides[data.code] || data.message || `HTTP ${response.status}`,
    );
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return data;
}
// FE-01: 로그인 성공 응답의 토큰과 사용자를 메모리에 저장합니다.
export async function login(email, password) {
  clearSession();
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  session = { accessToken: data.accessToken, user: data.user };
  return data.user;
}
// FE-04: 화면 버튼 표시용입니다. 실제 권한 검사는 서버의 assertOwner가 합니다.
export function canEdit(post) {
  return Boolean(session.user) && session.user.id === post.authorId;
}
export const api = {
  list: () => request("/posts"),
  detail: (id) => request(`/posts/${id}`),
  create: (input) =>
    request("/posts", { method: "POST", body: JSON.stringify(input) }),
  update: (id, input) =>
    request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  remove: (id) => request(`/posts/${id}`, { method: "DELETE" }),
  me: () => request("/me"),
};
