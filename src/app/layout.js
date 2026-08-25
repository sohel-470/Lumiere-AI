import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from './provider';
import { Toaster } from '@/components/ui/sonner';


const outfit = Outfit({
  subsets: ['latin']
})

export const metadata = {
  title: "Lumiere AI",
  description: "An AI video generator",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html
        lang="en"
        className={outfit.className}
      >
        <body className="min-h-full flex flex-col">
          <Provider>
            {children}
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
