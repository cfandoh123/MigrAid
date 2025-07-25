package com.example.migraid

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.migraid.ui.theme.MigrAidTheme
import com.example.migraid.ui.OnboardingScreen
import com.example.migraid.ui.HomeScreen
import com.example.migraid.ui.ResourceDetailScreen
import com.example.migraid.ui.ICEReportScreen
import com.example.migraid.ui.AdvocateDashboardScreen
import com.example.migraid.ui.ResourceCategoryScreen
import com.example.migraid.ui.LoginScreen
import com.example.migraid.utils.LocaleHelper

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val navController = rememberNavController()
            MigrAidTheme {
                NavHost(navController = navController, startDestination = "login") {
                    composable("login") { LoginScreen(navController) }
                    composable("onboarding") { OnboardingScreen(navController, ::updateLocale) }
                    composable("home") { HomeScreen(navController) }
                    composable("resourceCategory/{category}") { backStackEntry ->
                        val category = backStackEntry.arguments?.getString("category")
                        if (category != null) {
                            ResourceCategoryScreen(navController, category)
                        }
                    }
                    composable("resourceDetail/{resourceId}") { backStackEntry ->
                        val resourceId = backStackEntry.arguments?.getString("resourceId")
                        ResourceDetailScreen(navController, resourceId)
                    }
                    composable("iceReport") { ICEReportScreen(navController) }
                    composable("advocateDashboard") { AdvocateDashboardScreen(navController) }
                }
            }
        }
    }
    
    private fun updateLocale(languageCode: String) {
        LocaleHelper.setLocale(this, languageCode)
        // Restart activity to apply locale changes
        recreate()
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MigrAidTheme {
        Greeting("Android")
    }
}