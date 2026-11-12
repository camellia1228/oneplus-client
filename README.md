# OnePlus 테스트 가이드

서버와 클라이언트를 함께 띄워서 테스트하는 방법입니다.

## 1. 서버 실행

### Node 버전 맞추기 (.nvmrc)

```bash
# mac, linux
brew install nvm
nvm i            # 프로젝트 디렉토리에서

# windows
winget install Schniz.fnm
fnm env --use-on-cd
fnm i            # 프로젝트 디렉토리에서
```

- windows ARM이면 nvm-windows를 사용하세요.
- windows에서 nvm이 제대로 동작하지 않으면 Node.js LTS(v24.17.0)로 진행하세요.

### https 인증서 (mkcert, 최초 1회)

1. [mkcert 릴리스](https://github.com/FiloSottile/mkcert/releases)에서 `mkcert-v1.4.4-windows-amd64.exe`를 받습니다.
2. mkcert를 보관할 폴더를 환경변수로 지정합니다.
3. 아래를 순서대로 실행합니다. 마지막 명령은 서버 디렉토리에서 실행합니다.

```bash
mkcert -version
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

### 실행

Docker Compose가 설치되어 있고 Docker가 켜져 있어야 합니다.

```bash
npm i            # 의존성 설치 (DB, 노트 분석 API 포함)
npm run db:up    # DB 컨테이너 실행
npm run start    # 서버 시작
```

- CORS는 로컬 Live Server의 모든 요청을 받도록 열려 있습니다.
- Google OAuth 클라이언트 ID/시크릿과 테스트 계정은 별도 문서를 참고하세요. (2주 후 삭제 예정)
- 테스트 음원은 직접 준비해서 추가해야 합니다.

## 2. 클라이언트 실행

1. `src/main.html`을 Live Server로 엽니다. (`file://`로는 동작하지 않습니다)
2. `src/api.js` 맨 위의 `BASE`를 서버 주소로 바꿉니다.

```js
const BASE = 'https://localhost:서버포트/api'
```

- 로그인 쿠키가 `Secure; SameSite=Strict`라서, 클라이언트와 서버 모두 `localhost`로 열어야 합니다. (`127.0.0.1`과 섞어 쓰지 마세요)

## 3. 테스트 순서

1. **로그인**: 메인 화면 오른쪽 위 user 영역에 마우스를 올리면 패널이 열립니다. `Login to Google`로 테스트 계정에 로그인합니다.
2. **곡 업로드**: **Edit** → 제목, 아티스트, 음원, 이미지를 선택하고 `Upload`합니다.
https://drive.google.com/drive/folders/1zHpaFb5SwvSIekI7KB-LIUEwx53jXaD6?usp=drive_link(테스트용 곡과 이미지)
3. **곡 선택**: **Start** → 업로드한 곡을 클릭해 미리듣기를 확인하고 **Play**를 누릅니다.
4. **플레이**: `W/A/S/D` 또는 방향키로 노트가 오는 방향의 키를 누릅니다.
5. **결과**: 곡이 끝나면 결과 화면이 나옵니다. `Esc`를 누르면 곡 선택 화면으로 돌아갑니다.
6. **판정 보정** (선택): 메인 화면의 **Setting** → `OFFSET (ms)`. 늦게 눌러야 Perfect가 뜨면 양수, 일찍 눌러야 하면 음수를 입력합니다.

> 게임은 곡 이름과 같은 이름의 채보 파일(`public/Pattern/곡이름.json`)을 읽습니다. 채보가 없으면 게임이 시작되지 않습니다.

## 4. 안 될 때 확인할 것

- **곡 목록이 비어 있다**: 서버가 켜져 있는지, `BASE`가 맞는지, 로그인했는지 확인합니다. 개발자 도구 Network 탭에서 `/track/info` 응답을 확인하세요.
- **로그인이 안 된다**: https로 열었는지, 클라이언트와 서버가 모두 `localhost`인지 확인합니다.
- **서버 API는 따로 호출해서 확인할 필요가 없습니다.** 이 문서의 순서대로 클라이언트에서 확인하세요.


