import { useQuery, useMutation, useQueryClient } from 'react-query'
import { adminAPI, superAdminAPI, skillsAPI, teachersAPI, sessionsAPI, creditsAPI, notificationsAPI } from '../services/api'
import toast from 'react-hot-toast'

// Admin Hooks
export const useAdminAnalytics = (params) => useQuery(['adminAnalytics', params], () => adminAPI.analytics(params).then(res => res.data.data))
export const useAdminUsers = (params) => useQuery(['adminUsers', params], () => adminAPI.users(params).then(res => res.data.data))
export const useAdminSkills = (params) => useQuery(['adminSkills', params], () => adminAPI.skillsManagement(params).then(res => res.data.data))
export const useBranding = () => useQuery('branding', () => adminAPI.getSettings().then(res => res.data.data))
export const useSaveBranding = () => {
  const queryClient = useQueryClient()
  return useMutation(data => adminAPI.saveSettings(data), {
    onSuccess: () => { toast.success('Branding saved!'); queryClient.invalidateQueries('branding') }
  })
}
export const useBilling = () => useQuery('billing', () => adminAPI.billing().then(res => res.data.data))

// Super Admin Hooks
export const usePlatformStats = () => useQuery('platformStats', () => superAdminAPI.analytics().then(res => res.data.data))
export const useTenants = (params) => useQuery(['tenants', params], () => superAdminAPI.tenants(params).then(res => res.data.data))
export const useCreateTenant = () => {
  const queryClient = useQueryClient()
  return useMutation(data => superAdminAPI.createTenant(data), {
    onSuccess: () => { toast.success('Tenant created!'); queryClient.invalidateQueries('tenants') }
  })
}
export const useSuspendTenant = () => {
  const queryClient = useQueryClient()
  return useMutation(id => superAdminAPI.suspendTenant(id), {
    onSuccess: () => { toast.success('Tenant suspended!'); queryClient.invalidateQueries('tenants') }
  })
}
export const usePlans = () => useQuery('plans', () => superAdminAPI.plans().then(res => res.data.data))
export const useRevenue = () => useQuery('revenue', () => superAdminAPI.revenue().then(res => res.data.data))
export const useTickets = (params) => useQuery(['tickets', params], () => superAdminAPI.tickets(params).then(res => res.data.data))

// Student Hooks
export const useTeachers = (params) => useQuery(['teachers', params], () => teachersAPI.list(params).then(res => res.data.data))
export const useMySessions = (params) => useQuery(['mySessions', params], () => sessionsAPI.list(params).then(res => res.data.data))
export const useBookSession = () => {
  const queryClient = useQueryClient()
  return useMutation(data => sessionsAPI.request(data), {
    onSuccess: () => { toast.success('Session booked!'); queryClient.invalidateQueries('mySessions') }
  })
}
export const useAcceptSession = () => {
  const queryClient = useQueryClient()
  return useMutation(id => sessionsAPI.accept(id), {
    onSuccess: () => { toast.success('Session accepted!'); queryClient.invalidateQueries('mySessions') }
  })
}
export const useRejectSession = () => {
  const queryClient = useQueryClient()
  return useMutation(id => sessionsAPI.reject(id), {
    onSuccess: () => { toast.success('Session rejected!'); queryClient.invalidateQueries('mySessions') }
  })
}
export const useMarkComplete = () => {
  const queryClient = useQueryClient()
  return useMutation(id => sessionsAPI.markCompleted(id), {
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Session confirmed!')
      queryClient.invalidateQueries('mySessions')
    }
  })
}
export const useCancelSession = () => {
  const queryClient = useQueryClient()
  return useMutation(({ sessionId, data }) => sessionsAPI.cancel(sessionId, data), {
    onSuccess: (res) => {
      const msg = res.data?.message || 'Session cancelled'
      if (res.data?.penalty_applied) {
        toast.error(msg, { duration: 5000 })
      } else {
        toast.success(msg)
      }
      queryClient.invalidateQueries('mySessions')
      queryClient.invalidateQueries('transactions')
      queryClient.invalidateQueries('notifications')
    },
    onError: (err) => {
      const apiMsg = err?.response?.data?.message
      const apiErrors = err?.response?.data?.errors
      const firstField = apiErrors ? Object.keys(apiErrors)[0] : null
      const firstErr = firstField && Array.isArray(apiErrors[firstField]) ? apiErrors[firstField][0] : null
      const msg = firstErr || apiMsg || 'Failed to cancel session'
      toast.error(msg)
    }
  })
}
export const useMySkills = () => useQuery('mySkills', () => teachersAPI.myProfile().then(res => res.data.data?.skills || []))
export const useAddSkill = () => {
  const queryClient = useQueryClient()
  return useMutation(data => skillsAPI.create(data), {
    onSuccess: () => { toast.success('Skill added!'); queryClient.invalidateQueries('mySkills') }
  })
}
export const useRemoveSkill = () => {
  const queryClient = useQueryClient()
  return useMutation(id => skillsAPI.delete(id), {
    onSuccess: () => { toast.success('Skill removed!'); queryClient.invalidateQueries('mySkills') }
  })
}
export const useCategories = () => useQuery('categories', () => skillsAPI.categories().then(res => res.data.data))
export const useMyRatings = () => useQuery('myRatings', () => sessionsAPI.history().then(res => res.data.data))
export const useSubmitRating = () => {
  const queryClient = useQueryClient()
  return useMutation(({ sessionId, data }) => sessionsAPI.rate(sessionId, data), {
    onSuccess: () => {
      toast.success('Rating submitted!')
      queryClient.invalidateQueries('mySessions')
      queryClient.invalidateQueries('myRatings')
      queryClient.invalidateQueries('transactions')
      queryClient.invalidateQueries('teachers')
    }
  })
}
export const useTransactions = (params) => useQuery(['transactions', params], () => creditsAPI.transactions(params).then(res => res.data.data))
export const useMyAvailability = () => useQuery('myAvailability', () => teachersAPI.myProfile().then(res => res.data.data?.availability || []))
export const useSetAvailability = () => {
  const queryClient = useQueryClient()
  return useMutation(data => teachersAPI.setAvailability(data.slots), {
    onSuccess: () => { toast.success('Availability saved!'); queryClient.invalidateQueries('myAvailability') }
  })
}

export const useUpdateMeetingPlace = () => {
  const queryClient = useQueryClient()
  return useMutation(({ sessionId, data }) => sessionsAPI.updateMeetingPlace(sessionId, data), {
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Meeting place saved!')
      queryClient.invalidateQueries('mySessions')
      queryClient.invalidateQueries('notifications')
    },
    onError: (err) => {
      const apiMsg = err?.response?.data?.message
      const apiErrors = err?.response?.data?.errors
      const firstField = apiErrors ? Object.keys(apiErrors)[0] : null
      const firstErr = firstField && Array.isArray(apiErrors[firstField]) ? apiErrors[firstField][0] : null
      const msg = firstErr || apiMsg || 'Failed to save meeting place'
      toast.error(msg)
    }
  })
}

export const useAcceptMeetingPlace = () => {
  const queryClient = useQueryClient()
  return useMutation((sessionId) => sessionsAPI.acceptMeetingPlace(sessionId), {
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Meeting place accepted!')
      queryClient.invalidateQueries('mySessions')
      queryClient.invalidateQueries('notifications')
    },
    onError: (err) => {
      const apiMsg = err?.response?.data?.message
      const apiErrors = err?.response?.data?.errors
      const firstField = apiErrors ? Object.keys(apiErrors)[0] : null
      const firstErr = firstField && Array.isArray(apiErrors[firstField]) ? apiErrors[firstField][0] : null
      const msg = firstErr || apiMsg || 'Failed to accept meeting place'
      toast.error(msg)
    }
  })
}

export const useNotifications = () => useQuery('notifications', () => notificationsAPI.list().then(res => res.data.data))

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  return useMutation(() => notificationsAPI.markAllRead(), {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
    }
  })
}

export const useMarkMeetingPlaceNotificationsRead = () => {
  const queryClient = useQueryClient()
  return useMutation(() => notificationsAPI.markMeetingPlaceRead(), {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications')
    }
  })
}
