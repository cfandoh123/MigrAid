package com.example.migraid.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.migraid.R
import com.example.migraid.data.mockResources
import com.example.migraid.data.ResourceType

@Composable
fun ResourceCategoryScreen(navController: NavController, category: String) {
    val resourceType = ResourceType.valueOf(category)
    val filteredResources = mockResources.filter { it.type == resourceType }
    
    Column(modifier = Modifier.fillMaxSize()) {
        // Top Bar
        TopAppBar(
            title = { 
                Text(
                    text = when (resourceType) {
                        ResourceType.CLINIC -> stringResource(R.string.find_clinics)
                        ResourceType.LEGAL_AID -> stringResource(R.string.find_legal_aid)
                        ResourceType.FOOD_SUPPORT -> stringResource(R.string.find_food_support)
                        ResourceType.SHELTER -> stringResource(R.string.find_shelter)
                        ResourceType.MENTAL_HEALTH -> "Find Mental Health Services"
                        ResourceType.EMPLOYMENT -> "Find Employment Resources"
                        ResourceType.EDUCATION -> "Find Education Resources"
                        ResourceType.TRANSPORTATION -> "Find Transportation Help"
                        else -> "Resources"
                    }
                )
            },
            navigationIcon = {
                IconButton(onClick = { navController.navigateUp() }) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
            }
        )
        
        // Resources List
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            if (filteredResources.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No resources available in this category",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                items(filteredResources) { resource ->
                    ResourceCard(
                        resource = resource,
                        onClick = { navController.navigate("resourceDetail/${resource.id}") }
                    )
                }
            }
        }
    }
} 