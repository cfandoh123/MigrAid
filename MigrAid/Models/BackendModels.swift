//
//  BackendModels.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import Foundation
import CryptoKit
import Speech
import AVFoundation
import SwiftUI

// MARK: - Backend Configuration
struct BackendConfig {
    static let baseURL = "https://api.migraid.org/v1"
    static let firebaseConfig = "migraid-app"
    static let encryptionKey = "migraid-encryption-key-2024"
}

// MARK: - Encrypted Data Models
struct EncryptedData: Codable {
    let encryptedContent: String
    let iv: String
    let timestamp: Date
    let signature: String
}

// MARK: - Blockchain Reward Model
struct BlockchainReward: Codable, Identifiable {
    let id: String
    let userId: String
    let rewardType: RewardType
    let amount: Double
    let transactionHash: String
    let timestamp: Date
    let status: RewardStatus
    let metadata: [String: String]
    
    enum RewardType: String, Codable, CaseIterable {
        case resourceVerification = "resource_verification"
        case iceReport = "ice_report"
        case communityHelp = "community_help"
        case translation = "translation"
        case accessibility = "accessibility"
        
        var displayName: String {
            switch self {
            case .resourceVerification: return "Resource Verification"
            case .iceReport: return "ICE Report"
            case .communityHelp: return "Community Help"
            case .translation: return "Translation"
            case .accessibility: return "Accessibility"
            }
        }
        
        var rewardAmount: Double {
            switch self {
            case .resourceVerification: return 10.0
            case .iceReport: return 5.0
            case .communityHelp: return 15.0
            case .translation: return 8.0
            case .accessibility: return 12.0
            }
        }
    }
    
    enum RewardStatus: String, Codable {
        case pending = "pending"
        case confirmed = "confirmed"
        case failed = "failed"
    }
}

// MARK: - Community Verification Model
struct CommunityVerification: Codable, Identifiable {
    let id: String
    let resourceId: String
    let verifiedBy: String
    let verificationType: VerificationType
    let timestamp: Date
    let status: VerificationStatus
    let notes: String?
    let evidence: [String]?
    
    enum VerificationType: String, Codable, CaseIterable {
        case advocate = "advocate"
        case community = "community"
        case official = "official"
        case user = "user"
        
        var displayName: String {
            switch self {
            case .advocate: return "Legal Advocate"
            case .community: return "Community Member"
            case .official: return "Official Organization"
            case .user: return "User Verification"
            }
        }
        
        var weight: Int {
            switch self {
            case .advocate: return 10
            case .community: return 5
            case .official: return 15
            case .user: return 1
            }
        }
    }
    
    enum VerificationStatus: String, Codable {
        case pending = "pending"
        case approved = "approved"
        case rejected = "rejected"
        case flagged = "flagged"
    }
}

// MARK: - Voice Recognition Model
struct VoiceRecognitionResult: Codable {
    let text: String
    let confidence: Double
    let language: String
    let timestamp: Date
    let processingTime: TimeInterval
    let alternatives: [String]
}

// MARK: - Offline Data Model
struct OfflineData: Codable {
    let resources: [ResourceData]
    let lastSync: Date
    let version: String
    let checksum: String
    let size: Int64
    
    // Helper struct for Codable Resource data
    struct ResourceData: Codable {
        let id: String
        let name: String
        let category: String
        let resourceDescription: String
        let address: String
        let phone: String
        let website: String?
        let languages: [String]
        let hours: String
        let isVerified: Bool
        let latitude: Double?
        let longitude: Double?
        let isOffline: Bool
        let createdAt: Date
        
        init(from resource: Resource) {
            self.id = resource.id.uuidString
            self.name = resource.name
            self.category = resource.category.rawValue
            self.resourceDescription = resource.resourceDescription
            self.address = resource.address
            self.phone = resource.phone
            self.website = resource.website
            self.languages = resource.languages
            self.hours = resource.hours
            self.isVerified = resource.isVerified
            self.latitude = resource.latitude
            self.longitude = resource.longitude
            self.isOffline = resource.isOffline
            self.createdAt = resource.createdAt
        }
    }
    
    init(resources: [Resource], lastSync: Date, version: String, checksum: String, size: Int64) {
        self.resources = resources.map { ResourceData(from: $0) }
        self.lastSync = lastSync
        self.version = version
        self.checksum = checksum
        self.size = size
    }
}

// MARK: - Admin Dashboard Model
struct AdminDashboard: Codable {
    let totalResources: Int
    let pendingVerifications: Int
    let activeUsers: Int
    let recentReports: [ICEReportData]
    let systemHealth: SystemHealth
    let analytics: AnalyticsData
    
    struct SystemHealth: Codable {
        let status: String
        let uptime: TimeInterval
        let errorRate: Double
        let responseTime: TimeInterval
    }
    
    struct AnalyticsData: Codable {
        let dailyActiveUsers: Int
        let weeklyReports: Int
        let monthlyResources: Int
        let topLanguages: [String: Int]
        let topCategories: [String: Int]
    }
    
    // Helper struct for Codable ICEReport data
    struct ICEReportData: Codable {
        let id: String
        let reportDescription: String
        let location: String?
        let latitude: Double?
        let longitude: Double?
        let timestamp: Date
        let isAnonymous: Bool
        
        init(from report: ICEReport) {
            self.id = report.id.uuidString
            self.reportDescription = report.reportDescription
            self.location = report.location
            self.latitude = report.latitude
            self.longitude = report.longitude
            self.timestamp = report.timestamp
            self.isAnonymous = report.isAnonymous
        }
    }
    
    init(totalResources: Int, pendingVerifications: Int, activeUsers: Int, recentReports: [ICEReport], systemHealth: SystemHealth, analytics: AnalyticsData) {
        self.totalResources = totalResources
        self.pendingVerifications = pendingVerifications
        self.activeUsers = activeUsers
        self.recentReports = recentReports.map { ICEReportData(from: $0) }
        self.systemHealth = systemHealth
        self.analytics = analytics
    }
}

// MARK: - API Response Models
struct APIResponse<T: Codable>: Codable {
    let success: Bool
    let data: T?
    let message: String?
    let error: APIError?
    let timestamp: Date
}

struct APIError: Codable {
    let code: String
    let message: String
    let details: [String: String]?
}

// MARK: - Encryption Utilities
class EncryptionManager {
    static let shared = EncryptionManager()
    private let key: SymmetricKey
    
    private init() {
        let keyData = BackendConfig.encryptionKey.data(using: .utf8)!
        self.key = SymmetricKey(data: keyData)
    }
    
    func encrypt(_ data: Data) throws -> EncryptedData {
        let iv = AES.GCM.Nonce()
        let sealedBox = try AES.GCM.seal(data, using: key, nonce: iv)
        
        let encryptedContent = sealedBox.combined?.base64EncodedString() ?? ""
        let signature = SHA256.hash(data: data).description
        
        return EncryptedData(
            encryptedContent: encryptedContent,
            iv: Data(iv).base64EncodedString(),
            timestamp: Date(),
            signature: signature
        )
    }
    
    func decrypt(_ encryptedData: EncryptedData) throws -> Data {
        guard let encryptedContent = Data(base64Encoded: encryptedData.encryptedContent),
              let ivData = Data(base64Encoded: encryptedData.iv) else {
            throw EncryptionError.invalidData
        }
        
        let nonce = try AES.GCM.Nonce(data: ivData)
        let sealedBox = try AES.GCM.SealedBox(combined: encryptedContent)
        let decryptedData = try AES.GCM.open(sealedBox, using: key)
        
        return decryptedData
    }
    
    enum EncryptionError: Error {
        case invalidData
        case decryptionFailed
    }
}

// MARK: - Blockchain Integration
class BlockchainManager: ObservableObject {
    static let shared = BlockchainManager()
    
    func createReward(for userId: String, type: BlockchainReward.RewardType) async throws -> BlockchainReward {
        // Simulate blockchain transaction
        let reward = BlockchainReward(
            id: UUID().uuidString,
            userId: userId,
            rewardType: type,
            amount: type.rewardAmount,
            transactionHash: "0x\(UUID().uuidString.replacingOccurrences(of: "-", with: ""))",
            timestamp: Date(),
            status: .confirmed,
            metadata: ["app": "MigrAid", "version": "1.0"]
        )
        
        // In a real implementation, this would interact with a blockchain
        return reward
    }
    
    func getRewards(for userId: String) async throws -> [BlockchainReward] {
        // Simulate fetching rewards from blockchain
        return []
    }
}

// MARK: - Voice Recognition Manager
class VoiceRecognitionManager: ObservableObject {
    static let shared = VoiceRecognitionManager()
    
    @Published var isListening = false
    @Published var recognizedText = ""
    @Published var confidence = 0.0
    
    private var speechRecognizer: SFSpeechRecognizer?
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    
    func processVoiceCommand(_ command: String) -> VoiceCommand {
        let lowercased = command.lowercased()
        
        if lowercased.contains("clinic") || lowercased.contains("medical") {
            return .findResource(.clinics)
        } else if lowercased.contains("legal") || lowercased.contains("lawyer") {
            return .findResource(.legalAid)
        } else if lowercased.contains("food") || lowercased.contains("hungry") {
            return .findResource(.food)
        } else if lowercased.contains("shelter") || lowercased.contains("home") {
            return .findResource(.shelter)
        } else if lowercased.contains("ice") || lowercased.contains("report") {
            return .reportICE
        } else {
            return .unknown
        }
    }
}

enum VoiceCommand {
    case findResource(ResourceCategory)
    case reportICE
    case unknown
}

// MARK: - Offline Manager
class OfflineManager: ObservableObject {
    static let shared = OfflineManager()
    
    @Published var isOfflineMode = false
    @Published var offlineData: OfflineData?
    @Published var lastSyncDate: Date?
    
    func downloadResources() async throws {
        // Download resources for offline use
        let resources = try await BackendService.shared.fetchResources()
        let offlineData = OfflineData(
            resources: resources,
            lastSync: Date(),
            version: "1.0",
            checksum: "checksum",
            size: 1024
        )
        
        // Save to local storage
        try await saveOfflineData(offlineData)
    }
    
    func saveOfflineData(_ data: OfflineData) async throws {
        // Save offline data to local storage
    }
    
    func loadOfflineData() async throws -> OfflineData? {
        // Load offline data from local storage
        return nil
    }
}

// MARK: - Backend Service
class BackendService: ObservableObject {
    static let shared = BackendService()
    
    func fetchResources() async throws -> [Resource] {
        // Fetch resources from backend
        return []
    }
    
    func submitICEReport(_ report: ICEReport) async throws {
        // Submit ICE report to backend
    }
    
    func verifyResource(_ resourceId: String, verification: CommunityVerification) async throws {
        // Submit resource verification
    }
    
    func getAdminDashboard() async throws -> AdminDashboard {
        // Get admin dashboard data
        return AdminDashboard(
            totalResources: 0,
            pendingVerifications: 0,
            activeUsers: 0,
            recentReports: [],
            systemHealth: AdminDashboard.SystemHealth(
                status: "healthy",
                uptime: 86400,
                errorRate: 0.01,
                responseTime: 0.5
            ),
            analytics: AdminDashboard.AnalyticsData(
                dailyActiveUsers: 0,
                weeklyReports: 0,
                monthlyResources: 0,
                topLanguages: [:],
                topCategories: [:]
            )
        )
    }
} 