import app from "./app.js";
import connectDB from "./config/db.js";

// This file is ONLY used for local development (npm run dev / npm start locally).
// On Vercel, api/index.js is the entry point instead — app.listen() never runs there.

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
