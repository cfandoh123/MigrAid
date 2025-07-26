import SwiftUI

class LocalizationManager: ObservableObject {
    static let shared = LocalizationManager()
    @Published var currentLanguage: Language = .english
    
    // Simple translation dictionary for demo (expand as needed)
    private let translations: [Language: [String: String]] = [
        .english: [:],
        .spanish: [
            "Welcome": "Bienvenido",
            "Safe • Secure • Supportive": "Seguro • Protegido • Solidario",
            "Sign In": "Iniciar sesión",
            "Username": "Nombre de usuario",
            "Password": "Contraseña",
            "Forgot Password?": "¿Olvidó su contraseña?",
            "Create Account": "Crear cuenta",
            "Home": "Inicio",
            "Voice": "Voz",
            "ICE Alert": "Alerta ICE",
            "Offline": "Sin conexión",
            "Settings": "Configuración",
            "Search resources...": "Buscar recursos...",
            "No resources found": "No se encontraron recursos",
            "Try searching for something else or browse by category": "Intente buscar otra cosa o explore por categoría",
            "Language": "Idioma",
            "Privacy": "Privacidad",
            "About": "Acerca de",
            "Support": "Soporte",
            "Logout": "Cerrar sesión",
            "Continue": "Continuar",
            "Get Started": "Comenzar",
            "Help for Everyone": "Ayuda para todos",
            "Select Your Language": "Seleccione su idioma",
            "Anonymous Mode": "Modo anónimo",
            "Location Mode": "Modo de ubicación",
            "Use without location access": "Usar sin acceso a la ubicación",
            "Get nearby resources and alerts": "Obtener recursos y alertas cercanas",
            "Your privacy is our priority. We never share your personal information.": "Su privacidad es nuestra prioridad. Nunca compartimos su información personal."
        ],
        .arabic: [:],
        .french: [:],
        .chinese: [:]
    ]
    
    func t(_ key: String) -> String {
        translations[currentLanguage]?[key] ?? key
    }
    
    func setLanguage(_ language: Language) {
        currentLanguage = language
    }
} 