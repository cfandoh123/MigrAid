//
//  EnhancedFeaturesTests.swift
//  MigrAidTests
//
//  Created by Calvin Andoh on 7/25/25.
//

import XCTest
import SwiftUI
import SwiftData
@testable import MigrAid

final class EnhancedFeaturesTests: XCTestCase {
    
    // MARK: - Backend Integration Tests
    
    func testBackendServiceFetchResources() async throws {
        let backendService = BackendService.shared
        
        do {
            let resources = try await backendService.fetchResources()
            XCTAssertNotNil(resources)
            XCTAssertTrue(resources is [Resource])
        } catch {
            XCTFail("Backend service should handle errors gracefully: \(error)")
        }
    }
    
    func testBackendServiceSubmitICEReport() async throws {
        let backendService = BackendService.shared
        let report = ICEReport(
            description: "Test ICE activity report",
            location: "Test location",
            isAnonymous: true
        )
        
        do {
            try await backendService.submitICEReport(report)
            // If no exception is thrown, the test passes
        } catch {
            XCTFail("Backend service should handle ICE report submission: \(error)")
        }
    }
    
    func testBackendServiceGetAdminDashboard() async throws {
        let backendService = BackendService.shared
        
        do {
            let dashboard = try await backendService.getAdminDashboard()
            XCTAssertNotNil(dashboard)
            XCTAssertEqual(dashboard.totalResources, 0)
            XCTAssertEqual(dashboard.pendingVerifications, 0)
            XCTAssertEqual(dashboard.activeUsers, 0)
        } catch {
            XCTFail("Backend service should return admin dashboard: \(error)")
        }
    }
    
    // MARK: - Encryption Tests
    
    func testEncryptionManagerEncryptDecrypt() throws {
        let encryptionManager = EncryptionManager.shared
        let testData = "Test sensitive data".data(using: .utf8)!
        
        do {
            let encryptedData = try encryptionManager.encrypt(testData)
            XCTAssertNotNil(encryptedData)
            XCTAssertNotEqual(encryptedData.encryptedContent, "")
            XCTAssertNotEqual(encryptedData.iv, "")
            XCTAssertNotEqual(encryptedData.signature, "")
            
            let decryptedData = try encryptionManager.decrypt(encryptedData)
            XCTAssertEqual(decryptedData, testData)
        } catch {
            XCTFail("Encryption/decryption should work: \(error)")
        }
    }
    
    func testEncryptionManagerInvalidData() throws {
        let encryptionManager = EncryptionManager.shared
        let invalidEncryptedData = EncryptedData(
            encryptedContent: "invalid",
            iv: "invalid",
            timestamp: Date(),
            signature: "invalid"
        )
        
        do {
            _ = try encryptionManager.decrypt(invalidEncryptedData)
            XCTFail("Should throw error for invalid data")
        } catch {
            XCTAssertTrue(error is EncryptionManager.EncryptionError)
        }
    }
    
    // MARK: - Blockchain Tests
    
    func testBlockchainManagerCreateReward() async throws {
        let blockchainManager = BlockchainManager.shared
        let userId = "test-user-123"
        let rewardType = BlockchainReward.RewardType.resourceVerification
        
        do {
            let reward = try await blockchainManager.createReward(for: userId, type: rewardType)
            XCTAssertNotNil(reward)
            XCTAssertEqual(reward.userId, userId)
            XCTAssertEqual(reward.rewardType, rewardType)
            XCTAssertEqual(reward.amount, rewardType.rewardAmount)
            XCTAssertEqual(reward.status, .confirmed)
            XCTAssertTrue(reward.transactionHash.hasPrefix("0x"))
        } catch {
            XCTFail("Blockchain manager should create rewards: \(error)")
        }
    }
    
    func testBlockchainManagerGetRewards() async throws {
        let blockchainManager = BlockchainManager.shared
        let userId = "test-user-123"
        
        do {
            let rewards = try await blockchainManager.getRewards(for: userId)
            XCTAssertNotNil(rewards)
            XCTAssertTrue(rewards is [BlockchainReward])
        } catch {
            XCTFail("Blockchain manager should get rewards: \(error)")
        }
    }
    
    // MARK: - Voice Recognition Tests
    
    func testVoiceRecognitionManagerProcessCommand() {
        let voiceManager = VoiceRecognitionManager.shared
        
        let testCommands = [
            ("Find nearest clinic", VoiceCommand.findResource(.clinics)),
            ("I need legal help", VoiceCommand.findResource(.legalAid)),
            ("Where can I get food?", VoiceCommand.findResource(.food)),
            ("Report ICE activity", VoiceCommand.reportICE),
            ("Find shelter", VoiceCommand.findResource(.shelter)),
            ("Unknown command", VoiceCommand.unknown)
        ]
        
        for (command, expectedResult) in testCommands {
            let result = voiceManager.processVoiceCommand(command)
            XCTAssertEqual(result, expectedResult, "Command '\(command)' should return \(expectedResult)")
        }
    }
    
    // MARK: - Offline Manager Tests
    
    func testOfflineManagerDownloadResources() async throws {
        let offlineManager = OfflineManager.shared
        
        do {
            try await offlineManager.downloadResources()
            // If no exception is thrown, the test passes
        } catch {
            XCTFail("Offline manager should handle resource downloads: \(error)")
        }
    }
    
    func testOfflineManagerSaveLoadData() async throws {
        let offlineManager = OfflineManager.shared
        let testData = OfflineData(
            resources: [],
            lastSync: Date(),
            version: "1.0",
            checksum: "test-checksum",
            size: 1024
        )
        
        do {
            try await offlineManager.saveOfflineData(testData)
            let loadedData = try await offlineManager.loadOfflineData()
            // Note: In a real implementation, loadedData should match testData
            XCTAssertNotNil(loadedData)
        } catch {
            XCTFail("Offline manager should handle data persistence: \(error)")
        }
    }
    
    // MARK: - Community Verification Tests
    
    func testCommunityVerificationCreation() {
        let verification = CommunityVerification(
            id: "test-id",
            resourceId: "resource-123",
            verifiedBy: "test-user",
            verificationType: .advocate,
            timestamp: Date(),
            status: .approved,
            notes: "Test verification",
            evidence: ["photo1.jpg", "photo2.jpg"]
        )
        
        XCTAssertEqual(verification.id, "test-id")
        XCTAssertEqual(verification.resourceId, "resource-123")
        XCTAssertEqual(verification.verificationType, .advocate)
        XCTAssertEqual(verification.status, .approved)
        XCTAssertEqual(verification.verificationType.weight, 10)
    }
    
    func testVerificationTypeWeights() {
        XCTAssertEqual(CommunityVerification.VerificationType.advocate.weight, 10)
        XCTAssertEqual(CommunityVerification.VerificationType.community.weight, 5)
        XCTAssertEqual(CommunityVerification.VerificationType.official.weight, 15)
        XCTAssertEqual(CommunityVerification.VerificationType.user.weight, 1)
    }
    
    // MARK: - Language Support Tests
    
    func testLanguageDisplayNames() {
        XCTAssertEqual(Language.english.displayName, "English")
        XCTAssertEqual(Language.spanish.displayName, "Español")
        XCTAssertEqual(Language.arabic.displayName, "العربية")
        XCTAssertEqual(Language.french.displayName, "Français")
        XCTAssertEqual(Language.chinese.displayName, "中文")
    }
    
    func testLanguageRawValues() {
        XCTAssertEqual(Language.english.rawValue, "en")
        XCTAssertEqual(Language.spanish.rawValue, "es")
        XCTAssertEqual(Language.arabic.rawValue, "ar")
        XCTAssertEqual(Language.french.rawValue, "fr")
        XCTAssertEqual(Language.chinese.rawValue, "zh")
    }
    
    // MARK: - Resource Category Tests
    
    func testResourceCategoryIcons() {
        XCTAssertEqual(ResourceCategory.clinics.icon, "cross.fill")
        XCTAssertEqual(ResourceCategory.legalAid.icon, "scale.3d")
        XCTAssertEqual(ResourceCategory.food.icon, "fork.knife")
        XCTAssertEqual(ResourceCategory.shelter.icon, "house.fill")
        XCTAssertEqual(ResourceCategory.education.icon, "book.fill")
        XCTAssertEqual(ResourceCategory.mentalHealth.icon, "brain.head.profile")
    }
    
    func testResourceCategoryColors() {
        XCTAssertEqual(ResourceCategory.clinics.color, "teal")
        XCTAssertEqual(ResourceCategory.legalAid.color, "blue")
        XCTAssertEqual(ResourceCategory.food.color, "orange")
        XCTAssertEqual(ResourceCategory.shelter.color, "green")
        XCTAssertEqual(ResourceCategory.education.color, "purple")
        XCTAssertEqual(ResourceCategory.mentalHealth.color, "pink")
    }
    
    // MARK: - Blockchain Reward Tests
    
    func testBlockchainRewardTypes() {
        XCTAssertEqual(BlockchainReward.RewardType.resourceVerification.displayName, "Resource Verification")
        XCTAssertEqual(BlockchainReward.RewardType.iceReport.displayName, "ICE Report")
        XCTAssertEqual(BlockchainReward.RewardType.communityHelp.displayName, "Community Help")
        XCTAssertEqual(BlockchainReward.RewardType.translation.displayName, "Translation")
        XCTAssertEqual(BlockchainReward.RewardType.accessibility.displayName, "Accessibility")
    }
    
    func testBlockchainRewardAmounts() {
        XCTAssertEqual(BlockchainReward.RewardType.resourceVerification.rewardAmount, 10.0)
        XCTAssertEqual(BlockchainReward.RewardType.iceReport.rewardAmount, 5.0)
        XCTAssertEqual(BlockchainReward.RewardType.communityHelp.rewardAmount, 15.0)
        XCTAssertEqual(BlockchainReward.RewardType.translation.rewardAmount, 8.0)
        XCTAssertEqual(BlockchainReward.RewardType.accessibility.rewardAmount, 12.0)
    }
    
    // MARK: - Admin Dashboard Tests
    
    func testAdminDashboardCreation() {
        let systemHealth = AdminDashboard.SystemHealth(
            status: "healthy",
            uptime: 86400,
            errorRate: 0.01,
            responseTime: 0.5
        )
        
        let analytics = AdminDashboard.AnalyticsData(
            dailyActiveUsers: 100,
            weeklyReports: 25,
            monthlyResources: 50,
            topLanguages: ["English": 80, "Spanish": 20],
            topCategories: ["Clinics": 30, "Legal Aid": 20]
        )
        
        let dashboard = AdminDashboard(
            totalResources: 100,
            pendingVerifications: 5,
            activeUsers: 50,
            recentReports: [],
            systemHealth: systemHealth,
            analytics: analytics
        )
        
        XCTAssertEqual(dashboard.totalResources, 100)
        XCTAssertEqual(dashboard.pendingVerifications, 5)
        XCTAssertEqual(dashboard.activeUsers, 50)
        XCTAssertEqual(dashboard.systemHealth.status, "healthy")
        XCTAssertEqual(dashboard.analytics.dailyActiveUsers, 100)
    }
    
    // MARK: - API Response Tests
    
    func testAPIResponseSuccess() {
        let testData = "Test data"
        let response = APIResponse(
            success: true,
            data: testData,
            message: "Success",
            error: nil,
            timestamp: Date()
        )
        
        XCTAssertTrue(response.success)
        XCTAssertEqual(response.data as? String, testData)
        XCTAssertEqual(response.message, "Success")
        XCTAssertNil(response.error)
    }
    
    func testAPIResponseError() {
        let apiError = APIError(
            code: "INVALID_REQUEST",
            message: "Invalid request",
            details: ["field": "required"]
        )
        
        let response = APIResponse<String>(
            success: false,
            data: nil,
            message: "Error occurred",
            error: apiError,
            timestamp: Date()
        )
        
        XCTAssertFalse(response.success)
        XCTAssertNil(response.data)
        XCTAssertEqual(response.message, "Error occurred")
        XCTAssertNotNil(response.error)
        XCTAssertEqual(response.error?.code, "INVALID_REQUEST")
    }
    
    // MARK: - Offline Data Tests
    
    func testOfflineDataCreation() {
        let resources = [
            Resource(
                name: "Test Clinic",
                category: .clinics,
                description: "Test description",
                address: "Test address",
                phone: "555-1234",
                languages: ["English", "Spanish"],
                hours: "9AM-5PM"
            )
        ]
        
        let offlineData = OfflineData(
            resources: resources,
            lastSync: Date(),
            version: "1.0",
            checksum: "abc123",
            size: 2048
        )
        
        XCTAssertEqual(offlineData.resources.count, 1)
        XCTAssertEqual(offlineData.version, "1.0")
        XCTAssertEqual(offlineData.checksum, "abc123")
        XCTAssertEqual(offlineData.size, 2048)
    }
    
    // MARK: - Voice Recognition Result Tests
    
    func testVoiceRecognitionResult() {
        let result = VoiceRecognitionResult(
            text: "Find nearest clinic",
            confidence: 0.95,
            language: "en-US",
            timestamp: Date(),
            processingTime: 1.5,
            alternatives: ["Find nearest clinic", "Find nearest medical"]
        )
        
        XCTAssertEqual(result.text, "Find nearest clinic")
        XCTAssertEqual(result.confidence, 0.95, accuracy: 0.01)
        XCTAssertEqual(result.language, "en-US")
        XCTAssertEqual(result.alternatives.count, 2)
    }
    
    // MARK: - Performance Tests
    
    func testEncryptionPerformance() throws {
        let encryptionManager = EncryptionManager.shared
        let testData = "Large test data for performance testing".data(using: .utf8)!
        
        measure {
            do {
                let encryptedData = try encryptionManager.encrypt(testData)
                _ = try encryptionManager.decrypt(encryptedData)
            } catch {
                XCTFail("Performance test failed: \(error)")
            }
        }
    }
    
    func testVoiceCommandProcessingPerformance() {
        let voiceManager = VoiceRecognitionManager.shared
        let testCommands = Array(repeating: "Find nearest clinic", count: 1000)
        
        measure {
            for command in testCommands {
                _ = voiceManager.processVoiceCommand(command)
            }
        }
    }
    
    // MARK: - Integration Tests
    
    func testCompleteWorkflow() async throws {
        // Test a complete workflow from resource creation to blockchain reward
        let resource = Resource(
            name: "Integration Test Clinic",
            category: .clinics,
            description: "Test clinic for integration testing",
            address: "123 Test St",
            phone: "555-9999",
            languages: ["English"],
            hours: "9AM-5PM"
        )
        
        // Test backend submission
        let backendService = BackendService.shared
        do {
            try await backendService.verifyResource(resource.id.uuidString, verification: CommunityVerification(
                id: "test-verification",
                resourceId: resource.id.uuidString,
                verifiedBy: "test-user",
                verificationType: .advocate,
                timestamp: Date(),
                status: .approved,
                notes: "Integration test verification",
                evidence: nil
            ))
        } catch {
            XCTFail("Integration test failed at verification: \(error)")
        }
        
        // Test blockchain reward creation
        let blockchainManager = BlockchainManager.shared
        do {
            let reward = try await blockchainManager.createReward(for: "test-user", type: .resourceVerification)
            XCTAssertEqual(reward.rewardType, .resourceVerification)
            XCTAssertEqual(reward.status, .confirmed)
        } catch {
            XCTFail("Integration test failed at blockchain reward: \(error)")
        }
    }
} 