import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section id="home" className="relative">
      <div className="min-h-[600px] flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-amber-700 text-lg font-medium tracking-wide">WELCOME TO</p>
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 font-serif italic">Golden Sunshine</h1>
                <div className="bg-gray-900 inline-block px-6 py-2">
                  <p className="text-white text-2xl md:text-3xl font-bold tracking-wider">ACADEMY</p>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">金色阳光学院</h2>

              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
                CONTACT US 了解更多
              </Button>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/happy-diverse-children-students-with-teacher-in-cl.jpg"
                alt="Students and teacher"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[50vh]"></div>
    </section>
  )
}
