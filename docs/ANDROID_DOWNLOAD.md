# Android APK 직접 다운로드

최신 빌드 파일: https://github.com/bangdw-hash/trafficreport/releases/download/latest/trafficreport-latest.apk

위 주소는 GitHub Actions android.yml 빌드와 GitHub Releases 업로드가 성공한 뒤에만 유효합니다. GitHub Releases의 latest 태그에 동일한 파일명을 덮어써서 URL을 유지합니다.

## 주의
- 현재 산출물은 debug APK입니다. 매 빌드마다 서명키가 달라질 수 있어 기존 설치본 위에 덮어쓰기 설치가 실패할 수 있습니다.
- 배포용 안정적인 앱 업데이트를 위해서는 별도 릴리스 서명키를 GitHub Actions Secrets에 안전하게 보관하고 release 빌드로 전환해야 합니다.
- buildVersionCode는 GitHub Actions run_number를 반영합니다.
- 실제 APK 빌드, 업로드, 휴대전화 설치 여부는 GitHub Actions 결과에서 확인해야 합니다.
