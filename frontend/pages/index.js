import {useEffect, useState} from 'react'

export default function Home(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('http://localhost:8000/api/items/')
      .then(res=>res.json())
      .then(data=>{ setItems(data); setLoading(false) })
      .catch(err=>{ console.error(err); setLoading(false) })
  },[])

  return (
    <main style={{padding: '2rem', fontFamily: 'Arial'}}>
      <h1>Project Nexus — Items</h1>
      {loading ? <p>Loading…</p> : (
        <ul>
          {items.length === 0 && <li>No items yet (create via admin or API)</li>}
          {items.map(item=> (
            <li key={item.id}>
              <strong>{item.name}</strong>
              <div>{item.description}</div>
              <small>{new Date(item.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
