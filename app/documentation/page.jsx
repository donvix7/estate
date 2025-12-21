import React from 'react'

const page = () => {
  return (
    <div className="bg-white p-6 space-y-6 max-w-6xl mx-auto">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Features Card - Left Column */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-xl">🛡️</span>
              </div>
              <h4 className="text-xl font-bold text-green-900">Security Features</h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200">
                <span className="text-green-600 mr-3 mt-1">🔒</span>
                <div>
                  <p className="font-medium text-green-800">Unique Estate-Specific Links</p>
                  <p className="text-sm text-green-700 mt-1">Each invitation link is unique and estate-specific</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200">
                <span className="text-green-600 mr-3 mt-1">⏳</span>
                <div>
                  <p className="font-medium text-green-800">Automatic Link Expiry</p>
                  <p className="text-sm text-green-700 mt-1">Links expire after 7 days automatically</p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200">
                <span className="text-green-600 mr-3 mt-1">🏢</span>
                <div>
                  <p className="font-medium text-green-800">Restricted Registration</p>
                  <p className="text-sm text-green-700 mt-1">
                    Users can only register for <strong className="text-green-900 px-2 py-1 bg-green-100 rounded">{"adminEstate"}</strong>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200">
                <span className="text-green-600 mr-3 mt-1">👮</span>
                <div>
                  <p className="font-medium text-green-800">Admin-Only Authorization</p>
                  <p className="text-sm text-green-700 mt-1">Only authorized admins can send invitations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authorization Process Card - Right Column */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-xl">🔐</span>
            </div>
            <h4 className="text-xl font-bold text-blue-900">Authorization Process</h4>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: "1️⃣", title: "Admin Authentication", desc: "Admin logged into", highlight: "adminEstate" },
              { icon: "2️⃣", title: "Estate Identifier", desc: "Estate identifier", code: "adminEstateId", extra: "is embedded in links" },
              { icon: "3️⃣", title: "Invitation Sent", desc: "User receives email with unique, time-limited invitation link" },
              { icon: "4️⃣", title: "Link Validation", desc: "Link validates estate identifier during registration" },
              { icon: "5️⃣", title: "Automatic Authorization", desc: "User account is automatically authorized only for this estate" }
            ].map((step, index) => (
              <div key={index} className="flex items-start p-3 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200">
                <span className="mr-3 text-lg">{step.icon}</span>
                <div>
                  <p className="font-medium text-blue-800">{step.title}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {step.desc} 
                    {step.highlight && (
                      <strong className="text-blue-900 px-2 py-1 bg-blue-100 rounded mx-1">
                        {step.highlight}
                      </strong>
                    )}
                    {step.code && (
                      <code className="text-xs px-2 py-1 bg-blue-100 text-blue-900 rounded font-mono mx-1">
                        {step.code}
                      </code>
                    )}
                    {step.extra}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section - Broadcast Information */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
            <span className="text-2xl">📢</span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-purple-900">Broadcast Distribution</h4>
            <p className="text-sm text-purple-700">Messages will be sent to multiple platforms</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>
              Broadcasts will be sent to:
            </h5>
            <ul className="space-y-3">
              {[
                { icon: "👥", text: "All residents via notifications" },
                { icon: "👨‍💼", text: "Admin dashboard" },
                { icon: "👮", text: "Other security personnel" },
                { icon: "📊", text: "Announcements log (stored for 30 days)" }
              ].map((item, index) => (
                <li key={index} className="flex items-center p-3 bg-white/70 rounded-lg hover:bg-white transition-colors duration-200">
                  <span className="text-purple-600 mr-3">{item.icon}</span>
                  <span className="text-purple-800">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Priority Levels:
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-600 mr-3">🚨</span>
                  <span className="font-medium text-red-800">Emergency</span>
                </div>
                <span className="text-sm text-red-700 px-3 py-1 bg-red-100 rounded-full">High Priority</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-orange-600 mr-3">⚠️</span>
                  <span className="font-medium text-orange-800">Security Update</span>
                </div>
                <span className="text-sm text-orange-700 px-3 py-1 bg-orange-100 rounded-full">Medium Priority</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-3">📢</span>
                  <span className="font-medium text-blue-800">General Announcement</span>
                </div>
                <span className="text-sm text-blue-700 px-3 py-1 bg-blue-100 rounded-full">Normal Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - What Happens Next */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
            <span className="text-2xl">📧</span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">What Happens Next?</h4>
            <p className="text-sm text-gray-700">Step-by-step invitation process</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { icon: "📨", title: "Email Delivery", desc: "User receives email with invitation link" },
              { icon: "🔗", title: "Unique Link", desc: "Link contains unique token with estate identifier" },
              { icon: "👆", title: "User Action", desc: "User clicks link to complete registration" }
            ].map((step, index) => (
              <div key={index} className="flex items-start p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[
              { icon: "🏢", title: "Estate Assignment", desc: "Account is automatically authorized for", highlight: "adminEstate" },
              { icon: "⏳", title: "Security Expiry", desc: "Link expires in 7 days for security" },
              { icon: "✅", title: "Completion", desc: "User gains access to estate-specific features" }
            ].map((step, index) => (
              <div key={index} className="flex items-start p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {step.desc} 
                    {step.highlight && (
                      <strong className="text-gray-900 px-2 py-1 bg-gray-100 rounded mx-1">
                        {step.highlight}
                      </strong>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">💡</span>
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Always verify user details before sending invitations. 
              Double-check email addresses to ensure they're delivered to the right person.
            </p>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default page