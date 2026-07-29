import http from "./http";

export const userApi = {
  getProfile: () => http.get("/users/profile"),
  updateProfile: (payload) => http.put("/users/profile", payload),
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    return http.put("/users/profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
