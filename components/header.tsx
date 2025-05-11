import { ModeToggle } from "./mode-toggle"
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image src="/ncaa-logo.png" alt="NCAA Logo" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">NCAA</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Civil Aviation Authority</p>
          </div>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}
