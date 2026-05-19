import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  useTeachers, useMySessions, useBookSession, useAcceptSession,
  useRejectSession, useMarkComplete, useCancelSession,
  useMySkills, useAddSkill, useRemoveSkill, useCategories,
  useMyRatings, useSubmitRating, useTransactions, useMyAvailability, useSetAvailability,
  useUpdateMeetingPlace, useAcceptMeetingPlace,
  useNotifications, useMarkMeetingPlaceNotificationsRead,
} from '../../hooks/useApi'
import {
  Card, StatCard, StatusBadge, Avatar, Stars, Modal,
  Table, Pagination, EmptyState, Spinner, Badge
} from '../ui'
import toast from 'react-hot-toast'

// ─── Student Dashboard ────────────────────────────────────────────────────────
export function StudentDashboard() {
  const { user } = useAuth()
  const { data: sessions }    = useMySessions({ status: 'upcoming_and_pending_ratings', role: 'both', per_page: 5 })
  const { data: myBookings }  = useMySessions({ status: 'pending',  role: 'learner', per_page: 3 })
  const { data: requests }    = useMySessions({ status: 'pending',  role: 'teacher', per_page: 3 })
  const { data: notifications } = useNotifications()
  const [ratingModal, setRatingModal] = useState(null)

  const unreadMeetingPlaceSessionIds = new Set(
    (notifications || [])
      .filter(n => n.type === 'meeting_place' && !n.is_read && n.data?.session_id)
      .map(n => n.data.session_id)
  )

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ color: '#5a7a6a' }}>{user?.tenant?.name || 'SkillSwap'} · Student</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Credits" value={user?.credits ?? 0} icon="💳" color="#1D9E75" />
        <StatCard label="Sessions Done" value={user?.sessions_count ?? 0} icon="🎓" color="#EF9F27" />
        <StatCard label="Skills Taught" value={user?.skills_taught_count ?? 0} icon="📚" color="#7F77DD" />
        <StatCard label="Avg Rating" value={user?.avg_rating ? `${user.avg_rating}★` : '—'} icon="⭐" color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Upcoming Sessions</h3>
            {sessions?.data?.length ? sessions.data.map(s => (
              <SessionRow key={s.id} session={s} onRate={() => setRatingModal(s)} hasMeetingPlaceAlert={unreadMeetingPlaceSessionIds.has(s.id)} />
            )) : <EmptyState icon="📅" title="No accepted sessions yet" desc="Sessions appear here once a teacher accepts" />}
            <RatingModal session={ratingModal} onClose={() => setRatingModal(null)} />
          </Card>
          <Card>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>My Pending Bookings</h3>
            {myBookings?.data?.length ? myBookings.data.map(s => (
              <SessionRow key={s.id} session={s} onRate={() => setRatingModal(s)} hasMeetingPlaceAlert={unreadMeetingPlaceSessionIds.has(s.id)} />
            )) : <EmptyState icon="⏳" title="No pending bookings" desc="Book a session to see it here" />}
          </Card>
        </div>

        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Pending Requests (as teacher)</h3>
          {requests?.data?.length ? requests.data.map(s => (
            <RequestRow key={s.id} session={s} hasMeetingPlaceAlert={unreadMeetingPlaceSessionIds.has(s.id)} />
          )) : <EmptyState icon="📬" title="No pending requests" desc="Add skills to start receiving booking requests" />}
        </Card>
      </div>
    </div>
  )
}

function getCancelWarning(session, isLearner) {
  if (session.status !== 'accepted' || !isLearner) {
    return 'Cancel this session? Your reserved credit will be refunded.'
  }
  const minutesUntil = (new Date(session.scheduled_at) - new Date()) / 60000
  if (minutesUntil < 120) {
    return 'Less than 2 hours before this session starts.\n\nCancelling now will cost you 1 credit (no refund). The teacher will not earn anything.\n\nContinue?'
  }
  return 'Cancel this session? You are more than 2 hours before the start time — your credit will be refunded.'
}

function SessionRow({ session, onRate, hasMeetingPlaceAlert = false }) {
  const { user, refreshUser } = useAuth()
  const markComplete = useMarkComplete()
  const cancel = useCancelSession()
  const markMeetingRead = useMarkMeetingPlaceNotificationsRead()
  const [meetingOpen, setMeetingOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  const isLearner  = user?.id == session.requester_id
  const otherName  = isLearner ? session.teacher?.name : session.learner?.name
  const relation   = isLearner ? 'with' : 'from student'

  const hasConfirmed = isLearner ? session.requester_confirmed : session.teacher_confirmed
  const hasRated     = isLearner ? session.requester_rated : session.teacher_rated

  const handleDone = async () => {
    try {
      await markComplete.mutateAsync(session.id)
      onRate(session)
    } catch { /* toast handled by mutation */ }
  }

  const handleCancel = async () => {
    setCancelOpen(true)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e2b24' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{session.skill?.name}</div>
        <div style={{ color: '#5a7a6a', fontSize: 12 }}>{relation} {otherName} · {session.scheduled_at}</div>
        <div style={{ marginTop: 4 }}><StatusBadge status={session.status} /></div>
        {session.meeting_place?.title && (
          <div style={{ marginTop: 6, fontSize: 12, color: '#5a7a6a' }}>
            Meeting: {session.meeting_place.title}
            {session.meeting_place.room ? ` · Room ${session.meeting_place.room}` : ''}
            {session.meeting_place.status ? ` · ${session.meeting_place.status}` : ''}
          </div>
        )}
        {session.meeting_place?.status && ['proposed', 'changed'].includes(session.meeting_place.status) && (
          <>
            {session.meeting_place?.proposed_by && session.meeting_place.proposed_by !== (isLearner ? 'requester' : 'teacher') && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#EF9F27' }}>
                New meeting place update — please review
              </div>
            )}
          </>
        )}
        {hasConfirmed && !hasRated && session.status !== 'completed' && (
          <div style={{ fontSize: 11, color: '#EF9F27', marginTop: 4 }}>
            {session.status === 'pending_ratings'
              ? 'Both confirmed — please rate your partner'
              : 'You confirmed — waiting for other party (you can still rate)'}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: 12, position: 'relative' }}
          onClick={() => { markMeetingRead.mutate(); setMeetingOpen(true) }}
        >
          Meeting Place
          {hasMeetingPlaceAlert && <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: 999, background: '#E24B4A' }} />}
        </button>
        {session.status === 'accepted' && !hasConfirmed && (
          <>
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={handleDone} disabled={markComplete.isLoading}>Done</button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={handleCancel} disabled={cancel.isLoading}>Cancel</button>
          </>
        )}
        {(session.status === 'pending_ratings' || (hasConfirmed && !hasRated)) && session.status !== 'completed' && (
          <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12, background: '#EF9F27' }} onClick={() => onRate(session)}>Rate ⭐</button>
        )}
      </div>
      <MeetingPlaceModal session={meetingOpen ? session : null} onClose={() => setMeetingOpen(false)} />
      <CancelSessionModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        warning={getCancelWarning(session, isLearner)}
        onSubmit={async (reason) => {
          await cancel.mutateAsync({ sessionId: session.id, data: { cancellation_reason: reason } })
          refreshUser?.()
        }}
        loading={cancel.isLoading}
      />
    </div>
  )
}


function RequestRow({ session, hasMeetingPlaceAlert = false }) {
  const accept = useAcceptSession()
  const reject = useRejectSession()
  const markMeetingRead = useMarkMeetingPlaceNotificationsRead()
  const [meetingOpen, setMeetingOpen] = useState(false)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e2b24' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{session.skill?.name}</div>
        <div style={{ color: '#5a7a6a', fontSize: 12 }}>from {session.learner?.name} · {session.scheduled_at}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: 12, position: 'relative' }}
          onClick={() => { markMeetingRead.mutate(); setMeetingOpen(true) }}
        >
          Meeting Place
          {hasMeetingPlaceAlert && <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: 999, background: '#E24B4A' }} />}
        </button>
        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => accept.mutate(session.id)} disabled={accept.isLoading}>Accept</button>
        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => reject.mutate(session.id)}>Reject</button>
      </div>
      <MeetingPlaceModal session={meetingOpen ? session : null} onClose={() => setMeetingOpen(false)} />
    </div>
  )
}

// ─── Search / Find Skills ─────────────────────────────────────────────────────
export function SearchPage() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel]       = useState('')
  const [page, setPage]         = useState(1)
  const [booking, setBooking]   = useState(null)

  const { data: categories } = useCategories()
  const { data, isLoading }  = useTeachers({ search, category, level, page, per_page: 12 })

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Find a Skill</h1>
      <p style={{ color: '#5a7a6a', marginBottom: 24 }}>Browse peers who can teach you something new</p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input className="input-dark" placeholder="Search skills or teachers…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ flex: 1, minWidth: 200 }} />
        <select className="input-dark" value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} style={{ width: 160 }}>
          <option value="">All Categories</option>
          {categories?.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-dark" value={level} onChange={e => { setLevel(e.target.value); setPage(1) }} style={{ width: 140 }}>
          <option value="">All Levels</option>
          {['Beginner','Intermediate','Advanced','Expert'].map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><Spinner size={32} /></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {data?.data?.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} onBook={() => setBooking(teacher)} />
            ))}
          </div>
          {data?.data?.length === 0 && <EmptyState icon="🔍" title="No results found" desc="Try a different search or category" />}
          {data?.last_page > 1 && <Pagination page={page} lastPage={data.last_page} onChange={setPage} />}
        </>
      )}

      <BookingModal teacher={booking} onClose={() => setBooking(null)} />
    </div>
  )
}

function TeacherCard({ teacher, onBook }) {
  const initials = teacher.name?.split(' ').map(n => n[0]).join('') || 'T'
  return (
    <div className="card card-hover" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <Avatar initials={initials} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacher.name}</div>
          <Stars rating={teacher.avg_rating || 0} />
          <span style={{ color: '#5a7a6a', fontSize: 12 }}>{teacher.sessions_count || 0} sessions</span>
        </div>
      </div>

      {/* Skills offered */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {teacher.skills?.slice(0, 3).map(s => (
          <span key={s.id} className="badge badge-green">{s.name}</span>
        ))}
        {teacher.skills?.length > 3 && <span className="badge badge-gray">+{teacher.skills.length - 3}</span>}
      </div>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onBook}>
        Book a Session
      </button>
    </div>
  )
}

function BookingModal({ teacher, onClose }) {
  const [skillId, setSkillId]   = useState('')
  const [slotId, setSlotId]     = useState('')
  const [message, setMessage]   = useState('')
  const bookSession = useBookSession()

  const handleBook = async () => {
    if (!skillId || !slotId) { toast.error('Please select a skill and a time slot'); return }
    await bookSession.mutateAsync({ teacher_id: teacher.id, skill_id: skillId, slot_id: slotId, message })
    onClose()
  }

  if (!teacher) return null
  return (
    <Modal open={!!teacher} onClose={onClose} title={`Book with ${teacher.name}`}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Skill</label>
        <select className="input-dark" value={skillId} onChange={e => setSkillId(e.target.value)}>
          <option value="">Choose a skill…</option>
          {teacher.skills?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.level})</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Time Slot</label>
        <select className="input-dark" value={slotId} onChange={e => setSlotId(e.target.value)}>
          <option value="">Choose a slot…</option>
          {teacher.availability?.map(slot => (
            <option key={slot.id} value={slot.id}>{slot.day} {slot.start} – {slot.end}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Message (optional)</label>
        <textarea className="input-dark" rows={3} placeholder="Hi! I'd love to learn…" value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ background: '#0a0f0d', borderRadius: 10, padding: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5a7a6a', marginBottom: 6 }}>
          <span>Cost</span><span style={{ color: '#EF9F27', fontWeight: 700 }}>1 Credit</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#5a7a6a' }}>
          <span>Duration</span><span>1 hour</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleBook} disabled={bookSession.isLoading}>
          {bookSession.isLoading ? <Spinner size={16} /> : 'Confirm Booking →'}
        </button>
      </div>
    </Modal>
  )
}

// ─── My Sessions ──────────────────────────────────────────────────────────────
export function SessionsPage() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab]     = useState('upcoming')
  const [page, setPage]   = useState(1)
  const [ratingModal, setRatingModal] = useState(null)
  const [meetingModal, setMeetingModal] = useState(null)
  const [cancelModal, setCancelModal] = useState(null)
  const { data, isLoading } = useMySessions({ status: tab, page, per_page: 10 })
  const markComplete = useMarkComplete()
  const cancel = useCancelSession()
  const { data: notifications } = useNotifications()
  const markMeetingRead = useMarkMeetingPlaceNotificationsRead()

  const unreadMeetingPlaceSessionIds = new Set(
    (notifications || [])
      .filter(n => n.type === 'meeting_place' && !n.is_read && n.data?.session_id)
      .map(n => n.data.session_id)
  )

  const handleCancelRow = async (row) => {
    setCancelModal(row)
  }

  const tabs = ['upcoming', 'pending', 'completed', 'cancelled']

  const columns = [
    { key: 'skill',       label: 'Skill',    render: (_, row) => row.skill?.name },
    { key: 'teacher',     label: 'Teacher',  render: (_, row) => row.teacher?.name },
    { key: 'scheduled_at',label: 'Date',     muted: true },
    { key: 'status',      label: 'Status',   render: (v) => <StatusBadge status={v} /> },
    { key: 'meeting_place', label: 'Meeting Place', render: (v) => (
      <div style={{ fontSize: 12, color: '#5a7a6a' }}>
        {v?.title ? `${v.title}${v?.status ? ` (${v.status})` : ''}` : 'Not set'}
      </div>
    ) },
    {
      key: 'actions', label: '',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className="btn-secondary"
            style={{ padding: '5px 10px', fontSize: 12, position: 'relative' }}
            onClick={() => { markMeetingRead.mutate(); setMeetingModal(row) }}
          >
            Place
            {unreadMeetingPlaceSessionIds.has(row.id) && <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: 999, background: '#E24B4A' }} />}
          </button>
          {row.status === 'accepted' && <>
            <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 12 }} onClick={async () => { await markComplete.mutateAsync(row.id); setRatingModal(row) }}>Mark Done</button>
            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => handleCancelRow(row)} disabled={cancel.isLoading}>Cancel</button>
          </>}
          {row.status === 'pending_ratings' && (
            <button className="btn-primary" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => setRatingModal(row)}>Rate</button>
          )}
        </div>
      )
    }
  ]

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>My Sessions</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => { setTab(t); setPage(1) }}
            style={{ background: tab === t ? '#0F6E56' : 'transparent', color: tab === t ? '#fff' : '#5a7a6a', border: '1px solid', borderColor: tab === t ? '#0F6E56' : '#1e2b24', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      {isLoading ? <div style={{ textAlign: 'center', padding: 60 }}><Spinner size={32} /></div> : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table columns={columns} data={data?.data || []} />
          {data?.last_page > 1 && <div style={{ padding: 16 }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
        </Card>
      )}

      <RatingModal session={ratingModal} onClose={() => setRatingModal(null)} />
      <MeetingPlaceModal session={meetingModal} onClose={() => setMeetingModal(null)} />
      <CancelSessionModal
        open={!!cancelModal}
        onClose={() => setCancelModal(null)}
        warning={cancelModal ? getCancelWarning(cancelModal, user?.id == cancelModal.requester_id) : ''}
        onSubmit={async (reason) => {
          await cancel.mutateAsync({ sessionId: cancelModal.id, data: { cancellation_reason: reason } })
          refreshUser?.()
          setCancelModal(null)
        }}
        loading={cancel.isLoading}
      />
    </div>
  )
}

function CancelSessionModal({ open, onClose, warning, onSubmit, loading }) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!open) return
    setReason('')
  }, [open])

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Cancel Session" width={520}>
      <div style={{ color: '#5a7a6a', fontSize: 13, marginBottom: 12, whiteSpace: 'pre-line' }}>
        {warning}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Reason (required)</label>
        <textarea className="input-dark" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why you are cancelling..." style={{ resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Back</button>
        <button
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', background: '#E24B4A' }}
          onClick={async () => {
            if (!reason.trim()) { toast.error('Please add a cancellation reason'); return }
            await onSubmit(reason.trim())
            onClose()
          }}
          disabled={loading}
        >
          {loading ? <Spinner size={16} /> : 'Confirm Cancel'}
        </button>
      </div>
    </Modal>
  )
}

function MeetingPlaceModal({ session, onClose }) {
  const { user } = useAuth()
  const updateMeetingPlace = useUpdateMeetingPlace()
  const acceptMeetingPlace = useAcceptMeetingPlace()
  const [form, setForm] = useState({
    title: '',
    address: '',
    map_link: '',
    room: '',
    notes: '',
    change_reason: '',
  })

  useEffect(() => {
    if (!session) return
    setForm({
      title: session.meeting_place?.title || '',
      address: session.meeting_place?.address || '',
      map_link: session.meeting_place?.map_link || '',
      room: session.meeting_place?.room || '',
      notes: session.meeting_place?.notes || '',
      change_reason: '',
    })
  }, [session])

  if (!session) return null

  const isLearner = user?.id == session.requester_id
  const me = isLearner ? 'requester' : 'teacher'
  const isAccepted = session.meeting_place?.status === 'accepted'
  const hasExisting = !!session.meeting_place?.title
  const canAccept = hasExisting && !isAccepted && session.meeting_place?.proposed_by !== me

  const canEdit = ['pending', 'accepted', 'pending_ratings'].includes(session.status)
  const handleSave = async () => {
    if (!canEdit) {
      toast.error('Meeting place cannot be changed for this session')
      return
    }
    if (!form.title?.trim()) {
      toast.error('Please add a meeting place title')
      return
    }
    if (hasExisting && !form.change_reason?.trim()) {
      toast.error('Please provide a reason for changing the meeting place')
      return
    }

    const normalized = { ...form }
    if (normalized.map_link && !/^https?:\/\//i.test(normalized.map_link)) {
      normalized.map_link = `https://${normalized.map_link}`
    }
    try {
      await updateMeetingPlace.mutateAsync({ sessionId: session.id, data: normalized })
      onClose()
    } catch {}
  }

  const handleAccept = async () => {
    try {
      await acceptMeetingPlace.mutateAsync(session.id)
      onClose()
    } catch {}
  }

  return (
    <Modal open={!!session} onClose={onClose} title="Meeting Place">
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#5a7a6a', marginBottom: 6 }}>Current Status</div>
        <StatusBadge status={session.meeting_place?.status || 'pending'} />
      </div>

      {!canEdit && (
        <div style={{ background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A', borderRadius: 10, padding: 12, fontSize: 12, marginBottom: 14 }}>
          Meeting place cannot be changed when the session is {session.status}.
        </div>
      )}

      {hasExisting && (
        <div style={{ background: '#0a0f0d', borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: '#5a7a6a' }}>
          <div><strong style={{ color: '#fff' }}>{session.meeting_place?.title}</strong></div>
          {session.meeting_place?.address && <div>{session.meeting_place.address}</div>}
          {session.meeting_place?.room && <div>Room: {session.meeting_place.room}</div>}
          {session.meeting_place?.map_link && <a href={session.meeting_place.map_link} target="_blank" rel="noreferrer" style={{ color: '#1D9E75' }}>Open map link</a>}
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Title</label>
        <input className="input-dark" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Main Library" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Address</label>
        <input className="input-dark" value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} placeholder="Street and building" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Map Link</label>
        <input className="input-dark" value={form.map_link} onChange={(e) => setForm(prev => ({ ...prev, map_link: e.target.value }))} placeholder="https://maps.google.com/..." />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Room Number</label>
        <input className="input-dark" value={form.room} onChange={(e) => setForm(prev => ({ ...prev, room: e.target.value }))} placeholder="A-203" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Notes</label>
        <textarea className="input-dark" rows={2} value={form.notes} onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Meet near the reception desk." />
      </div>
      {hasExisting && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Reason for change</label>
          <input className="input-dark" value={form.change_reason} onChange={(e) => setForm(prev => ({ ...prev, change_reason: e.target.value }))} placeholder="Traffic, room unavailable, etc." />
        </div>
      )}

      {!!session.meeting_place_history?.length && (
        <div style={{ marginBottom: 16, maxHeight: 120, overflowY: 'auto' }}>
          <div style={{ color: '#5a7a6a', fontSize: 12, marginBottom: 6 }}>History</div>
          {session.meeting_place_history.slice().reverse().map((h, idx) => (
            <div key={idx} style={{ fontSize: 12, color: '#5a7a6a', marginBottom: 4 }}>
              {h.type} by {h.by_role} at {h.at}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Close</button>
        {canAccept && (
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#1D9E75' }} onClick={handleAccept} disabled={acceptMeetingPlace.isLoading}>
            {acceptMeetingPlace.isLoading ? <Spinner size={16} /> : 'Accept Place'}
          </button>
        )}
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSave} disabled={!canEdit || updateMeetingPlace.isLoading}>
          {updateMeetingPlace.isLoading ? <Spinner size={16} /> : (hasExisting ? 'Request Change' : 'Propose Place')}
        </button>
      </div>
    </Modal>
  )
}

function RatingModal({ session, onClose }) {
  const { user, refreshUser } = useAuth()
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState('')
  const submitRating = useSubmitRating()
  const isLearner = user?.id == session?.requester_id

  const handleSubmit = async () => {
    await submitRating.mutateAsync({ sessionId: session.id, data: { rating, comment } })
    refreshUser?.()
    onClose()
  }

  if (!session) return null
  return (
    <Modal open={!!session} onClose={onClose} title="Rate your session">
      <p style={{ color: '#5a7a6a', fontSize: 14, marginBottom: 20 }}>
        How was your session on <strong style={{ color: '#fff' }}>{session.skill?.name}</strong>?
      </p>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: '#5a7a6a', marginBottom: 10 }}>Your rating</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 32, color: n <= rating ? '#EF9F27' : '#1e2b24', transition: 'color 0.15s' }}>★</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Comment (optional)</label>
        <textarea className="input-dark" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Great session, very clear explanations…" style={{ resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Skip</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSubmit} disabled={submitRating.isLoading}>
          {submitRating.isLoading ? <Spinner size={16} /> : (isLearner ? 'Submit & Transfer Credit' : 'Submit Rating')}
        </button>
      </div>
    </Modal>
  )
}

// ─── Teach page ───────────────────────────────────────────────────────────────
export function TeachPage() {
  const { data: mySkills, isLoading } = useMySkills()
  const { data: categories }          = useCategories()
  const addSkill    = useAddSkill()
  const removeSkill = useRemoveSkill()
  const setAvail    = useSetAvailability()
  const { data: avail } = useMyAvailability()

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm]       = useState({ name: '', category: '', level: 'Intermediate', description: '' })

  const DAYS    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const [slots, setSlots] = useState(DAYS.map((_, i) => ({ day_index: i, start: '10:00', end: '12:00', active: false })))

  useEffect(() => {
    if (avail?.length) {
      setSlots(prev => {
        const next = [...prev];
        avail.forEach(a => {
          if (next[a.day_of_week]) {
            next[a.day_of_week] = { ...next[a.day_of_week], start: a.start, end: a.end, active: true };
          }
        });
        return next;
      });
    }
  }, [avail])

  const updateSlot = (i, field, val) => {
    setSlots(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  const handleSaveAvail = () => {
    const activeSlots = slots.filter(s => s.active)
    setAvail.mutate({ slots: activeSlots })
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    await addSkill.mutateAsync(form)
    setForm({ name: '', category: '', level: 'Intermediate', description: '' })
    setShowAdd(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Teach & Earn Credits</h1>
          <p style={{ color: '#5a7a6a' }}>Add skills you can teach and set your availability</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Add Skill</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* My Skills */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Skills I Teach</h3>
          {isLoading ? <Spinner /> : mySkills?.length ? mySkills.map(skill => (
            <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e2b24' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{skill.name}</div>
                <div style={{ color: '#5a7a6a', fontSize: 12 }}>{skill.category} · {skill.level}</div>
              </div>
              <button onClick={() => removeSkill.mutate(skill.id)} style={{ background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)', color: '#E24B4A', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Remove</button>
            </div>
          )) : <EmptyState icon="📚" title="No skills yet" desc="Add skills you can teach to start earning credits" />}
        </Card>

        {/* Availability */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>My Availability</h3>
          <p style={{ color: '#5a7a6a', fontSize: 13, marginBottom: 16 }}>Select days and times when you're available to teach</p>
          {DAYS.map((day, i) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, opacity: slots[i].active ? 1 : 0.5 }}>
              <input type="checkbox" checked={slots[i].active} onChange={e => updateSlot(i, 'active', e.target.checked)} />
              <span style={{ color: '#fff', fontSize: 13, width: 80 }}>{day}</span>
              <input type="time" className="input-dark" style={{ flex: 1 }} value={slots[i].start} onChange={e => updateSlot(i, 'start', e.target.value)} disabled={!slots[i].active} />
              <span style={{ color: '#5a7a6a' }}>→</span>
              <input type="time" className="input-dark" style={{ flex: 1 }} value={slots[i].end} onChange={e => updateSlot(i, 'end', e.target.value)} disabled={!slots[i].active} />
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
            onClick={handleSaveAvail} disabled={setAvail.isLoading}>
            {setAvail.isLoading ? <Spinner size={16} /> : 'Save Availability'}
          </button>
        </Card>
      </div>

      {/* Add Skill Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add a Skill to Teach">
        <form onSubmit={handleAddSkill}>
          {[
            { key: 'name',        label: 'Skill Name',  type: 'text',   ph: 'e.g. Python, French, Guitar' },
            { key: 'description', label: 'Description', type: 'text',   ph: 'Brief description of what you\'ll teach' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input className="input-dark" type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Category</label>
              <select className="input-dark" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                <option value="">Select…</option>
                {categories?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#5a7a6a', fontSize: 12, display: 'block', marginBottom: 6 }}>Level</label>
              <select className="input-dark" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                {['Beginner','Intermediate','Advanced','Expert'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAdd(false)}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={addSkill.isLoading}>
              {addSkill.isLoading ? <Spinner size={16} /> : 'Add Skill →'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ─── Credits page ─────────────────────────────────────────────────────────────
export function CreditsPage() {
  const { user }             = useAuth()
  const { data: txData }     = useTransactions({ page: 1, per_page: 20 })

  const columns = [
    { key: 'created_at', label: 'Date', muted: true },
    { key: 'type',       label: 'Type',   render: v => <Badge variant={v === 'earn' ? 'green' : v === 'spend' ? 'amber' : 'red'}>{v}</Badge> },
    { key: 'amount',     label: 'Amount', render: v => <span style={{ color: v > 0 ? '#1D9E75' : '#E24B4A', fontWeight: 700 }}>{v > 0 ? '+' : ''}{v}</span> },
    { key: 'description',label: 'Description', muted: true },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Credits</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Balance" value={user?.credits ?? 0} icon="💳" color="#1D9E75" />
        <StatCard label="Total Earned" value={txData?.meta?.total_earned ?? '—'} icon="📈" color="#EF9F27" />
        <StatCard label="Total Spent" value={txData?.meta?.total_spent ?? '—'} icon="📉" color="#7F77DD" />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2b24' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Transaction History</h3>
        </div>
        <Table columns={columns} data={txData?.data || []} />
      </Card>
    </div>
  )
}

// ─── Ratings page ─────────────────────────────────────────────────────────────
export function RatingsPage() {
  const { data: ratings, refetch } = useMyRatings()
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    refreshUser?.()
    refetch()
  }, [refreshUser, refetch])

  const reviewCount = ratings?.length ?? user?.ratings_count ?? 0
  const avgDisplay = reviewCount > 0
    ? `${Number(user?.avg_rating ?? 0).toFixed(1)}★`
    : '—'

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>My Ratings</h1>
      <p style={{ color: '#5a7a6a', marginBottom: 24 }}>What students say about your teaching</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Avg Rating" value={avgDisplay} icon="⭐" color="#EF9F27" />
        <StatCard label="Total Reviews" value={reviewCount} icon="💬" color="#7F77DD" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {ratings?.length ? ratings.map((r) => (
          <Card key={r.id}>
            <Stars rating={r.rating} />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, margin: '10px 0 12px' }}>"{r.comment || 'No comment'}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar initials={r.from?.name?.split(' ').map(n=>n[0]).join('')} size={30} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.from?.name}</div>
                <div style={{ color: '#5a7a6a', fontSize: 11 }}>{r.session?.skill?.name} · {r.created_at}</div>
              </div>
            </div>
          </Card>
        )) : <EmptyState icon="⭐" title="No ratings yet" desc="Complete sessions to receive ratings from students" />}
      </div>
    </div>
  )
}
