import http from "./http";

export const exerciseApi = {
  getAll: () => http.get("/exercises"),
  getById: (id) => http.get(`/exercises/${id}`),
  create: (formData) =>
    http.post("/exercises", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    http.put(`/exercises/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => http.delete(`/exercises/${id}`),
};
