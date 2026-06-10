# 📦 발주단가 관리 시스템

Google Spreadsheet + Apps Script + GitHub Pages 기반의 내부용 발주단가 히스토리 관리 웹 프로그램입니다.
별도 서버 없이 운영 가능합니다.

---

## 📁 파일 구조

```
/
├── index.html              대시보드
├── products.html           제품 관리
├── history-detail.html     제품별 단가 히스토리
├── price-change.html       단가 변경 등록
├── history.html            전체 이력 조회
├── settings.html           사유코드 관리
├── Code.gs                 Google Apps Script (별도 배포)
├── js/
│   ├── config.js           API URL 설정
│   └── app.js              공통 유틸리티
└── css/
    └── style.css           커스텀 스타일
```

---

## ⚙️ 1단계 — Google 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트를 생성합니다.
2. 스프레드시트 이름을 **"발주단가 관리 DB"** 등 원하는 이름으로 설정합니다.
3. 시트 탭은 아직 건드리지 않아도 됩니다. (Apps Script 초기화 함수가 자동 생성합니다)

---

## ⚙️ 2단계 — Google Apps Script 배포

### 2-1. 스크립트 에디터 열기
1. 스프레드시트 상단 메뉴에서 **확장 프로그램 > Apps Script** 클릭
2. 기본 생성된 `Code.gs` 파일의 내용을 **전부 삭제**합니다.
3. 이 저장소의 `Code.gs` 파일 내용을 **붙여넣기** 합니다.
4. 저장 (Ctrl+S 또는 💾 버튼)

### 2-2. 초기 데이터 세팅
1. 상단 함수 선택 드롭다운에서 `initializeSheets` 선택
2. **▶ 실행** 버튼 클릭
3. 권한 허용 팝업이 뜨면 → **권한 검토 > 본인 계정 선택 > 고급 > 안전하지 않은 페이지로 이동 > 허용**
4. 스프레드시트로 돌아가면 `products`, `price_history`, `reason_codes` 시트 3개가 자동 생성됩니다.

### 2-3. 웹앱으로 배포
1. Apps Script 에디터 우측 상단 **배포 > 새 배포** 클릭
2. ⚙️ 아이콘 클릭 > **웹 앱** 선택
   ```
   설명:          발주단가 관리 API
   실행 사용자:   나 (본인)
   액세스 권한:   모든 사용자  ← 내부 사용이므로 조직으로 제한 가능
   ```
3. **배포** 버튼 클릭
4. 표시되는 **웹앱 URL** 복사 (형식: `https://script.google.com/macros/s/XXXX.../exec`)

> ⚠️ **코드 수정 후에는 반드시 재배포** 해야 반영됩니다.
> (배포 > 기존 배포 관리 > 수정 아이콘 > 버전: 새 버전 > 배포)

---

## ⚙️ 3단계 — config.js에 URL 입력

`js/config.js` 파일을 열고 아래 부분에 복사한 URL을 붙여넣습니다:

```javascript
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/여기에_복사한_URL/exec',
  // ...
};
```

---

## ⚙️ 4단계 — GitHub Pages 배포

1. GitHub에서 새 리포지토리 생성 (예: `price-management`)
2. 이 프로젝트 파일 전체를 push:
   ```bash
   git init
   git add .
   git commit -m "초기 배포"
   git remote add origin https://github.com/본인계정/price-management.git
   git push -u origin main
   ```
3. 리포지토리 **Settings > Pages** 이동
4. Source: **Deploy from a branch**, Branch: **main**, Folder: **/ (root)** 설정
5. 저장 후 1~2분 내 `https://본인계정.github.io/price-management/` 로 접속 가능

---

## 📖 사용 방법

### 대시보드 (`index.html`)
- 총 제품 수, 이번달 변경건수, 평균 변동률, 최근 변경 제품 요약 카드
- 최근 6개월 사유별 분포 도넛 차트
- 변동률 절대값 상위 5개 제품 목록
- 최근 10건 단가 변경 이력 테이블

### 제품 관리 (`products.html`)
- 제품코드/제품명으로 검색, 카테고리 필터
- **제품 등록** 버튼으로 신규 등록
- 행 클릭 시 해당 제품의 단가 히스토리 페이지로 이동
- 이력이 없는 제품만 삭제 가능

### 단가 변경 등록 (`price-change.html`)
- 제품 선택 → 현재 단가 자동 표시
- 변경 후 단가 입력 시 변동률 실시간 계산 (인상: 빨간 ▲, 인하: 파란 ▼)
- 현재 단가와 동일 금액 입력 시 경고 표시
- 저장 시 `price_history` 시트에 기록 + `products` 현재 단가 자동 업데이트

### 전체 이력 조회 (`history.html`)
- 기간/제품/거래처/사유코드 복합 필터
- 20건 단위 페이지네이션
- **CSV 다운로드** 버튼 (파일명: `단가변경이력_YYYYMMDD.csv`)

### 사유코드 관리 (`settings.html`)
- 사유코드 추가/수정/비활성화
- 비활성화된 코드는 단가 변경 등록 드롭다운에서 숨겨짐
- 코드 삭제 불가 (이력 추적 보존)

---

## ❓ 자주 묻는 질문

**Q. API 호출이 안 됩니다.**
- `config.js`의 URL이 올바른지 확인
- Apps Script 배포가 "모든 사용자" 접근으로 설정되었는지 확인
- 코드 수정 후 반드시 **재배포** 필요

**Q. 데이터가 업데이트되지 않습니다.**
- Apps Script 코드 수정 후에는 새 버전으로 재배포해야 반영됩니다.

**Q. 조직 내부에서만 사용하고 싶습니다.**
- Apps Script 배포 시 "액세스 권한"을 **조직 내 사용자만** 으로 설정

---

## 🔧 기술 스택

| 항목 | 기술 |
|------|------|
| 프론트엔드 | HTML + Tailwind CSS + Vanilla JS |
| 차트 | Chart.js |
| 백엔드 | Google Apps Script (Web App) |
| 데이터베이스 | Google Spreadsheet |
| 호스팅 | GitHub Pages |
