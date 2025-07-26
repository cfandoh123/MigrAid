//
//  EnhancedMainTabView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData

struct EnhancedMainTabView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var userSettings: [UserSettings]
    @State private var showingAdminAccess = false
    @State private var isAdminMode = false
    
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
            
            EnhancedVoiceView()
                .tabItem {
                    Image(systemName: "mic.fill")
                    Text("Voice")
                }
            
            ICEReportView()
                .tabItem {
                    Image(systemName: "exclamationmark.triangle.fill")
                    Text("ICE Alert")
                }
            
            EnhancedOfflineView()
                .tabItem {
                    Image(systemName: "arrow.down.circle.fill")
                    Text("Offline")
                }
            
            EnhancedSettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Settings")
                }
        }
        .accentColor(.accentColor)
        .sheet(isPresented: $showingAdminAccess) {
            AdminDashboardView()
        }
        .onAppear {
            checkAdminAccess()
        }
    }
    
    private func checkAdminAccess() {
        // Check if user has admin privileges
        // This would typically check against a backend service
        if let settings = userSettings.first {
            // For demo purposes, enable admin mode if user has specific settings
            isAdminMode = settings.language == "admin"
        }
    }
}

struct EnhancedSettingsView: View {
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var authManager: AuthenticationManager
    @Query private var userSettings: [UserSettings]
    @State private var selectedLanguage: Language = .english
    @State private var isAnonymousMode = true
    @State private var locationEnabled = false
    @State private var voiceEnabled = true
    @State private var showingAccessibility = false
    @State private var showingAdminDashboard = false
    @State private var showingBlockchainRewards = false
    @State private var showingEncryptionInfo = false
    @State private var showingLogoutAlert = false
    
    var body: some View {
        NavigationView {
            List {
                Section("Language & Localization") {
                    Picker("Language", selection: $selectedLanguage) {
                        ForEach(Language.allCases, id: \.self) { language in
                            Text(language.displayName).tag(language)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                }
                
                Section("Privacy & Security") {
                    Toggle("Anonymous Mode", isOn: $isAnonymousMode)
                    Toggle("Location Services", isOn: $locationEnabled)
                        .disabled(isAnonymousMode)
                    
                    Button("Encryption Information") {
                        showingEncryptionInfo = true
                    }
                }
                
                Section("Accessibility") {
                    Toggle("Voice Assistant", isOn: $voiceEnabled)
                    
                    Button("Accessibility Settings") {
                        showingAccessibility = true
                    }
                }
                
                Section("Advanced Features") {
                    Button("Blockchain Rewards") {
                        showingBlockchainRewards = true
                    }
                    
                    Button("Admin Dashboard") {
                        showingAdminDashboard = true
                    }
                }
                
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("2.0.0")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("Build")
                        Spacer()
                        Text("2024.1")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section("Support") {
                    Button("Privacy Policy") {
                        // Open privacy policy
                    }
                    
                    Button("Terms of Service") {
                        // Open terms of service
                    }
                    
                    Button("Contact Support") {
                        // Open contact support
                    }
                }
                
                Section("Account") {
                    Button("Logout") {
                        showingLogoutAlert = true
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
        .onAppear {
            loadUserSettings()
        }
        .onChange(of: selectedLanguage) { _ in
            saveUserSettings()
        }
        .onChange(of: isAnonymousMode) { _ in
            saveUserSettings()
        }
        .onChange(of: locationEnabled) { _ in
            saveUserSettings()
        }
        .onChange(of: voiceEnabled) { _ in
            saveUserSettings()
        }
        .sheet(isPresented: $showingAccessibility) {
            EnhancedAccessibilityView()
        }
        .sheet(isPresented: $showingAdminDashboard) {
            AdminDashboardView()
        }
        .sheet(isPresented: $showingBlockchainRewards) {
            BlockchainRewardsView()
        }
        .sheet(isPresented: $showingEncryptionInfo) {
            EncryptionInfoView()
        }
        .alert("Logout", isPresented: $showingLogoutAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Logout", role: .destructive) {
                logout()
            }
        } message: {
            Text("Are you sure you want to logout? This will clear your settings.")
        }
    }
    
    private func loadUserSettings() {
        if let settings = userSettings.first {
            selectedLanguage = Language(rawValue: settings.language) ?? .english
            isAnonymousMode = settings.isAnonymousMode
            locationEnabled = settings.locationEnabled
            voiceEnabled = settings.voiceEnabled
        }
    }
    
    private func saveUserSettings() {
        if let settings = userSettings.first {
            settings.language = selectedLanguage.rawValue
            settings.isAnonymousMode = isAnonymousMode
            settings.locationEnabled = locationEnabled
            settings.voiceEnabled = voiceEnabled
        } else {
            let newSettings = UserSettings(
                language: selectedLanguage.rawValue,
                isAnonymousMode: isAnonymousMode,
                locationEnabled: locationEnabled,
                voiceEnabled: voiceEnabled
            )
            modelContext.insert(newSettings)
        }
    }
    
    private func logout() {
        // Clear user settings from database
        for setting in userSettings {
            modelContext.delete(setting)
        }
        
        // Logout using authentication manager
        authManager.logout()
    }
}

// MARK: - Enhanced Home View with Advanced Features
struct EnhancedHomeView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var resources: [Resource]
    @Query private var userSettings: [UserSettings]
    @State private var searchText = ""
    @State private var showingVoiceInput = false
    @State private var selectedCategory: ResourceCategory?
    @State private var showingEmergencyMode = false
    @State private var showingCommunityVerification = false
    
    var filteredResources: [Resource] {
        if let category = selectedCategory {
            return resources.filter { $0.category == category }
        }
        if !searchText.isEmpty {
            return resources.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
        return resources
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Emergency Mode Banner
                if showingEmergencyMode {
                    EmergencyModeBanner()
                }
                
                // Search Bar with Voice
                EnhancedSearchBar(
                    searchText: $searchText,
                    showingVoiceInput: $showingVoiceInput
                )
                
                // Enhanced Resources List - Show immediately when there are resources
                if !filteredResources.isEmpty {
                    EnhancedResourcesList(resources: filteredResources)
                } else {
                    // Show category grid only when no resources are available
                    if selectedCategory == nil && searchText.isEmpty {
                        EnhancedCategoryGrid(
                            selectedCategory: $selectedCategory,
                            showingCommunityVerification: $showingCommunityVerification
                        )
                    } else {
                        EmptyStateView()
                    }
                }
            }
            .navigationTitle("MigrAid")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                if selectedCategory != nil {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button("Back") {
                            selectedCategory = nil
                        }
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Emergency") {
                        showingEmergencyMode.toggle()
                    }
                    .foregroundColor(.red)
                }
            }
        }
        .sheet(isPresented: $showingVoiceInput) {
            EnhancedVoiceView()
        }
        .sheet(isPresented: $showingCommunityVerification) {
            CommunityVerificationView()
        }
    }
}

struct EmergencyModeBanner: View {
    var body: some View {
        HStack {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(.white)
            
            Text("EMERGENCY MODE - Quick access to critical resources")
                .font(.caption)
                .fontWeight(.semibold)
                .foregroundColor(.white)
            
            Spacer()
        }
        .padding()
        .background(Color.red)
    }
}

struct EnhancedSearchBar: View {
    @Binding var searchText: String
    @Binding var showingVoiceInput: Bool
    
    var body: some View {
        HStack {
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                
                TextField("Search resources...", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                
                if !searchText.isEmpty {
                    Button(action: {
                        searchText = ""
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.gray)
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            Button(action: {
                showingVoiceInput = true
            }) {
                Image(systemName: "mic.fill")
                    .font(.title2)
                    .foregroundColor(.white)
                    .padding(12)
                                                .background(Color.accentColor)
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }
}

struct EnhancedCategoryGrid: View {
    @Binding var selectedCategory: ResourceCategory?
    @Binding var showingCommunityVerification: Bool
    
    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 16), count: 2), spacing: 16) {
            ForEach(ResourceCategory.allCases, id: \.self) { category in
                EnhancedCategoryCard(
                    category: category,
                    onTap: {
                        selectedCategory = category
                    }
                )
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }
}

struct EnhancedCategoryCard: View {
    let category: ResourceCategory
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 12) {
                Image(systemName: category.icon)
                    .font(.system(size: 40))
                    .foregroundColor(.white)
                
                Text(category.rawValue)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                // Verification badge for verified categories
                if category == .clinics || category == .legalAid {
                    HStack {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.caption)
                        Text("Verified")
                            .font(.caption)
                    }
                    .foregroundColor(.white.opacity(0.8))
                }
            }
            .frame(height: 140)
            .frame(maxWidth: .infinity)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(category.color))
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct EnhancedResourcesList: View {
    let resources: [Resource]
    
    var body: some View {
        List(resources) { resource in
            NavigationLink(destination: EnhancedResourceDetailView(resource: resource)) {
                EnhancedResourceRowView(resource: resource)
            }
        }
        .listStyle(PlainListStyle())
        .padding(.top, 0)
        .padding(.bottom, 0)
        .listRowInsets(EdgeInsets())
    }
}

struct EnhancedResourceRowView: View {
    let resource: Resource
    @State private var showingVerification = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(resource.name)
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Text(resource.category.rawValue)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color(resource.category.color).opacity(0.2))
                        )
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    if resource.isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.green)
                            .font(.title2)
                    } else {
                        Button("Verify") {
                            showingVerification = true
                        }
                        .font(.caption)
                        .foregroundColor(.orange)
                    }
                    
                    if resource.isOffline {
                        Image(systemName: "lock.fill")
                            .foregroundColor(.teal)
                            .font(.caption)
                    }
                }
            }
            
            Text(resource.resourceDescription)
                .font(.body)
                .foregroundColor(.secondary)
                .lineLimit(2)
            
            HStack {
                Image(systemName: "location")
                    .foregroundColor(.gray)
                Text(resource.address)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Image(systemName: "clock")
                    .foregroundColor(.gray)
                Text(resource.hours)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            // Languages with enhanced display
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(resource.languages, id: \.self) { language in
                        Text(language)
                            .font(.caption2)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(Color.accentColor.opacity(0.2))
                            )
                    }
                }
            }
        }
        .padding(.vertical, 8)
        .sheet(isPresented: $showingVerification) {
            ResourceVerificationView(resource: resource)
        }
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            
            Text("No resources found")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Try searching for something else or browse by category")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct EnhancedResourceDetailView: View {
    let resource: Resource
    @Environment(\.modelContext) private var modelContext
    @State private var showingMap = false
    @State private var showingVerification = false
    @State private var showingBlockchainReward = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Enhanced Header
                EnhancedResourceHeader(resource: resource)
                
                // Contact Information with Enhanced Features
                EnhancedContactSection(resource: resource, showingMap: $showingMap)
                
                // Languages with Enhanced Display
                EnhancedLanguagesSection(resource: resource)
                
                // Verification and Blockchain Section
                EnhancedVerificationSection(
                    resource: resource,
                    showingVerification: $showingVerification,
                    showingBlockchainReward: $showingBlockchainReward
                )
                
                // Offline Toggle with Encryption Info
                EnhancedOfflineSection(resource: resource)
            }
            .padding()
        }
        .navigationTitle(resource.name)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingMap) {
            ResourceMapView(resource: resource)
        }
        .sheet(isPresented: $showingVerification) {
            ResourceVerificationView(resource: resource)
        }
        .sheet(isPresented: $showingBlockchainReward) {
            BlockchainRewardsView()
        }
    }
}

struct EnhancedResourceHeader: View {
    let resource: Resource
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(resource.name)
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text(resource.category.rawValue)
                        .font(.headline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                VStack(spacing: 8) {
                    if resource.isVerified {
                        VStack {
                            Image(systemName: "checkmark.seal.fill")
                                .foregroundColor(.green)
                                .font(.title)
                            Text("Verified")
                                .font(.caption)
                                .foregroundColor(.green)
                        }
                    }
                    
                    if resource.isOffline {
                        VStack {
                            Image(systemName: "lock.shield.fill")
                                .foregroundColor(.teal)
                                .font(.title2)
                            Text("Encrypted")
                                .font(.caption)
                                .foregroundColor(.teal)
                        }
                    }
                }
            }
            
            Text(resource.resourceDescription)
                .font(.body)
                .foregroundColor(.secondary)
        }
    }
}

struct EnhancedContactSection: View {
    let resource: Resource
    @Binding var showingMap: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Contact Information")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                HStack {
                    Image(systemName: "phone.fill")
                        .foregroundColor(.teal)
                    Text(resource.phone)
                    Spacer()
                    Button("Call") {
                        if let url = URL(string: "tel:\(resource.phone.replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "(", with: "").replacingOccurrences(of: ")", with: "").replacingOccurrences(of: "-", with: ""))") {
                            UIApplication.shared.open(url)
                        }
                    }
                    .foregroundColor(.teal)
                }
                
                HStack {
                    Image(systemName: "location.fill")
                        .foregroundColor(.teal)
                    Text(resource.address)
                    Spacer()
                    if resource.latitude != nil && resource.longitude != nil {
                        Button("Map") {
                            showingMap = true
                        }
                        .foregroundColor(.teal)
                    }
                }
                
                HStack {
                    Image(systemName: "clock.fill")
                        .foregroundColor(.teal)
                    Text(resource.hours)
                    Spacer()
                }
            }
        }
    }
}

struct EnhancedLanguagesSection: View {
    let resource: Resource
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Languages Supported")
                .font(.headline)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                ForEach(resource.languages, id: \.self) { language in
                    Text(language)
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 8)
                                .fill(Color.accentColor.opacity(0.2))
                        )
                }
            }
        }
    }
}

struct EnhancedVerificationSection: View {
    let resource: Resource
    @Binding var showingVerification: Bool
    @Binding var showingBlockchainReward: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Verification & Rewards")
                .font(.headline)
                .fontWeight(.semibold)
            
            HStack {
                if resource.isVerified {
                    VStack {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.green)
                            .font(.title2)
                        Text("Verified")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                } else {
                    Button("Verify Resource") {
                        showingVerification = true
                    }
                    .foregroundColor(.orange)
                }
                
                Spacer()
                
                Button("View Rewards") {
                    showingBlockchainReward = true
                }
                .foregroundColor(.orange)
            }
        }
    }
}

struct EnhancedOfflineSection: View {
    let resource: Resource
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Offline Access")
                .font(.headline)
                .fontWeight(.semibold)
            
            Toggle("Save for offline use (encrypted)", isOn: Binding(
                get: { resource.isOffline },
                set: { newValue in
                    resource.isOffline = newValue
                }
            ))
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            if resource.isOffline {
                Text("This resource is encrypted and available offline")
                    .font(.caption)
                    .foregroundColor(.accentColor)
            }
        }
    }
}

struct CommunityVerificationView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 80))
                    .foregroundColor(.green)
                
                Text("Community Verification")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Help verify resources in your community to earn blockchain rewards and keep information accurate.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.secondary)
                
                VStack(spacing: 12) {
                    Button("Verify a Resource") {
                        // Navigate to resource verification
                    }
                    .buttonStyle(.borderedProminent)
                    
                    Button("View Verification Guidelines") {
                        // Show guidelines
                    }
                    .buttonStyle(.bordered)
                }
            }
            .padding()
            .navigationTitle("Community Verification")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
} 