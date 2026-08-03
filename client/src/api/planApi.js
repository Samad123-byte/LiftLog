import http from "./http";

export const planApi = {
  getAll: () => http.get("/workout-plans"),
  getToday: () => http.get("/workout-plans/today"),
  getUpcoming: () => http.get("/workout-plans/upcoming"),
  duplicate: (id) => http.post(`/workout-plans/${id}/duplicate`),
  getById: (id) => http.get(`/workout-plans/${id}`),
  create: (payload) => http.post("/workout-plans", payload),
  update: (id, payload) => http.put(`/workout-plans/${id}`, payload),
  remove: (id) => http.delete(`/workout-plans/${id}`),
};
