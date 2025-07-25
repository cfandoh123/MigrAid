package com.example.migraid.data

data class Resource(
    val id: String,
    val type: ResourceType,
    val name: String,
    val description: String,
    val address: String,
    val phone: String?,
    val verified: Boolean = false,
    val distanceMiles: Double? = null
)

enum class ResourceType {
    CLINIC, LEGAL_AID, FOOD_SUPPORT, SHELTER
}

val mockResources = listOf(
    Resource(
        id = "1",
        type = ResourceType.CLINIC,
        name = "Sunrise Health Clinic",
        description = "Free walk-in clinic for all ages.",
        address = "123 Main St",
        phone = "555-1234",
        verified = true,
        distanceMiles = 1.2
    ),
    Resource(
        id = "2",
        type = ResourceType.LEGAL_AID,
        name = "Justice For All",
        description = "Pro bono legal aid for immigrants.",
        address = "456 Liberty Ave",
        phone = "555-5678",
        verified = false,
        distanceMiles = 2.5
    ),
    Resource(
        id = "3",
        type = ResourceType.FOOD_SUPPORT,
        name = "Hope Food Pantry",
        description = "Weekly food distribution.",
        address = "789 Hope Rd",
        phone = null,
        verified = true,
        distanceMiles = 0.8
    ),
    Resource(
        id = "4",
        type = ResourceType.SHELTER,
        name = "Safe Haven Shelter",
        description = "Emergency overnight shelter.",
        address = "321 Shelter Ln",
        phone = "555-8765",
        verified = false,
        distanceMiles = 3.0
    )
) 