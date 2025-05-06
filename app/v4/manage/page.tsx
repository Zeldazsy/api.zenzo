'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Paste } from "@/types"

export default function ManagePage() {
  const [pastes, setPastes] = useState<Paste[]>([])
  const [license, setLicense] = useState("")
  const [verify, setVerify] = useState(false)

  useEffect(() => {
    fetch("/api/pastes")
      .then(res => res.json())
      .then(data => setPastes(data))
  }, [])

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/pastes/${id}`, { method: "DELETE" })
    if (res.ok) {
      alert("Deleted!")
      setPastes(pastes.filter(p => p._id !== id))
    } else {
        alert("Failed to delete.")
    }
  }

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/raw/${id}`
    navigator.clipboard.writeText(url)
    alert("Raw URL copied!")
  }

  if (!verify) {
    return (
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Enter License Key</h1>
        <textarea
          className="w-full p-3 border rounded-lg font-mono text-sm mb-4"
          placeholder="Enter your license key..."
          value={license}
          onChange={(e) => setLicense(e.target.value)}
        />
        <button
onClick={async () => {
    const res = await fetch("/api/verify-license", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: license })
    })
  
    const data = await res.json()
  
    if (data.valid) {
      setVerify(true)
    } else {
      alert("Invalid license key")
    }
  }}
  
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-200 w-full sm:w-auto"
        >
          Verify Key
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📁 จัดการไฟล์</h1>
      <ul className="space-y-4">
        {pastes.map(paste => (
          <li key={paste._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{paste.info}</p>
              <p className="text-sm text-gray-500">{new Date(paste.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleCopy(paste._id)} className="p-2 hover:bg-gray-100 rounded">
             Coppt URL
              </button>
              <Link href={`/v4/manage/${paste._id}/edit`} className="p-2 hover:bg-gray-100 rounded">
                Edit
              </Link>
              <button onClick={() => handleDelete(paste._id)} className="p-2 hover:bg-red-100 rounded">
              Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
