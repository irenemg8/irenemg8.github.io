"use client"

import { X } from 'lucide-react'

interface SimpleWebWindowProps {
  url: string
  title: string
  onClose: () => void
}

export function SimpleWebWindow({ url, title, onClose }: SimpleWebWindowProps) {
  return (
    <div 
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '900px',
        height: '80vh',
        maxHeight: '600px',
        zIndex: 999999,
        backgroundColor: 'white',
        border: '5px solid #FF0000',
        borderRadius: '8px',
        boxShadow: '0 0 100px rgba(255, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{
        height: '40px',
        background: 'linear-gradient(to bottom, #e0e0e0, #d0d0d0)',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        borderBottom: '1px solid #999'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Traffic lights */}
          <button
            onClick={onClose}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ff5f56',
              border: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ffbd2e'
          }} />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#27c93f'
          }} />
        </div>
        <span style={{ fontSize: '14px', color: '#333' }}>{title}</span>
        <div style={{ width: '36px' }} />
      </div>
      
      {/* URL Bar */}
      <div style={{
        padding: '8px',
        background: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}>
        <div style={{
          background: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          🌐 {url}
        </div>
      </div>
      
      {/* Content */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'white'
      }}>
        <iframe
          src={url}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title={title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}
