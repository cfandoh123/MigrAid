//
//  EnhancedOfflineView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData

struct EnhancedOfflineView: View {
    @StateObject private var offlineManager = OfflineManager.shared
    @StateObject private var blockchainManager = BlockchainManager.shared
    @Query private var resources: [Resource]
    @State private var showingDownloadOptions = false
    @State private var showingRewards = false
    @State private var isDownloading = false
    @State private var downloadProgress = 0.0
    @State private var showingEncryptionInfo = false
    
    var offlineResources: [Resource] {
        resources.filter { $0.isOffline }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                if offlineResources.isEmpty {
                    EmptyOfflineView(
                        showingDownloadOptions: $showingDownloadOptions,
                        isDownloading: $isDownloading,
                        downloadProgress: $downloadProgress,
                        showingEncryptionInfo: $showingEncryptionInfo
                    )
                } else {
                    OfflineResourcesList(
                        resources: offlineResources,
                        showingRewards: $showingRewards
                    )
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
                
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Rewards") {
                        showingRewards = true
                    }
                }
            }
        }
        .sheet(isPresented: $showingDownloadOptions) {
            EnhancedDownloadOptionsView()
        }
        .sheet(isPresented: $showingRewards) {
            BlockchainRewardsView()
        }
        .sheet(isPresented: $showingEncryptionInfo) {
            EncryptionInfoView()
        }
    }
}

struct EmptyOfflineView: View {
    @Binding var showingDownloadOptions: Bool
    @Binding var isDownloading: Bool
    @Binding var downloadProgress: Double
    @Binding var showingEncryptionInfo: Bool
    
    var body: some View {
        VStack(spacing: 30) {
            Spacer()
            
            // Offline Icon
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
            }
            
            // Download Progress
            if isDownloading {
                VStack(spacing: 16) {
                    ProgressView(value: downloadProgress)
                        .progressViewStyle(LinearProgressViewStyle())
                        .scaleEffect(x: 1, y: 2, anchor: .center)
                    
                    Text("Downloading resources... \(Int(downloadProgress * 100))%")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding()
            }
            
            // Download Button
            Button(action: {
                showingDownloadOptions = true
            }) {
                HStack {
                    Image(systemName: "arrow.down.circle.fill")
                    Text("Download Resources")
                }
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.teal)
                )
            }
            .disabled(isDownloading)
            
            // Encryption Info
            Button(action: {
                showingEncryptionInfo = true
            }) {
                HStack {
                    Image(systemName: "lock.shield")
                    Text("Learn about encryption")
                }
                .font(.caption)
                .foregroundColor(.teal)
            }
            
            Spacer()
        }
        .padding()
    }
}

struct OfflineResourcesList: View {
    let resources: [Resource]
    @Binding var showingRewards: Bool
    
    var body: some View {
        List {
            Section {
                ForEach(resources) { resource in
                    OfflineResourceRowView(resource: resource)
                }
            } header: {
                HStack {
                    Text("Offline Resources")
                    Spacer()
                    Text("\(resources.count) items")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Section {
                Button(action: {
                    showingRewards = true
                }) {
                    HStack {
                        Image(systemName: "bitcoinsign.circle.fill")
                            .foregroundColor(.orange)
                        Text("View Blockchain Rewards")
                        Spacer()
                        Image(systemName: "chevron.right")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            } header: {
                Text("Rewards")
            }
        }
        .listStyle(InsetGroupedListStyle())
    }
}

struct OfflineResourceRowView: View {
    let resource: Resource
    @State private var showingDetails = false
    
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
                    }
                    
                    Image(systemName: "lock.fill")
                        .foregroundColor(.teal)
                        .font(.caption)
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
            
            // Languages
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(resource.languages, id: \.self) { language in
                        Text(language)
                            .font(.caption2)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(
                                RoundedRectangle(cornerRadius: 6)
                                    .fill(Color.teal.opacity(0.2))
                            )
                    }
                }
            }
        }
        .padding(.vertical, 8)
        .onTapGesture {
            showingDetails = true
        }
        .sheet(isPresented: $showingDetails) {
            ResourceDetailView(resource: resource)
        }
    }
}

struct EnhancedDownloadOptionsView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @Query private var resources: [Resource]
    @State private var selectedCategories: Set<ResourceCategory> = []
    @State private var isDownloading = false
    @State private var downloadProgress = 0.0
    
    var body: some View {
        NavigationView {
            VStack {
                // Download Progress
                if isDownloading {
                    VStack(spacing: 20) {
                        ProgressView(value: downloadProgress)
                            .progressViewStyle(LinearProgressViewStyle())
                            .scaleEffect(x: 1, y: 2, anchor: .center)
                        
                        Text("Downloading encrypted resources... \(Int(downloadProgress * 100))%")
                            .font(.headline)
                        
                        Text("Your data is being encrypted for offline use")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                } else {
                    // Category Selection
                    List {
                        ForEach(ResourceCategory.allCases, id: \.self) { category in
                            Section(category.rawValue) {
                                ForEach(resources.filter { $0.category == category }) { resource in
                                    DownloadResourceRow(
                                        resource: resource,
                                        isSelected: selectedCategories.contains(category)
                                    ) {
                                        if selectedCategories.contains(category) {
                                            selectedCategories.remove(category)
                                        } else {
                                            selectedCategories.insert(category)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Download Resources")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                if !isDownloading {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Download") {
                            startDownload()
                        }
                        .disabled(selectedCategories.isEmpty)
                    }
                }
            }
        }
    }
    
    private func startDownload() {
        isDownloading = true
        
        // Simulate download progress
        Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { timer in
            downloadProgress += 0.01
            if downloadProgress >= 1.0 {
                timer.invalidate()
                
                // Mark resources as offline
                for category in selectedCategories {
                    for resource in resources.filter({ $0.category == category }) {
                        resource.isOffline = true
                    }
                }
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    dismiss()
                }
            }
        }
    }
}

struct DownloadResourceRow: View {
    let resource: Resource
    let isSelected: Bool
    let onToggle: () -> Void
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(resource.name)
                    .font(.headline)
                Text(resource.address)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if isSelected {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.teal)
            } else {
                Image(systemName: "circle")
                    .foregroundColor(.gray)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture {
            onToggle()
        }
    }
}

struct BlockchainRewardsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var rewards: [BlockchainReward] = []
    @State private var isLoading = true
    
    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView("Loading rewards...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if rewards.isEmpty {
                    EmptyRewardsView()
                } else {
                    RewardsListView(rewards: rewards)
                }
            }
            .navigationTitle("Blockchain Rewards")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            loadRewards()
        }
    }
    
    private func loadRewards() {
        // Simulate loading rewards
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            rewards = [
                BlockchainReward(
                    id: "1",
                    userId: "user123",
                    rewardType: .resourceVerification,
                    amount: 10.0,
                    transactionHash: "0x1234567890abcdef",
                    timestamp: Date(),
                    status: .confirmed,
                    metadata: ["resource": "Community Health Clinic"]
                ),
                BlockchainReward(
                    id: "2",
                    userId: "user123",
                    rewardType: .iceReport,
                    amount: 5.0,
                    transactionHash: "0xabcdef1234567890",
                    timestamp: Date().addingTimeInterval(-86400),
                    status: .confirmed,
                    metadata: ["location": "Downtown"]
                )
            ]
            isLoading = false
        }
    }
}

struct EmptyRewardsView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "bitcoinsign.circle")
                .font(.system(size: 80))
                .foregroundColor(.orange)
            
            Text("No Rewards Yet")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Complete actions to earn blockchain rewards")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct RewardsListView: View {
    let rewards: [BlockchainReward]
    
    var body: some View {
        List(rewards) { reward in
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading) {
                        Text(reward.rewardType.displayName)
                            .font(.headline)
                        Text(reward.timestamp, style: .date)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing) {
                        Text("\(reward.amount, specifier: "%.1f")")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.orange)
                        Text("tokens")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                Text("Transaction: \(reward.transactionHash.prefix(10))...")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                HStack {
                    Text(reward.status.rawValue.capitalized)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(
                            RoundedRectangle(cornerRadius: 6)
                                .fill(reward.status == .confirmed ? Color.green.opacity(0.2) : Color.orange.opacity(0.2))
                        )
                    
                    Spacer()
                }
            }
            .padding(.vertical, 4)
        }
    }
}

struct EncryptionInfoView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("End-to-End Encryption")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("All your offline data is encrypted using AES-256-GCM encryption. This ensures that your information remains secure even if your device is compromised.")
                            .font(.body)
                    }
                    
                    VStack(alignment: .leading, spacing: 12) {
                        Text("How it works:")
                            .font(.headline)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            EncryptionFeatureRow(
                                icon: "lock.shield",
                                title: "Local Encryption",
                                description: "Data is encrypted on your device before storage"
                            )
                            
                            EncryptionFeatureRow(
                                icon: "key.fill",
                                title: "Unique Keys",
                                description: "Each user gets a unique encryption key"
                            )
                            
                            EncryptionFeatureRow(
                                icon: "eye.slash",
                                title: "Zero Knowledge",
                                description: "We cannot access your encrypted data"
                            )
                        }
                    }
                    
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Privacy First")
                            .font(.headline)
                        
                        Text("Your privacy is our top priority. All offline resources are encrypted with your personal key, ensuring that only you can access your downloaded information.")
                            .font(.body)
                    }
                }
                .padding()
            }
            .navigationTitle("Encryption")
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

struct EncryptionFeatureRow: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.teal)
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
} 