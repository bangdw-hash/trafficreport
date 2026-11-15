# 배포 및 검증

- 저장소: https://github.com/bangdw-hash/trafficreport
- GitHub Pages: https://bangdw-hash.github.io/trafficreport/
- APK CI: https://github.com/bangdw-hash/trafficreport/actions/workflows/android.yml
- 웹 CI: https://github.com/bangdw-hash/trafficreport/actions/workflows/web.yml

## GitHub Pages
Settings → Pages → Source → GitHub Actions. main 브랜치에 푸시하면 web.yml이 자동 실행됩니다.

## APK
android.yml 성공 후 해당 실행의 Artifacts에서 trafficreport-v0.1.0-debug-apk 파일을 다운로드합니다. debug APK는 정식 스토어 배포용 서명이 아닙니다.

## 구현 범위
웹 및 Android WebView 기반 초기 프로토타입입니다. MP4 인코딩, USB 폴더 자동 검색, Google Drive OAuth, AI 법령 검증은 미구현입니다. APK 설치 테스트 및 웹 접근성 테스트는 별도 검증해야 합니다.
