# 게임 공략 게시판

웹서비스설계 JWT 게시판 과제입니다. 누구나 게임 공략을 읽을 수 있고, 로그인한 사용자만 공략을 쓰며, 자신이 쓴 공략만 수정·삭제할 수 있는 웹서비스입니다.

## 작성자와 서비스 소개

- 학번 / 이름: 202219903 / 박예찬
- 서비스 목적과 대상 사용자: 게임을 하다 막힌 플레이어가 보스 공략, 아이템 위치, 빌드 추천 같은 정보를 찾아보고 공유하는 게시판입니다. 공략은 로그인 없이 누구나 읽을 수 있어 검색하듯 바로 확인할 수 있습니다. 공략 작성은 로그인한 사용자만 할 수 있고, 다른 사람이 내 공략을 고치거나 지울 수 없도록 작성자 본인만 수정·삭제할 수 있습니다.
- 선택한 기술: Vue + Express
- 주요 기능: 공략 목록·상세 공개 조회, JWT 로그인과 로그인 사용자 표시, 내 정보 조회, 로그인 사용자 공략 작성, 작성자 본인만 수정·삭제, 토큰 없음·변조·만료 처리, 로그아웃, SQLite 파일 저장

## 보고서와 테스트 증거

- [최종 보고서 PDF](docs/202219903_박예찬_최종보고서.pdf)
- [테스트 기록 (T01~T17 결과표)](docs/evidence/테스트기록.md)
- [테스트 증거 캡처](docs/evidence/)
- [AI 활용 기록](docs/AI_활용기록.md)

## 프로젝트 구조

제공 템플릿과 같은 폴더 이름을 사용했고, 선택하지 않은 템플릿(frontend-react, backend-fastapi, backend-spring)은 제외했습니다.

```text
.
├── README.md
├── .gitignore
├── backend-express/          # Express 백엔드
│   ├── .env.example          # 환경설정 예시 (실제 .env는 커밋하지 않음)
│   ├── package.json, package-lock.json
│   └── src/
│       ├── app.js            # 라우트, 입력 검사, 오류 응답
│       ├── auth.js           # JWT 발급·검증, 작성자 권한 검사 (구현)
│       ├── store.js          # SQLite 저장소
│       ├── users.js          # 테스트 계정, 비밀번호 검증
│       └── errors.js
├── frontend-vue/             # Vue 프론트
│   ├── package.json, package-lock.json, vite.config.js
│   └── src/
│       ├── api.js            # 로그인, 토큰 보관·전송, 응답 처리 (구현)
│       ├── App.vue           # 화면 (구현)
│       └── style.css
├── tools/check_api.py        # 제공 자동 API 검사 도구
└── docs/
    ├── 202219903_박예찬_최종보고서.pdf  # 최종 보고서
    ├── AI_활용기록.md
    ├── evidence/             # 테스트 캡처와 테스트기록.md
    └── 01~07                 # 제공된 과제 문서
```

## 실행 환경

| 항목 | 사용 버전 |
|---|---|
| 운영체제 | macOS 15.6.1 |
| 프론트 런타임 Node.js | v24.15.0 (요구: 20.19 이상) |
| 백엔드 런타임 | Node.js v24.15.0 |
| 프레임워크 | Vue 3.5.43, Vite 8.3.4 / Express 5.3.0, jsonwebtoken 9.0.3, dotenv 18.0.7 |
| 데이터 저장 | SQLite 파일 (sql.js 1.14.2) |
| 검사 도구 | Python 3.10.2 (추가 패키지 없음) |

## 설치와 실행

터미널 2개를 사용합니다. 터미널 A는 백엔드, 터미널 B는 프론트입니다. 아래 명령은 저장소 루트에서 시작합니다.

### 1 저장소 복제

```sh
git clone https://github.com/ParkYeChan2979/game-guide-board.git
cd game-guide-board
```

### 2 백엔드 준비와 실행 (터미널 A)

```sh
cd backend-express
npm ci
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

`.env`의 `JWT_SECRET`을 직접 생성한 키로 바꿉니다. 아래 명령은 32바이트 난수를 64자리 16진수로 출력합니다. 출력값을 `.env`의 `JWT_SECRET=` 뒤에 붙여 넣고, 이 값은 어디에도 공유하거나 커밋하지 않습니다.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

```sh
npm start
```

- 환경설정 예시 파일: `backend-express/.env.example`
- JWT_SECRET: 64자리 16진수만 허용합니다. 비어 있거나, 예시 값(`REPLACE_WITH_RANDOM_64_HEX_CHARACTERS`) 그대로이거나, 형식이 틀리면 서버가 시작하지 않고 오류를 출력합니다.
- JWT_ISSUER / JWT_AUDIENCE: `webservice-class` / `board-api` (예시 파일 값 그대로 사용)
- TOKEN_TTL: 기본 90초. 만료 테스트 시 macOS/Linux `TOKEN_TTL=3 npm start`, Windows PowerShell `$env:TOKEN_TTL="3"; npm start`
- 백엔드 주소: http://127.0.0.1:8000
- 정상 실행 확인: 터미널에 `게임 공략 게시판 API http://127.0.0.1:8000`이 출력되고, http://127.0.0.1:8000/api/health 가 `{"status":"ok","stack":"express"}`를 반환합니다.

### 3 프론트 빌드와 로컬 실행 (터미널 B)

백엔드를 켜 둔 상태에서 새 터미널을 저장소 루트에서 엽니다.

```sh
cd frontend-vue
npm ci
npm run build
npm run preview
```

- 최종 확인 주소: http://127.0.0.1:4173
- 개발 중 실행: `npm run dev`, http://127.0.0.1:5173
- API 연결 방식: 브라우저는 같은 주소의 `/api`로 요청하고, Vite preview(4173)·dev(5173) 서버가 `vite.config.js`의 프록시 설정으로 `http://127.0.0.1:8000`의 백엔드에 전달합니다. 백엔드 포트를 바꾸면 `vite.config.js`의 두 `proxy` 주소도 함께 바꿉니다.
- 종료: 프론트와 백엔드를 실행한 각 터미널에서 Ctrl+C
- 코드 변경 후 재실행: 프론트는 `npm run build` 후 `npm run preview`를 다시 실행하고, 백엔드는 Ctrl+C 후 `npm start`로 재시작합니다.

### 4 테스트 계정과 DB

| 사용자 | 이메일 | 실습용 비밀번호 |
|---|---|---|
| Alice (id 1) | alice@class.test | Classroom!2026 |
| Bob (id 2) | bob@class.test | Classroom!2026 |

- SQLite 파일 위치: `backend-express/data/board.sqlite`. `backend-express` 폴더에서 `npm start`를 실행하면 폴더와 테이블이 자동으로 생성됩니다. DB 파일은 커밋하지 않으므로 처음 실행하면 글이 없는 상태로 시작합니다.
- DB 초기화: 백엔드를 Ctrl+C로 종료한 뒤 `backend-express/data/board.sqlite`를 삭제하고 다시 `npm start`합니다. 저장된 글이 모두 지워집니다.
- 서버 재시작 후 데이터 유지: 서버를 Ctrl+C로 종료하고 재시작한 뒤에도 글의 id·제목·내용·작성자·작성 시각이 그대로 유지되는 것을 확인했습니다 (T15).

위 계정은 과제 전용 테스트 계정입니다. 실제 서비스 계정 정보나 서버 비밀 키는 기록하지 않았습니다.

## 구현 완료 범위

| 기능 | 완료 여부 | 주요 파일 또는 함수 |
|---|---|---|
| 공개 목록과 상세 | 완료 | `backend-express/src/app.js` GET 라우트, `frontend-vue/src/App.vue` (제공 코드 유지) |
| 로그인과 JWT 발급 | 완료 | `backend-express/src/auth.js` `issueToken`, `frontend-vue/src/api.js` `login` |
| JWT 검증과 내 정보 조회 | 완료 | `backend-express/src/auth.js` `currentUserId`, GET /api/me |
| 글 작성과 작성자 저장 | 완료 | POST /api/posts, 작성자는 `currentUserId`가 검증한 ID로 저장 |
| 본인 글 수정·삭제 | 완료 | `backend-express/src/auth.js` `assertOwner`, `frontend-vue/src/api.js` `canEdit` |
| 토큰 만료와 로그아웃 | 완료 | `auth.js` TOKEN_EXPIRED 처리, `api.js` `request`의 401 세션 해제, `App.vue` `logout` |
| 입력 오류와 권한 오류 처리 | 완료 | `app.js` `fields`·`postId`(제공 코드), `api.js` 응답 code별 안내, `App.vue` `run`의 404 처리 |

알려진 문제와 미완성 기능: 없음. 로그인 상태는 브라우저 메모리에만 보관하므로 새로고침하면 로그아웃되는 것이 의도된 동작입니다. 로그아웃은 이 탭의 토큰을 지우는 기능이며, 이미 발급된 토큰을 서버에서 무효화하지는 않습니다(만료 시각까지 유효).

## 테스트 방법과 결과 요약

- 수동 테스트: 빌드본(http://127.0.0.1:4173)에서 Chrome 개발자 도구 Network와, 저장소 루트의 터미널에서 curl로 T01~T17을 직접 수행했습니다. 17개 모두 PASS입니다.
- 자동 검사 (저장소 루트, 백엔드 실행 중): `python3 tools/check_api.py --mode final` → 40개 PASS. `TOKEN_TTL=3 npm start`로 재시작 후 `python3 tools/check_api.py --mode final --expiry` → 48개 PASS.
- Alice/Bob 권한 구분: Bob의 정상 토큰으로 Alice 글을 curl로 직접 수정·삭제하면 403 FORBIDDEN이고 재조회 시 원문이 그대로입니다. Bob 화면에서는 Alice 글의 수정·삭제 버튼이 보이지 않습니다. Bob 본인 글은 작성 201, 수정 200, 삭제 204입니다.
- HTTP 상태와 오류 code: 성공 200·201·204, 실패 400 BAD_INPUT, 401 INVALID_CREDENTIALS·TOKEN_REQUIRED·INVALID_TOKEN·TOKEN_EXPIRED, 403 FORBIDDEN, 404 NOT_FOUND를 각각 확인했습니다.
- 응답 헤더와 본문: 등록 201에 `Location: /api/posts/{id}`, 보호 API 401에 `WWW-Authenticate: Bearer`, 삭제 204는 응답 본문 없음을 확인했습니다.
- 토큰 없음·변조·만료: 토큰 없음 401 TOKEN_REQUIRED, 서명 첫 글자를 바꾼 토큰 401 INVALID_TOKEN, TTL 3초 토큰을 5초 뒤 사용 시 401 TOKEN_EXPIRED이며, /me와 POST·PUT·DELETE 모두에서 확인했습니다. 화면에서는 만료 안내 후 자동으로 로그아웃 상태가 됩니다.
- Bearer 형식 오류: `Authorization: Basic abc`, `Bearer`(토큰 없음), 접두어 없는 토큰 모두 401 TOKEN_REQUIRED를 확인했습니다.
- 새 폴더 재현: GitHub에서 새 폴더로 clone한 뒤 이 README의 절차만으로 설치·키 설정·빌드·실행했고, 빈 DB에서 자동 시작해 글 등록까지 동작했습니다.
- 판단 순서: 토큰 없이 없는 글 수정 401, 정상 토큰으로 없는 글 수정 404, Bob이 Alice 글에 공백 제목 403, Alice가 자기 글에 공백 제목 400을 확인했습니다.
- 전체 결과와 증거: [테스트기록.md](docs/evidence/테스트기록.md), 보고서 4장

## 핵심 구현 설명

1. **로그인과 발급**: 프론트 `api.js`의 `login`이 이메일·비밀번호를 POST /api/auth/login으로 보냅니다. 백엔드는 제공된 `verifyCredentials`로 계정을 확인한 뒤 `auth.js`의 `issueToken`이 HS256으로 `sub`(사용자 ID 문자열), `iss`, `aud`, `exp`를 담은 JWT를 발급합니다.
2. **토큰 보관과 전송**: 토큰은 `api.js` 모듈 변수(브라우저 메모리)에만 저장하고 localStorage는 사용하지 않습니다. `authorizationHeaders`가 토큰이 있을 때만 `Authorization: Bearer <JWT>`를 붙입니다.
3. **서버 검증**: 보호 API는 `auth.js`의 `currentUserId`를 먼저 호출합니다. Bearer 형식 확인 → `jwt.verify`로 알고리즘(HS256 고정)·서명·만료·iss·aud 검증 → exp·sub 형식 확인 → 실제 계정 존재 확인 순서로 검사하고, 검증된 사용자 ID만 돌려줍니다.
4. **작성자 권한**: 수정·삭제 시 `assertOwner`가 검증된 사용자 ID와 DB에 저장된 글의 `authorId`를 비교해 다르면 403을 반환합니다. 글 작성 시 작성자는 요청 본문이 아니라 검증된 토큰의 사용자로 정해지며, 본문에 `authorId`·`userId`를 넣으면 400으로 거부됩니다. 프론트 `canEdit`은 버튼 표시용이고 실제 권한 검사는 서버가 합니다.

상세 설명은 보고서 3장에 있습니다.

## AI 활용 요약과 참고 자료

- AI 사용 여부: 사용
- 도구: Claude Code (VS Code 확장, 모델 Claude Opus 5.5)
- 사용 목적: 과제 문서 요약과 작업 순서 계획, 백엔드 `auth.js`와 프론트 `api.js`·`App.vue` 구현 코드 생성, 구현 검증(자동 API 검사·브라우저 자동 점검), 수동 테스트 절차와 curl 명령 안내, README·보고서 초안 작성
- 직접 수행한 내용: 기술 조합(Vue + Express)과 주제 선택, 제출 폴더 구조 결정, 생성된 코드 검토, T01~T17 수동 테스트 전체 수행과 증거 캡처, 테스트 기록 확인, 최종 제출
- 검증: 모든 필수 동작을 직접 수행한 수동 테스트(T01~T17)와 제공 자동 검사(final 40개, expiry 48개)로 확인했습니다.
- 상세 활용 기록: [docs/AI_활용기록.md](docs/AI_활용기록.md), 보고서 AI 활용 절
- 참고 자료
  - 제공 시작 템플릿과 과제 문서(docs/01~07): 프로젝트 구조, 라우트·저장소·계정 코드, API 명세
  - jsonwebtoken 공식 문서 https://github.com/auth0/node-jsonwebtoken : `jwt.sign`·`jwt.verify` 옵션 (`backend-express/src/auth.js`)
  - Vite 공식 문서 https://vite.dev/guide/ : 빌드·preview·프록시 실행

## 제출 확인

- [x] README의 안내 문구를 실제 내용으로 교체했다.
- [x] 새 폴더에 clone하여 README만으로 설치·환경설정·빌드·로컬 실행했다.
- [x] 4173번 빌드 화면에서 API 연결과 전체 필수 기능을 확인했다.
- [x] GitHub에서 보고서와 증거 링크가 열린다.
- [x] 교수자가 저장소를 열람·복제할 수 있다. (공개 저장소)
- [x] 비밀 키·실제 토큰·DB·node_modules를 커밋하지 않았다.
- [x] 최종 push 후 저장소 URL과 제출 기준 커밋 SHA를 LMS에 제출했다.
