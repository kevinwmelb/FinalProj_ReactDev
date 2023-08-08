import './App.css';
//import Giphy from './Giphy';
import MacroEconomics from './MacroEconomics';
import {Link, Routes, Route} from 'react-router-dom'
import ToShort from './ToShort';
import ToLong from './ToLong';

function App() {
  return (
    <div className="App">
	  <nav>
	    <Link to='/'>Macro-Economics</Link> &emsp;|&emsp; <Link to='/toshort'>To_Short</Link>&emsp;|&emsp;<Link to='/tolong'>To_Long</Link> 
	  </nav>

	  <Routes>
	    <Route path='/' element={<MacroEconomics/>} />
	    <Route path='/toshort' element={<ToShort />} />
	    <Route path='/tolong' element={<ToLong />} />
	    <Route path='*' element={<p>Page Not Found</p>} />
	  </Routes>
    </div>
  );
}

export default App;
