import React from 'react';
import {useContext, useState} from 'react';
import {Link, Routes, Route} from 'react-router-dom';
import {useOutletContext, Outlet, useNavigate} from 'react-router-dom';
import {Container, Stack, NativeSelect, Button, InputLabel} from '@mui/material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material'
import Divider from '@mui/material/Divider';
import XNYS1000 from './XNYS1000'
import XETRA1000 from './XETRA1000'

import LoadingButton from '@mui/lab/LoadingButton'
import SymbolChart from './SymbolChart'
import {Context} from './ToLong'

//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;
//All variables that impact state value has to be assigned/reassigned outside of 
//the main function body or embeded into a sub-function that won't be called immediately
//by main function, if the state is rendered in return section! If we do need it in main 
//function body, don't render state.
let selectedSymbols=[]
//To avoid rendering caused by mount:
let fromMount=0

function SelectedStocks () {
	const selectedSymbols=useOutletContext()
	console.log("selectedSymbols in SelectedStocks:", selectedSymbols)
	//Context also works, as long as there is no HTTP redirection
	//const props=React.useContext(Context)
	//console.log("SelectedStocks Context:", props)

	const [percentage, setPercentage] = useState("0.05")
	const [exchange, setExchange] = useState("ALL")
	const [timeup, setTimeup] = useState(false)
	const [startSelect, setStartSelect] = useState(false)
	//state update doesn't work in for loop due to overwriting issue. 
	//But it's still needed in handleSubmit trigger
	const [symbols, setSymbols] = useState([])
	//const [nok, setNok] = useState([])
	//const [monthly, setMonthly] = useState("")
	const [apiErr, setApiErr] = useState("")
	let navigate=useNavigate()

	const handleSubmit = sym => {
		navigate(sym)
	}

	return (
		<Container className="selectedStocks" maxWidth="md" sx={{textAlign: "center"}}>
			<h1> </h1>
		   <div> 
			   {selectedSymbols.length > 0 && selectedSymbols.map((sym, index) => 
		   		  (
					<TableContainer component={Paper} key={index}>
						<Table sx={{minWidth:650, "& .MuiTableCell-root": {border: '1px solid black'}}} aria-label="simple table">
							<TableBody>
								<TableRow>
									<TableCell component="th" scope="row" width="600">
										<SymbolChart sym={sym} key={index} />
									</TableCell>
									<TableCell width="400">
										<p>Company Name: {sym.company}</p>
										<Divider />
										<p>Company Symbol: {sym.symbol}</p>
										<Divider />
										<p>Company Current Month Close: {sym.current}</p>
										<Divider />
										<p>Company Past Year Average: {sym.yearAverage}</p>
										<Divider />
										<p>Company Actual Change Percentage: {sym.percent}</p>
										<Divider />
										<p>Exchange: {sym.exchange}</p>
										<Button
											variant="contained"
											size="medium"
											onClick={()=>handleSubmit(`${sym.symbol}`)}
										>
											check details ...
										</Button>
										{/*link tag from react router dom also work */}
										{/* hyperlink will change context! <a href={`http://localhost:3000/tolong/${sym.symbol}`}>...to check details</a>*/} 
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
		  		  )
				)} 
			</div>
			<h1> </h1>
		</Container>
	)
}

export default SelectedStocks
