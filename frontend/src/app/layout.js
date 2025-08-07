import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "MedAssist AI - Clinical Dashboard",
  description: "Healthcare-focused AI application designed to assist with medical queries and support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
