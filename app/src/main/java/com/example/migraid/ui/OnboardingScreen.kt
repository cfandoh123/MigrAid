package com.example.migraid.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.migraid.R
import java.util.*

@Composable
fun OnboardingScreen(
    navController: NavController, 
    onLanguageSelected: (String) -> Unit
) {
    var selectedLanguage by remember { mutableStateOf("en") }
    
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = stringResource(R.string.onboarding_title),
            style = MaterialTheme.typography.headlineLarge
        )
        Spacer(modifier = Modifier.height(32.dp))
        
        // Language selection buttons
        Text(
            text = stringResource(R.string.onboarding_select_language),
            style = MaterialTheme.typography.headlineSmall
        )
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = { selectedLanguage = "en" },
            modifier = Modifier.fillMaxWidth(0.8f),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (selectedLanguage == "en") MaterialTheme.colorScheme.primary 
                else MaterialTheme.colorScheme.secondary
            )
        ) {
            Text("English")
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Button(
            onClick = { selectedLanguage = "fr" },
            modifier = Modifier.fillMaxWidth(0.8f),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (selectedLanguage == "fr") MaterialTheme.colorScheme.primary 
                else MaterialTheme.colorScheme.secondary
            )
        ) {
            Text("Français")
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Button(
            onClick = { selectedLanguage = "ha" },
            modifier = Modifier.fillMaxWidth(0.8f),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (selectedLanguage == "ha") MaterialTheme.colorScheme.primary 
                else MaterialTheme.colorScheme.secondary
            )
        ) {
            Text("Hausa")
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Button(
            onClick = { selectedLanguage = "ak" },
            modifier = Modifier.fillMaxWidth(0.8f),
            colors = ButtonDefaults.buttonColors(
                containerColor = if (selectedLanguage == "ak") MaterialTheme.colorScheme.primary 
                else MaterialTheme.colorScheme.secondary
            )
        ) {
            Text("Akan")
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Continue button
        Button(
            onClick = { 
                onLanguageSelected(selectedLanguage)
                navController.navigate("home") 
            },
            modifier = Modifier.fillMaxWidth(0.8f)
        ) {
            Text("Continue")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Anonymous mode button
        OutlinedButton(
            onClick = { 
                // TODO: Enable anonymous mode
                navController.navigate("home") 
            },
            modifier = Modifier.fillMaxWidth(0.8f)
        ) {
            Text(stringResource(R.string.onboarding_anonymous_mode))
        }
    }
} 