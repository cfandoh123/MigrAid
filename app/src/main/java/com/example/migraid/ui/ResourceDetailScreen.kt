package com.example.migraid.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.migraid.R
import com.example.migraid.data.mockResources

@Composable
fun ResourceDetailScreen(navController: NavController, resourceId: String? = null) {
    val resource = mockResources.find { it.id == resourceId }
    
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (resource != null) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = resource.name,
                        style = MaterialTheme.typography.headlineMedium
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = resource.description,
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Address: ${resource.address}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    if (resource.phone != null) {
                        Text(
                            text = "Phone: ${resource.phone}",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                    if (resource.distanceMiles != null) {
                        Text(
                            text = "Distance: ${resource.distanceMiles} miles",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (resource.verified) "✓ Verified" else "⚠ Not verified",
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        } else {
            Text(text = "Resource not found")
        }
    }
} 