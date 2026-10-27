import jwt from "jsonwebtoken";
import { ApiError } from "./errors.js";
import { findPublic } from "./users.js";

// 서버 설정: 잘못된 키나 TTL이면 서버 시작 자체를 거부합니다.
const EXAMPLE_SECRET = "REPLACE_WITH_RANDOM_64_HEX_CHARACTERS";
const ISSUER = process.env.JWT_ISSUER || "webservice-class";
const AUDIENCE = process.env.JWT_AUDIENCE || "board-api";
const TTL = Number(process.env.TOKEN_TTL || 90);
if (
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET === EXAMPLE_SECRET ||
  !/^[0-9a-fA-F]{64}$/.test(process.env.JWT_SECRET)
)
  throw new Error(
    "JWT_SECRET에 직접 생성한 64자리 16진수 키를 설정하세요. backend-express/README.md 참고",
  );
if (!Number.isInteger(TTL) || TTL <= 0)
  throw new Error("TOKEN_TTL은 양의 정수(초)여야 합니다.");
const SECRET = Buffer.from(process.env.JWT_SECRET, "hex");

function invalidToken() {
  return new ApiError(401, "INVALID_TOKEN", "유효하지 않은 토큰입니다. 다시 로그인하세요.");
}

// BE-01: 비밀번호 검증을 통과한 user에게만 호출됩니다. 비밀번호·해시는 넣지 않습니다.
export function issueToken(user) {
  return jwt.sign({}, SECRET, {
    algorithm: "HS256",
    subject: String(user.id),
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: TTL,
  });
}

// BE-02: Bearer 추출 → 서명/알고리즘/만료/클레임 검증 → 실제 사용자 확인.
export function currentUserId(req) {
  const match = /^Bearer (\S+)$/i.exec(req.get("Authorization") ?? "");
  if (!match) throw new ApiError(401, "TOKEN_REQUIRED", "로그인이 필요합니다.");
  let payload;
  try {
    payload = jwt.verify(match[1], SECRET, {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
  } catch (error) {
    // 만료 판정은 서명 검증이 통과한 뒤에만 나오므로 "정상 서명의 만료 토큰"입니다.
    if (error instanceof jwt.TokenExpiredError)
      throw new ApiError(401, "TOKEN_EXPIRED", "로그인 시간이 만료되었습니다. 다시 로그인하세요.");
    throw invalidToken();
  }
  // jwt.verify는 exp가 없는 토큰도 통과시키므로 exp와 sub를 직접 확인합니다.
  if (
    typeof payload.exp !== "number" ||
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub)
  )
    throw invalidToken();
  const user = findPublic(Number(payload.sub));
  if (!user) throw invalidToken();
  return user.id;
}

// BE-03: 검증된 사용자 ID와 DB에 저장된 글의 작성자 ID를 비교합니다.
export function assertOwner(userId, authorId) {
  if (userId !== authorId)
    throw new ApiError(403, "FORBIDDEN", "본인이 작성한 글만 수정·삭제할 수 있습니다.");
}
