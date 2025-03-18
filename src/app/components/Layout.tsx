// src/app/components/Layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        {/* Server components can't directly include client components without a client boundary */}
        {children}
      </div>
    );
  }