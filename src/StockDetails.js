import React, { useContext, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom'
import {useOutletContext, Outlet, useNavigate} from 'react-router-dom';
import {Context} from './ToLong'
import SymbolChart from './SymbolChart'
import {useState} from 'react';
import {Container, Stack, NativeSelect, TextField, Button, InputLabel} from '@mui/material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;
//To avoid rendering caused by mount:
let fromMount=0
let returnNewsInfo=[]
let returnOvInfo={}
let returnEarningInfo=[]
let apiError=null
let sym={}

export default function StockDetails() {
  const params=useParams()
  console.log("symbol in StockDetails:", params, params.symbol)
  const selectedSymbols=useOutletContext()
  console.log("selectedSymbols in StockDetails:", selectedSymbols)
  //Below also works as long as there is no http re-direction.
  //const props=React.useContext(Context)
	//console.log("StockDetails Context:", props)
  let navigate=useNavigate()
  const [symbol, setSymbol] = useState(sym.symbol)
  const [apiReturn, setApiReturn] = useState()

  for (let i=0; i<selectedSymbols.length; i++) {
    if (selectedSymbols[i].symbol == params.symbol) {
      sym=selectedSymbols[i]
    }
  }
  

  console.log("sym in StockDetails:", sym)
	const handleSubmit = ()=> {
		navigate('/tolong')
	}

	const handleAPI = () => {

		console.log("URL:", `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${APIKey}&symbol=${sym.symbol}`)
		fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${APIKey}&symbol=${sym.symbol}&limit=10`)
			.then(res=>{
				console.log("res status:", res.status)
				if (res.status !== 200) {
					returnNewsInfo=[]
					console.log("res status & info:", res.status, res.Information)
					setApiReturn("NewsError")
				} else {
					res.json().then(res => {
						console.log("res:", res)
					    console.log("res items:", res.items)
						if (res.items != "0") {
					       returnNewsInfo=res.feed
					       console.log("returnNewsInfo:", returnNewsInfo)
						   setApiReturn("NewsOK")
					    } else {
							returnNewsInfo=[]
							setApiReturn("NewsZero")
					    }
				   })
				}
			})
		console.log("URL:", `https://www.alphavantage.co/query?function=EARNINGS&apikey=${APIKey}&symbol=${sym.symbol}`)
		fetch(`https://www.alphavantage.co/query?function=EARNINGS&apikey=${APIKey}&symbol=${sym.symbol}`)
			.then(res=>{
				console.log("res status:", res.status)
				if (res.status !== 200) {
					returnEarningInfo={}
					console.log("res status & info:", res.status, res.Information)
					setApiReturn("EarningError")
				} else {
					res.json().then(res => {
					console.log("res:", res)
					console.log("res items:", res.items)
					if (res.items != "0") {
					   returnEarningInfo=res.annualEarnings
					   console.log("returnEarningInfo:", returnEarningInfo)
					   setApiReturn("EarningOK")
					} else {
						returnEarningInfo=[]
						setApiReturn("EarningZero")
					}
				   })
				}
			})
		console.log("URL:", `https://www.alphavantage.co/query?function=OVERVIEW&apikey=${APIKey}&symbol=${sym.symbol}`)
		fetch(`https://www.alphavantage.co/query?function=OVERVIEW&apikey=${APIKey}&symbol=${sym.symbol}`)
			.then(res=>{
				console.log("res status:", res.status)
				if (res.status !== 200) {
					returnOvInfo=[]
					console.log("res status & info:", res.status, res.Information)
					setApiReturn("OvError")
				} else {
					res.json().then(res => {
					console.log("res:", res)
					console.log("res items:", res.items)
					if (res.items != "0") {
					   returnOvInfo=res
					   console.log("returnOvInfo:", returnOvInfo)
					   setApiReturn("OvOK")
					} else {
						returnOvInfo=[]
						setApiReturn("OvZero")
					}
				   })
				}
		})
		//setTimeout(
		//	()=>{
		//		console.log("Due to license limit, pls wait 5 Sec...");
		//		setTimeup(true)
		//	},
		//	5000
		//)
		//return selectedSymbols
		return
	}
  console.log("API Return:", apiReturn)
  //can't trigger handleAPI at mount
  useEffect(handleAPI, [])

  return (
		<Container className="StockDetails" maxWidth="md" sx={{textAlign: "center"}}>
			<TableContainer component={Paper} >
				<Table sx={{minWidth:650}} aria-label="simple table">
					<TableBody>
						<TableRow>
							<TableCell component="th" scope="row">
								<SymbolChart sym={sym} />
							</TableCell>
							<TableCell>
								<p>Company Name: {sym.company}</p>
								<p>Company Symbol: {sym.symbol}</p>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<div> 
					 <TableContainer component={Paper}>
						 <Table sx={{minWidth:650}} aria-label="simple table">
							 <TableBody>
								 <TableRow>
									 <TableCell>
										 <p>50 Day Moving Average: {returnOvInfo[Object.keys(returnOvInfo)[41]]}</p>
										 <p>200 Day Moving Average: {returnOvInfo[Object.keys(returnOvInfo)[42]]}</p>
									 </TableCell>
									 <TableCell>
										 Current Year Earnings: {returnEarningInfo.map((annualEarn, key) =>
										<div key={key}>{annualEarn.fiscalDateEnding}:&nbsp;{annualEarn.reportedEPS}</div>)}

									 </TableCell>
								 </TableRow>
							 </TableBody>
						 </Table>
					 </TableContainer>
			</div>
			<div> 
				{returnNewsInfo.length > 0 && returnNewsInfo.map((news, index) => 
				  (
					 <TableContainer component={Paper} key={index}>
						 <Table sx={{minWidth:650}} aria-label="simple table">
							 <TableBody>
								 <TableRow>
									 <TableCell component="th" scope="row">
										<a href={`${news.url}`}>{news.title}</a>
									 </TableCell>
									 <TableCell>
										 <p>Publish Time: {news.time_published}</p>
										 <p>Authors: {news.authors}</p>
										 <p>Source: {news.source}</p>
										 Related Stock Symbols: {news.ticker_sentiment.map((symbol, idx) => 
										 	(
												<div key={idx}>{symbol.ticker}&nbsp;</div>
											)
										 )}
										 
									 </TableCell>
									 <TableCell>
										Summary: {news.summary}
									 </TableCell>
									 <TableCell>
										<p>Overall Sentiment Score: {news.overall_sentiment_score}</p>
										<p>Overall Sentiment Label: {news.overall_sentiment_label}</p>
									 </TableCell>
								 </TableRow>
							 </TableBody>
						 </Table>
					 </TableContainer>
			 		)
				)} 
			</div>

   			<Button
				variant="contained"
				size="medium"
				onClick={()=>handleSubmit()}
			>
				Back to all selected symbols
			</Button>
		</Container>
	)
}

