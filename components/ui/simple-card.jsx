export function SimpleCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  )
}