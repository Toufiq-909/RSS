import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./components/landingpage"
import Feed from "./components/feed"
import Auth from "./components/auth"
export default function App()
{
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/feed" element={<Feed/>}/>
    <Route path="/login" element={<Auth mode="login"/>}/>
    <Route path="/signup" element={<Auth mode="signup"/>}/>
   </Routes>
   </BrowserRouter>
  )
}
