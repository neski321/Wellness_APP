import { useState } from "react"

console.log("App.tsx: Starting to load...")

function App() {
  console.log("App: Component rendering...")
  const [count, setCount] = useState(0)

  console.log("App: About to render JSX...")
  
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-center mb-8">MindPulse</h1>
        <p className="text-center mb-4">If you can see this, React is working!</p>
        <div className="text-center">
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Count: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

console.log("App.tsx: Component defined, exporting...")
export default App
