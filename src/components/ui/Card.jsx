export function Card({ children, className }) {
    return <div className={`p-4 border rounded bg-gray-800 ${className}`}>{children}</div>;
  }
  