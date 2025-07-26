import SwiftUI
import LocalAuthentication

struct LoginView: View {
    @EnvironmentObject private var authManager: AuthenticationManager
    @State private var username = ""
    @State private var password = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var isLoading = false
    @State private var showForgotPassword = false
    @State private var showCreateAccount = false
    @State private var useBiometric = false
    @State private var biometricType: LABiometryType = .none
    
    // Mock credentials for demo
    private let mockCredentials = [
        "user": "password123",
        "admin": "admin123",
        "advocate": "help123",
        "demo": "demo123"
    ]
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                LinearGradient(
                    gradient: Gradient(colors: [Color.accentColor.opacity(0.1), Color.white]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 30) {
                        // Logo and title
                        VStack(spacing: 20) {
                            MigrAidLogoView(size: 80)
                            
                            Text("MigrAid")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.primary)
                            
                            Text("Safe • Secure • Supportive")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .padding(.top, 60)
                        
                        // Login form
                        VStack(spacing: 20) {
                            // Username field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Username")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                HStack {
                                    Image(systemName: "person.fill")
                                        .foregroundColor(.gray)
                                    TextField("Enter username", text: $username)
                                        .textFieldStyle(PlainTextFieldStyle())
                                        .autocapitalization(.none)
                                        .disableAutocorrection(true)
                                }
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                            }
                            
                            // Password field
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Password")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                HStack {
                                    Image(systemName: "lock.fill")
                                        .foregroundColor(.gray)
                                    SecureField("Enter password", text: $password)
                                        .textFieldStyle(PlainTextFieldStyle())
                                }
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                            }
                            

                            
                            // Login button
                            Button(action: performLogin) {
                                HStack {
                                    if isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                            .scaleEffect(0.8)
                                    } else {
                                        Image(systemName: "arrow.right")
                                    }
                                    Text("Sign In")
                                        .fontWeight(.semibold)
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.accentColor)
                                .cornerRadius(12)
                            }
                            .disabled(username.isEmpty || password.isEmpty || isLoading)
                            .opacity((username.isEmpty || password.isEmpty) ? 0.6 : 1.0)
                            
                            // Biometric login
                            if biometricType != .none {
                                Button(action: authenticateWithBiometric) {
                                    HStack {
                                        Image(systemName: biometricType == .faceID ? "faceid" : "touchid")
                                        Text("Sign in with \(biometricType == .faceID ? "Face ID" : "Touch ID")")
                                    }
                                    .foregroundColor(.accentColor)
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.accentColor.opacity(0.1))
                                    .cornerRadius(12)
                                }
                                .disabled(isLoading)
                            }
                        }
                        .padding(.horizontal, 30)
                        
                        // Additional options
                        VStack(spacing: 15) {
                            Button("Forgot Password?") {
                                showForgotPassword = true
                            }
                            .foregroundColor(.accentColor)
                            
                            HStack {
                                Text("Don't have an account?")
                                    .foregroundColor(.secondary)
                                Button("Create Account") {
                                    showCreateAccount = true
                                }
                                .foregroundColor(.accentColor)
                            }
                        }
                        
                        Spacer()
                    }
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            checkBiometricAvailability()
        }
        .alert("Login", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
        .sheet(isPresented: $showForgotPassword) {
            ForgotPasswordView()
        }
        .sheet(isPresented: $showCreateAccount) {
            CreateAccountView()
        }

    }
    
    private func performLogin() {
        isLoading = true
        
        // Simulate network delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            
            if let storedPassword = mockCredentials[username.lowercased()] {
                if password == storedPassword {
                    // Successful login
                    authManager.login(username: username)
                    alertMessage = "Welcome back, \(username)!"
                    showAlert = true
                } else {
                    alertMessage = "Incorrect password. Please try again."
                    showAlert = true
                }
            } else {
                alertMessage = "User not found. Please check your username."
                showAlert = true
            }
        }
    }
    
    private func authenticateWithBiometric() {
        let context = LAContext()
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            let reason = "Sign in to MigrAid securely"
            
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
                DispatchQueue.main.async {
                    if success {
                        // Use demo credentials for biometric login
                        username = "demo"
                        password = "demo123"
                        performLogin()
                    } else {
                        alertMessage = "Biometric authentication failed. Please try again."
                        showAlert = true
                    }
                }
            }
        } else {
            alertMessage = "Biometric authentication not available."
            showAlert = true
        }
    }
    
    private func checkBiometricAvailability() {
        let context = LAContext()
        var error: NSError?
        
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            biometricType = context.biometryType
        }
    }
}

struct ForgotPasswordView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                VStack(spacing: 15) {
                    MigrAidLogoView(size: 60)
                    
                    Text("Reset Password")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    Text("Enter your email address and we'll send you a link to reset your password.")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Email Address")
                            .font(.headline)
                        
                        TextField("Enter your email", text: $email)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                    }
                    
                    Button("Send Reset Link") {
                        // Mock password reset
                        alertMessage = "If an account exists for \(email), you will receive a password reset link shortly."
                        showAlert = true
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.accentColor)
                    .cornerRadius(12)
                    .disabled(email.isEmpty)
                }
                .padding(.horizontal, 30)
                
                Spacer()
            }
            .padding(.top, 50)
            .navigationTitle("Forgot Password")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
        .alert("Password Reset", isPresented: $showAlert) {
            Button("OK") {
                if alertMessage.contains("you will receive") {
                    dismiss()
                }
            }
        } message: {
            Text(alertMessage)
        }
    }
}

struct CreateAccountView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var username = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 30) {
                    VStack(spacing: 15) {
                        MigrAidLogoView(size: 60)
                        
                        Text("Create Account")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("Join MigrAid to access resources and support your community.")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    
                    VStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Username")
                                .font(.headline)
                            
                            TextField("Choose a username", text: $username)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Email Address")
                                .font(.headline)
                            
                            TextField("Enter your email", text: $email)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .keyboardType(.emailAddress)
                                .autocapitalization(.none)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Password")
                                .font(.headline)
                            
                            SecureField("Create a password", text: $password)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Confirm Password")
                                .font(.headline)
                            
                            SecureField("Confirm your password", text: $confirmPassword)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        
                        Button(action: createAccount) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                        .scaleEffect(0.8)
                                } else {
                                    Image(systemName: "person.badge.plus")
                                }
                                Text("Create Account")
                                    .fontWeight(.semibold)
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.accentColor)
                            .cornerRadius(12)
                        }
                        .disabled(!isValidForm || isLoading)
                        .opacity(isValidForm ? 1.0 : 0.6)
                    }
                    .padding(.horizontal, 30)
                }
                .padding(.top, 30)
            }
            .navigationTitle("Create Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
        .alert("Account Creation", isPresented: $showAlert) {
            Button("OK") {
                if alertMessage.contains("Account created successfully") {
                    dismiss()
                }
            }
        } message: {
            Text(alertMessage)
        }
    }
    
    private var isValidForm: Bool {
        !username.isEmpty && !email.isEmpty && !password.isEmpty && 
        password == confirmPassword && password.count >= 6
    }
    
    private func createAccount() {
        isLoading = true
        
        // Simulate account creation
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            isLoading = false
            
            if isValidForm {
                alertMessage = "Account created successfully! You can now sign in with your credentials."
                showAlert = true
            } else {
                alertMessage = "Please fill in all fields correctly and ensure passwords match."
                showAlert = true
            }
        }
    }
}

#Preview {
    LoginView()
} 