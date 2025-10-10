import { Routes, Route } from "react-router-dom"
import Rodd from "./test/Rodd"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Rodd />} />
    </Routes>

  )
}
export default App