export default function FloatingCard ({ children, className = '' }: {children: React.ReactNode; className?: string;}) {
    return (
        <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
}