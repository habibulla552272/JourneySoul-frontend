import React from 'react'

const Footer = () => {
  return (
    <section className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column - Contact & Publisher */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact the Publisher</h3>
              <p className="text-gray-300 text-sm">mike@umocom</p>
              <p className="text-gray-300 text-sm mt-1">4944 450 804 505</p>
            </div>
          </div>

          {/* Middle Column - Links */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Explorate</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Job Opportunities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Advertise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Membership</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Headquarter</h3>
              <address className="text-sm text-gray-300 not-italic">
                BJ Middleville Road,<br />
                NY 1001, Sydney<br />
                Australia
              </address>
            </div>
          </div>

          {/* Right Column - Connections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Connections</h3>
            <div className="flex space-x-4">
              {/* Social media icons would go here */}
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                <span className="text-xs">FB</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                <span className="text-xs">TW</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                <span className="text-xs">IN</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                <span className="text-xs">IG</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* Bottom Border */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 UmoCom. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Footer