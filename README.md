# OnePlus Client

방향키(WASD / 화살표) 리듬게임의 프론트엔드입니다. 번들러 없이 HTML + ES Module로 동작합니다.

## 실행

ES Module과 `fetch`를 쓰기 때문에 `file://`로 열면 동작하지 않습니다. 정적 서버로 열어주세요.

- 시작 페이지: `src/main.html`
- API는 `/api` 경로로 호출합니다. 개발 서버에서 `/api`를 백엔드로 프록시하거나, 같은 도메인에 배포해야 합니다. 쿠키가 `Secure; SameSite=Strict`라서 프론트와 API가 같은 사이트여야 로그인이 됩니다.
- 서버 주소를 바꾸려면 `src/api.js`의 `BASE`를 수정하세요.

## 페이지

| 파일 | 설명 |
|---|---|
| `src/main.html` | 메인. Start / Edit / Setting 버튼, 로그인 영역, 설정 패널 |
| `src/select.html` | 곡 선택. 서버 트랙 목록 표시 |
| `src/game.html` | 게임 화면 (`?song=곡이름`) |
| `src/score.html` | 결과 화면 |
| `src/edit.html` | 곡 업로드 폼 |

## 폴더 구조

```
src/
  api.js          API 호출 모음
  main.js         곡 선택 화면 로직
  user.js         로그인 / 로그아웃 / 내 정보
  setting.js      설정 (판정 오프셋)
  edit.js         곡 업로드
  game/
    game.js       게임 루프, 채보 로드
    layout.js     화면 단위(u) 계산
    input.js      WASD / 화살표 입력
    notes.js      노트 위치 계산, 그리기
    timing.js     판정 구간
    finish.js     종료 처리
    ui/           콤보, 정확도, 판정 이미지, 플레이어 버튼
  score/          결과 화면 (점수, 랭크)
public/
  css/            페이지별 스타일
  img/            이미지
  Pattern/        채보 JSON (로컬, 곡 이름과 파일 이름이 같아야 함)
```

## API 연결

`src/api.js`에 명세서(`API.md`)의 엔드포인트가 함수로 정리되어 있습니다.

| 함수 | 엔드포인트 |
|---|---|
| `login()` | `GET /api/auth` (OAuth 진입, 페이지 이동) |
| `logout()` | `POST /api/auth/logout` |
| `refresh()` | `POST /api/auth/refresh` |
| `getMe()` | `GET /api/auth/me` |
| `getTracks(cursor)` | `GET /api/track/info` |
| `getTrack(id)` | `GET /api/track/info?id=` |
| `loadTrack(id)` | `GET /api/track/:id` |
| `uploadTrack(fields)` | `POST /api/track` (multipart) |
| `updateTrack(id, fields)` | `PATCH /api/track/:id` (multipart) |
| `deleteTrack(id)` | `DELETE /api/track/:id` |
| `imageUrl(file)`, `audioUrl(file)` | `/api/public/images/:file`, `/api/public/tracks/:file` |

- 모든 요청에 `x-device-id` 헤더와 쿠키(`credentials: 'include'`)가 포함됩니다. device id는 최초 1회 생성해 localStorage에 저장합니다.
- 로그인은 OAuth라서 프론트에서 아이디/비밀번호를 검사하지 않습니다. 로그인 여부는 `getMe()` 결과로 판단합니다.
- 트랙 응답 필드는 `title`, `artist`, `image`, `audio`를 가정하고 있습니다. 실제 응답과 다르면 `src/main.js`의 매핑을 수정하세요.

### 아직 서버와 연결되지 않은 부분

- 게임의 채보(`public/Pattern/*.json`)는 로컬 파일을 읽습니다. 곡 정보, 음원, 이미지는 모두 서버에서 받아옵니다.
- 점수 저장, 랭킹 API는 명세에 없어서 연결하지 않았습니다.
- 트랙 수정/삭제는 `api.js`에 함수만 있고 화면이 없습니다.

## 게임 화면 크기 규칙

게임 화면의 크기, 위치, 노트 속도는 모두 단위 `u` 하나로 계산합니다. 16:9 영역을 화면에 꽉 차게 맞췄을 때 가로 1%가 1u입니다(1920x1080에서 19.2px). `src/game/layout.js`가 창 크기가 바뀔 때마다 CSS 변수 `--u`와 JS 값을 갱신합니다.

- CSS에서는 `calc(var(--u) * 7)`처럼 씁니다.
- JS에서는 `getUnit()`을 곱해서 씁니다.
- 새 요소를 추가할 때 `vw`, `vh`, `%`로 크기를 잡지 말고 `u`를 쓰세요. 그래야 화면 비율이 바뀌어도 위치와 속도가 같은 비율로 변합니다.

## 입력과 판정

- WASD와 방향키로 상/좌/하/우 노트를 칩니다. 키는 `e.code`(물리 키)로 판별해서 한글 입력 상태나 맥에서도 동작합니다.
- 판정 구간은 `src/game/timing.js`(Perfect 40ms, Great 80ms, Good 120ms, Bad 160ms, 그 이상 Miss)에 있습니다.
- 메인 화면의 설정 패널에서 판정 오프셋(ms)을 설정할 수 있습니다. 늦게 눌러야 Perfect가 뜨면 양수, 일찍 눌러야 하면 음수를 입력합니다. 값은 브라우저 localStorage(`offsetMs`)에 저장됩니다.

## 채보 형식

`public/Pattern/곡이름.json`은 노트 배열입니다. `time`은 곡 시작 기준 초 단위입니다.

```json
[{ "dir": "north", "time": 1.5 }]
```

`dir`은 `north`, `south`, `east`, `west` 중 하나입니다.
