import "@testing-library/jest-dom";

import { server } from "./mocks/server";

// 모든 테스트 서버를 생성
beforeAll(() => server.listen());

// 테스트 이후에 핸들러 초기화
afterEach(() => server.resetHandlers());

// 테스트 이후에 서버 종료
afterAll(() => server.close());