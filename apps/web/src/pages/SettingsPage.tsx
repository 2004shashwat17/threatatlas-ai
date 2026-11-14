import { useState, type FormEvent } from 'react'
import { Check, Info, Monitor, ShieldCheck, Users } from 'lucide-react'
import { PageHeading, SectionHeading } from '../components/ui/primitives'
import { Button } from '../components/ui/button'
import { useAppStore } from '../stores/useAppStore'

export default function SettingsPage() {
  const {
    mapMode,
    setMapMode,
    rotationPaused,
    toggleRotation,
    organization,
    analystName,
    analystEmail,
    setProfile,
  } = useAppStore()
  const [saved, setSaved] = useState(false)
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setProfile(
      String(form.get('organization')).trim(),
      String(form.get('name')).trim(),
      String(form.get('email')).trim(),
    )
    setSaved(true)
  }
  return (
    <>
      <PageHeading
        title="Make this workspace yours."
        description="Manage local demonstration preferences and organization details."
      />
      <div className="settings-layout">
        <section className="panel">
          <SectionHeading
            title="Organization & profile"
            description="Saved locally in this browser. Not a real account."
            icon={<Users size={17} />}
          />
          <form className="form-grid settings-form" onSubmit={save}>
            <label>
              Organization name
              <input
                name="organization"
                defaultValue={organization}
                required
                maxLength={40}
                pattern={String.raw`.*\S.*`}
              />
            </label>
            <label>
              Display name
              <input
                name="name"
                defaultValue={analystName}
                required
                maxLength={50}
                pattern={String.raw`.*\S.*`}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                defaultValue={analystEmail}
                required
                maxLength={100}
              />
            </label>
            <div className="notice">
              <Info size={15} />
              Use fictional details only. No profile data is sent to a server.
            </div>
            <div className="form-actions">
              <Button type="submit">Save local preferences</Button>
              {saved && (
                <span role="status" className="saved-message">
                  <Check size={14} />
                  Preferences saved
                </span>
              )}
            </div>
          </form>
        </section>
        <div className="settings-aside">
          <section className="panel">
            <SectionHeading title="Visualization preferences" icon={<Monitor size={17} />} />
            <div className="settings-options">
              <label>
                Default geographic view
                <select
                  value={mapMode}
                  onChange={(event) => setMapMode(event.target.value as '3d' | '2d')}
                >
                  <option value="3d">3D globe (when supported)</option>
                  <option value="2d">2D geographic map</option>
                </select>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={!rotationPaused} onChange={toggleRotation} />
                Enable globe auto-rotation
              </label>
              <p className="subtle-note">
                Reduced-motion settings are respected automatically. Animations pause when the
                browser tab is hidden.
              </p>
            </div>
          </section>
          <section className="panel security-settings">
            <ShieldCheck size={23} />
            <h3>A safe space to explore.</h3>
            <p>
              This workspace contains fictional data. Authentication, team permissions, API keys,
              and real connections are intentionally not implemented.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
