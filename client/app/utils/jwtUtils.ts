import { jwtDecode } from "jwt-decode";


export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
