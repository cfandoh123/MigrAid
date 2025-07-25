package com.example.migraid.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.migraid.R
import com.example.migraid.data.mockResources
import com.example.migraid.data.ResourceType

@Composable
fun HomeScreen(navController: NavController) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp)
    ) {
        item {
            Text(
                text = stringResource(R.string.home_title),
                style = MaterialTheme.typography.headlineMedium,
                modifier = Modifier.padding(bottom = 24.dp)
            )
        }
        
        // Resource Categories
        item {
            Text(
                text = "Resource Categories",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }
        
        // Clinics Category
        item {
            ResourceCategoryCard(
                title = stringResource(R.string.find_clinics),
                icon = Icons.Default.LocalHospital,
                resourceCount = mockResources.count { it.type == ResourceType.CLINIC },
                onClick = { navController.navigate("resourceCategory/CLINIC") }
            )
        }
        
        // Legal Aid Category
        item {
            ResourceCategoryCard(
                title = stringResource(R.string.find_legal_aid),
                icon = Icons.Default.Gavel,
                resourceCount = mockResources.count { it.type == ResourceType.LEGAL_AID },
                onClick = { navController.navigate("resourceCategory/LEGAL_AID") }
            )
        }
        
        // Food Support Category
        item {
            ResourceCategoryCard(
                title = stringResource(R.string.find_food_support),
                icon = Icons.Default.Restaurant,
                resourceCount = mockResources.count { it.type == ResourceType.FOOD_SUPPORT },
                onClick = { navController.navigate("resourceCategory/FOOD_SUPPORT") }
            )
        }
        
        // Shelter Category
        item {
            ResourceCategoryCard(
                title = stringResource(R.string.find_shelter),
                icon = Icons.Default.Home,
                resourceCount = mockResources.count { it.type == ResourceType.SHELTER },
                onClick = { navController.navigate("resourceCategory/SHELTER") }
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
        
        // ICE Report Button
        item {
            Button(
                onClick = { navController.navigate("iceReport") },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Report,
                    contentDescription = null,
                    modifier = Modifier.padding(end = 8.dp)
                )
                Text(text = stringResource(R.string.report_ice_activity))
            }
        }
        
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        
        // All Resources Section
        item {
            Text(
                text = "All Resources",
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(bottom = 16.dp)
            )
        }
        
        // Display all resources
        items(mockResources) { resource ->
            ResourceCard(
                resource = resource,
                onClick = { navController.navigate("resourceDetail/${resource.id}") }
            )
        }
    }
}

@Composable
fun ResourceCategoryCard(
    title: String,
    icon: ImageVector,
    resourceCount: Int,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(32.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = "$resourceCount resources available",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Icon(
                imageVector = Icons.Default.ArrowForward,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun ResourceCard(
    resource: com.example.migraid.data.Resource,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = resource.name,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = resource.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = resource.address,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                if (resource.verified) {
                    Icon(
                        imageVector = Icons.Default.Verified,
                        contentDescription = "Verified",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
            if (resource.distanceMiles != null) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${resource.distanceMiles} miles away",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
} 