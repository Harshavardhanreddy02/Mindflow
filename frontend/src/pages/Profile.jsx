import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'
import { User, Settings, Target, Award, Calendar, BarChart3, Globe, Bell, Cloud, Leaf, Sparkles, Brain, Heart } from 'lucide-react'
import { getApiBaseUrl } from '../utils/config'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [preferences, setPreferences] = useState({
    language: 'en',
    notifications: true,
    theme: 'light',
    privacy: 'friends'
  })
  const [stats, setStats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
 
  const [recentActivity, setRecentActivity] = useState([])
  const [moodTrend, setMoodTrend] = useState([])
  const [activityDistribution, setActivityDistribution] = useState({})
  const [journalEntries, setJournalEntries] = useState([])
  const [aiConversations, setAiConversations] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
  ]

  const fetchProfileData = useCallback(async () => {
    try {
      if (!user) {
        console.warn('User not authenticated, cannot fetch profile data')
       
        setStats([])
        setIsLoading(false)
        return
      }
      const idToken = await user.getIdToken()
      
      const statsResponse = await fetch(`${getApiBaseUrl()}/profile/stats`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      // Fetch user preferences
      const preferencesResponse = await fetch(`${getApiBaseUrl()}/profile/preferences`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      // Fetch mood trend from backend
      const moodTrendResponse = await fetch(`${getApiBaseUrl()}/profile/mood-trend?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      // Fetch activity distribution from backend
      const activityDistributionResponse = await fetch(`${getApiBaseUrl()}/profile/activity-distribution?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      // Fetch recent activity from backend
      const recentActivityResponse = await fetch(`${getApiBaseUrl()}/profile/recent-activity?limit=10`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      // Fetch journal entries for wellness calculation
      const journalResponse = await fetch(`${getApiBaseUrl()}/journal/entries`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      // Fetch AI conversations for wellness calculation
      const aiResponse = await fetch(`${getApiBaseUrl()}/ai/conversations`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      })
      
      // Fetch exercise sessions for wellness calculation
     
      
      // Check if any response failed
      if ( !statsResponse.ok || !preferencesResponse.ok || 
          !moodTrendResponse.ok || !activityDistributionResponse.ok || !recentActivityResponse.ok || !journalResponse.ok || !aiResponse.ok) {
        console.warn('Backend server not running')
        
        setStats([])
        setJournalEntries([])
        setAiConversations([])
        setIsLoading(false)
        return
      }
      
  
      
     
      const statsData = await statsResponse.json()
      const preferencesData = await preferencesResponse.json()
      const moodTrendData = await moodTrendResponse.json()
      const activityDistributionData = await activityDistributionResponse.json()
      const recentActivityData = await recentActivityResponse.json()
      const journalData = await journalResponse.json()
      const aiData = await aiResponse.json()
      
    
      if (statsData.success) {
        // Transform backend stats object into frontend format
        const backendStats = statsData.stats || {}
        const transformedStats = [
          {
            label: 'Journal Entries',
            value: backendStats.journalEntries || 0,
            icon: <Calendar className="w-6 h-6 text-white" />,
            color: 'from-blue-500 to-blue-600'
          },
          {
            label: 'AI Conversations',
            value: backendStats.aiConversations || 0,
            icon: <User className="w-6 h-6 text-white" />,
            color: 'from-green-500 to-green-600'
          }
        ]
        setStats(transformedStats)
      } else {
        console.error('Failed to fetch stats:', statsData.error)
        setStats([])
      }
      
      // Process journal entries and AI conversations for wellness calculation
      if (journalData.success) {
        setJournalEntries(journalData.entries || [])
      } else {
        console.error('Failed to fetch journal entries:', journalData.error)
        setJournalEntries([])
      }
      
      if (aiData.success) {
        setAiConversations(aiData.conversations || [])
      } else {
        console.error('Failed to fetch AI conversations:', aiData.error)
        setAiConversations([])
      }
      
      // Process exercise sessions for wellness calculation
    
      
      if (preferencesData.success) {
        setPreferences(preferencesData.preferences || {
          language: 'en',
          notifications: true,
          theme: 'light',
          privacy: 'friends'
        })
      } else {
        console.error('Failed to fetch preferences:', preferencesData.error)
      }
      
      // Process mood trend data from backend
      if (moodTrendData.success) {
        setMoodTrend(moodTrendData.moodTrend || [])
      } else {
        console.error('Failed to fetch mood trend:', moodTrendData.error)
        setMoodTrend([])
      }
      
      // Process activity distribution data from backend
      if (activityDistributionData.success) {
        setActivityDistribution(activityDistributionData.distribution || {})
      } else {
        console.error('Failed to fetch activity distribution:', activityDistributionData.error)
        setActivityDistribution({})
      }
      
      // Process recent activity data from backend
      if (recentActivityData.success) {
        setRecentActivity(recentActivityData.activities || [])
      } else {
        console.error('Failed to fetch recent activity:', recentActivityData.error)
        setRecentActivity([])
      }
    } catch (error) {
      console.error('Error fetching profile data:', error.message)
     
      setStats([])
      setRecentActivity([])
      setMoodTrend([])
      setActivityDistribution({})
    } finally {
      setIsLoading(false)
    }
  }, [user, selectedPeriod])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

  // Update stats when wellness scores change
  useEffect(() => {
    setStats([
      {
        label: 'Journal Entries',
        value: journalEntries.length.toString(),
        icon: <Calendar className="w-6 h-6 text-white" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        label: 'AI Conversations',
        value: aiConversations.length.toString(),
        icon: <User className="w-6 h-6 text-white" />,
        color: 'from-green-500 to-green-600'
      },
     
    ])
  }, [journalEntries, aiConversations])



 
 

  return (
    <div className="min-h-screen wellness-bg relative overflow-hidden">
      {/* Floating wellness elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-sky-200/30"
        >
          <Cloud className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-32 text-emerald-200/25"
        >
          <Leaf className="w-12 h-12" />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-32 text-violet-200/20"
        >
          <Sparkles className="w-14 h-14" />
        </motion.div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-wellness border-b border-emerald-100/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="mr-6 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600"
              >
                ← Back
              </Button>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-slate-700">Wellness Profile</h1>
                  <p className="text-sm text-slate-500">Manage your wellness journey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-wellness p-8 mb-8 border border-emerald-100"
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-wellness">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-light text-slate-700 mb-2">
                {user?.displayName || 'User'}
              </h2>
              <p className="text-slate-600 mb-4">
                {user?.email || 'user@example.com'}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
                <span className="text-sm text-slate-500">
                  Member since {new Date().getFullYear()}
                </span>
              </div>
            </div>
            {/* <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-wellness hover:shadow-wellness-lg">
              Edit Profile
            </Button> */}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading stats...</p>
              </div>
            </div>
          ) : (
            stats.map((stat, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-wellness p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-wellness`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-700 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))
          )}
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-wellness overflow-hidden border border-emerald-100">
          <div className="border-b border-emerald-100">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-light text-slate-700">Weekly Progress</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="text-sm border border-emerald-200 rounded-lg px-3 py-1 bg-white/50 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Activity Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">AI Conversations</span>
                            <span className="text-sm font-medium">{activityDistribution.aiConversations || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${activityDistribution.aiConversations || 0}%` }}></div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Journaling</span>
                            <span className="text-sm font-medium">{activityDistribution.journaling || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${activityDistribution.journaling || 0}%` }}></div>
                          </div>
                                                  
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-light text-slate-700 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                        <span className="ml-2 text-slate-600">Loading recent activity...</span>
                      </div>
                    ) : recentActivity.length > 0 ? (
                      recentActivity.map((item) => {
                        // Get appropriate icon based on activity type
                        const getActivityIcon = (type) => {
                          switch (type) {
                            case 'journal': return '📝'
                            case 'ai': return '🤖'
                            case 'exercise': return '💪'
                            default: return '📊'
                          }
                        }
                        
                        return (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{getActivityIcon(item.type)}</div>
                              <div>
                                <p className="font-medium text-slate-700">{item.activity}</p>
                                <p className="text-sm text-slate-500">{item.time}</p>
                                {item.description && (
                                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-emerald-600">{item.points}</div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <p>No recent activity found</p>
                        <p className="text-sm mt-2">Start journaling, meditating, or chatting with AI to see your activity here!</p>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}       
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile