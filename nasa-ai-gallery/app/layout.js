import "./globals.css";

export const metadata = {
  title: "NASA AI Gallery",
  description: "Random NASA imagery with real-time AI-generated descriptions"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
