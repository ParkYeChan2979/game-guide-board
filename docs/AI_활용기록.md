# AI 활용 기록

작업하면서 그때그때 기록합니다. 보고서의 "AI 활용 및 출처" 절과 README의 AI 활용 요약은 이 기록을 바탕으로 작성합니다.

- 도구·모델: Claude Code (VS Code 확장), Claude Opus 5.5

| 날짜 | 단계 | 사용 목적 | 주요 요청 | 반영한 파일·함수 | 직접 수정·판단한 내용 | 검증 결과 |
|---|---|---|---|---|---|---|
| 2026-10-27 | 준비 | 과제 문서 요약, 작업 순서 계획 | 공지 PDF·API 명세·체크리스트를 읽고 진행 순서 정리 요청 | 없음 (계획) | 기술 조합(Vue + Express), 주제(게임 공략) 직접 선택 | - |
| 2026-10-28 | 준비 | 제출용 폴더 구성, 템플릿 실행 | 선택한 템플릿(frontend-vue, backend-express)과 tools·docs를 제공 폴더 구조 그대로 복사하고 의존성 설치·starter 검사 실행 | 폴더 구조, README.md(양식 복사) | 제공 템플릿과 같은 폴더 이름을 쓰도록 직접 요청, 미사용 템플릿 3개 제외 | `check_api.py --mode starter` 14개 PASS, 로그인 501 확인 |
| 2026-10-28 | BE-01~03 | 백엔드 JWT 발급·검증·작성자 권한 코드 생성 | auth.js의 issueToken·currentUserId·assertOwner 구현, 서버 키·TTL 시작 시 검사 | backend-express/src/auth.js 전체, backend-express/src/app.js 시작 로그 문구 | (작성 예정: 직접 이해·수정한 부분) | final 40개 PASS, TOKEN_TTL=3 --expiry 48개 PASS, iss/aud/exp/sub/alg=none/HS512/다른 키 조작 토큰 모두 401 INVALID_TOKEN, 빈 키·예시 키·형식 오류 키는 서버 시작 거부 |
| 2026-10-28 | 키 설정 | 비밀 키 생성 | .env.example을 .env로 복사하고 JWT_SECRET을 crypto.randomBytes(32)로 생성 | backend-express/.env (커밋 제외) | - | 키 값은 출력하지 않음, git check-ignore로 .env 제외 확인 |
| 2026-10-28 | FE-01~04 | 프론트 로그인 연결·토큰 전송·오류 처리·버튼 표시 코드 생성 | api.js의 login·authorizationHeaders·request(401 세션 해제, code별 안내)·canEdit 구현, App.vue 비로그인 글쓰기 안내·404 목록 갱신·로그아웃 초기화·배너/제목 교체 | frontend-vue/src/api.js, frontend-vue/src/App.vue, frontend-vue/src/style.css(.message.error), frontend-vue/index.html(title) | (작성 예정: 직접 이해·수정한 부분) | Chrome 헤드리스 자동 UI 점검 29개 PASS(비로그인 안내, 로그인 실패/성공, 400 입력 유지, 201/200/204, Bob의 403 후 로그인 유지·원문 유지, 로그아웃 후 /me 토큰 없음, 404 목록 갱신, Bearer undefined 없음, Web Storage 미사용, 새로고침 시 로그인 해제), TOKEN_TTL=3 만료 UI 점검 7개 PASS. 보고서용 수동 캡처는 별도로 직접 수행 필요 |
