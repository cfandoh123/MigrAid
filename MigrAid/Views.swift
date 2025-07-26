//
//  Views.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData
import MapKit

// MARK: - Voice Assistant View
struct VoiceAssistantView: View {
    @State private var isListening = false
    @State private var transcribedText = ""
    @State private var responseText = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                Spacer()
                
                // Voice Icon
                Image(systemName: isListening ? "waveform" : "mic.fill")
                    .font(.system(size: 100))
                    .foregroundColor(isListening ? .red : .teal)
                    .scaleEffect(isListening ? 1.2 : 1.0)
                    .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: isListening)
                
                Text(isListening ? "Listening..." : "Tap to ask for help")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .multilineTextAlignment(.center)
                
                if !transcribedText.isEmpty {
                    VStack(spacing: 12) {
                        Text("You said:")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        
                        Text(transcribedText)
                            .font(.body)
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                    }
                }
                
                if !responseText.isEmpty {
                    VStack(spacing: 12) {
                        Text("Response:")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        
                        Text(responseText)
                            .font(.body)
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)
                            .padding()
                            .background(Color.teal.opacity(0.1))
                            .cornerRadius(12)
                    }
                }
                
                Spacer()
                
                // Voice Button
                Button(action: {
                    isListening.toggle()
                    if isListening {
                        // Start voice recognition
                        transcribedText = "Find nearest clinic"
                        responseText = "I found 3 clinics near you. The closest is Community Health Clinic at 123 Main St."
                    } else {
                        // Stop voice recognition
                    }
                }) {
                    Image(systemName: isListening ? "stop.fill" : "mic.fill")
                        .font(.title)
                        .foregroundColor(.white)
                        .padding(40)
                        .background(
                            Circle()
                                .fill(isListening ? Color.red : Color.teal)
                        )
                }
                
                Spacer()
                
                // Example Phrases
                VStack(spacing: 12) {
                    Text("Try saying:")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    
                    VStack(spacing: 8) {
                        Text("• \"Find nearest clinic\"")
                        Text("• \"Where can I get food?\"")
                        Text("• \"I need legal help\"")
                        Text("• \"Report ICE activity\"")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
            }
            .padding()
            .navigationTitle("Voice Assistant")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

// MARK: - ICE Report View
struct ICEReportView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var reportText = ""
    @State private var location = ""
    @State private var isAnonymous = true
    @State private var showingConfirmation = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Warning Header
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.red)
                        
                        Text("ICE Activity Report")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        Text("Report ICE activity in your area to help keep the community safe")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding()
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(16)
                    
                    // Report Form
                    VStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("What did you see?")
                                .font(.headline)
                                .fontWeight(.semibold)
                            
                            TextEditor(text: $reportText)
                                .frame(minHeight: 120)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                )
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Location (optional)")
                                .font(.headline)
                                .fontWeight(.semibold)
                            
                            TextField("Enter location or address", text: $location)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                        
                        Toggle("Submit anonymously", isOn: $isAnonymous)
                            .font(.headline)
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                    }
                    
                    // Submit Button
                    Button(action: {
                        submitReport()
                    }) {
                        Text("Submit Report")
                            .font(.title3)
                            .fontWeight(.semibold)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.red)
                            )
                    }
                    .disabled(reportText.isEmpty)
                    .opacity(reportText.isEmpty ? 0.6 : 1.0)
                }
                .padding()
            }
            .navigationTitle("ICE Alert")
            .navigationBarTitleDisplayMode(.large)
            .alert("Report Submitted", isPresented: $showingConfirmation) {
                Button("OK") {
                    reportText = ""
                    location = ""
                }
            } message: {
                Text("Your report has been submitted anonymously. Thank you for helping keep the community safe.")
            }
        }
    }
    
    private func submitReport() {
        let report = ICEReport(
            description: reportText,
            location: location.isEmpty ? nil : location,
            isAnonymous: isAnonymous
        )
        modelContext.insert(report)
        showingConfirmation = true
    }
}

// MARK: - Offline Resources View
struct OfflineResourcesView: View {
    @Query private var resources: [Resource]
    @State private var showingDownloadOptions = false
    
    var offlineResources: [Resource] {
        resources.filter { $0.isOffline }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                if offlineResources.isEmpty {
                    VStack(spacing: 20) {
                        Image(systemName: "arrow.down.circle")
                            .font(.system(size: 80))
                            .foregroundColor(.gray)
                        
                        Text("No Offline Resources")
                            .font(.title2)
                            .fontWeight(.semibold)
                        
                        Text("Download resources to access them without internet")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                        
                        Button(action: {
                            showingDownloadOptions = true
                        }) {
                            Text("Download Resources")
                                .font(.headline)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                                .padding()
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Color.teal)
                                )
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(offlineResources) { resource in
                        ResourceRowView(resource: resource)
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("Offline Resources")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                if !offlineResources.isEmpty {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Download More") {
                            showingDownloadOptions = true
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showingDownloadOptions) {
            DownloadOptionsView()
        }
    }
}

// MARK: - Settings View
struct SettingsView: View {
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var authManager: AuthenticationManager
    @Query private var userSettings: [UserSettings]
    @State private var selectedLanguage: Language = .english
    @State private var isAnonymousMode = true
    @State private var locationEnabled = false
    @State private var voiceEnabled = true
    @State private var showingLogoutAlert = false
    
    var body: some View {
        NavigationView {
            List {
                Section("Language") {
                    Picker("Language", selection: $selectedLanguage) {
                        ForEach(Language.allCases, id: \.self) { language in
                            Text(language.displayName).tag(language)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                }
                
                Section("Privacy") {
                    Toggle("Anonymous Mode", isOn: $isAnonymousMode)
                    Toggle("Location Services", isOn: $locationEnabled)
                        .disabled(isAnonymousMode)
                }
                
                Section("Accessibility") {
                    Toggle("Voice Assistant", isOn: $voiceEnabled)
                }
                
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("Build")
                        Spacer()
                        Text("1")
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

// MARK: - Resource Detail View
struct ResourceDetailView: View {
    let resource: Resource
    @Environment(\.modelContext) private var modelContext
    @State private var showingMap = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
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
                    }
                    
                    Text(resource.resourceDescription)
                        .font(.body)
                        .foregroundColor(.secondary)
                }
                
                // Contact Information
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
                
                // Languages
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
                                        .fill(Color.teal.opacity(0.2))
                                )
                        }
                    }
                }
                
                // Offline Toggle
                VStack(alignment: .leading, spacing: 12) {
                    Text("Offline Access")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Toggle("Save for offline use", isOn: Binding(
                        get: { resource.isOffline },
                        set: { newValue in
                            resource.isOffline = newValue
                        }
                    ))
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                }
            }
            .padding()
        }
        .navigationTitle(resource.name)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingMap) {
            ResourceMapView(resource: resource)
        }
    }
}

// MARK: - Download Options View
struct DownloadOptionsView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @Query private var resources: [Resource]
    
    var body: some View {
        NavigationView {
            List {
                ForEach(ResourceCategory.allCases, id: \.self) { category in
                    Section(category.rawValue) {
                        ForEach(resources.filter { $0.category == category }) { resource in
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(resource.name)
                                        .font(.headline)
                                    Text(resource.address)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                if resource.isOffline {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.green)
                                } else {
                                    Button("Download") {
                                        resource.isOffline = true
                                    }
                                    .foregroundColor(.teal)
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Download Resources")
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

// MARK: - Resource Map View
struct ResourceMapView: View {
    let resource: Resource
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack {
                if let latitude = resource.latitude, let longitude = resource.longitude {
                    Map(coordinateRegion: .constant(MKCoordinateRegion(
                        center: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
                        span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
                    )), annotationItems: [resource]) { _ in
                        MapMarker(coordinate: CLLocationCoordinate2D(latitude: latitude, longitude: longitude), tint: .red)
                    }
                } else {
                    VStack {
                        Image(systemName: "map")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        Text("Map not available")
                            .font(.title2)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
            .navigationTitle("Location")
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
