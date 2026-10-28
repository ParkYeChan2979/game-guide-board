# AI 활용 기록

작업하면서 그때그때 기록했습니다. 보고서의 "AI 활용 및 출처" 절과 README의 AI 활용 요약은 이 기록을 바탕으로 작성합니다.

- 도구·모델: Claude Code (VS Code 확장), Claude Opus 5.5
- 사용 방식: VS Code에서 AI에게 단계별로 요청하고, AI가 파일 작성·명령 실행을 한 결과를 확인한 뒤 다음 단계를 진행했습니다.

## 작업 구분

| 구분 | 내용 |
|---|---|
| 제공 코드 유지 | `backend-express/src/app.js`(라우트·입력 검사·오류 응답), `store.js`, `users.js`, `errors.js`, `frontend-vue`의 화면 구조와 CRUD 흐름, `tools/check_api.py` |
| AI 생성 후 그대로 반영 | `backend-express/src/auth.js` 전체, `frontend-vue/src/api.js`의 FE-01~04, `App.vue` 변경분, `style.css`의 `.message.error` |
| 본인이 직접 수행 | 기술 조합·주제 선택, 제출 폴더 구조 결정(템플릿과 같은 폴더 이름 사용), 생성 코드 검토, T01~T17 수동 테스트 전체 수행과 캡처 41장, 캡처 파일 이름 규칙 정리, 테스트 기록 확인, GitHub 업로드와 LMS 제출 |
| AI 초안 후 본인 확인 | README.md, 테스트기록.md(본인 캡처에 나온 값으로 작성) |
| AI 초안 후 본인 수정 | 보고서(docs/202219903_박예찬_최종보고서.pdf): AI가 제공 양식에 초안을 채운 뒤 본인이 문장을 다듬고 반영 방식·체크 항목을 직접 수정 |

## 단계별 기록

| 날짜 | 단계 | 사용 목적 | 주요 요청 | 반영한 파일·함수 | 직접 수정·판단한 내용 | 검증 결과 |
|---|---|---|---|---|---|---|
| 2026-10-27 | 준비 | 과제 문서 요약, 작업 순서 계획 | 공지 PDF·API 명세·체크리스트를 읽고 진행 순서 정리 요청 | 없음 (계획) | 기술 조합(Vue + Express), 주제(게임 공략) 직접 선택 | - |
| 2026-10-28 | 준비 | 제출용 폴더 구성, 템플릿 실행 | 선택한 템플릿(frontend-vue, backend-express)과 tools·docs를 제공 폴더 구조 그대로 복사하고 의존성 설치·starter 검사 실행 | 폴더 구조, README.md(양식 복사) | 제공 템플릿과 같은 폴더 이름을 쓰도록 직접 요청, 미사용 템플릿 3개 제외 | `check_api.py --mode starter` 14개 PASS, 로그인 501 확인. 본인이 브라우저에서 등록·목록·상세·수정·삭제와 로그인 501 안내를 직접 확인 |
| 2026-10-28 | BE-01~03 | 백엔드 JWT 발급·검증·작성자 권한 코드 생성 | auth.js의 issueToken·currentUserId·assertOwner 구현, 서버 키·TTL 시작 시 검사 | backend-express/src/auth.js 전체, backend-express/src/app.js 시작 로그 문구 | 코드 수정 없이 그대로 반영. AI 설명으로 검증 순서(Bearer 형식 → jwt.verify → exp·sub 확인 → 계정 확인)와 401/403 차이를 확인함 | AI 실행: final 40개 PASS, expiry 48개 PASS, iss/aud/exp/sub/alg=none/HS512/다른 키 조작 토큰 모두 401 INVALID_TOKEN, 빈 키·예시 키·형식 오류 키는 서버 시작 거부. 본인 수행: T02~T04, T07~T10, T12~T14, T17 PASS |
| 2026-10-28 | 키 설정 | 비밀 키 생성 | .env.example을 .env로 복사하고 JWT_SECRET을 crypto.randomBytes(32)로 생성 | backend-express/.env (커밋 제외) | - | 키 값은 출력하지 않음, git check-ignore로 .env 제외 확인 |
| 2026-10-28 | FE-01~04 | 프론트 로그인 연결·토큰 전송·오류 처리·버튼 표시 코드 생성 | api.js의 login·authorizationHeaders·request(401 세션 해제, code별 안내)·canEdit 구현, App.vue 비로그인 글쓰기 안내·404 목록 갱신·로그아웃 초기화·배너/제목 교체 | frontend-vue/src/api.js, frontend-vue/src/App.vue, frontend-vue/src/style.css(.message.error), frontend-vue/index.html(title) | 코드 수정 없이 그대로 반영. 토큰을 메모리에만 두는 이유(새로고침 시 로그아웃이 정상)와 403에서 로그아웃하지 않는 이유를 확인함 | AI 실행: Chrome 헤드리스 자동 UI 점검 29개 PASS, TTL 3초 만료 UI 점검 7개 PASS. 본인 수행: T01, T02, T05, T06, T10(화면), T11, T16 PASS |
| 2026-10-28 | 테스트 준비 | 수동 테스트 절차 안내 | T01~T17을 한 단계씩 안내하고 curl 명령을 준비해 달라고 요청 | 저장소 밖 개인용 테스트 가이드와 보조 스크립트(tok·tamper·m 함수), docs/evidence/테스트기록.md 양식 | 가이드가 길어 한 단계씩 안내받는 방식으로 바꿔 진행. 캡처가 한 화면에 안 들어가는 경우 두 장으로 나누어 찍음 | AI가 명령의 동작을 미리 확인한 뒤 안내 |
| 2026-10-28 | 수동 테스트 | (본인 수행) | - | docs/evidence/ 캡처 41장 | 빌드본(4173)에서 Network·curl로 T01~T17, 겹치는 조건, 서버 재시작, TTL 3초 만료, 자동 검사를 직접 수행하고 캡처. 304 캐시 응답을 보고 Disable cache를 켜고 다시 확인 | T01~T17 모두 PASS |
| 2026-10-28 | 테스트 기록 | 결과표 작성 | 본인이 찍은 캡처를 바탕으로 기록표 작성 요청 | docs/evidence/테스트기록.md | 캡처 파일 이름을 _a/_b 규칙으로 통일하도록 직접 요청, 기록 내용 확인 | 표의 값은 캡처에 찍힌 상태 코드·code·헤더와 일치 |
| 2026-10-28 | 문서 | README·보고서 초안 | 학번·이름을 주고 README와 AI 활용 기록 초안 요청 | README.md, docs/AI_활용기록.md, 보고서 | README·AI 기록은 내용 확인 후 반영. 보고서는 초안을 직접 다듬어 수정 후 반영. 표의 "제공 코드의 원래 역할" 문구가 미구현으로 오해될 수 있음을 직접 지적해 "시작 코드:" 표기로 고치게 함 | 링크·명령은 실제 폴더 기준, 보고서 테스트 값은 캡처와 일치 |
