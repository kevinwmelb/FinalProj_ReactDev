import React, {useState, useEffect} from 'react';
import {Link, Routes, Route} from 'react-router-dom';
import {Outlet, useNavigate} from 'react-router-dom';
import {Container, Stack, NativeSelect, Button, InputLabel} from '@mui/material'
import XNYS1000 from './XNYS1000'
import XETRA1000 from './XETRA1000'

import LoadingButton from '@mui/lab/LoadingButton'
import SymbolChart from './SymbolChart'

//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;
//All variables that impact state value has to be assigned/reassigned outside of 
//the main function body or embeded into a sub-function that won't be called immediately
//by main function, if the state is rendered in return section! If we do need it in main 
//function body, don't render state.
let selectedSymbols=[]
//To avoid rendering caused by mount:
let fromMount=0
export const Context=React.createContext({})

function ToLong (props) {
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

	const handleExchange =()=>{
		if (exchange == "ALL") {
			handleAPI("XNYS1000", 1)
			handleAPI("XETRA1000", 1)
		} else if (exchange == "XNYS") {
			handleAPI("XNYS1000", 3)
		} else if (exchange == "XETRA") {
			handleAPI("XETRA1000", 3)
		} else {
			setApiErr("Wrong Exchange Code")
		}
		return
	}

	const handleAPI = (exchangeFile, times) => {
		console.log("exchangeFile:", exchangeFile, "times:", times)
		//To skip the 1st and 2nd calls at mount for exchange "ALL".
		//let exc=eval({exchangeFile})
		//console.log("exc:", exc.exchangeFile)
		let skipTimes=2
		if (exchange == "ALL") {
			skipTimes=3
		}
		fromMount+=1
		console.log("fromMount:", fromMount)
		if (fromMount<skipTimes) {
			return
		}

		selectedSymbols=[]
		//setStates together with for loop doesn't work due to the delay.
		//if (type="percentChange") {
		//	setPercentage(value)
		//	console.log("states1:", value, percentage)
		//} else if (type ="exchangeChange") {
		//	setExchange({value})
		//	console.log("states2:", percentage)
		//} else {
		//	setApiErr("Form Population Err")
		//	console.log("states3:", percentage)
		//}

		for (let i=0; i<times; i++) {
			let symbol
			let exchangeAcronym
			let companyName
			let sym1
			let sym2

			if (exchangeFile == "XNYS1000") {
			   symbol=XNYS1000.data.tickers[i].symbol
			   exchangeAcronym=XNYS1000.data.mic
			   companyName=XNYS1000.data.tickers[i].name
			} else if (exchangeFile == "XETRA1000") {
				sym1=XETRA1000.data.tickers[i].symbol
				sym2=sym1.slice(0,-5)
				symbol=sym2+"DEX"
				exchangeAcronym=XETRA1000.data.mic
				companyName=XETRA1000.data.tickers[i].name
			}

			console.log("Symbol in Tolong:", symbol)
			let monthlyData=null
			//let currentMonth=null
			let currentMonthClose=null
			let month1Close=null
			let month2Close=null
			let month3Close=null
			let month4Close=null
			let month5Close=null
			let month6Close=null
			let month7Close=null
			let month8Close=null
			let month9Close=null
			let month10Close=null
			let month11Close=null
			let month12Close=null
			let year1Total=0
			let year1Average=0
			let selectFlag=null
			let stockPercentage=0

			fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${APIKey}&limit=2`)
			//fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=cba&apikey=${APIKey}`)
			.then(res=>{
				console.log("res status:", res.status)
				if (res.status !== 200) {
					console.log("res status & info:", res.status, res.Information)
					monthlyData={ERR: "error in API reply"}
					//setMonthly({ERR: "error in API reply"})
					setApiErr("API Network Err")
				} else {
					res.json().then(res => {
						//console.log("res:", res)
					    console.log("res info:", res.Information)
						if (res.Information == null && res["Monthly Time Series"] != null) {
					    //console.log("MonthlySeries", res["Monthly Time Series"])
					    monthlyData=res["Monthly Time Series"]
					    console.log("monthlyData:", monthlyData)
					    //currentMonth=monthlyData[Object.keys(monthlyData)[0]]
					    //console.log("currentMonth:", currentMonth)
			  		    //currentMonthClose=currentMonth["4. close"]
						currentMonthClose=monthlyData[Object.keys(monthlyData)[0]]["4. close"]
					    console.log("currentMonthClose:", currentMonthClose)
						month1Close=monthlyData[Object.keys(monthlyData)[1]]["4. close"]
					    //console.log("month1Close:", month1Close)
						month2Close=monthlyData[Object.keys(monthlyData)[2]]["4. close"]
					    //console.log("month2Close:", month2Close)
						month3Close=monthlyData[Object.keys(monthlyData)[3]]["4. close"]
					    //console.log("month3Close:", month3Close)
						month4Close=monthlyData[Object.keys(monthlyData)[4]]["4. close"]
					    //console.log("month4Close:", month4Close)
						month5Close=monthlyData[Object.keys(monthlyData)[5]]["4. close"]
					    //console.log("month5Close:", month5Close)
						month6Close=monthlyData[Object.keys(monthlyData)[6]]["4. close"]
					    //console.log("month6Close:", month6Close)
						month7Close=monthlyData[Object.keys(monthlyData)[7]]["4. close"]
					    //console.log("month7Close:", month7Close)
						month8Close=monthlyData[Object.keys(monthlyData)[8]]["4. close"]
					    //console.log("month8Close:", month8Close)
						month9Close=monthlyData[Object.keys(monthlyData)[9]]["4. close"]
					    //console.log("month9Close:", month9Close)
						month10Close=monthlyData[Object.keys(monthlyData)[10]]["4. close"]
					    //console.log("month10Close:", month10Close)
						month11Close=monthlyData[Object.keys(monthlyData)[11]]["4. close"]
					    //console.log("month11Close:", month11Close)
						month12Close=monthlyData[Object.keys(monthlyData)[12]]["4. close"]
					    //console.log("month12Close:", month12Close)
					    
						//Can't use state due to additional delay	    
					    //setMonthly(res["Monthly Time Series"])

						for (let i=1; i<13; i++) {
							//let month="month"+i+"Close"
							//console.log("month1:", month)
							let monthClose=eval("month"+i+"Close")
							if ( !isNaN(monthClose) ) {
								//console.log("a number!", monthClose)
								//year1Total=Number(year1Total)+monthClose
								year1Total+=Number(monthClose)
							} else {
								selectFlag=false
								break
							}
						}
						
						if (selectFlag != false) {
							year1Average=year1Total/12
							console.log("year1Average:", year1Average)
							stockPercentage=1-Number(currentMonthClose)/year1Average
							console.log("percentage:", stockPercentage, percentage)
							if (Number(stockPercentage)>=Number(percentage) && Number(stockPercentage)<1) {
								if (exchangeFile == "XETRA1000") {
									sym2=sym1.slice(0,-6)
									symbol="XETR:"+sym2
								}
								//incorrect syntax: selectedSymbols={...selectedSymbols, {symbol:symbol, company:companyName, exchange:exchangeAcronym, current:currentMonthClose, y:year1Average, percent:stockPercentage}}
								selectedSymbols=[...selectedSymbols, {"symbol":symbol, "company":companyName, "exchange":exchangeAcronym, "current":currentMonthClose, "yearAverage":year1Average, "percent":stockPercentage}]
								setSymbols([symbol])
								console.log("selectedSymbols:", selectedSymbols, "symbol:", symbol)
								//state can't be used since additional delay in for loop will lead to
								//symbols state update for diff symbol to overwrite each other. We only 
								//have one symbol left in state finally!
								//if (symbol!="NOK") {
								//setSymbols([...symbols, symbol])
								//} else {
								//setNok([...nok, symbol])
								//}
							} 
						} else {
								setApiErr("API No Data Err")
						}
					} else {
						setApiErr("API Limit per Day Err")
					}
					})
					
				}
			})
			//Due to delay of fetch, value assignment has to be done inside then method, which has the same delay! Outside assignment is the same across for loop!
			//console.log("monthlyData:", monthlyData)

			//To access the first element of object array:
			//console.log("monthly:", monthly[Object.keys(monthly)[0]])

			//currentMonth=monthlyData[Object.keys(monthlyData)[0]]
			//Below get err "can't convert undefined or null to obj"
			//currentMonth=monthly[Object.keys(monthly)[0]][Object.keys(monthly[Object.keys(monthly)[0]])[2]]

			//if (currentMonth != null) {
			  //Either one below will do
			  //currentMonthClose=Object.values(currentMonth)[3]
			  //currentMonthClose=currentMonth["4. close"]
			  //console.log("currentMonth:", currentMonth)
			  //console.log("currentMonthClose:", currentMonthClose)
			//}

			//To access the last element of object array:
			//console.log("monthlyData:", monthly[Object.keys(monthly)[Object.keys(monthly).length-1]])
		}
		//below statements run outside of for loop are run even before 1st fetch!
		//console.log("symbols:", [...symbols],[nok])
		//console.log("selectedSymbols:!", [...selectedSymbols])
		//setSymbols(selectedSymbols)
		setTimeout(
			()=>{
				console.log("Due to license limit, pls wait 1 min...");
				setTimeup(false)
			},
			60000
		)
		//return selectedSymbols
		return
	}

	//Return of handleAPI is before finish of 1st fetch! so return null
	//Since selectedSymbols keep value during form fillin, we can only setState
	//after the next button click
	//const handleSelectedSymbols = () => {
		//let returnVal=handleAPI
		//console.log("returnVal:", returnVal)
		//setSymbols(returnVal)
		
		//if (selectedSymbols != "") {
			//console.log("latest selectedSymbols:", selectedSymbols, "last", selectedSymbols.slice(-1))
			//setSymbols(selectedSymbols)
		//}
	//}


	useEffect(handleExchange, [startSelect])

	return (
		<Context.Provider value={selectedSymbols}>
		<Container className="ToLong" maxWidth="md" sx={{textAlign: "center"}}>
		  <h1>Symbol Search</h1>
		  <p><b>- based on exchange location and price difference between current month and last year average</b></p>
		  <form onSubmit={handleAPI}>
		    <Stack
		     direction="row"
		     justifyContent="center"
		     alignItems="center"
		     spacing={2}
		    >
			<InputLabel variant="standard">Price Difference:</InputLabel>
		 	<NativeSelect 
			 defaultValue={0.05}
			 onChange={e=>{setPercentage(e.target.value); setTimeup(false)}}
			 inputProps={{
				 name: 'Percentage',
				 id: 'Percentage',
			 }}
			>
			 <option value={0.3}>30%</option>
			 <option value={0.05}>5%</option>
			</NativeSelect>

			<InputLabel variant="standard">Exchange:</InputLabel>
		 	<NativeSelect 
			 defaultValue={"ALL"}
			 onChange={e=>{setExchange(e.target.value); setTimeup(false)}}
			 inputProps={{
				 name: 'Exchange',
				 id: 'Exchange',
			 }}
			>
			 <option value={"ALL"}>ALL</option>
			 <option value={"XNYS"}>NewYorkStockExchange-USA</option>
			 <option value={"XETRA"}>FrankfurtStockExchange-German</option>
			</NativeSelect>
		
			<LoadingButton
		         variant="contained"
		         loading={timeup}
				 loadingIndicator="One Min Query..."
		         onClick={e=>{selectedSymbols=[]; setStartSelect(!startSelect); setTimeup(true)}}
		    >
			  Symbol Search
		    </LoadingButton>

		    </Stack>
		   </form>

		  <Outlet context={selectedSymbols} />
		  {/* <div> {Object.keys(selectedSymbols).length > 0 && selectedSymbols.map((sym, index) => <SymbolChart sym={sym} key={index} />)} </div>*/}
		  {/*<h1>Percent:{percentage}; 1st:{selectedSymbols[0]}; 2nd:{selectedSymbols[1]}</h1>
		  <h1>API Err: {apiErr}</h1>*/}
		</Container>
		</Context.Provider>
	)
}

export default ToLong
