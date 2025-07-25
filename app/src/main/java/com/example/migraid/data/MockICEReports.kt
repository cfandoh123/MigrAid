package com.example.migraid.data

import java.util.Date

data class ICEReport(
    val id: String,
    val location: String,
    val description: String,
    val timestamp: Long,
    val verified: Boolean = false
)

val mockICEReports = listOf(
    ICEReport(
        id = "r1",
        location = "Central Park",
        description = "ICE agents spotted near the playground.",
        timestamp = System.currentTimeMillis() - 3600_000,
        verified = false
    ),
    ICEReport(
        id = "r2",
        location = "Downtown Library",
        description = "Unmarked vehicles, possible ICE presence.",
        timestamp = System.currentTimeMillis() - 7200_000,
        verified = true
    )
) 