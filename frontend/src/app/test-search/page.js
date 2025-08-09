'use client'

import { useState, useEffect } from 'react'
import { getAllCombinedPatients, searchCombinedPatients } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function TestSearchPage() {
  const [allPatients, setAllPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({})

  // Load all patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true)
      try {
        const patients = await getAllCombinedPatients()
        setAllPatients(patients)
        setStats({
          total: patients.length,
          api: patients.filter(p => p.source === 'api').length,
          mock: patients.filter(p => p.source === 'mock').length
        })
      } catch (error) {
        console.error('Failed to load patients:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const results = await searchCombinedPatients(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Patient Search Test Page</h1>
      
      {/* Stats Card */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Patient Data Statistics</h2>
        </CardHeader>
        <CardContent>
          {loading && !stats.total ? (
            <p>Loading patient data...</p>
          ) : (
            <div className="space-y-2">
              <p>Total Patients: <strong>{stats.total || 0}</strong></p>
              <p>From API: <strong>{stats.api || 0}</strong></p>
              <p>From Mock Data: <strong>{stats.mock || 0}</strong></p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Search Patients</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, ID, room, age, or condition..."
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <p>Try searching for:</p>
            <ul className="list-disc list-inside">
              <li>"Nurul Asyikin" (shared patient)</li>
              <li>"Lim" (partial name)</li>
              <li>"302" (room number)</li>
              <li>"P001" (patient ID)</li>
              <li>Leave empty to see first 20</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Search Results {searchResults.length > 0 && `(${searchResults.length})`}
          </h2>
        </CardHeader>
        <CardContent>
          {searchResults.length === 0 ? (
            <p className="text-gray-500">No results to display. Try searching above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Age</th>
                    <th className="text-left p-2">Room</th>
                    <th className="text-left p-2">Condition</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((patient, index) => (
                    <tr key={patient.id || index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{patient.id}</td>
                      <td className="p-2 font-medium">{patient.name}</td>
                      <td className="p-2">{patient.age}</td>
                      <td className="p-2">{patient.room}</td>
                      <td className="p-2">{patient.condition}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          patient.status === 'critical' ? 'bg-red-100 text-red-800' :
                          patient.status === 'serious' ? 'bg-orange-100 text-orange-800' :
                          patient.status === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          patient.source === 'api' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}