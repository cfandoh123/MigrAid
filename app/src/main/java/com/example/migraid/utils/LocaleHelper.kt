package com.example.migraid.utils

import android.content.Context
import android.content.res.Configuration
import android.content.res.Resources
import java.util.*

object LocaleHelper {
    
    fun setLocale(context: Context, languageCode: String): Context {
        val locale = when (languageCode) {
            "fr" -> Locale("fr")
            "ha" -> Locale("ha")
            "ak" -> Locale("ak")
            else -> Locale("en")
        }
        
        Locale.setDefault(locale)
        
        val config = Configuration(context.resources.configuration)
        config.setLocale(locale)
        
        return context.createConfigurationContext(config)
    }
    
    fun getLanguageCode(context: Context): String {
        val locale = context.resources.configuration.locales[0]
        return locale.language
    }
    
    fun getSupportedLanguages(): List<Language> {
        return listOf(
            Language("en", "English"),
            Language("fr", "Français"),
            Language("ha", "Hausa"),
            Language("ak", "Akan")
        )
    }
}

data class Language(
    val code: String,
    val name: String
) 