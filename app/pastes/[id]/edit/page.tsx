'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function EditPaste({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params) // ✅ unwrap the Promise with React.use
  const [code, setCode] = useState("")
  const [info, setInfo] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/paste/${id}`)
      .then(res => res.json())
      .then(data => {
        setCode(data.code)
        setInfo(data.info)
      })
  }, [id])

  async function handleSave() {
    await fetch(`/api/paste/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, info })
    })
    router.push(`/v4/paste/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <textarea
        rows={15}
        className="w-full p-3 border rounded font-mono"
        value={info}
        onChange={e => setInfo(e.target.value)}
      />
      <textarea
        rows={15}
        className="w-full p-3 border rounded font-mono"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handleSave} className="mt-3 bg-green-500 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </div>
  )
}
