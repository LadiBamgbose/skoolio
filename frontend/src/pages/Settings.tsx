import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Calendar, AlertCircle, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BillingService } from '../services'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function Settings() {
  const { user } = useAuth()
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const data = await BillingService.getSubscriptionStatus()
      setSubscriptionData(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setIsLoadingPortal(true)
      const { url } = await BillingService.createPortalSession()
      window.location.href = url
    } catch (error) {
      console.error('Error opening portal:', error)
      alert('Failed to open subscription management. Please try again.')
    } finally {
      setIsLoadingPortal(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  const planNames: Record<string, string> = {
    BASIC: 'Free',
    TEACHER: 'Teacher Plan',
    ADVANCED: 'Advanced Plan'
  }

  const planColors: Record<string, string> = {
    BASIC: 'bg-gray-100 text-gray-800',
    TEACHER: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and subscription</p>
        </div>

        {/* Account Info */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Info */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </h2>

          <div className="space-y-4">
            {/* Current Plan */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Current Plan</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${planColors[subscriptionData?.plan || 'BASIC']}`}>
                {planNames[subscriptionData?.plan || 'BASIC']}
              </span>
            </div>

            {/* Subscription Status */}
            {subscriptionData?.subscriptionStatus && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    subscriptionData.subscriptionStatus === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscriptionData.subscriptionStatus}
                  </span>
                </div>

                {/* Renewal Date */}
                {subscriptionData.currentPeriodEnd && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {subscriptionData.cancelAtPeriodEnd ? 'Expires' : 'Renews'} on
                    </label>
                    <p className="text-gray-900">
                      {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Cancel Notice */}
                {subscriptionData.cancelAtPeriodEnd && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Subscription Canceling</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your subscription will end on {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()}.
                        You can reactivate anytime before then.
                      </p>
                    </div>
                  </div>
                )}

                {/* Manage Subscription Button - Only show if user has active subscription */}
                {subscriptionData?.hasActiveSubscription && (
                  <div className="pt-4">
                    <button
                      onClick={handleManageSubscription}
                      disabled={isLoadingPortal}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingPortal ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          Manage Subscription
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Cancel, update payment method, or view billing history
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Free Plan CTA */}
            {!subscriptionData?.subscriptionStatus && (
              <div className="pt-4">
                <p className="text-gray-600 mb-4">
                  Upgrade to unlock more quizzes and premium features.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors"
                >
                  View Plans
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

