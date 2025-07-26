//
//  AdminDashboardView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import SwiftData
import Charts

struct AdminDashboardView: View {
    @StateObject private var backendService = BackendService.shared
    @State private var dashboard: AdminDashboard?
    @State private var isLoading = true
    @State private var selectedTab = 0
    @State private var showingResourceVerification = false
    @State private var showingReportReview = false
    
    var body: some View {
        NavigationView {
            VStack {
                if isLoading {
                    ProgressView("Loading dashboard...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let dashboard = dashboard {
                    TabView(selection: $selectedTab) {
                        OverviewTab(dashboard: dashboard)
                            .tabItem {
                                Image(systemName: "chart.bar.fill")
                                Text("Overview")
                            }
                            .tag(0)
                        
                        ResourcesTab()
                            .tabItem {
                                Image(systemName: "folder.fill")
                                Text("Resources")
                            }
                            .tag(1)
                        
                        ReportsTab()
                            .tabItem {
                                Image(systemName: "exclamationmark.triangle.fill")
                                Text("Reports")
                            }
                            .tag(2)
                        
                        AnalyticsTab(dashboard: dashboard)
                            .tabItem {
                                Image(systemName: "chart.line.uptrend.xyaxis")
                                Text("Analytics")
                            }
                            .tag(3)
                        
                        SettingsTab()
                            .tabItem {
                                Image(systemName: "gear")
                                Text("Settings")
                            }
                            .tag(4)
                    }
                } else {
                    ErrorView()
                }
            }
            .navigationTitle("Admin Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Refresh") {
                        loadDashboard()
                    }
                }
            }
        }
        .onAppear {
            loadDashboard()
        }
    }
    
    private func loadDashboard() {
        isLoading = true
        
        Task {
            do {
                let dashboardData = try await backendService.getAdminDashboard()
                await MainActor.run {
                    self.dashboard = dashboardData
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.isLoading = false
                }
            }
        }
    }
}

struct OverviewTab: View {
    let dashboard: AdminDashboard
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // System Health
                SystemHealthCard(health: dashboard.systemHealth)
                
                // Quick Stats
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                    StatCard(
                        title: "Total Resources",
                        value: "\(dashboard.totalResources)",
                        icon: "folder.fill",
                        color: .teal
                    )
                    
                    StatCard(
                        title: "Pending Verifications",
                        value: "\(dashboard.pendingVerifications)",
                        icon: "checkmark.seal.fill",
                        color: .orange
                    )
                    
                    StatCard(
                        title: "Active Users",
                        value: "\(dashboard.activeUsers)",
                        icon: "person.2.fill",
                        color: .blue
                    )
                    
                    StatCard(
                        title: "Recent Reports",
                        value: "\(dashboard.recentReports.count)",
                        icon: "exclamationmark.triangle.fill",
                        color: .red
                    )
                }
                
                // Recent Activity
                RecentActivityCard(reports: dashboard.recentReports)
            }
            .padding()
        }
    }
}

struct SystemHealthCard: View {
    let health: AdminDashboard.SystemHealth
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "heart.fill")
                    .foregroundColor(health.status == "healthy" ? .green : .red)
                Text("System Health")
                    .font(.headline)
                Spacer()
                Text(health.status.capitalized)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(
                        RoundedRectangle(cornerRadius: 6)
                            .fill(health.status == "healthy" ? Color.green.opacity(0.2) : Color.red.opacity(0.2))
                    )
            }
            
            VStack(spacing: 12) {
                HealthMetricRow(
                    label: "Uptime",
                    value: formatUptime(health.uptime),
                    icon: "clock.fill",
                    color: .blue
                )
                
                HealthMetricRow(
                    label: "Error Rate",
                    value: "\(Int(health.errorRate * 100))%",
                    icon: "exclamationmark.triangle.fill",
                    color: health.errorRate < 0.05 ? .green : .orange
                )
                
                HealthMetricRow(
                    label: "Response Time",
                    value: "\(Int(health.responseTime * 1000))ms",
                    icon: "speedometer",
                    color: health.responseTime < 1.0 ? .green : .orange
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private func formatUptime(_ uptime: TimeInterval) -> String {
        let hours = Int(uptime) / 3600
        let days = hours / 24
        return "\(days)d \(hours % 24)h"
    }
}

struct HealthMetricRow: View {
    let label: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 20)
            
            Text(label)
                .font(.subheadline)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.semibold)
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title)
                .foregroundColor(color)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct RecentActivityCard: View {
    let reports: [AdminDashboard.ICEReportData]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Recent Activity")
                .font(.headline)
            
            if reports.isEmpty {
                Text("No recent activity")
                    .font(.caption)
                    .foregroundColor(.secondary)
            } else {
                ForEach(reports.prefix(5), id: \.id) { report in
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.red)
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text(report.reportDescription)
                                .font(.subheadline)
                                .lineLimit(2)
                            
                            Text(report.timestamp, style: .relative)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        if let location = report.location {
                            Text(location)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ResourcesTab: View {
    @Query private var resources: [Resource]
    @State private var showingAddResource = false
    @State private var searchText = ""
    
    var filteredResources: [Resource] {
        if searchText.isEmpty {
            return resources
        } else {
            return resources.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }
    
    var body: some View {
        VStack {
            // Search Bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                
                TextField("Search resources...", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
            .padding(.horizontal)
            
            // Resources List
            List {
                ForEach(filteredResources) { resource in
                    AdminResourceRow(resource: resource)
                }
            }
        }
        .navigationTitle("Resources")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Add") {
                    showingAddResource = true
                }
            }
        }
        .sheet(isPresented: $showingAddResource) {
            AddResourceView()
        }
    }
}

struct AdminResourceRow: View {
    let resource: Resource
    @State private var showingVerification = false
    
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
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    if resource.isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .foregroundColor(.green)
                    } else {
                        Button("Verify") {
                            showingVerification = true
                        }
                        .font(.caption)
                        .foregroundColor(.orange)
                    }
                    
                    Text(resource.isOffline ? "Offline" : "Online")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            
            Text(resource.resourceDescription)
                .font(.body)
                .foregroundColor(.secondary)
                .lineLimit(2)
        }
        .padding(.vertical, 4)
        .sheet(isPresented: $showingVerification) {
            ResourceVerificationView(resource: resource)
        }
    }
}

struct ReportsTab: View {
    @Query private var reports: [ICEReport]
    @State private var selectedFilter = ReportFilter.all
    
    enum ReportFilter: String, CaseIterable {
        case all = "All"
        case pending = "Pending"
        case reviewed = "Reviewed"
        case urgent = "Urgent"
    }
    
    var filteredReports: [ICEReport] {
        switch selectedFilter {
        case .all:
            return reports
        case .pending:
            return reports.filter { $0.timestamp > Date().addingTimeInterval(-86400) }
        case .reviewed:
            return reports.filter { $0.timestamp < Date().addingTimeInterval(-86400) }
        case .urgent:
            return reports.filter { $0.reportDescription.lowercased().contains("urgent") }
        }
    }
    
    var body: some View {
        VStack {
            // Filter Picker
            Picker("Filter", selection: $selectedFilter) {
                ForEach(ReportFilter.allCases, id: \.self) { filter in
                    Text(filter.rawValue).tag(filter)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            .padding()
            
            // Reports List
            List(filteredReports) { report in
                AdminReportRow(report: report)
            }
        }
        .navigationTitle("Reports")
    }
}

struct AdminReportRow: View {
    let report: ICEReport
    @State private var showingDetails = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(report.reportDescription)
                        .font(.headline)
                        .lineLimit(2)
                    
                    Text(report.timestamp, style: .relative)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    if report.isAnonymous {
                        Text("Anonymous")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    if let location = report.location {
                        Text(location)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            HStack {
                Button("Review") {
                    showingDetails = true
                }
                .font(.caption)
                .foregroundColor(.teal)
                
                Spacer()
                
                if report.timestamp > Date().addingTimeInterval(-3600) {
                    Text("URGENT")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.red)
                        .cornerRadius(6)
                }
            }
        }
        .padding(.vertical, 4)
        .sheet(isPresented: $showingDetails) {
            ReportDetailView(report: report)
        }
    }
}

struct AnalyticsTab: View {
    let dashboard: AdminDashboard
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Usage Chart
                UsageChartCard(analytics: dashboard.analytics)
                
                // Language Distribution
                LanguageDistributionCard(analytics: dashboard.analytics)
                
                // Category Distribution
                CategoryDistributionCard(analytics: dashboard.analytics)
            }
            .padding()
        }
    }
}

struct UsageChartCard: View {
    let analytics: AdminDashboard.AnalyticsData
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Usage Analytics")
                .font(.headline)
            
            VStack(spacing: 12) {
                AnalyticsRow(label: "Daily Active Users", value: "\(analytics.dailyActiveUsers)")
                AnalyticsRow(label: "Weekly Reports", value: "\(analytics.weeklyReports)")
                AnalyticsRow(label: "Monthly Resources", value: "\(analytics.monthlyResources)")
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct AnalyticsRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.semibold)
        }
    }
}

struct LanguageDistributionCard: View {
    let analytics: AdminDashboard.AnalyticsData
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Language Distribution")
                .font(.headline)
            
            ForEach(Array(analytics.topLanguages.keys.sorted()), id: \.self) { language in
                if let count = analytics.topLanguages[language] {
                    HStack {
                        Text(language)
                            .font(.subheadline)
                        
                        Spacer()
                        
                        Text("\(count)")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct CategoryDistributionCard: View {
    let analytics: AdminDashboard.AnalyticsData
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Category Distribution")
                .font(.headline)
            
            ForEach(Array(analytics.topCategories.keys.sorted()), id: \.self) { category in
                if let count = analytics.topCategories[category] {
                    HStack {
                        Text(category)
                            .font(.subheadline)
                        
                        Spacer()
                        
                        Text("\(count)")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct SettingsTab: View {
    var body: some View {
        List {
            Section("Admin Settings") {
                Button("Manage Users") {
                    // Manage users
                }
                
                Button("System Configuration") {
                    // System configuration
                }
                
                Button("Backup & Restore") {
                    // Backup and restore
                }
            }
            
            Section("Security") {
                Button("Access Logs") {
                    // Access logs
                }
                
                Button("Encryption Settings") {
                    // Encryption settings
                }
                
                Button("Privacy Controls") {
                    // Privacy controls
                }
            }
            
            Section("Support") {
                Button("Documentation") {
                    // Documentation
                }
                
                Button("Contact Support") {
                    // Contact support
                }
            }
        }
        .navigationTitle("Settings")
    }
}

struct ErrorView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 60))
                .foregroundColor(.orange)
            
            Text("Unable to load dashboard")
                .font(.title2)
                .fontWeight(.semibold)
            
            Text("Please check your connection and try again")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// Placeholder views for additional functionality
struct AddResourceView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Text("Add Resource Form")
                .navigationTitle("Add Resource")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Save") {
                            dismiss()
                        }
                    }
                    
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button("Cancel") {
                            dismiss()
                        }
                    }
                }
        }
    }
}

struct ResourceVerificationView: View {
    let resource: Resource
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Text("Resource Verification Form")
                .navigationTitle("Verify Resource")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Verify") {
                            dismiss()
                        }
                    }
                    
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button("Cancel") {
                            dismiss()
                        }
                    }
                }
        }
    }
}

struct ReportDetailView: View {
    let report: ICEReport
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Text("Report Detail View")
                .navigationTitle("Report Details")
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