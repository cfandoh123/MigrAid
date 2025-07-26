//
//  OnboardingView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData

struct OnboardingView: View {
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var authManager: AuthenticationManager
    @Query private var userSettings: [UserSettings]
    @State private var selectedLanguage: Language = .english
    @State private var showingPrivacyMode = false
    @State private var hasCompletedOnboarding = false
    @State private var showingLogout = false
    
    var body: some View {
        if hasCompletedOnboarding {
            MainTabView()
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Logout") {
                            showingLogout = true
                        }
                        .foregroundColor(.red)
                    }
                }
                .alert("Logout", isPresented: $showingLogout) {
                    Button("Cancel", role: .cancel) { }
                    Button("Logout", role: .destructive) {
                        logout()
                    }
                } message: {
                    Text("Are you sure you want to logout?")
                }
        } else if showingPrivacyMode {
            PrivacyModeView(selectedLanguage: selectedLanguage) {
                hasCompletedOnboarding = true
            }
        } else {
            LanguageSelectionView(selectedLanguage: $selectedLanguage) {
                showingPrivacyMode = true
            }
        }
    }
    
    private func logout() {
        // Clear user settings and return to login
        hasCompletedOnboarding = false
        showingPrivacyMode = false
        selectedLanguage = .english
        
        // Clear user settings from database
        for setting in userSettings {
            modelContext.delete(setting)
        }
        
        // Logout using authentication manager
        authManager.logout()
    }
}

struct LanguageSelectionView: View {
    @Binding var selectedLanguage: Language
    let onContinue: () -> Void
    @EnvironmentObject private var localization: LocalizationManager
    
    var body: some View {
        VStack(spacing: 30) {
            Spacer()
            
            // App Logo/Title
            VStack(spacing: 20) {
                MigrAidLogoView(size: 80)
                
                Text("MigrAid")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                
                Text("Help for Everyone")
                    .font(.title2)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // Language Selection
            VStack(spacing: 20) {
                Text("Select Your Language")
                    .font(.title2)
                    .fontWeight(.semibold)
                
                VStack(spacing: 12) {
                    ForEach(Language.allCases, id: \.self) { language in
                        Button(action: {
                            selectedLanguage = language
                        }) {
                            HStack {
                                Text(language.displayName)
                                    .font(.title3)
                                    .foregroundColor(selectedLanguage == language ? .white : .primary)
                                
                                Spacer()
                                
                                if selectedLanguage == language {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(.white)
                                }
                            }
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(selectedLanguage == language ? Color.accentColor : Color.gray.opacity(0.1))
                            )
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
            
            Spacer()
            
            // Continue Button
            Button(action: {
                localization.setLanguage(selectedLanguage)
                onContinue()
            }) {
                Text(localization.t("Continue"))
                    .font(.title3)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.accentColor)
                    )
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .padding()
        .background(Color(.systemBackground))
    }
}

struct PrivacyModeView: View {
    let selectedLanguage: Language
    let onComplete: () -> Void
    
    @Environment(\.modelContext) private var modelContext
    @State private var isAnonymousMode = true
    
    var body: some View {
        VStack(spacing: 30) {
            Spacer()
            
            // Privacy Icon
            Image(systemName: "lock.shield")
                .font(.system(size: 80))
                .foregroundColor(.accentColor)
            
            Text("Privacy Mode")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("Choose how you want to use MigrAid")
                .font(.title3)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Spacer()
            
            // Privacy Options
            VStack(spacing: 20) {
                Button(action: {
                    isAnonymousMode = true
                }) {
                    VStack(spacing: 12) {
                        Image(systemName: "person.crop.circle.badge.questionmark")
                            .font(.system(size: 40))
                            .foregroundColor(isAnonymousMode ? .white : .accentColor)
                        
                        Text("Anonymous Mode")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(isAnonymousMode ? .white : .primary)
                        
                        Text("Use without location access")
                            .font(.body)
                            .foregroundColor(isAnonymousMode ? .white.opacity(0.8) : .secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(isAnonymousMode ? Color.accentColor : Color.gray.opacity(0.1))
                    )
                }
                .buttonStyle(PlainButtonStyle())
                
                Button(action: {
                    isAnonymousMode = false
                }) {
                    VStack(spacing: 12) {
                        Image(systemName: "location.circle")
                            .font(.system(size: 40))
                            .foregroundColor(!isAnonymousMode ? .white : .accentColor)
                        
                        Text("Location Mode")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(!isAnonymousMode ? .white : .primary)
                        
                        Text("Get nearby resources and alerts")
                            .font(.body)
                            .foregroundColor(!isAnonymousMode ? .white.opacity(0.8) : .secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(!isAnonymousMode ? Color.accentColor : Color.gray.opacity(0.1))
                    )
                }
                .buttonStyle(PlainButtonStyle())
            }
            
            Spacer()
            
            // Privacy Notice
            Text("Your privacy is our priority. We never share your personal information.")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            // Get Started Button
            Button(action: {
                saveUserSettings()
                onComplete()
            }) {
                Text("Get Started")
                    .font(.title3)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.accentColor)
                    )
            }
            .padding(.horizontal)
            
            Spacer()
        }
        .padding()
        .background(Color(.systemBackground))
    }
    
    private func saveUserSettings() {
        let settings = UserSettings(
            language: selectedLanguage.rawValue,
            isAnonymousMode: isAnonymousMode,
            locationEnabled: !isAnonymousMode,
            voiceEnabled: true
        )
        modelContext.insert(settings)
        
        // Add sample data for testing
        addSampleResources()
    }
    
    private func addSampleResources() {
        let sampleResources = [
            // CLINICS
            Resource(
                name: "Downtown Community Health Clinic",
                category: .clinics,
                description: "Free medical care, dental services, and mental health support for all community members",
                address: "123 Main St, Downtown",
                phone: "(555) 123-4567",
                website: "https://downtownclinic.org",
                languages: ["English", "Spanish", "Arabic"],
                hours: "Mon-Fri 8AM-6PM, Sat 9AM-2PM",
                isVerified: true,
                latitude: 37.7749,
                longitude: -122.4194
            ),
            Resource(
                name: "Migrant Health Center",
                category: .clinics,
                description: "Specialized healthcare for immigrant and refugee communities",
                address: "456 Oak Ave, Midtown",
                phone: "(555) 234-5678",
                website: "https://migranthealth.org",
                languages: ["English", "Spanish", "Haitian Creole", "Arabic"],
                hours: "Mon-Thu 9AM-7PM, Fri 9AM-5PM",
                isVerified: true,
                latitude: 37.7849,
                longitude: -122.4094
            ),
            Resource(
                name: "Women's Health & Family Clinic",
                category: .clinics,
                description: "Comprehensive women's health services and family planning",
                address: "789 Pine St, Uptown",
                phone: "(555) 345-6789",
                website: "https://womenshealthclinic.org",
                languages: ["English", "Spanish", "French"],
                hours: "Mon-Fri 8AM-5PM",
                isVerified: true,
                latitude: 37.7649,
                longitude: -122.4294
            ),
            Resource(
                name: "Pediatric Care Center",
                category: .clinics,
                description: "Specialized medical care for children and families",
                address: "321 Elm St, Westside",
                phone: "(555) 456-7890",
                website: "https://pediatriccare.org",
                languages: ["English", "Spanish", "Mandarin"],
                hours: "Mon-Fri 9AM-6PM, Sat 9AM-1PM",
                isVerified: true,
                latitude: 37.7549,
                longitude: -122.4394
            ),
            
            // LEGAL AID
            Resource(
                name: "Immigrant Legal Defense Center",
                category: .legalAid,
                description: "Free legal representation for immigration cases and deportation defense",
                address: "654 Maple Ave, Downtown",
                phone: "(555) 567-8901",
                website: "https://immigrantlegal.org",
                languages: ["English", "Spanish", "Arabic", "Haitian Creole"],
                hours: "Mon-Fri 9AM-6PM",
                isVerified: true,
                latitude: 37.7749,
                longitude: -122.4194
            ),
            Resource(
                name: "Community Legal Services",
                category: .legalAid,
                description: "Comprehensive legal assistance for housing, employment, and civil rights",
                address: "987 Cedar St, Eastside",
                phone: "(555) 678-9012",
                website: "https://communitylegal.org",
                languages: ["English", "Spanish", "Vietnamese"],
                hours: "Mon-Thu 8AM-7PM, Fri 8AM-5PM",
                isVerified: true,
                latitude: 37.7849,
                longitude: -122.4094
            ),
            Resource(
                name: "Refugee Rights Legal Clinic",
                category: .legalAid,
                description: "Specialized legal services for refugees and asylum seekers",
                address: "147 Birch St, Northside",
                phone: "(555) 789-0123",
                website: "https://refugeerights.org",
                languages: ["English", "Arabic", "Somali", "French"],
                hours: "Mon-Fri 9AM-5PM",
                isVerified: true,
                latitude: 37.7949,
                longitude: -122.3994
            ),
            Resource(
                name: "Workers' Rights Legal Center",
                category: .legalAid,
                description: "Legal protection for workers' rights and workplace discrimination",
                address: "258 Willow St, Southside",
                phone: "(555) 890-1234",
                website: "https://workersrights.org",
                languages: ["English", "Spanish", "Mandarin", "Tagalog"],
                hours: "Mon-Fri 8AM-6PM",
                isVerified: true,
                latitude: 37.7649,
                longitude: -122.4294
            ),
            
            // FOOD
            Resource(
                name: "Community Food Bank",
                category: .food,
                description: "Emergency food assistance and grocery distribution for families in need",
                address: "369 Oak St, Downtown",
                phone: "(555) 901-2345",
                website: "https://communityfoodbank.org",
                languages: ["English", "Spanish", "Arabic"],
                hours: "Mon-Sat 9AM-7PM, Sun 10AM-4PM",
                isVerified: true,
                latitude: 37.7749,
                longitude: -122.4194
            ),
            Resource(
                name: "Fresh Start Meal Program",
                category: .food,
                description: "Hot meals served daily and weekend food packages",
                address: "741 Pine Ave, Midtown",
                phone: "(555) 012-3456",
                website: "https://freshstartmeals.org",
                languages: ["English", "Spanish", "Haitian Creole"],
                hours: "Daily 11AM-8PM",
                isVerified: true,
                latitude: 37.7849,
                longitude: -122.4094
            ),
            Resource(
                name: "Migrant Workers Food Pantry",
                category: .food,
                description: "Specialized food assistance for migrant workers and their families",
                address: "852 Elm St, Westside",
                phone: "(555) 123-4567",
                website: "https://migrantfood.org",
                languages: ["English", "Spanish", "Tagalog", "Vietnamese"],
                hours: "Mon-Fri 10AM-6PM, Sat 9AM-3PM",
                isVerified: true,
                latitude: 37.7649,
                longitude: -122.4294
            ),
            Resource(
                name: "Family Nutrition Center",
                category: .food,
                description: "Nutrition education and healthy food distribution",
                address: "963 Maple St, Eastside",
                phone: "(555) 234-5678",
                website: "https://familynutrition.org",
                languages: ["English", "Spanish", "Mandarin"],
                hours: "Mon-Fri 9AM-5PM, Sat 10AM-2PM",
                isVerified: true,
                latitude: 37.7949,
                longitude: -122.3994
            ),
            
            // SHELTER
            Resource(
                name: "Safe Haven Emergency Shelter",
                category: .shelter,
                description: "24/7 emergency shelter for families and individuals in crisis",
                address: "159 Cedar St, Downtown",
                phone: "(555) 345-6789",
                website: "https://safehavenshelter.org",
                languages: ["English", "Spanish", "Arabic"],
                hours: "24/7",
                isVerified: true,
                latitude: 37.7749,
                longitude: -122.4194
            ),
            Resource(
                name: "Family Transitional Housing",
                category: .shelter,
                description: "Long-term housing support for families working toward stability",
                address: "267 Birch St, Northside",
                phone: "(555) 456-7890",
                website: "https://familyhousing.org",
                languages: ["English", "Spanish", "Haitian Creole"],
                hours: "24/7",
                isVerified: true,
                latitude: 37.7849,
                longitude: -122.4094
            ),
            Resource(
                name: "Youth Emergency Shelter",
                category: .shelter,
                description: "Safe space for homeless and at-risk youth",
                address: "374 Willow St, Southside",
                phone: "(555) 567-8901",
                website: "https://youthshelter.org",
                languages: ["English", "Spanish", "Vietnamese"],
                hours: "24/7",
                isVerified: true,
                latitude: 37.7649,
                longitude: -122.4294
            ),
            Resource(
                name: "Domestic Violence Safe House",
                category: .shelter,
                description: "Confidential shelter for survivors of domestic violence",
                address: "485 Oak Ave, Westside",
                phone: "(555) 678-9012",
                website: "https://domesticviolencesafe.org",
                languages: ["English", "Spanish", "Arabic", "Mandarin"],
                hours: "24/7",
                isVerified: true,
                latitude: 37.7949,
                longitude: -122.3994
            ),
            
            // EDUCATION
            Resource(
                name: "Community Learning Center",
                category: .education,
                description: "ESL classes, GED preparation, and job training programs",
                address: "592 Pine St, Downtown",
                phone: "(555) 789-0123",
                website: "https://communitylearning.org",
                languages: ["English", "Spanish", "Arabic", "Vietnamese"],
                hours: "Mon-Fri 8AM-8PM, Sat 9AM-3PM",
                isVerified: true,
                latitude: 37.7749,
                longitude: -122.4194
            ),
            Resource(
                name: "Migrant Education Program",
                category: .education,
                description: "Educational support for migrant children and families",
                address: "683 Elm St, Midtown",
                phone: "(555) 890-1234",
                website: "https://migranteducation.org",
                languages: ["English", "Spanish", "Tagalog", "Haitian Creole"],
                hours: "Mon-Fri 9AM-6PM",
                isVerified: true,
                latitude: 37.7849,
                longitude: -122.4094
            ),
            Resource(
                name: "Adult Literacy Center",
                category: .education,
                description: "Reading, writing, and computer skills for adults",
                address: "794 Maple St, Eastside",
                phone: "(555) 901-2345",
                website: "https://adultliteracy.org",
                languages: ["English", "Spanish", "Mandarin", "Somali"],
                hours: "Mon-Thu 9AM-7PM, Fri 9AM-5PM",
                isVerified: true,
                latitude: 37.7649,
                longitude: -122.4294
            ),
            Resource(
                name: "Vocational Training Institute",
                category: .education,
                description: "Skills training for construction, healthcare, and service industries",
                address: "805 Cedar St, Westside",
                phone: "(555) 012-3456",
                website: "https://vocationaltraining.org",
                languages: ["English", "Spanish", "Vietnamese", "French"],
                hours: "Mon-Fri 8AM-6PM",
                isVerified: true,
                latitude: 37.7949,
                longitude: -122.3994
            ),
            
            // MENTAL HEALTH
            Resource(
                name: "Community Mental Health Center",
                category: .mentalHealth,
                description: "Counseling, therapy, and crisis intervention services",
                address: "916 Birch St, Downtown",
                phone: "(555) 123-4567",
                website: "https://communitymentalhealth.org",
                languages: ["English", "Spanish", "Arabic"],
                hours: "Mon-Fri 8AM-8PM, Sat 9AM-5PM",
                isVerified: true,
                latitude: 37.7749,
                longitude: -122.4194
            ),
            Resource(
                name: "Trauma Recovery Center",
                category: .mentalHealth,
                description: "Specialized therapy for trauma survivors and refugees",
                address: "027 Willow St, Northside",
                phone: "(555) 234-5678",
                website: "https://traumarecovery.org",
                languages: ["English", "Arabic", "Somali", "French"],
                hours: "Mon-Fri 9AM-6PM",
                isVerified: true,
                latitude: 37.7849,
                longitude: -122.4094
            ),
            Resource(
                name: "Family Counseling Services",
                category: .mentalHealth,
                description: "Family therapy and parenting support programs",
                address: "138 Oak Ave, Southside",
                phone: "(555) 345-6789",
                website: "https://familycounseling.org",
                languages: ["English", "Spanish", "Mandarin", "Vietnamese"],
                hours: "Mon-Fri 9AM-7PM, Sat 10AM-4PM",
                isVerified: true,
                latitude: 37.7649,
                longitude: -122.4294
            ),
            Resource(
                name: "Crisis Intervention Hotline",
                category: .mentalHealth,
                description: "24/7 crisis support and suicide prevention",
                address: "249 Pine St, Westside",
                phone: "(555) 456-7890",
                website: "https://crisishotline.org",
                languages: ["English", "Spanish", "Arabic", "Haitian Creole"],
                hours: "24/7",
                isVerified: true,
                latitude: 37.7949,
                longitude: -122.3994
            )
        ]
        
        for resource in sampleResources {
            modelContext.insert(resource)
        }
    }
} 