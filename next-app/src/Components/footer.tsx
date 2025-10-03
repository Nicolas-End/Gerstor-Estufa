
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h2 className="text-3xl font-bold"><img src="./public/Logo.png" alt="" /></h2>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 flex-grow">
            {/* Início */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Início</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Downloads
                  </a>
                </li>
              </ul>
            </div>

            {/* Sobre-nós */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Sobre-nós</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Informações da Empresa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Suporte */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Suporte</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Telefones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chat
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media and Contact Button */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            {/* Contact Button */}
            <p className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full">Contato</p>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-400 text-sm">© 2025 Copyright - Controle Verde</p>
        </div>
      </div>
    </footer>
  )
}
