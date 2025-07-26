import SwiftUI
import SwiftData

class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: String = ""
    
    static let shared = AuthenticationManager()
    
    private init() {}
    
    func login(username: String) {
        currentUser = username
        isAuthenticated = true
    }
    
    func logout() {
        currentUser = ""
        isAuthenticated = false
    }
} 