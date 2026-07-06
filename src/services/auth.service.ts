import { api } from "@/services/apiClients";
import type { LoginResponse, SignInCredentials, SignUpCredentials, User, ResetPasswordPayload } from "@/types/global";

export const AuthService = {
  async updateProfile(data: { fullname?: string; phone_number?: string }): Promise<User> {
    const { data: response } = await api.put<User>("/users", data);
    return response;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/me");

    // console.log("me service", data);
    return data;
  },

  async signIn(credentials: SignInCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/login", credentials);
    return data;
  },

  async signUp(credentials: SignUpCredentials) {
    const { data } = await api.post("/users", {
      fullname: credentials.fullname,
      email: credentials.email,
      phone_number: credentials.phone_number,
      password: credentials.password,
      confirmpassword: credentials.confirmpassword,
    });

    return data;
  },

  async uploadPhoto(photo: File): Promise<void> {
    const formData = new FormData();
    formData.append("photo", photo);
    await api.post("/users/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async updatePhoto(photo: File): Promise<void> {
    const formData = new FormData();
    formData.append("photo", photo);
    await api.put("/users/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deletePhoto(): Promise<void> {
    await api.delete("/users/photo");
  },

  async activate(token: string) {
    const { data } = await api.get("/activation", { params: { token } });
    return data;
  },

  async resetPassword(token: string, payload: ResetPasswordPayload) {
    const { data } = await api.post(`/auth/reset-password?token=${token}`, payload);
    return data;
  },
};
