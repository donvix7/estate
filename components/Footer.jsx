import React from 'react'

const Footer = () => {
  return (
    <div>
         {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">ES</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">EstateSecure</h3>
            <p className="text-gray-300 mb-6">Secure Estate Management PWA</p>
            <div className="mt-8 text-sm">
              <p className="text-gray-400 mb-2">© 2024 EstateSecure. All core features included.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Access Control</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Panic System</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Digital Payments</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Admin Dashboard</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full">Communication</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer