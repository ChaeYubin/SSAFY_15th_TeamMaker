# 🍚 SSAFY 15기 랜덤 밥조 자동 생성기 🍚

SSAFY 교육생들의 점심 조를 랜덤하게 편성하고, 결과를 Mattermost로 자동으로 전송해주는 프로그램입니다.

> SSAFY 12기에서 사용하던 팀 생성 프로젝트를 바탕으로 했으며, 15기 운영 환경에 맞게 일부 기능과 구조를 개선한 버전입니다.

## 개요

- GitHub Actions가 정해진 시간에 실행됩니다.
- 실행된 스크립트가 점심 조를 생성합니다.
- 생성된 결과를 Mattermost Webhook으로 전송합니다.
- 운영 실행 시에는 조 편성 결과와 로그를 함께 저장합니다.

## 15기에서 개선한 부분

- 팀 생성 로직 통합 및 구조 정리
- 날짜 처리 및 로그 저장 구조 개선
- 테스트용/운영용 Mattermost Webhook 분리
- 테스트 실행 시 운영 로그 오염 방지
- GitHub Actions 배포 흐름 및 자동 커밋 방식 정리

## 0. 사용 기술

![node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![github-actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## 1. 기능

- 매주 정해진 시간에 점심 조를 생성하고 Mattermost 메시지로 전송합니다.
- 이전 조 편성 로그를 바탕으로 가중치를 반영해 팀을 구성합니다.
- 실행 결과를 `logs` 디렉터리에 저장해 다음 실행에서 참고할 수 있습니다.
- GitHub Actions 수동 실행 시 테스트용 또는 운영용 Webhook을 선택할 수 있습니다.

### Mattermost 메시지 예시

```text
:party_blob: :rice: 4월 29일 밥 같이 먹어요 :rice: :party_blob: :cat_feed:
1조 (4명)  ➡  김OO    황OO    윤OO    이OO
2조 (4명)  ➡  장OO    오OO    서OO    강OO
3조 (4명)  ➡  고OO    이OO    신OO    채OO
4조 (4명)  ➡  최OO    구OO    전OO    임OO
5조 (5명)  ➡  채OO    민OO    안OO    정OO    최OO
```

## 2. 실행 순서

### 1) Repository fork

이 저장소를 개인 또는 팀 저장소로 fork 해서 사용합니다.

### 2) GitHub Secrets 설정

Repository `Settings -> Secrets and variables -> Actions`에서 아래 값을 등록합니다.

- `MM_WEBHOOK_URL`: 운영용 Mattermost Webhook URL
- `MM_WEBHOOK_TEST_URL`: 테스트용 Mattermost Webhook URL
- `USER_EMAIL`: 자동 커밋에 사용할 Git 이메일
- `USER_NAME`: 자동 커밋에 사용할 Git 사용자명
- `MEMBERS`: 조를 생성할 인원 목록
  - `MEMBERS`는 JSON 배열 문자열 형태로 입력해야 합니다.

    ```json
    ["홍길동", "김철수", "이영희", "박민수"]
    ```

### 3) GitHub Actions 설정

- `.github/workflows/deploy.yml`에서 실행 시간(cron)을 원하는 일정에 맞게 조정합니다.
- 현재 기본 스케줄은 `수요일 08:30 (KST)` 기준으로 설정되어 있습니다.
- 서버 시간은 UTC 기준이므로 스케줄을 변경할 때 시차를 함께 고려해야 합니다.

### 4) 실행 방식

- 정기 실행: 스케줄에 따라 자동으로 점심 조를 생성하고 운영 로그를 저장합니다.
- 수동 실행: GitHub Actions의 `workflow_dispatch`로 실행하며 `test` 또는 `prod` 대상을 선택할 수 있습니다.
- `test` 실행은 테스트용 Webhook으로 전송되며 로그를 저장하지 않습니다.
- `prod` 실행은 운영용 Webhook으로 전송되며 로그를 저장합니다.

### 5) 첫 설정 후 테스트 방법

- GitHub Secrets 등록을 마친 뒤 GitHub 저장소의 `Actions` 탭으로 이동합니다.
- `Deploy` 워크플로우를 선택한 뒤 `Run workflow`를 클릭합니다.
- `target` 값을 `test`로 선택해 수동 실행합니다.
- 테스트용 Mattermost 채널에서 메시지가 정상적으로 전송됐는지 확인합니다.
- 확인이 끝나면 같은 방식으로 `prod`를 실행하거나 스케줄 실행을 기다리면 됩니다.
