import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Modal } from '../components/ui'
import toast from 'react-hot-toast'
import {
  User, Mail, BookOpen, Calendar, Shield, Check, Edit2,
  Lock, Trash2, Save, Star, Award, Clock, AlertTriangle, Eye, EyeOff,
} from 'lucide-react'

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function ProfileAvatar({ user, size = 80 }) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.32, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', flexShrink: 0, border: '3px solid rgba(29,158,117,0.4)' }}>
      {initials}
    </div>
  )
}

function FieldLabel({ children }) {
  return (
    <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: 'var(--bg)', border: '1.5px solid var(--border)',
  borderRadius: 12, color: 'var(--text-main)', fontSize: 14,
  fontFamily: 'var(--font-sans)', fontWeight: 500, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input
        {...props}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

function TextArea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea
        {...props}
        style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: 44 }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

function SectionCard({ title, icon: Icon, accent, children }) {
  return (
    <div style={{ background: 'var(--surface)', border: `1.5px solid ${accent ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`, borderRadius: 20, padding: '28px 28px 24px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 36, height: 36, background: accent ? 'rgba(239,68,68,0.1)' : 'rgba(29,158,117,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color: accent ? '#f87171' : 'var(--primary)' }} />
        </div>
        <h2 style={{ color: accent ? '#f87171' : 'var(--text-main)', fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-sans)', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth()
  const navigate = useNavigate()

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    department: user?.department || '',
    graduation_year: user?.graduation_year || '',
    avatar_url: user?.avatar_url || '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  // Password form
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwErrors, setPwErrors] = useState({})

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const roleLabel = user?.role === 'super_admin' ? 'Super Admin'
    : user?.role === 'tenant_admin' ? 'Administrateur'
    : 'Étudiant'

  const roleBg = user?.role === 'super_admin' ? 'rgba(239,159,39,0.12)'
    : user?.role === 'tenant_admin' ? 'rgba(29,158,117,0.1)'
    : 'rgba(29,158,117,0.1)'

  const roleColor = user?.role === 'super_admin' ? 'var(--accent)' : 'var(--primary)'

  /* Save profile */
  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileErrors({})
    setProfileSaving(true)
    try {
      await updateProfile(profileForm)
      toast.success('Profil mis à jour !')
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setProfileErrors(errs)
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setProfileSaving(false)
    }
  }

  /* Save password */
  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPwErrors({})
    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      setPwErrors({ new_password_confirmation: ['Les mots de passe ne correspondent pas.'] })
      return
    }
    setPwSaving(true)
    try {
      await updateProfile({ ...profileForm, ...pwForm })
      toast.success('Mot de passe modifié !')
      setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setPwErrors(errs)
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setPwSaving(false)
    }
  }

  /* Delete account */
  const handleDelete = async () => {
    setDeleteError('')
    if (!deletePassword) { setDeleteError('Veuillez entrer votre mot de passe.'); return }
    setDeleteLoading(true)
    try {
      await deleteAccount({ password: deletePassword })
      toast.success('Compte supprimé.')
      navigate('/')
    } catch (err) {
      const errs = err.response?.data?.errors?.password?.[0]
        || err.response?.data?.message
        || 'Erreur lors de la suppression.'
      setDeleteError(errs)
    } finally {
      setDeleteLoading(false)
    }
  }

  const setProfile = (key) => (e) => setProfileForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* ── Profile header ── */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 24, padding: '32px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <ProfileAvatar user={user} size={88} />

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h1 style={{ color: 'var(--text-main)', fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>{user?.name}</h1>
            <span style={{ background: roleBg, color: roleColor, fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.5px' }}>{roleLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14, marginBottom: 4, fontWeight: 500 }}>
            <Mail size={13} /> {user?.email}
          </div>
          {user?.tenant?.name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>
              <Shield size={13} /> {user.tenant.name}
            </div>
          )}
          {user?.department && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
              <BookOpen size={13} /> {user.department}
              {user?.graduation_year && <span>· Promo {user.graduation_year}</span>}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { icon: Award, value: user?.credits ?? 0, label: 'Crédits', color: 'var(--primary)' },
            { icon: Clock, value: user?.sessions_count ?? 0, label: 'Séances', color: 'var(--accent)' },
            { icon: Star, value: user?.avg_rating ? user.avg_rating.toFixed(1) : '—', label: 'Note moy.', color: 'var(--primary)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 18px', textAlign: 'center', minWidth: 80 }}>
              <s.icon size={16} style={{ color: s.color, marginBottom: 4 }} />
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Edit profile ── */}
        <SectionCard title="Modifier le profil" icon={Edit2}>
          <form onSubmit={handleProfileSave}>
            <Input
              label="Nom complet *"
              type="text"
              required
              value={profileForm.name}
              onChange={setProfile('name')}
              placeholder="Votre nom"
            />
            {profileErrors.name && <div style={{ color: '#f87171', fontSize: 12, marginTop: -14, marginBottom: 14 }}>{profileErrors.name[0]}</div>}

            <TextArea
              label="Bio"
              value={profileForm.bio}
              onChange={setProfile('bio')}
              placeholder="Décrivez-vous en quelques mots..."
              rows={3}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input
                label="Département / Filière"
                type="text"
                value={profileForm.department}
                onChange={setProfile('department')}
                placeholder="ex: Informatique"
              />
              <Input
                label="Année de promo"
                type="number"
                min="2000"
                max="2040"
                value={profileForm.graduation_year}
                onChange={setProfile('graduation_year')}
                placeholder="ex: 2026"
              />
            </div>

            <Input
              label="URL de l'avatar (optionnel)"
              type="url"
              value={profileForm.avatar_url}
              onChange={setProfile('avatar_url')}
              placeholder="https://..."
            />
            {profileErrors.avatar_url && <div style={{ color: '#f87171', fontSize: 12, marginTop: -14, marginBottom: 14 }}>{profileErrors.avatar_url[0]}</div>}

            <button
              type="submit"
              disabled={profileSaving}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: 14, fontWeight: 800, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: profileSaving ? 0.7 : 1 }}
            >
              {profileSaving ? 'Enregistrement...' : <><Save size={15} /> Enregistrer les modifications</>}
            </button>
          </form>
        </SectionCard>

        {/* ── Change password ── */}
        <SectionCard title="Changer le mot de passe" icon={Lock}>
          <form onSubmit={handlePasswordSave}>
            <PasswordInput
              label="Mot de passe actuel *"
              value={pwForm.current_password}
              onChange={e => setPwForm(f => ({ ...f, current_password: e.target.value }))}
              placeholder="••••••••"
            />
            {pwErrors.current_password && <div style={{ color: '#f87171', fontSize: 12, marginTop: -14, marginBottom: 14 }}>{pwErrors.current_password[0]}</div>}

            <PasswordInput
              label="Nouveau mot de passe *"
              value={pwForm.new_password}
              onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))}
              placeholder="6 caractères minimum"
            />
            {pwErrors.new_password && <div style={{ color: '#f87171', fontSize: 12, marginTop: -14, marginBottom: 14 }}>{pwErrors.new_password[0]}</div>}

            <PasswordInput
              label="Confirmer le nouveau mot de passe *"
              value={pwForm.new_password_confirmation}
              onChange={e => setPwForm(f => ({ ...f, new_password_confirmation: e.target.value }))}
              placeholder="Répétez le mot de passe"
            />
            {pwErrors.new_password_confirmation && <div style={{ color: '#f87171', fontSize: 12, marginTop: -14, marginBottom: 14 }}>{pwErrors.new_password_confirmation[0]}</div>}

            <div style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.15)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                Le mot de passe doit contenir au minimum 6 caractères. Utilisez une combinaison de lettres, chiffres et symboles pour plus de sécurité.
              </p>
            </div>

            <button
              type="submit"
              disabled={pwSaving || !pwForm.current_password || !pwForm.new_password}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: 14, fontWeight: 800, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (pwSaving || !pwForm.current_password || !pwForm.new_password) ? 0.5 : 1 }}
            >
              {pwSaving ? 'Modification...' : <><Check size={15} /> Changer le mot de passe</>}
            </button>
          </form>
        </SectionCard>
      </div>

      {/* ── Danger zone ── */}
      <SectionCard title="Zone de danger" icon={AlertTriangle} accent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Supprimer mon compte</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: 0, fontWeight: 500, maxWidth: 480 }}>
              Cette action est irréversible. Votre profil sera anonymisé, vos compétences et disponibilités supprimées, et vous perdrez tous vos crédits.
            </p>
          </div>
          <button
            onClick={() => setDeleteOpen(true)}
            style={{ padding: '11px 22px', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.35)', borderRadius: 12, color: '#f87171', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)' }}
          >
            <Trash2 size={15} /> Supprimer mon compte
          </button>
        </div>
      </SectionCard>

      {/* ── Delete confirmation modal ── */}
      <Modal open={deleteOpen} onClose={() => { setDeleteOpen(false); setDeletePassword(''); setDeleteError('') }} title="Confirmer la suppression" width={480}>
        <div style={{ padding: '8px 0 4px' }}>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertTriangle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: '#f87171', fontSize: 13, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
              Vous êtes sur le point de supprimer définitivement votre compte <strong>{user?.name}</strong>. Cette action ne peut pas être annulée.
            </p>
          </div>

          <FieldLabel>Confirmez avec votre mot de passe</FieldLabel>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              type="password"
              value={deletePassword}
              onChange={e => { setDeletePassword(e.target.value); setDeleteError('') }}
              placeholder="Votre mot de passe actuel"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#f87171'}
              onBlur={e => e.target.style.borderColor = deleteError ? '#f87171' : 'var(--border)'}
              onKeyDown={e => e.key === 'Enter' && handleDelete()}
            />
          </div>
          {deleteError && <div style={{ color: '#f87171', fontSize: 12, marginBottom: 16 }}>{deleteError}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button
              onClick={() => { setDeleteOpen(false); setDeletePassword(''); setDeleteError('') }}
              style={{ flex: 1, padding: '12px', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 12, color: 'var(--text-muted)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading || !deletePassword}
              style={{ flex: 1, padding: '12px', background: deleteLoading || !deletePassword ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.4)', borderRadius: 12, color: '#f87171', fontSize: 14, fontWeight: 800, cursor: deleteLoading || !deletePassword ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s', opacity: deleteLoading || !deletePassword ? 0.5 : 1 }}
              onMouseEnter={e => { if (!deleteLoading && deletePassword) { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = '#f87171' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)' }}
            >
              {deleteLoading ? 'Suppression...' : 'Supprimer définitivement'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
