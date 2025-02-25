export function Card({ children, className }) {
    return <div className={`p-4 border rounded bg-[#282828] ${className}`}>{children}</div>;
  }
  