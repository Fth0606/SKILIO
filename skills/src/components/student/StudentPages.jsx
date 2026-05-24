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
  Table, Pagination, EmptyState, Spinner, Badge, FloatingInput
} from '../ui'
import toast from 'react-hot-toast'

// ─── Unique Credit Counter ──────────────────────────────────────────────────
function CreditCounter({ value = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const dur = 1000, step = 16, steps = dur / step
    let cur = displayValue; const inc = (value - displayValue) / steps
    const t = setInterval(() => {
      cur += inc;
      if ((inc > 0 && cur >= value) || (inc < 0 && cur <= value)) {
        cur = value; clearInterval(t)
      }
      setDisplayValue(cur)
    }, step)
    return () => clearInterval(t)
  }, [value])

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / 10, 1) // Just for visual effect
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={radius} stroke="var(--border)" strokeWidth="6" fill="none" />
        <circle
          cx="60" cy="60" r={radius}
          stroke="var(--primary)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{Math.round(displayValue)}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Crédits</div>
      </div>
    </div>
  )
}

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
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Bienvenue, {user?.name?.split(' ')[0]} 👋</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>{user?.tenant?.name || 'SKILIO'} · Étudiant</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard label="Crédits" value={user?.credits ?? 0} icon="💳" color="var(--primary)" />
        <StatCard label="Séances effectuées" value={user?.sessions_count ?? 0} icon="🎓" color="var(--accent)" />
        <StatCard label="Compétences enseignées" value={user?.skills_taught_count ?? 0} icon="📚" color="var(--primary-light)" />
        <StatCard label="Note moyenne" value={user?.avg_rating ? `${user.avg_rating}★` : '—'} icon="⭐" color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Card>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Prochaines séances</h3>
            {sessions?.data?.length ? sessions.data.map(s => (
              <SessionRow key={s.id} session={s} onRate={() => setRatingModal(s)} hasMeetingPlaceAlert={unreadMeetingPlaceSessionIds.has(s.id)} />
            )) : <EmptyState icon="📅" title="Aucune séance acceptée pour le moment" desc="Les séances apparaîtront ici une fois qu'un enseignant aura accepté" />}
            <RatingModal session={ratingModal} onClose={() => setRatingModal(null)} />
          </Card>
          <Card>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Mes réservations en attente</h3>
            {myBookings?.data?.length ? myBookings.data.map(s => (
              <SessionRow key={s.id} session={s} onRate={() => setRatingModal(s)} hasMeetingPlaceAlert={unreadMeetingPlaceSessionIds.has(s.id)} />
            )) : <EmptyState icon="⏳" title="Aucune réservation en attente" desc="Réservez une séance pour la voir ici" />}
          </Card>
        </div>

        <Card>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Demandes en attente (en tant qu'enseignant)</h3>
          {requests?.data?.length ? requests.data.map(s => (
            <RequestRow key={s.id} session={s} hasMeetingPlaceAlert={unreadMeetingPlaceSessionIds.has(s.id)} />
          )) : <EmptyState icon="📬" title="Aucune demande en attente" desc="Ajoutez des compétences pour commencer à recevoir des demandes de réservation" />}
        </Card>
      </div>
    </div>
  )
}

function getCancelWarning(session, isLearner) {
  if (session.status !== 'accepted' || !isLearner) {
    return 'Annuler cette séance ? Votre crédit réservé sera remboursé.'
  }
  const minutesUntil = (new Date(session.scheduled_at) - new Date()) / 60000
  if (minutesUntil < 120) {
    return 'Moins de 2 heures avant le début de cette séance.\n\nL\'annuler maintenant vous coûtera 1 crédit (aucun remboursement). L\'enseignant ne gagnera rien.\n\nContinuer ?'
  }
  return 'Annuler cette séance ? Vous êtes à plus de 2 heures du début — votre crédit sera remboursé.'
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
  const relation   = isLearner ? 'avec' : 'de l\'étudiant'

  const hasConfirmed = isLearner ? session.requester_confirmed : session.teacher_confirmed
  const hasRated     = isLearner ? session.requester_rated : session.teacher_rated

  const handleDone = async () => {
    try {
      await markComplete.mutateAsync(session.id)
      refreshUser?.()
      onRate(session)
    } catch { /* toast handled by mutation */ }
  }

  const handleCancel = async () => {
    setCancelOpen(true)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>{session.skill?.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{relation} {otherName} · {session.scheduled_at}</div>
        {session.notes && (
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--shadow-color)', borderLeft: '4px solid var(--primary)', color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', borderRadius: '0 12px 12px 0' }}>
            "{session.notes}"
          </div>
        )}
        <div style={{ marginTop: 12 }}><StatusBadge status={session.status} /></div>
        {session.meeting_place?.title && (
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
            📍 Lieu : {session.meeting_place.title}
            {session.meeting_place.room ? ` · Salle ${session.meeting_place.room}` : ''}
          </div>
        )}
        {hasConfirmed && !hasRated && session.status !== 'completed' && (
          <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8, fontWeight: 700 }}>
            {session.status === 'pending_ratings'
              ? 'Séance terminée — veuillez évaluer votre partenaire'
              : 'Vous avez confirmé — en attente de l\'autre partie'}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, marginLeft: 20 }}>
        <button
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: 13, position: 'relative' }}
          onClick={() => { markMeetingRead.mutate(); setMeetingOpen(true) }}
        >
          Lieu
          {hasMeetingPlaceAlert && <span style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />}
        </button>
        {session.status === 'accepted' && !hasConfirmed && (
          <>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={handleDone} disabled={markComplete.isLoading}>Terminé</button>
            <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--accent)' }} onClick={handleCancel} disabled={cancel.isLoading}>Annuler</button>
          </>
        )}
        {(session.status === 'pending_ratings' || (hasConfirmed && !hasRated)) && session.status !== 'completed' && (
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, background: 'var(--accent)' }} onClick={() => onRate(session)}>Évaluer ⭐</button>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>{session.skill?.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>de {session.learner?.name} · {session.scheduled_at}</div>
        {session.notes && (
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--shadow-color)', borderLeft: '4px solid var(--primary)', color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', borderRadius: '0 12px 12px 0' }}>
            "{session.notes}"
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginLeft: 20 }}>
        <button
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: 13, position: 'relative' }}
          onClick={() => { markMeetingRead.mutate(); setMeetingOpen(true) }}
        >
          Lieu
          {hasMeetingPlaceAlert && <span style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />}
        </button>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => accept.mutate(session.id)} disabled={accept.isLoading}>Accepter</button>
        <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, color: 'var(--accent)' }} onClick={() => reject.mutate(session.id)}>Refuser</button>
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
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Trouver une compétence</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>Parcourez les profils des étudiants prêts à partager leur savoir</p>
      </div>

      {/* Filters */}
      <div className="card glass" style={{ padding: 24, marginBottom: 40, display: 'flex', gap: 16, flexWrap: 'wrap', borderRadius: 16 }}>
        <input className="input-premium" placeholder="Rechercher des compétences ou des enseignants…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ flex: 1, minWidth: 250 }} />
        <select className="input-premium" value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} style={{ width: 200 }}>
          <option value="">Toutes les catégories</option>
          {categories?.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-premium" value={level} onChange={e => { setLevel(e.target.value); setPage(1) }} style={{ width: 180 }}>
          <option value="">Tous les niveaux</option>
          {['Beginner','Intermediate','Advanced','Expert'].map(l => {
              const labels = { Beginner: 'Débutant', Intermediate: 'Intermédiaire', Advanced: 'Avancé', Expert: 'Expert' };
              return <option key={l} value={l}>{labels[l]}</option>
          })}
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {data?.data?.map(teacher => (
              <TeacherCard key={teacher.id} teacher={teacher} onBook={() => setBooking(teacher)} />
            ))}
          </div>
          {data?.data?.length === 0 && <EmptyState icon="🔍" title="Aucun résultat trouvé" desc="Essayez une autre recherche ou catégorie" />}
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
    <div className="card card-hover glass" style={{ padding: 28, borderRadius: 14 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <Avatar initials={initials} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-main)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacher.name}</div>
          <Stars rating={teacher.avg_rating || 0} />
          <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{teacher.sessions_count || 0} séances</div>
        </div>
      </div>

      {/* Skills offered - Bento style grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {teacher.skills?.slice(0, 3).map(s => (
          <span key={s.id} className="badge badge-green" style={{ fontSize: 11, padding: '4px 12px' }}>{s.name}</span>
        ))}
        {teacher.skills?.length > 3 && <span className="badge badge-gray" style={{ fontSize: 11, padding: '4px 12px' }}>+{teacher.skills.length - 3}</span>}
      </div>

      <button className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 16, fontWeight: 800 }} onClick={onBook}>
        Réserver une séance
      </button>
    </div>
  )
}

function BookingModal({ teacher, onClose }) {
  const { refreshUser } = useAuth()
  const [skillId, setSkillId]   = useState('')
  const [slotId, setSlotId]     = useState('')
  const [message, setMessage]   = useState('')
  const bookSession = useBookSession()

  const handleBook = async () => {
    if (!skillId || !slotId) { toast.error('Veuillez sélectionner une compétence et un créneau'); return }
    await bookSession.mutateAsync({ teacher_id: teacher.id, skill_id: skillId, slot_id: slotId, message })
    refreshUser?.()
    onClose()
  }

  if (!teacher) return null
  return (
    <Modal open={!!teacher} onClose={onClose} title={`Réserver avec ${teacher.name}`}>
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Compétence</label>
        <select className="input-premium" value={skillId} onChange={e => setSkillId(e.target.value)}>
          <option value="">Choisir une compétence…</option>
          {teacher.skills?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.level})</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Créneau horaire</label>
        <select className="input-premium" value={slotId} onChange={e => setSlotId(e.target.value)}>
          <option value="">Choisir un créneau…</option>
          {teacher.availability?.map(slot => (
            <option key={slot.id} value={slot.id}>{slot.day} {slot.start} – {slot.end}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Message (optionnel)</label>
        <textarea className="input-premium" rows={3} placeholder="Bonjour ! J'aimerais apprendre…" value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ background: 'var(--shadow-color)', borderRadius: 20, padding: 20, marginBottom: 32, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
          <span>Coût</span><span style={{ color: 'var(--accent)', fontWeight: 800 }}>1 Crédit</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
          <span>Durée</span><span style={{ color: 'var(--text-main)', fontWeight: 800 }}>1 heure</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={onClose}>Annuler</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }} onClick={handleBook} disabled={bookSession.isLoading}>
          {bookSession.isLoading ? <Spinner size={20} /> : 'Confirmer la réservation →'}
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

  const tabs = [
      { key: 'upcoming', label: 'À venir' },
      { key: 'pending', label: 'En attente' },
      { key: 'completed', label: 'Terminées' },
      { key: 'cancelled', label: 'Annulées' }
  ]

  const columns = [
    { key: 'skill',       label: 'Compétence',    render: (_, row) => row.skill?.name },
    { key: 'teacher',     label: 'Enseignant',  render: (_, row) => row.teacher?.name },
    { key: 'scheduled_at',label: 'Date',     muted: true },
    { key: 'status',      label: 'Statut',   render: (v) => <StatusBadge status={v} /> },
    { key: 'meeting_place', label: 'Lieu de rencontre', render: (v) => (
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
        {v?.title ? `${v.title}${v?.status ? ` (${v.status === 'accepted' ? 'accepté' : 'en attente'})` : ''}` : 'Non défini'}
      </div>
    ) },
    {
      key: 'actions', label: '',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: 12, position: 'relative' }}
            onClick={() => { markMeetingRead.mutate(); setMeetingModal(row) }}
          >
            Lieu
            {unreadMeetingPlaceSessionIds.has(row.id) && <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
          </button>
          {row.status === 'accepted' && <>
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={async () => { await markComplete.mutateAsync(row.id); setRatingModal(row) }}>Terminé</button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--accent)' }} onClick={() => handleCancelRow(row)} disabled={cancel.isLoading}>Annuler</button>
          </>}
          {row.status === 'pending_ratings' && (
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 12, background: 'var(--accent)' }} onClick={() => setRatingModal(row)}>Évaluer</button>
          )}
        </div>
      )
    }
  ]

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Mes séances</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setPage(1) }}
            style={{
                background: tab === t.key ? 'var(--primary)' : 'var(--shadow-color)',
                color: tab === t.key ? '#fff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: tab === t.key ? 'var(--primary)' : 'var(--border)',
                padding: '10px 24px',
                borderRadius: 12,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                transition: 'all 0.2s'
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? <div style={{ textAlign: 'center', padding: 80 }}><Spinner size={48} /></div> : (
        <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
          <div style={{ padding: '24px' }}>
            <Table columns={columns} data={data?.data || []} />
          </div>
          {data?.last_page > 1 && <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}><Pagination page={page} lastPage={data.last_page} onChange={setPage} /></div>}
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
    <Modal open={open} onClose={onClose} title="Annuler la séance" width={520}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20, whiteSpace: 'pre-line', fontWeight: 500, lineHeight: 1.6 }}>
        {warning}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Raison (obligatoire)</label>
        <textarea className="input-premium" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Expliquez pourquoi vous annulez..." style={{ resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={onClose}>Retour</button>
        <button
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', background: 'var(--accent)', padding: 14, borderRadius: 16 }}
          onClick={async () => {
            if (!reason.trim()) { toast.error('Veuillez ajouter un motif d\'annulation'); return }
            await onSubmit(reason.trim())
            onClose()
          }}
          disabled={loading}
        >
          {loading ? <Spinner size={20} /> : 'Confirmer l\'annulation'}
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
      toast.error('Le lieu de rencontre ne peut plus être modifié pour cette séance')
      return
    }
    if (!form.title?.trim()) {
      toast.error('Veuillez ajouter un titre pour le lieu')
      return
    }
    if (hasExisting && !form.change_reason?.trim()) {
      toast.error('Veuillez fournir une raison pour le changement de lieu')
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
    <Modal open={!!session} onClose={onClose} title="Lieu de rencontre">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 700 }}>Statut actuel</div>
        <StatusBadge status={session.meeting_place?.status || 'pending'} />
      </div>

      {!canEdit && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 16, padding: 16, fontSize: 13, marginBottom: 24, fontWeight: 600 }}>
          Le lieu de rencontre ne peut pas être modifié lorsque la séance est {session.status}.
        </div>
      )}

      {hasExisting && (
        <div style={{ background: 'var(--shadow-color)', borderRadius: 20, padding: 20, marginBottom: 24, fontSize: 14, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          <div><strong style={{ color: 'var(--text-main)', fontSize: 16 }}>{session.meeting_place?.title}</strong></div>
          {session.meeting_place?.address && <div style={{ marginTop: 4 }}>{session.meeting_place.address}</div>}
          {session.meeting_place?.room && <div style={{ marginTop: 4 }}>Salle : {session.meeting_place.room}</div>}
          {session.meeting_place?.map_link && <div style={{ marginTop: 12 }}><a href={session.meeting_place.map_link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Ouvrir le lien GPS</a></div>}
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        <FloatingInput label="Titre (ex: Bibliothèque)" id="place-title" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} />
        <FloatingInput label="Adresse" id="place-address" value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} />
        <FloatingInput label="Lien Google Maps" id="place-map" value={form.map_link} onChange={(e) => setForm(prev => ({ ...prev, map_link: e.target.value }))} />
        <FloatingInput label="Numéro de salle" id="place-room" value={form.room} onChange={(e) => setForm(prev => ({ ...prev, room: e.target.value }))} />
        <div className="input-group">
          <textarea className="input-premium" rows={2} value={form.notes} onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder=" " id="place-notes" />
          <label htmlFor="place-notes" className="floating-label">Notes (ex: Près de l'accueil)</label>
        </div>
        {hasExisting && (
          <FloatingInput label="Raison du changement" id="place-reason" value={form.change_reason} onChange={(e) => setForm(prev => ({ ...prev, change_reason: e.target.value }))} />
        )}
      </div>

      {!!session.meeting_place_history?.length && (
        <div style={{ marginTop: 24, marginBottom: 24, maxHeight: 150, overflowY: 'auto', padding: 16, background: 'var(--shadow-color)', borderRadius: 16 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12, fontWeight: 800, textTransform: 'uppercase' }}>Historique</div>
          {session.meeting_place_history.slice().reverse().map((h, idx) => (
            <div key={idx} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{h.type}</span> par {h.by_role === 'requester' ? 'Apprenant' : 'Enseignant'} le {h.at}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={onClose}>Fermer</button>
        {canAccept && (
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--primary)', padding: 14, borderRadius: 16 }} onClick={handleAccept} disabled={acceptMeetingPlace.isLoading}>
            {acceptMeetingPlace.isLoading ? <Spinner size={20} /> : 'Accepter le lieu'}
          </button>
        )}
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }} onClick={handleSave} disabled={!canEdit || updateMeetingPlace.isLoading}>
          {updateMeetingPlace.isLoading ? <Spinner size={20} /> : (hasExisting ? 'Demander un changement' : 'Proposer un lieu')}
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

  const handleSubmit = async () => {
    await submitRating.mutateAsync({ sessionId: session.id, data: { rating, comment } })
    refreshUser?.()
    onClose()
  }

  if (!session) return null
  return (
    <Modal open={!!session} onClose={onClose} title="Évaluez votre séance">
      <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 24, fontWeight: 500 }}>
        Comment s'est passée votre séance sur <strong style={{ color: 'var(--text-main)' }}>{session.skill?.name}</strong> ?
      </p>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700, textTransform: 'uppercase' }}>Votre note</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 40, color: n <= rating ? 'var(--accent)' : 'var(--border)', transition: 'all 0.2s', filter: n <= rating ? 'drop-shadow(0 0 10px var(--accent))' : 'none' }}>★</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Commentaire (optionnel)</label>
        <textarea className="input-premium" rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Excellente séance, explications très claires…" style={{ resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={onClose}>Passer</button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }} onClick={handleSubmit} disabled={submitRating.isLoading}>
          {submitRating.isLoading ? <Spinner size={20} /> : 'Soumettre l\'évaluation'}
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

  const DAYS    = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Enseigner & Gagner des crédits</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>Ajoutez les compétences que vous pouvez enseigner et définissez vos disponibilités</p>
        </div>
        <button className="btn-primary" style={{ padding: '14px 28px', borderRadius: 16, fontWeight: 800 }} onClick={() => setShowAdd(true)}>+ Ajouter une compétence</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* My Skills */}
        <Card>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Compétences que j'enseigne</h3>
          {isLoading ? <Spinner size={40} /> : mySkills?.length ? mySkills.map(skill => (
            <div key={skill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>{skill.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>{skill.category} · {skill.level}</div>
              </div>
              <button onClick={() => removeSkill.mutate(skill.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '8px 16px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.2s' }}>Supprimer</button>
            </div>
          )) : <EmptyState icon="📚" title="Aucune compétence pour le moment" desc="Ajoutez des compétences que vous pouvez enseigner pour commencer à gagner des crédits" />}
        </Card>

        {/* Availability */}
        <Card>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, fontFamily: 'var(--font-heading)' }}>Ma disponibilité</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, fontWeight: 500 }}>Sélectionnez les jours et créneaux où vous êtes disponible pour enseigner</p>
          {DAYS.map((day, i) => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, opacity: slots[i].active ? 1 : 0.4, transition: 'all 0.2s' }}>
              <input type="checkbox" style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--primary)' }} checked={slots[i].active} onChange={e => updateSlot(i, 'active', e.target.checked)} />
              <span style={{ color: 'var(--text-main)', fontSize: 14, fontWeight: 700, width: 80 }}>{day}</span>
              <input type="time" className="input-premium" style={{ flex: 1, padding: '8px' }} value={slots[i].start} onChange={e => updateSlot(i, 'start', e.target.value)} disabled={!slots[i].active} />
              <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>→</span>
              <input type="time" className="input-premium" style={{ flex: 1, padding: '8px' }} value={slots[i].end} onChange={e => updateSlot(i, 'end', e.target.value)} disabled={!slots[i].active} />
            </div>
          ))}
          <button className="btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center', padding: 14, borderRadius: 16, fontWeight: 800 }}
            onClick={handleSaveAvail} disabled={setAvail.isLoading}>
            {setAvail.isLoading ? <Spinner size={20} /> : 'Enregistrer les disponibilités'}
          </button>
        </Card>
      </div>

      {/* Add Skill Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Proposer une compétence">
        <form onSubmit={handleAddSkill}>
          <FloatingInput label="Nom de la compétence" id="skill-name" type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          <FloatingInput label="Description (brève)" id="skill-desc" type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Catégorie</label>
              <select className="input-premium" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                <option value="">Sélectionner…</option>
                {categories?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'var(--text-muted)', fontSize: 13, display: 'block', marginBottom: 8, fontWeight: 700 }}>Niveau</label>
              <select className="input-premium" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                <option value="Beginner">Débutant</option>
                <option value="Intermediate">Intermédiaire</option>
                <option value="Advanced">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, padding: 14, borderRadius: 16 }} onClick={() => setShowAdd(false)}>Annuler</button>
            <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14, borderRadius: 16 }} disabled={addSkill.isLoading}>
              {addSkill.isLoading ? <Spinner size={20} /> : 'Ajouter la compétence →'}
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
    { key: 'type',       label: 'Type',   render: v => {
        const labels = { earn: 'Gain', spend: 'Dépense', penalty: 'Pénalité', refund: 'Remboursement' };
        const variants = { earn: 'green', spend: 'amber', penalty: 'red', refund: 'purple' };
        return <Badge variant={variants[v] || 'gray'}>{labels[v] || v}</Badge>
    }},
    { key: 'amount',     label: 'Montant', render: v => <span style={{ color: v > 0 ? 'var(--primary)' : 'var(--accent)', fontWeight: 800 }}>{v > 0 ? '+' : ''}{v} DH</span> },
    { key: 'description',label: 'Description', muted: true },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40 }}>Crédits</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 32, marginBottom: 40, alignItems: 'center' }}>
        <Card style={{ textAlign: 'center', padding: 20 }}>
            <CreditCounter value={user?.credits ?? 0} />
            <div style={{ marginTop: 20, color: 'var(--text-muted)', fontWeight: 600 }}>Solde actuel</div>
        </Card>
        <div style={{ display: 'grid', gap: 24 }}>
            <StatCard label="Total gagné" value={`${txData?.meta?.total_earned ?? 0} DH`} icon="📈" color="var(--primary)" />
            <StatCard label="Total dépensé" value={`${txData?.meta?.total_spent ?? 0} DH`} icon="📉" color="var(--accent)" />
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Historique des transactions</h3>
        </div>
        <div style={{ padding: '24px' }}>
            <Table columns={columns} data={txData?.data || []} />
        </div>
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
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Mes évaluations</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>Ce que les étudiants disent de votre enseignement</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, marginBottom: 40 }}>
        <StatCard label="Note moyenne" value={avgDisplay} icon="⭐" color="#f59e0b" />
        <StatCard label="Total des avis" value={reviewCount} icon="💬" color="var(--primary-light)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
        {ratings?.length ? ratings.map((r) => (
          <Card key={r.id} style={{ borderRadius: 14, padding: 24 }}>
            <Stars rating={r.rating} />
            <p style={{ color: 'var(--text-main)', fontSize: 14, lineHeight: 1.6, margin: '16px 0 20px', fontWeight: 500, fontStyle: 'italic' }}>"{r.comment || 'Aucun commentaire'}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <Avatar initials={r.from?.name?.split(' ').map(n=>n[0]).join('')} size={36} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{r.from?.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>{r.session?.skill?.name} · {r.created_at}</div>
              </div>
            </div>
          </Card>
        )) : <EmptyState icon="⭐" title="Aucune évaluation pour l'instant" desc="Complétez des séances pour recevoir des avis de vos étudiants" />}
      </div>
    </div>
  )
}
