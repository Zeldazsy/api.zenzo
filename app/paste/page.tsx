"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PastePage() {
  const [code, setCode] = useState("")
  const [info, setInfo] = useState("")
  const [license, setLicense] = useState("")
  const [verify, setVerify] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    const res = await fetch("/api/paste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, info })
    })
    const data = await res.json()
    router.push(`/v4/paste/${data._id}`)
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
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Create a New Paste</h1>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Info</label>
        <textarea
          rows={3}
          className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description or tags (e.g. javascript, example, bugfix)..."
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Code</label>
        <textarea
          rows={15}
          className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition duration-200 w-full sm:w-auto"
      >
        Save Paste
      </button>
    </div>
  )
}
