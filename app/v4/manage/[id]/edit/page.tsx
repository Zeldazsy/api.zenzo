'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function EditPage() {
  const { id } = useParams()
  const [code, setCode] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(true)
  const [license, setLicense] = useState("")
  const [verify, setVerify] = useState(false)



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pastes/${id}`)
        const data = await res.json()
        setInfo(data?.info ?? "")
        setCode(data?.code ?? "")
      } catch (err) {
        console.error("Failed to fetch paste data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])



  const handleSave = async () => {
    const res = await fetch(`/api/pastes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ info, code }),
    })
    
    if (res.ok) {
      alert("Saved!")
    } else {
      alert("Failed to save!")
    }
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

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">✏️ แก้ไขไฟล์</h1>
      <input
        className="w-full p-2 border mb-4"
        value={info}
        onChange={e => setInfo(e.target.value)}
        placeholder="File Info"
      />
      <textarea
        className="w-full p-2 border h-60 mb-4"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Code"
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  )
}
