import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { GlobalStateProvider } from './context/GlobalState'
import { useScrollToTop } from './hooks/useScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shaadi.fun - Raj & Simran\'s Wedding',
  description: 'Fun mini-apps for Raj and Simran\'s wedding',
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  useScrollToTop()

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-red-500">Shaadi.fun</Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700">Fun</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] lg:w-[600px] bg-gray-800">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-red-500 to-red-900 p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mt-4 text-lg font-medium text-white">
                              Shaadi.fun
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Celebrate love with fun mini-apps
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/wishes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white">
                            <div className="text-sm font-medium leading-none">Ashirvad Express</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Share your 15-second video wishes for the couple
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/photos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white">
                            <div className="text-sm font-medium leading-none">Shaadi Snap</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Take 10 one-shot photos during the wedding
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/predictions" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white">
                            <div className="text-sm font-medium leading-none">Mauke Pe Chauka</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Place your bets on fun wedding events
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/trivia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white">
                            <div className="text-sm font-medium leading-none">Jodi Quiz</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              How well do you know the couple?
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/dj-requests" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white">
                            <div className="text-sm font-medium leading-none">DJ Waale Babu</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              Request your favorite song for the DJ to play
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700">Info</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-gray-800">
                      {[
                        {
                          title: "Schedule",
                          href: "/schedule",
                          description: "View the wedding event timeline",
                        },
                        {
                          title: "Registry",
                          href: "/registry",
                          description: "Find the perfect gift for the couple",
                        },
                        {
                          title: "RSVP",
                          href: "/rsvp",
                          description: "Confirm your attendance",
                        },
                        {
                          title: "The Couple",
                          href: "/couple",
                          description: "Learn about Rahul and Priya's love story",
                        },
                      ].map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white"
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                                {item.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </header>
        <main className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="bg-gray-800 mt-12 py-8">
          <div className="container mx-auto text-center">
            <Link href="/couple" className="text-2xl font-semibold mb-4 text-red-500 hover:text-red-400">
              Raj & Simran's Wedding
            </Link>
            <p className="mb-4 text-gray-400">August 18-20, 2023 | Sunrise Garden Resort, Mumbai</p>
            <div className="flex justify-center space-x-4">
              <Link href="/schedule" className="text-gray-300 hover:text-white">Schedule</Link>
              <Link href="/registry" className="text-gray-300 hover:text-white">Registry</Link>
              <Link href="/rsvp" className="text-gray-300 hover:text-white">RSVP</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalStateProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </GlobalStateProvider>
  )
}

