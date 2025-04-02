import "./globals.css";
import logo from "@/public/images/logo/logo.png";


export const metadata = {
  title: "Aslam Zaman 2024",
  description: "Created By Aslam Zaman ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
