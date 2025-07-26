//
//  EnhancedVoiceView.swift
//  MigrAid
//
//  Created by Calvin Andoh on 7/25/25.
//

import SwiftUI
import Speech
import AVFoundation

struct EnhancedVoiceView: View {
    @StateObject private var voiceManager = VoiceRecognitionManager.shared
    @State private var showingVoiceInput = false
    @State private var recognizedText = ""
    @State private var isProcessing = false
    @State private var showingCommandResult = false
    @State private var lastCommand: VoiceCommand?
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                // Voice Status
                VStack(spacing: 20) {
                    Image(systemName: voiceManager.isListening ? "waveform.circle.fill" : "mic.circle.fill")
                        .font(.system(size: 100))
                        .foregroundColor(voiceManager.isListening ? .red : .teal)
                        .scaleEffect(voiceManager.isListening ? 1.2 : 1.0)
                        .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: voiceManager.isListening)
                    
                    Text(voiceManager.isListening ? "Listening..." : "Tap to speak")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .multilineTextAlignment(.center)
                    
                    if voiceManager.confidence > 0 {
                        Text("Confidence: \(Int(voiceManager.confidence * 100))%")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                
                // Recognized Text Display
                if !recognizedText.isEmpty {
                    VStack(spacing: 12) {
                        Text("You said:")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        
                        Text(recognizedText)
                            .font(.body)
                            .foregroundColor(.primary)
                            .multilineTextAlignment(.center)
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(12)
                            .frame(maxWidth: .infinity)
                    }
                }
                
                // Command Result
                if let command = lastCommand, showingCommandResult {
                    VStack(spacing: 12) {
                        Text("Command Recognized:")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        
                        CommandResultView(command: command)
                    }
                }
                
                Spacer()
                
                // Voice Commands Examples
                VStack(spacing: 16) {
                    Text("Try saying:")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                        VoiceCommandExample(text: "Find nearest clinic", icon: "cross.fill")
                        VoiceCommandExample(text: "I need legal help", icon: "scale.3d")
                        VoiceCommandExample(text: "Where can I get food?", icon: "fork.knife")
                        VoiceCommandExample(text: "Report ICE activity", icon: "exclamationmark.triangle.fill")
                        VoiceCommandExample(text: "Find shelter", icon: "house.fill")
                        VoiceCommandExample(text: "Mental health help", icon: "brain.head.profile")
                    }
                }
                
                // Voice Button
                Button(action: {
                    if voiceManager.isListening {
                        voiceManager.stopListening()
                        processRecognizedText()
                    } else {
                        startVoiceRecognition()
                    }
                }) {
                    Image(systemName: voiceManager.isListening ? "stop.fill" : "mic.fill")
                        .font(.title)
                        .foregroundColor(.white)
                        .padding(40)
                        .background(
                            Circle()
                                .fill(voiceManager.isListening ? Color.red : Color.teal)
                        )
                }
                .disabled(isProcessing)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Voice Assistant")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .onReceive(voiceManager.$recognizedText) { text in
                recognizedText = text
            }
        }
    }
    
    private func startVoiceRecognition() {
        voiceManager.startListening()
    }
    
    private func processRecognizedText() {
        guard !recognizedText.isEmpty else { return }
        
        isProcessing = true
        
        // Process the voice command
        let command = voiceManager.processVoiceCommand(recognizedText)
        lastCommand = command
        
        // Show command result
        showingCommandResult = true
        
        // Simulate processing delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            isProcessing = false
        }
    }
}

struct VoiceCommandExample: View {
    let text: String
    let icon: String
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.teal)
            
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct CommandResultView: View {
    let command: VoiceCommand
    
    var body: some View {
        VStack(spacing: 12) {
            switch command {
            case .findResource(let category):
                HStack {
                    Image(systemName: category.icon)
                        .font(.title2)
                        .foregroundColor(.teal)
                    
                    VStack(alignment: .leading) {
                        Text("Finding \(category.rawValue)")
                            .font(.headline)
                        Text("Searching for nearby resources...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    ProgressView()
                        .scaleEffect(0.8)
                }
                .padding()
                .background(Color.teal.opacity(0.1))
                .cornerRadius(12)
                
            case .reportICE:
                HStack {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.title2)
                        .foregroundColor(.red)
                    
                    VStack(alignment: .leading) {
                        Text("ICE Report")
                            .font(.headline)
                        Text("Opening report form...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    Image(systemName: "arrow.right")
                        .foregroundColor(.red)
                }
                .padding()
                .background(Color.red.opacity(0.1))
                .cornerRadius(12)
                
            case .unknown:
                HStack {
                    Image(systemName: "questionmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(.orange)
                    
                    VStack(alignment: .leading) {
                        Text("Command not recognized")
                            .font(.headline)
                        Text("Try speaking more clearly")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                }
                .padding()
                .background(Color.orange.opacity(0.1))
                .cornerRadius(12)
            }
        }
    }
}

// MARK: - Enhanced Voice Recognition Manager
extension VoiceRecognitionManager {
    func requestSpeechAuthorization() {
        SFSpeechRecognizer.requestAuthorization { status in
            DispatchQueue.main.async {
                switch status {
                case .authorized:
                    print("Speech recognition authorized")
                case .denied:
                    print("Speech recognition denied")
                case .restricted:
                    print("Speech recognition restricted")
                case .notDetermined:
                    print("Speech recognition not determined")
                @unknown default:
                    print("Speech recognition unknown status")
                }
            }
        }
    }
    
    func startListening() {
        guard let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US")) else {
            print("Speech recognizer not available")
            return
        }
        
        guard speechRecognizer.isAvailable else {
            print("Speech recognizer not available")
            return
        }
        
        // Request authorization
        SFSpeechRecognizer.requestAuthorization { [weak self] status in
            DispatchQueue.main.async {
                if status == .authorized {
                    self?.beginRecording()
                }
            }
        }
    }
    
    private func beginRecording() {
        // Implementation for starting voice recording
        isListening = true
        
        // Simulate voice recognition for demo
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            self.recognizedText = "Find nearest clinic"
            self.confidence = 0.95
        }
    }
    
    func stopListening() {
        isListening = false
        // Stop recording implementation
    }
} 