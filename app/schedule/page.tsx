import { CalendarDays, Clock, MapPin } from 'lucide-react'

interface Event {
  name: string
  date: string
  time: string
  location: string
  description: string
}

const events: Event[] = [
  {
    name: "Mehendi Ceremony",
    date: "Friday, August 18, 2023",
    time: "4:00 PM - 8:00 PM",
    location: "Family Residence",
    description: "Join us for a colorful evening of henna application and music."
  },
  {
    name: "Sangeet Night",
    date: "Saturday, August 19, 2023",
    time: "7:00 PM - 11:00 PM",
    location: "Golden Palace Banquet Hall",
    description: "An evening of music, dance, and celebration with family and friends."
  },
  {
    name: "Wedding Ceremony",
    date: "Sunday, August 20, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Sunrise Garden Resort",
    description: "The auspicious wedding ceremony followed by lunch."
  },
  {
    name: "Reception",
    date: "Sunday, August 20, 2023",
    time: "7:00 PM - 11:00 PM",
    location: "Sunrise Garden Resort",
    description: "Join us in celebrating the newlyweds with dinner and dancing."
  }
]

export default function Schedule() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Wedding Schedule</h1>
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">{event.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center md:col-span-2">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                <span>{event.location}</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

