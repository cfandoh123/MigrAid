//
//  Item.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import Foundation
import SwiftData
import CoreLocation

// MARK: - Resource Model
@Model
final class Resource {
    var id: UUID
    var name: String
    var category: ResourceCategory
    var resourceDescription: String
    var address: String
    var phone: String
    var website: String?
    var languages: [String]
    var hours: String
    var isVerified: Bool
    var latitude: Double?
    var longitude: Double?
    var isOffline: Bool
    var createdAt: Date
    
    init(name: String, category: ResourceCategory, description: String, address: String, phone: String, website: String? = nil, languages: [String], hours: String, isVerified: Bool = false, latitude: Double? = nil, longitude: Double? = nil) {
        self.id = UUID()
        self.name = name
        self.category = category
        self.resourceDescription = description
        self.address = address
        self.phone = phone
        self.website = website
        self.languages = languages
        self.hours = hours
        self.isVerified = isVerified
        self.latitude = latitude
        self.longitude = longitude
        self.isOffline = false
        self.createdAt = Date()
    }
}

// MARK: - ICE Report Model
@Model
final class ICEReport {
    var id: UUID
    var reportDescription: String
    var location: String?
    var latitude: Double?
    var longitude: Double?
    var timestamp: Date
    var isAnonymous: Bool
    
    init(description: String, location: String? = nil, latitude: Double? = nil, longitude: Double? = nil, isAnonymous: Bool = true) {
        self.id = UUID()
        self.reportDescription = description
        self.location = location
        self.latitude = latitude
        self.longitude = longitude
        self.timestamp = Date()
        self.isAnonymous = isAnonymous
    }
}

// MARK: - User Settings Model
@Model
final class UserSettings {
    var id: UUID
    var language: String
    var isAnonymousMode: Bool
    var locationEnabled: Bool
    var voiceEnabled: Bool
    
    init(language: String = "en", isAnonymousMode: Bool = true, locationEnabled: Bool = false, voiceEnabled: Bool = true) {
        self.id = UUID()
        self.language = language
        self.isAnonymousMode = isAnonymousMode
        self.locationEnabled = locationEnabled
        self.voiceEnabled = voiceEnabled
    }
}

// MARK: - Enums
enum ResourceCategory: String, CaseIterable, Codable {
    case clinics = "Clinics"
    case legalAid = "Legal Aid"
    case food = "Food"
    case shelter = "Shelter"
    case education = "Education"
    case mentalHealth = "Mental Health"
    
    var icon: String {
        switch self {
        case .clinics: return "cross.fill"
        case .legalAid: return "scale.3d"
        case .food: return "fork.knife"
        case .shelter: return "house.fill"
        case .education: return "book.fill"
        case .mentalHealth: return "brain.head.profile"
        }
    }
    
    var color: String {
        switch self {
        case .clinics: return "teal"
        case .legalAid: return "blue"
        case .food: return "orange"
        case .shelter: return "green"
        case .education: return "purple"
        case .mentalHealth: return "pink"
        }
    }
}

enum Language: String, CaseIterable {
    case english = "en"
    case spanish = "es"
    case arabic = "ar"
    case french = "fr"
    case chinese = "zh"
    
    var displayName: String {
        switch self {
        case .english: return "English"
        case .spanish: return "Español"
        case .arabic: return "العربية"
        case .french: return "Français"
        case .chinese: return "中文"
        }
    }
}
