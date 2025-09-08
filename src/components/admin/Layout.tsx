export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</div>
    </div>
  );
}
