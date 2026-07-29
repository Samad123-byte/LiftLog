import http from "./http";

export const recordApi = {
  getAll: () => http.get("/records"),
  update: (payload) => http.post("/records", payload),
  remove: (id) => http.delete(`/records/${id}`),
};
