// services/api/client.ts
import axios from "axios";

/**
 * Axios 인스턴스
 * - baseURL: Django 서버 주소
 * - 요청 시 localStorage에 저장된 "access_token"을 헤더에 첨부
 */
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Django DRF 서버
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // 만약 URL이 /users/register 또는 /users/login 이라면 Authorization 제거
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
/**
 * Allow Any Axios 인스턴스
 * - baseURL: Django 서버 주소
 * - 인증 헤더 없음
 */
export const allowAnyApiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});