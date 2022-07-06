import { BrowserRouter as Router, Routes, Navigate, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import { LandingPage } from './pages/index';

let hist = createBrowserHistory();

const App = () => {
  return (
    <Router history={hist}>
        <Routes>
            <Route path="/" exact element={ LandingPage() } />

            {/* if user go to unknow page bring user to home page */}
            <Route path="*" element={<Navigate to ="/" />}/>
        </Routes>
    </Router>
  );
}

export default App;
