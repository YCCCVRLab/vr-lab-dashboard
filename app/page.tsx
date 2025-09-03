'use client'

import { useState, useEffect } from 'react'
import { 
  Monitor, 
  Users, 
  Calendar, 
  Clock, 
  Headphones, 
  Settings,
  Activity,
  BookOpen,
  MapPin,
  Wifi
} from 'lucide-react'
import { format } from 'date-fns'

interface WidgetProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  subtitle?: string
}

function Widget({ title, value, icon, color, subtitle }: WidgetProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

function StatusCard({ title, status, details }: { title: string; status: 'online' | 'offline' | 'maintenance'; details: string }) {
  const statusColors = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{details}</p>
    </div>
  )
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [labStatus, setLabStatus] = useState<'open' | 'closed'>('open')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()
    const day = currentTime.getDay()
    
    // Lab hours: Mon-Fri 8:00-16:30 (4:30 PM)
    const isWeekday = day >= 1 && day <= 5
    const isLabHours = hour >= 8 && hour < 16.5
    
    setLabStatus(isWeekday && isLabHours ? 'open' : 'closed')
  }, [currentTime])

  const isClassTime = () => {
    const hour = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const day = currentTime.getDay()
    const currentMinutes = hour * 60 + minutes
    const classStart = 11 * 60 // 11:00
    const classEnd = 12 * 60 + 15 // 12:15
    
    // Tuesday (2) and Thursday (4)
    return (day === 2 || day === 4) && currentMinutes >= classStart && currentMinutes <= classEnd
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VR Lab Dashboard</h1>
                <p className="text-sm text-gray-500">York County Community College</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">{format(currentTime, 'PPpp')}</p>
              <p className="text-sm text-gray-500">Room 112, Wells Campus</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lab Status Alert */}
        <div className={`mb-6 p-4 rounded-lg ${labStatus === 'open' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${labStatus === 'open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${labStatus === 'open' ? 'text-green-800' : 'text-red-800'}`}>
              VR Lab is currently {labStatus.toUpperCase()}
            </span>
            {isClassTime() && <span className="text-yellow-600 font-medium ml-4">⚠️ Class in session</span>}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Widget
            title="Active Sessions"
            value={3}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-blue-500"
            subtitle="2 Meta Quest 3"
          />
          <Widget
            title="Equipment Status"
            value="8/10"
            icon={<Monitor className="w-6 h-6 text-white" />}
            color="bg-green-500"
            subtitle="Available"
          />
          <Widget
            title="Today's Workshops"
            value={2}
            icon={<Calendar className="w-6 h-6 text-white" />}
            color="bg-purple-500"
            subtitle="1 upcoming"
          />
          <Widget
            title="Lab Utilization"
            value="75%"
            icon={<Activity className="w-6 h-6 text-white" />}
            color="bg-orange-500"
            subtitle="This week"
          />
        </div>

        {/* Equipment and Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipment Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Equipment Status</h2>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <StatusCard 
                title="Meta Quest 3 - Station 1" 
                status="online" 
                details="Battery: 85% | User: Student Demo"
              />
              <StatusCard 
                title="Meta Quest 3 - Station 2" 
                status="online" 
                details="Battery: 92% | Available"
              />
              <StatusCard 
                title="Projection System" 
                status="online" 
                details="Igloo Immersive Setup Ready"
              />
              <StatusCard 
                title="Workstation 3" 
                status="maintenance" 
                details="Software update in progress"
              />
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">VR Development Class</p>
                  <p className="text-sm text-gray-600">11:00 AM - 12:15 PM</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {isClassTime() ? 'Active' : 'Upcoming'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">VR Club Meeting</p>
                  <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Scheduled</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Office Hours</p>
                  <p className="text-sm text-gray-600">Until 5:30 PM</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <Headphones className="w-8 h-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Start VR Session</p>
              <p className="text-sm text-gray-600">Initialize Meta Quest 3</p>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Schedule Workshop</p>
              <p className="text-sm text-gray-600">Book lab time</p>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <Wifi className="w-8 h-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">System Check</p>
              <p className="text-sm text-gray-600">Run diagnostics</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}