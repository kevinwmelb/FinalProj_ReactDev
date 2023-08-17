import React, { useContext, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom'
import {useOutletContext, Outlet, useNavigate} from 'react-router-dom';
import {Context} from './ToLong'
import SymbolChart from './SymbolChart'
import {useState} from 'react';
import {Container, Stack, NativeSelect, TextField, Button, InputLabel} from '@mui/material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import Divider from '@mui/material/Divider';
import { DataGrid } from '@mui/x-data-grid';

//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;
//To avoid rendering caused by mount:
let fromMount=0
let rowInit=0
let returnNewsInfo=[]
let returnOvInfo={}
let returnEarningInfo=[]
let apiError=null
let sym={}
let rows=[]
let x=0
let z=0

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
  const [timeup, setTimeup] = useState(false)
  const [startSelect, setStartSelect] = useState(false)
  const [tableTrigger, setTableTrigger] = useState(false)


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
				setTimeout(
					()=>{
						console.log("TableTrigger!");
						setTableTrigger(true)
					},
					3000
				)
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
		setTimeout(
			()=>{
				console.log("Due to license limit, pls wait 1 min...");
				setTimeup(false)
			},
			5000
		)
		return
	}
  console.log("API Return:", apiReturn)
  //can't trigger handleAPI at mount

  const columns = [
	{ field: 'id', headerName: 'ID', width: 10 },
	{ field: 'Title', headerName: 'Title', width: 150 },
	{ field: 'Summary', headerName: 'Summary', width: 200 },
	{ field: 'PublishTime', headerName: 'PublishTime', width: 150 },
	{
		  field: 'Source',
		  headerName: 'Source',
		  width: 120,
	},
	{
		  field: 'StockSymbol',
		  headerName: 'RelatedStockSymbol',
		  width: 100,
	},
	{ field: 'SentimentScore', headerName: 'SentimentScore', width: 100 },
	{ field: 'SentimentLabel', headerName: 'SentimentLabel', width: 150 },
  ];

  const handleRows = () => {
	rowInit+=1
	console.log("rowInit:", rowInit)
	if (rowInit<2) {
		return
	}
	for (z=0; z<returnNewsInfo.length; z++) {
		let stockSymbol=""
		for (x=0; x<returnNewsInfo[z].ticker_sentiment.length; x++) {
			stockSymbol=returnNewsInfo[z].ticker_sentiment[x].ticker+", "+stockSymbol
		}
		let urlTitle=""
		urlTitle="<a href='"+returnNewsInfo[z].url+"'>"+returnNewsInfo[z].title+"</a>"
		console.log("stockSymbol:", stockSymbol)
		rows=[...rows, {"id":z, "Title":returnNewsInfo[z].title, "Summary":returnNewsInfo[z].summary, "PublishTime":returnNewsInfo[z].time_published, "Source":returnNewsInfo[z].source, "StockSymbol":stockSymbol, "SentimentScore":returnNewsInfo[z].overall_sentiment_score,"SentimentLabel":returnNewsInfo[z].overall_sentiment_label}]
	}
	console.log("rows:", rows)
  }

//const rows = [
//	{ id: 1, Title: "a", Summary: 'bc', PublishTime: '20230816T102524', Source: "Cointelegraph", StockSymbol: "CRYPTO:BTC", SentimentScore: -0.189983, SentimentLabel: "Somewhat-Bearish"},
//	{ id: 2, Title: "d", Summary: 'ef', PublishTime: '20230816T102525', Source: "Cointelegraph", StockSymbol: "NOK", SentimentScore: 0.189983, SentimentLabel: "Somewhat-Bullish"},
//];

  useEffect(handleRows, [tableTrigger])
  useEffect(handleAPI, [])

  return (
		<Container className="StockDetails" maxWidth="md" sx={{textAlign: "center"}}>
			<h1></h1>
			<TableContainer component={Paper} >
				<Table sx={{minWidth:650, "& .MuiTableCell-root": {border: '1px solid black'}}} aria-label="simple table">
					<TableBody>
						<TableRow>
							<TableCell component="th" scope="row"  width="60%">
								<SymbolChart sym={sym} />
							</TableCell>
							<TableCell  width="40%">
								<p>Company Name: {sym.company}</p>
								<Divider />
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

