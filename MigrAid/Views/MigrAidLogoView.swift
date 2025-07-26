import SwiftUI

struct MigrAidLogoView: View {
    let size: CGFloat
    let showBackground: Bool
    
    init(size: CGFloat = 60, showBackground: Bool = true) {
        self.size = size
        self.showBackground = showBackground
    }
    
    var body: some View {
        ZStack {
            if showBackground {
                // Circular green background
                Circle()
                    .fill(Color(red: 0.4, green: 0.6, blue: 0.4)) // Muted green
                    .frame(width: size, height: size)
            }
            
            // Globe/World representation
            Circle()
                .stroke(Color.white, lineWidth: size * 0.08)
                .frame(width: size * 0.7, height: size * 0.7)
                .offset(y: size * 0.15)
            
            // Land masses on globe (simplified)
            Path { path in
                // Africa-like shape
                path.move(to: CGPoint(x: size * 0.35, y: size * 0.45))
                path.addCurve(
                    to: CGPoint(x: size * 0.25, y: size * 0.55),
                    control1: CGPoint(x: size * 0.3, y: size * 0.5),
                    control2: CGPoint(x: size * 0.25, y: size * 0.52)
                )
                path.addCurve(
                    to: CGPoint(x: size * 0.35, y: size * 0.65),
                    control1: CGPoint(x: size * 0.25, y: size * 0.58),
                    control2: CGPoint(x: size * 0.3, y: size * 0.62)
                )
                path.addCurve(
                    to: CGPoint(x: size * 0.45, y: size * 0.55),
                    control1: CGPoint(x: size * 0.4, y: size * 0.6),
                    control2: CGPoint(x: size * 0.45, y: size * 0.58)
                )
                path.addCurve(
                    to: CGPoint(x: size * 0.35, y: size * 0.45),
                    control1: CGPoint(x: size * 0.45, y: size * 0.52),
                    control2: CGPoint(x: size * 0.4, y: size * 0.48)
                )
            }
            .fill(Color.white)
            
            // Adult figure (taller)
            Path { path in
                // Head
                path.addEllipse(in: CGRect(x: size * 0.25, y: size * 0.2, width: size * 0.12, height: size * 0.12))
                
                // Body
                path.move(to: CGPoint(x: size * 0.31, y: size * 0.32))
                path.addLine(to: CGPoint(x: size * 0.31, y: size * 0.5))
                
                // Arms
                path.move(to: CGPoint(x: size * 0.31, y: size * 0.35))
                path.addLine(to: CGPoint(x: size * 0.38, y: size * 0.4)) // Right arm holding child
                path.move(to: CGPoint(x: size * 0.31, y: size * 0.35))
                path.addLine(to: CGPoint(x: size * 0.24, y: size * 0.4)) // Left arm
                
                // Legs (walking stride)
                path.move(to: CGPoint(x: size * 0.31, y: size * 0.5))
                path.addLine(to: CGPoint(x: size * 0.28, y: size * 0.6)) // Left leg forward
                path.move(to: CGPoint(x: size * 0.31, y: size * 0.5))
                path.addLine(to: CGPoint(x: size * 0.34, y: size * 0.58)) // Right leg back
            }
            .stroke(Color.white, lineWidth: size * 0.04)
            .fill(Color.white)
            
            // Child figure (shorter)
            Path { path in
                // Head
                path.addEllipse(in: CGRect(x: size * 0.45, y: size * 0.25, width: size * 0.1, height: size * 0.1))
                
                // Body
                path.move(to: CGPoint(x: size * 0.5, y: size * 0.35))
                path.addLine(to: CGPoint(x: size * 0.5, y: size * 0.48))
                
                // Arms
                path.move(to: CGPoint(x: size * 0.5, y: size * 0.38))
                path.addLine(to: CGPoint(x: size * 0.38, y: size * 0.4)) // Left arm holding adult
                path.move(to: CGPoint(x: size * 0.5, y: size * 0.38))
                path.addLine(to: CGPoint(x: size * 0.56, y: size * 0.42)) // Right arm
                
                // Legs (walking stride)
                path.move(to: CGPoint(x: size * 0.5, y: size * 0.48))
                path.addLine(to: CGPoint(x: size * 0.53, y: size * 0.56)) // Right leg forward
                path.move(to: CGPoint(x: size * 0.5, y: size * 0.48))
                path.addLine(to: CGPoint(x: size * 0.47, y: size * 0.54)) // Left leg back
            }
            .stroke(Color.white, lineWidth: size * 0.04)
            .fill(Color.white)
        }
        .frame(width: size, height: size)
    }
}

// Extension to create a simple icon version for smaller sizes
extension MigrAidLogoView {
    static func icon(size: CGFloat = 30) -> some View {
        ZStack {
            Circle()
                .fill(Color(red: 0.4, green: 0.6, blue: 0.4))
                .frame(width: size, height: size)
            
            // Simplified figures
            HStack(spacing: size * 0.1) {
                // Adult
                VStack(spacing: 0) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: size * 0.3, height: size * 0.3)
                    Rectangle()
                        .fill(Color.white)
                        .frame(width: size * 0.15, height: size * 0.4)
                }
                
                // Child
                VStack(spacing: 0) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: size * 0.25, height: size * 0.25)
                    Rectangle()
                        .fill(Color.white)
                        .frame(width: size * 0.12, height: size * 0.35)
                }
            }
        }
        .frame(width: size, height: size)
    }
}

#Preview {
    VStack(spacing: 40) {
        MigrAidLogoView(size: 80)
        MigrAidLogoView(size: 60)
        MigrAidLogoView(size: 40)
        MigrAidLogoView.icon(size: 30)
    }
    .padding()
    .background(Color.gray.opacity(0.1))
} 