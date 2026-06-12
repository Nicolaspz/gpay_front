import { api } from "@/services/apiClients";
import type { LoginResponse, SignInCredentials, SignUpCredentials, User } from "@/types/global";

export const AuthService = {
  async me(): Promise<User> {
    const { data } = await api.get<User>("/me");
    return data;
  },

  async signIn(credentials: SignInCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/login", credentials);
    return data;
  },

  async signUp(credentials: SignUpCredentials) {
    const { data } = await api.post("/users", {
      name: credentials.name,
      email: credentials.email,
      role: credentials.role,
      user_name: credentials.user_name,
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
};
