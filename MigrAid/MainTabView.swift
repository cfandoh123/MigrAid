//
//  MainTabView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData

struct MainTabView: View {
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var localization: LocalizationManager
    @Query private var userSettings: [UserSettings]
    
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text(localization.t("Home"))
                }
            
            VoiceAssistantView()
                .tabItem {
                    Image(systemName: "mic.fill")
                    Text(localization.t("Voice"))
                }
            
            ICEReportView()
                .tabItem {
                    Image(systemName: "exclamationmark.triangle.fill")
                    Text(localization.t("ICE Alert"))
                }
            
            OfflineResourcesView()
                .tabItem {
                    Image(systemName: "arrow.down.circle.fill")
                    Text(localization.t("Offline"))
                }
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text(localization.t("Settings"))
                }
        }
        .accentColor(.accentColor)
    }
}

struct HomeView: View {
    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var localization: LocalizationManager
    @Query private var resources: [Resource]
    @Query private var userSettings: [UserSettings]
    @State private var searchText = ""
    @State private var showingVoiceInput = false
    @State private var selectedCategory: ResourceCategory?
    
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
                // Search Bar
                HStack {
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(.gray)
                        
                        TextField(localization.t("Search resources..."), text: $searchText)
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
                
                // Category Grid
                if selectedCategory == nil && searchText.isEmpty {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 16), count: 2), spacing: 16) {
                        ForEach(ResourceCategory.allCases, id: \.self) { category in
                            Button(action: {
                                selectedCategory = category
                            }) {
                                VStack(spacing: 12) {
                                    Image(systemName: category.icon)
                                        .font(.system(size: 40))
                                        .foregroundColor(.white)
                                    
                                    Text(localization.t(category.rawValue))
                                        .font(.headline)
                                        .fontWeight(.semibold)
                                        .foregroundColor(.white)
                                        .multilineTextAlignment(.center)
                                }
                                .frame(height: 120)
                                .frame(maxWidth: .infinity)
                                .background(
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color(category.color))
                                )
                            }
                            .buttonStyle(PlainButtonStyle())
                        }
                    }
                    .padding(.horizontal)
                    .padding(.top, 8)
                }
                
                // Resources List
                if !filteredResources.isEmpty {
                    List(filteredResources) { resource in
                        NavigationLink(destination: ResourceDetailView(resource: resource)) {
                            ResourceRowView(resource: resource)
                        }
                    }
                    .listStyle(PlainListStyle())
                    .padding(.top, 0)
                    .padding(.bottom, 0)
                    .listRowInsets(EdgeInsets())
                } else {
                    VStack(spacing: 20) {
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        
                        Text(localization.t("No resources found"))
                            .font(.title2)
                            .fontWeight(.semibold)
                        
                        Text(localization.t("Try searching for something else or browse by category"))
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
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
            }
        }
        .sheet(isPresented: $showingVoiceInput) {
            VoiceInputView()
        }
    }
}

struct ResourceRowView: View {
    let resource: Resource
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
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
                
                if resource.isVerified {
                    Image(systemName: "checkmark.seal.fill")
                        .foregroundColor(.green)
                        .font(.title2)
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
        }
        .padding(.vertical, 8)
    }
}

struct VoiceInputView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var isListening = false
    @State private var transcribedText = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                Spacer()
                
                // Voice Icon
                Image(systemName: isListening ? "waveform" : "mic.fill")
                    .font(.system(size: 80))
                    .foregroundColor(isListening ? .red : .teal)
                    .scaleEffect(isListening ? 1.2 : 1.0)
                    .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: isListening)
                
                Text(isListening ? "Listening..." : "Tap to speak")
                    .font(.title2)
                    .fontWeight(.semibold)
                
                if !transcribedText.isEmpty {
                    Text(transcribedText)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                }
                
                Spacer()
                
                // Voice Button
                Button(action: {
                    isListening.toggle()
                    if isListening {
                        // Start voice recognition
                        transcribedText = "Voice recognition would be implemented here..."
                    } else {
                        // Stop voice recognition
                    }
                }) {
                    Image(systemName: isListening ? "stop.fill" : "mic.fill")
                        .font(.title)
                        .foregroundColor(.white)
                        .padding(30)
                        .background(
                            Circle()
                                .fill(isListening ? Color.red : Color.accentColor)
                        )
                }
                
                Spacer()
            }
            .padding()
            .navigationTitle("Voice Assistant")
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