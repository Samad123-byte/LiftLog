import http from "./http";

export const sessionApi = {
  getAll: () => http.get("/workout-sessions"),
  getById: (id) => http.get(`/workout-sessions/${id}`),
  create: (payload) => http.post("/workout-sessions", payload),
};
