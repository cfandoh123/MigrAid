//
//  MigrAidApp.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData

@main
struct MigrAidApp: App {
    @StateObject private var authManager = AuthenticationManager.shared
    
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            Resource.self,
            ICEReport.self,
            UserSettings.self
        ])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            if authManager.isAuthenticated {
                OnboardingView()
                    .preferredColorScheme(.light)
            } else {
                LoginView()
                    .preferredColorScheme(.light)
            }
        }
        .modelContainer(sharedModelContainer)
        .environmentObject(authManager)
        .environmentObject(LocalizationManager.shared)
    }
}
