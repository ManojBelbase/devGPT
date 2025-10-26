import {Route, Routes} from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPageIndex from './pages/login/LoginPageIndex';
import CreditPageIndex from './pages/credit/CreditPageIndex';
import CommunityPageIndex from './pages/community/CommunityPageIndex';
import { FronendRoutes } from './constant/FrontendRoutes';

function App() {

  return (
    <>
    <Routes>
        <Route path={FronendRoutes.LOGIN} element={<LoginPageIndex/>} />
      <Route path="/" element={<Layout/>}>
       <Route index element={<div>Home Page</div>} />
       <Route path={FronendRoutes.COMMUNITY} element={<CommunityPageIndex/>} />
       <Route path={FronendRoutes.CREDITS} element={<CreditPageIndex/>} />
      </Route>
    </Routes>
    </>
  )
}

export default App
