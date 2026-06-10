export default function FloatingCard({ children, className = '' }: { children: React.ReactNode; className?: string; }) {
    return (
        <div className={`bg-card/40 dark:bg-card/10 backdrop-blur-md border border-border/40 dark:border-border/10 rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-none hover:bg-card/65 dark:hover:bg-card/15 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
}

