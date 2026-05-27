import './globals.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'TaskPulse',
  description: 'Agentic Workforce Intelligence',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100 font-sans">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
