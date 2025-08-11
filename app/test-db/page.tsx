"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestDatabase() {
  const [connectionStatus, setConnectionStatus] = useState('接続中...')

  useEffect(() => {
    async function testConnection() {
      try {
        // シンプルな接続テスト
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)

        if (error) {
          setConnectionStatus(`エラー: ${error.message}`)
        } else {
          setConnectionStatus('接続成功！')
        }
      } catch (err) {
        setConnectionStatus(`接続失敗: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Supabase 接続テスト</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">接続状態:</h2>
            <p className={`p-3 rounded ${
              connectionStatus.includes('成功') 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus.includes('エラー') 
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {connectionStatus}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">プロジェクト情報:</h2>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || '未設定'}</p>
              <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}