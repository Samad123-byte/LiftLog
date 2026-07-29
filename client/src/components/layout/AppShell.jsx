import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-void">
      <Sidebar />
      <MobileNav />

      <main className="min-h-screen px-4 pb-28 pt-24 sm:px-6 lg:ml-[268px] lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
        <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-[1500px]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
