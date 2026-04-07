import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:9000'

const initialForm = {
  ServiceDate: '',
  PlateNumber: '',
  ServiceCode: '',
}

function getRecordId(record) {
  return record?.RecordNumber ?? null
}

function normalizeRecords(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.records)) {
    return payload.records
  }

  return []
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function fetchUsers() {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/records`)

      if (!response.ok) {
        throw new Error('Failed to load records from the endpoint.')
      }

      const data = await response.json()
      setUsers(normalizeRecords(data))
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load records.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm(initialForm)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    const method = editingId ? 'PUT' : 'POST'
    const targetUrl = editingId ? `${API_URL}/records/${editingId}` : `${API_URL}/records`

    try {
      const response = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? 'update' : 'create'} record.`)
      }

      await response.json().catch(() => null)

      setSuccessMessage(
        editingId ? 'Record updated successfully.' : 'Record created successfully.',
      )

      resetForm()
      await fetchUsers()
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit the form.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(user) {
    setEditingId(getRecordId(user))
    setForm({
      ServiceDate: user.ServiceDate ? String(user.ServiceDate).slice(0, 10) : '',
      PlateNumber: user.PlateNumber ?? '',
      ServiceCode: user.ServiceCode ?? '',
    })
    setError('')
    setSuccessMessage('')
  }

  async function handleDelete(user) {
    const id = getRecordId(user)

    if (!id) {
      setError('This record cannot be deleted because it has no id.')
      return
    }

    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch(`${API_URL}/records/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete record.')
      }

      setSuccessMessage('Record deleted successfully.')

      if (editingId === id) {
        resetForm()
      }

      await fetchUsers()
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this record.')
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow"></p>
          <h1></h1>
          <p className="hero-copy">
          
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={fetchUsers}>
          Refresh Data
        </button>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">{editingId ? 'Update mode' : 'New record'}</p>
              <h2>{editingId ? 'Edit Service Record' : 'Add Service Record'}</h2>
            </div>
          </div>

          <form className="student-form" onSubmit={handleSubmit}>
            <label>
              <span>Service Date</span>
              <input
                name="ServiceDate"
                type="date"
                value={form.ServiceDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Plate Number</span>
              <input
                name="PlateNumber"
                type="text"
                value={form.PlateNumber}
                onChange={handleChange}
                placeholder="Enter plate number"
                required
              />
            </label>

            <label>
              <span>Service Code</span>
              <input
                name="ServiceCode"
                type="text"
                value={form.ServiceCode}
                onChange={handleChange}
                placeholder="Enter service code"
                required
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingId
                    ? 'Update Record'
                    : 'Create Record'}
              </button>

              {editingId ? (
                <button
                  className="ghost-button"
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          {error ? <p className="status-message error">{error}</p> : null}
          {successMessage ? <p className="status-message success">{successMessage}</p> : null}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Endpoint records</p>
              <h2>Stored Service Records</h2>
            </div>
            <span className="count-badge">{users.length}</span>
          </div>

          {isLoading ? <p className="empty-state">Loading records...</p> : null}

          {!isLoading && !users.length ? (
            <p className="empty-state">
              No records were returned from <code>{API_URL}/records</code>.
            </p>
          ) : null}

          {!isLoading && users.length ? (
            <div className="records-list">
              {users.map((user, index) => {
                const id = getRecordId(user)

                return (
                  <div className="record-card" key={id ?? `${user.PlateNumber}-${index}`}>
                    <div className="record-main">
                      <h3>{user.PlateNumber || 'Unknown plate'}</h3>
                      <p>{user.ServiceCode || 'unknown-service'}</p>
                    </div>

                    <dl className="record-meta">
                      <div>
                        <dt>Service Date</dt>
                        <dd>{user.ServiceDate ? String(user.ServiceDate).slice(0, 10) : 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Plate Number</dt>
                        <dd>{user.PlateNumber ?? 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Service Code</dt>
                        <dd>{user.ServiceCode ?? 'N/A'}</dd>
                      </div>
                      <div>
                        <dt>Id</dt>
                        <dd>{id ?? 'Missing id'}</dd>
                      </div>
                    </dl>

                    <div className="record-actions">
                      <button className="secondary-button" type="button" onClick={() => handleEdit(user)}>
                        Edit
                      </button>
                      <button className="danger-button" type="button" onClick={() => handleDelete(user)}>
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </article>
      </section>
    </main>
  )
}

export default App
