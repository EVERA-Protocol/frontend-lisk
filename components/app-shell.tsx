import Footer from "./footer";
import Navbar from "./navbar";
import { Toaster } from "./ui/toaster";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      <div className="pt-10">{/* Space for the fixed navbar */}</div>
      {/* Main content area */}
      {children}
      <Footer />
      <Toaster />
    </main>
  );
};

export default AppShell;
