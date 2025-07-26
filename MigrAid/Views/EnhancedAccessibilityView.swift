//
//  EnhancedAccessibilityView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData

struct EnhancedAccessibilityView: View {
    @State private var selectedLanguage: Language = .english
    @State private var fontSize: FontSize = .medium
    @State private var colorScheme: ColorScheme = .normal
    @State private var isHighContrast = false
    @State private var isReducedMotion = false
    @State private var showAccessibilityLabels = true
    @State private var enableVoiceNavigation = true
    
    enum FontSize: String, CaseIterable {
        case small = "Small"
        case medium = "Medium"
        case large = "Large"
        case extraLarge = "Extra Large"
        
        var scale: CGFloat {
            switch self {
            case .small: return 0.8
            case .medium: return 1.0
            case .large: return 1.3
            case .extraLarge: return 1.6
            }
        }
    }
    
    enum ColorScheme: String, CaseIterable {
        case normal = "Normal"
        case colorBlind = "Color Blind"
        case highContrast = "High Contrast"
        case darkMode = "Dark Mode"
    }
    
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
                    
                    NavigationLink("Regional Settings") {
                        RegionalSettingsView()
                    }
                }
                
                Section("Visual Accessibility") {
                    Picker("Font Size", selection: $fontSize) {
                        ForEach(FontSize.allCases, id: \.self) { size in
                            Text(size.rawValue).tag(size)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                    
                    Picker("Color Scheme", selection: $colorScheme) {
                        ForEach(ColorScheme.allCases, id: \.self) { scheme in
                            Text(scheme.rawValue).tag(scheme)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                    
                    Toggle("High Contrast", isOn: $isHighContrast)
                    Toggle("Reduced Motion", isOn: $isReducedMotion)
                    Toggle("Show Accessibility Labels", isOn: $showAccessibilityLabels)
                }
                
                Section("Voice & Audio") {
                    Toggle("Voice Navigation", isOn: $enableVoiceNavigation)
                    
                    NavigationLink("Voice Commands") {
                        VoiceCommandsGuideView()
                    }
                    
                    NavigationLink("Audio Settings") {
                        AudioSettingsView()
                    }
                }
                
                Section("Screen Reader") {
                    NavigationLink("VoiceOver Guide") {
                        VoiceOverGuideView()
                    }
                    
                    NavigationLink("Accessibility Testing") {
                        AccessibilityTestingView()
                    }
                }
                
                Section("Cognitive Support") {
                    NavigationLink("Simplified Mode") {
                        SimplifiedModeView()
                    }
                    
                    NavigationLink("Step-by-Step Guide") {
                        StepByStepGuideView()
                    }
                }
                
                Section("Emergency Features") {
                    NavigationLink("Emergency Contacts") {
                        EmergencyContactsView()
                    }
                    
                    NavigationLink("Quick Actions") {
                        QuickActionsView()
                    }
                }
            }
            .navigationTitle("Accessibility")
            .navigationBarTitleDisplayMode(.large)
        }
        .environment(\.sizeCategory, fontSize == .small ? .small : 
                    fontSize == .large ? .large : 
                    fontSize == .extraLarge ? .accessibilityExtraExtraExtraLarge : .medium)
        .preferredColorScheme(colorScheme == .darkMode ? .dark : .light)
    }
}

struct RegionalSettingsView: View {
    @State private var selectedRegion = "US"
    @State private var timeFormat = "12-hour"
    @State private var dateFormat = "MM/DD/YYYY"
    
    let regions = ["US", "CA", "MX", "ES", "FR", "DE", "UK", "AU"]
    
    var body: some View {
        List {
            Section("Region") {
                Picker("Country/Region", selection: $selectedRegion) {
                    ForEach(regions, id: \.self) { region in
                        Text(region).tag(region)
                    }
                }
                .pickerStyle(MenuPickerStyle())
            }
            
            Section("Time & Date") {
                Picker("Time Format", selection: $timeFormat) {
                    Text("12-hour").tag("12-hour")
                    Text("24-hour").tag("24-hour")
                }
                .pickerStyle(SegmentedPickerStyle())
                
                Picker("Date Format", selection: $dateFormat) {
                    Text("MM/DD/YYYY").tag("MM/DD/YYYY")
                    Text("DD/MM/YYYY").tag("DD/MM/YYYY")
                    Text("YYYY-MM-DD").tag("YYYY-MM-DD")
                }
                .pickerStyle(MenuPickerStyle())
            }
        }
        .navigationTitle("Regional Settings")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct VoiceCommandsGuideView: View {
    let voiceCommands = [
        VoiceCommandGuide(command: "Find nearest clinic", description: "Locate nearby medical facilities"),
        VoiceCommandGuide(command: "I need legal help", description: "Find legal assistance resources"),
        VoiceCommandGuide(command: "Where can I get food?", description: "Locate food banks and meal programs"),
        VoiceCommandGuide(command: "Report ICE activity", description: "Submit an ICE activity report"),
        VoiceCommandGuide(command: "Find shelter", description: "Locate emergency housing"),
        VoiceCommandGuide(command: "Mental health help", description: "Find mental health resources"),
        VoiceCommandGuide(command: "Emergency contact", description: "Access emergency contacts"),
        VoiceCommandGuide(command: "Translate this", description: "Translate current text")
    ]
    
    var body: some View {
        List {
            Section("Available Voice Commands") {
                ForEach(voiceCommands, id: \.command) { command in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(command.command)
                            .font(.headline)
                            .foregroundColor(.teal)
                        
                        Text(command.description)
                            .font(.body)
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 4)
                }
            }
            
            Section("Tips") {
                Text("Speak clearly and naturally")
                Text("Use simple, direct phrases")
                Text("Wait for the confirmation sound")
                Text("Try different ways to say the same thing")
            }
        }
        .navigationTitle("Voice Commands")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct VoiceCommandGuide {
    let command: String
    let description: String
}

struct AudioSettingsView: View {
    @State private var voiceVolume: Double = 0.8
    @State private var feedbackVolume: Double = 0.6
    @State private var enableAudioFeedback = true
    @State private var enableHapticFeedback = true
    @State private var selectedVoice = "Default"
    
    let voices = ["Default", "Male", "Female", "Slow", "Clear"]
    
    var body: some View {
        List {
            Section("Voice Settings") {
                Picker("Voice Type", selection: $selectedVoice) {
                    ForEach(voices, id: \.self) { voice in
                        Text(voice).tag(voice)
                    }
                }
                .pickerStyle(MenuPickerStyle())
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Voice Volume")
                    Slider(value: $voiceVolume, in: 0...1)
                    Text("\(Int(voiceVolume * 100))%")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Section("Feedback") {
                Toggle("Audio Feedback", isOn: $enableAudioFeedback)
                
                if enableAudioFeedback {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Feedback Volume")
                        Slider(value: $feedbackVolume, in: 0...1)
                        Text("\(Int(feedbackVolume * 100))%")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Toggle("Haptic Feedback", isOn: $enableHapticFeedback)
            }
            
            Section("Test Audio") {
                Button("Test Voice") {
                    // Test voice playback
                }
                
                Button("Test Feedback") {
                    // Test audio feedback
                }
            }
        }
        .navigationTitle("Audio Settings")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct VoiceOverGuideView: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                VStack(alignment: .leading, spacing: 12) {
                    Text("VoiceOver Navigation")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    Text("VoiceOver provides spoken feedback to help you navigate the app. Here are some key gestures and commands:")
                        .font(.body)
                }
                
                VStack(alignment: .leading, spacing: 16) {
                    Text("Basic Gestures")
                        .font(.headline)
                    
                    VoiceOverGestureRow(
                        gesture: "Single Tap",
                        description: "Select and activate items"
                    )
                    
                    VoiceOverGestureRow(
                        gesture: "Double Tap",
                        description: "Activate selected item"
                    )
                    
                    VoiceOverGestureRow(
                        gesture: "Swipe Right/Left",
                        description: "Navigate between items"
                    )
                    
                    VoiceOverGestureRow(
                        gesture: "Two-Finger Tap",
                        description: "Stop current action"
                    )
                }
                
                VStack(alignment: .leading, spacing: 16) {
                    Text("App-Specific Features")
                        .font(.headline)
                    
                    VoiceOverFeatureRow(
                        feature: "Resource Categories",
                        description: "Each category is clearly labeled and can be navigated with swipe gestures"
                    )
                    
                    VoiceOverFeatureRow(
                        feature: "ICE Reports",
                        description: "Form fields are properly labeled and provide audio confirmation"
                    )
                    
                    VoiceOverFeatureRow(
                        feature: "Voice Commands",
                        description: "Voice commands work seamlessly with VoiceOver"
                    )
                }
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Tips for Best Experience")
                        .font(.headline)
                    
                    Text("• Keep VoiceOver enabled while using the app")
                    Text("• Use the rotor to adjust speech rate and volume")
                    Text("• Enable audio descriptions for better context")
                    Text("• Practice with the tutorial before emergency use")
                }
                .font(.body)
            }
            .padding()
        }
        .navigationTitle("VoiceOver Guide")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct VoiceOverGestureRow: View {
    let gesture: String
    let description: String
    
    var body: some View {
        HStack {
            Text(gesture)
                .font(.subheadline)
                .fontWeight(.semibold)
                .frame(width: 120, alignment: .leading)
            
            Text(description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
        }
    }
}

struct VoiceOverFeatureRow: View {
    let feature: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(feature)
                .font(.subheadline)
                .fontWeight(.semibold)
            
            Text(description)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
}

struct AccessibilityTestingView: View {
    @State private var currentTest = 0
    @State private var testResults: [String: Bool] = [:]
    
    let tests = [
        "Screen Reader Compatibility",
        "Color Contrast",
        "Touch Target Size",
        "Font Scaling",
        "Voice Commands",
        "Haptic Feedback"
    ]
    
    var body: some View {
        VStack {
            if currentTest < tests.count {
                VStack(spacing: 20) {
                    Text("Accessibility Test \(currentTest + 1) of \(tests.count)")
                        .font(.headline)
                    
                    Text(tests[currentTest])
                        .font(.title2)
                        .fontWeight(.semibold)
                    
                    VStack(spacing: 12) {
                        Button("Pass") {
                            testResults[tests[currentTest]] = true
                            nextTest()
                        }
                        .buttonStyle(.borderedProminent)
                        
                        Button("Fail") {
                            testResults[tests[currentTest]] = false
                            nextTest()
                        }
                        .buttonStyle(.bordered)
                    }
                }
                .padding()
            } else {
                TestResultsView(results: testResults)
            }
        }
        .navigationTitle("Accessibility Testing")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func nextTest() {
        if currentTest < tests.count - 1 {
            currentTest += 1
        }
    }
}

struct TestResultsView: View {
    let results: [String: Bool]
    
    var passedTests: Int {
        results.values.filter { $0 }.count
    }
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Test Results")
                .font(.title)
                .fontWeight(.bold)
            
            Text("\(passedTests) of \(results.count) tests passed")
                .font(.headline)
                .foregroundColor(passedTests == results.count ? .green : .orange)
            
            List {
                ForEach(Array(results.keys.sorted()), id: \.self) { test in
                    HStack {
                        Text(test)
                        Spacer()
                        Image(systemName: results[test] == true ? "checkmark.circle.fill" : "xmark.circle.fill")
                            .foregroundColor(results[test] == true ? .green : .red)
                    }
                }
            }
        }
        .padding()
    }
}

struct SimplifiedModeView: View {
    @State private var enableSimplifiedMode = false
    @State private var showIconsOnly = false
    @State private var useLargeButtons = true
    @State private var reduceComplexity = true
    
    var body: some View {
        List {
            Section("Simplified Interface") {
                Toggle("Enable Simplified Mode", isOn: $enableSimplifiedMode)
                Toggle("Show Icons Only", isOn: $showIconsOnly)
                Toggle("Use Large Buttons", isOn: $useLargeButtons)
                Toggle("Reduce Complexity", isOn: $reduceComplexity)
            }
            
            Section("Preview") {
                SimplifiedModePreview(
                    showIconsOnly: showIconsOnly,
                    useLargeButtons: useLargeButtons
                )
            }
            
            Section("Benefits") {
                Text("• Larger, easier-to-tap buttons")
                Text("• Clearer visual hierarchy")
                Text("• Reduced cognitive load")
                Text("• Better for users with motor difficulties")
            }
        }
        .navigationTitle("Simplified Mode")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct SimplifiedModePreview: View {
    let showIconsOnly: Bool
    let useLargeButtons: Bool
    
    var body: some View {
        VStack(spacing: 16) {
            if showIconsOnly {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 16) {
                    ForEach(ResourceCategory.allCases.prefix(6), id: \.self) { category in
                        Button(action: {}) {
                            Image(systemName: category.icon)
                                .font(.system(size: useLargeButtons ? 40 : 30))
                                .foregroundColor(.white)
                                .frame(width: useLargeButtons ? 80 : 60, height: useLargeButtons ? 80 : 60)
                                .background(Color(category.color))
                                .cornerRadius(12)
                        }
                    }
                }
            } else {
                VStack(spacing: 12) {
                    ForEach(ResourceCategory.allCases.prefix(3), id: \.self) { category in
                        Button(action: {}) {
                            HStack {
                                Image(systemName: category.icon)
                                    .font(.title2)
                                Text(category.rawValue)
                                    .font(useLargeButtons ? .title3 : .body)
                                Spacer()
                            }
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                        }
                    }
                }
            }
        }
        .padding()
    }
}

struct StepByStepGuideView: View {
    @State private var currentStep = 0
    
    let steps = [
        Step(icon: "1.circle.fill", title: "Open MigrAid", description: "Launch the app from your home screen"),
        Step(icon: "2.circle.fill", title: "Choose Language", description: "Select your preferred language"),
        Step(icon: "3.circle.fill", title: "Set Privacy Mode", description: "Choose anonymous or location mode"),
        Step(icon: "4.circle.fill", title: "Browse Resources", description: "Find help by category or search"),
        Step(icon: "5.circle.fill", title: "Get Help", description: "Call, visit, or save resources")
    ]
    
    var body: some View {
        VStack {
            if currentStep < steps.count {
                VStack(spacing: 30) {
                    Image(systemName: steps[currentStep].icon)
                        .font(.system(size: 80))
                        .foregroundColor(.teal)
                    
                    Text(steps[currentStep].title)
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text(steps[currentStep].description)
                        .font(.body)
                        .multilineTextAlignment(.center)
                        .foregroundColor(.secondary)
                    
                    HStack(spacing: 20) {
                        Button("Previous") {
                            if currentStep > 0 {
                                currentStep -= 1
                            }
                        }
                        .disabled(currentStep == 0)
                        
                        Button("Next") {
                            if currentStep < steps.count - 1 {
                                currentStep += 1
                            }
                        }
                        .disabled(currentStep == steps.count - 1)
                    }
                }
                .padding()
            } else {
                VStack(spacing: 20) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 80))
                        .foregroundColor(.green)
                    
                    Text("You're Ready!")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("You now know how to use MigrAid. Remember, help is always available.")
                        .font(.body)
                        .multilineTextAlignment(.center)
                        .foregroundColor(.secondary)
                    
                    Button("Start Over") {
                        currentStep = 0
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
            }
        }
        .navigationTitle("Step-by-Step Guide")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct Step {
    let icon: String
    let title: String
    let description: String
}

struct EmergencyContactsView: View {
    @State private var contacts: [EmergencyContact] = [
        EmergencyContact(name: "National Immigration Law Center", phone: "1-800-898-7180", type: .legal),
        EmergencyContact(name: "ACLU Immigrant Rights", phone: "1-800-835-5233", type: .legal),
        EmergencyContact(name: "RAICES", phone: "1-800-558-0231", type: .legal),
        EmergencyContact(name: "Emergency Services", phone: "911", type: .emergency),
        EmergencyContact(name: "Suicide Prevention", phone: "988", type: .crisis)
    ]
    
    var body: some View {
        List {
            ForEach(contacts) { contact in
                EmergencyContactRow(contact: contact)
            }
        }
        .navigationTitle("Emergency Contacts")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct EmergencyContact: Identifiable {
    let id = UUID()
    let name: String
    let phone: String
    let type: ContactType
    
    enum ContactType {
        case legal, emergency, crisis
        
        var color: Color {
            switch self {
            case .legal: return .blue
            case .emergency: return .red
            case .crisis: return .orange
            }
        }
    }
}

struct EmergencyContactRow: View {
    let contact: EmergencyContact
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(contact.name)
                    .font(.headline)
                
                Text(contact.phone)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Button("Call") {
                if let url = URL(string: "tel:\(contact.phone)") {
                    UIApplication.shared.open(url)
                }
            }
            .foregroundColor(contact.type.color)
        }
        .padding(.vertical, 4)
    }
}

struct QuickActionsView: View {
    var body: some View {
        List {
            Section("Emergency Actions") {
                QuickActionRow(
                    title: "Report ICE Activity",
                    icon: "exclamationmark.triangle.fill",
                    color: .red
                ) {
                    // Navigate to ICE report
                }
                
                QuickActionRow(
                    title: "Find Nearest Clinic",
                    icon: "cross.fill",
                    color: .teal
                ) {
                    // Navigate to clinics
                }
                
                QuickActionRow(
                    title: "Emergency Contacts",
                    icon: "phone.fill",
                    color: .orange
                ) {
                    // Show emergency contacts
                }
            }
            
            Section("Quick Access") {
                QuickActionRow(
                    title: "Voice Commands",
                    icon: "mic.fill",
                    color: .blue
                ) {
                    // Open voice commands
                }
                
                QuickActionRow(
                    title: "Offline Resources",
                    icon: "arrow.down.circle.fill",
                    color: .green
                ) {
                    // Open offline resources
                }
                
                QuickActionRow(
                    title: "Settings",
                    icon: "gear",
                    color: .gray
                ) {
                    // Open settings
                }
            }
        }
        .navigationTitle("Quick Actions")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct QuickActionRow: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .frame(width: 30)
                
                Text(title)
                    .foregroundColor(.primary)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
} 