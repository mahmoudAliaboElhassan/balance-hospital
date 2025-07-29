import { useState } from "react";

import "./App.css";
import Login from "../components/login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-red-500">
      Mahmoud ali
      <Login />
    </div>
  );
}

export default App;
