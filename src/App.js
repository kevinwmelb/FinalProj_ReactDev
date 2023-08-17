import './App.css';
//import Giphy from './Giphy';
import MacroEconomics from './MacroEconomics';
import {Link, Routes, Route} from 'react-router-dom'
import ToShort from './ToShort';
import ToLong from './ToLong';
import SelectedStocks from './SelectedStocks';
import StockDetails from './StockDetails';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {BrowserRouter} from 'react-router-dom';

function App() {
	let show=true

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
	  setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
	  setAnchorEl(null);
	};
  
	const MyIcon = ({ title }) => (
		<p
		  align="left"
		  style={{
			left: "50px",
			backgroundColor: "blue",
			color: "white",
			fontSize: "20px",
			fontWeight: "bold",
			display: "inline-block",
			padding: "5px 8px 5px 8px",
			borderRadius: "6px"
		  }}
		>
		  {title}
		</p>
	  );
	  
  return (

    <div className="App">
	<MyIcon title={"CIC"} />
	
    <BrowserRouter>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}  
        open={open}	//
        onClose={handleClose}	//
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem component={Link} to="/">Macro-Economics</MenuItem>
        <MenuItem component={Link} to="/toshort">To Short</MenuItem>
        <MenuItem component={Link} to="/tolong">To Long</MenuItem>
      </Menu>

	

	  <Routes>
	    <Route path='/' element={<MacroEconomics/>} />
	    <Route path='/toshort' element={<ToShort />} />
	    <Route path='/tolong' element={<ToLong />} >
		  <Route index element={<SelectedStocks />} />
		  <Route path=':symbol' element={<StockDetails />} />
		</Route>
	    <Route path='*' element={<p>Page Not Found</p>} />
	  </Routes>

	  </BrowserRouter>
    </div>
  );
}

export default App;
