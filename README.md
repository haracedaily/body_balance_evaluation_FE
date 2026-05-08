This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 2026-05-08
[FIX] 화면 개선.v1

**4단계 Wizard UI**: 사진 업로드 → 인바디 데이터 → 설문 → 결과 순으로 진행

**사진 업로드**: 정면 사진(필수)과 측면 사진(선택)을 업로드하며, 미리보기 제공

**인바디 데이터 입력**: 체중, 골격근량, 체지방량, 체지방률, BMI 입력 폼

**설문 작성**: 통증 부위, 운동 경험, 운동 목표를 입력

**결과 표시**: 자세 분석 결과, 추천 운동, 스트레칭 등을 카드 형태로 시각화
