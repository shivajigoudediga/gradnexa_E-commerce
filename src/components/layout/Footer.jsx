import { Link } from 'react-router-dom'
import { Share2, MessageCircle, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#262626] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold gradient-text font-[Space_Grotesk] mb-2">GradNexa Wear</h3>
            <p className="text-gray-400 text-sm mb-4">Wear Your Vibe</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium custom fashion and streetwear. DTF printed anime tees, hoodies, and coding apparel.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/shop" className="hover:text-purple-400 transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=anime" className="hover:text-purple-400 transition-colors">Anime Collection</Link></li>
              <li><Link to="/shop?category=hoodies" className="hover:text-purple-400 transition-colors">Hoodies</Link></li>
              <li><Link to="/shop?category=coding" className="hover:text-purple-400 transition-colors">Coding Collection</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="p-2 bg-[#141414] rounded-lg hover:bg-purple-500/20 transition-colors"><Share2 size={18} /></a>
              <a href="#" className="p-2 bg-[#141414] rounded-lg hover:bg-purple-500/20 transition-colors"><MessageCircle size={18} /></a>
              <a href="#" className="p-2 bg-[#141414] rounded-lg hover:bg-purple-500/20 transition-colors"><Mail size={18} /></a>
            </div>
            <p className="text-sm text-gray-500">Subscribe for exclusive drops</p>
          </div>
        </div>
        <div className="border-t border-[#262626] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 GradNexa Wear. All rights reserved.</p>
          <p className="text-sm text-gray-600">Crafted with DTF printing excellence</p>
        </div>
      </div>
    </footer>
  )
}
