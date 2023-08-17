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
let ovEarningRows=[]
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
					9000
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

  const ovEarningColumns = [
	{ field: 'id', headerName: 'ID', width: 3 },
	{ field: 'Desc', headerName: 'Description', width: 150 },
	{ field: 'EBITDA', headerName: 'EBITDA', width: 65 },
	{ field: 'PE', headerName: 'PERatio', width: 70 },
	{ field: 'EPS', headerName: 'EPS', width: 60 },
	{ field: '52WKH', headerName: '52WeekHigh', width: 100	},
	{ field: '52WKL', headerName: '52WeekLow', width: 100	},
	{ field: '50DMA', headerName: '50DayMovingAverage', width: 110,	},
	{ field: '200DMA', headerName: '200DayMovingAverage', width: 110,	},
	{ field: 'OneYearEarning', headerName: 'OneYearEarning', width: 120 },
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
		//console.log("stockSymbol:", stockSymbol)
		rows=[...rows, {"id":z, "Title":returnNewsInfo[z].title, "Summary":returnNewsInfo[z].summary, "PublishTime":returnNewsInfo[z].time_published, "Source":returnNewsInfo[z].source, "StockSymbol":stockSymbol, "SentimentScore":returnNewsInfo[z].overall_sentiment_score,"SentimentLabel":returnNewsInfo[z].overall_sentiment_label}]
	}
	console.log("rows:", rows)


	//for (z=0; z<returnNewsInfo.length; z++) {
	//	let stockSymbol=""
	//	for (x=0; x<returnNewsInfo[z].ticker_sentiment.length; x++) {
	//		stockSymbol=returnNewsInfo[z].ticker_sentiment[x].ticker+", "+stockSymbol
	//	}
	//	let urlTitle=""
	//	urlTitle="<a href='"+returnNewsInfo[z].url+"'>"+returnNewsInfo[z].title+"</a>"
		//console.log("stockSymbol:", stockSymbol)
	//}
	let WH52=returnOvInfo[Object.keys(returnOvInfo)[39]]
	let WL52=returnOvInfo[Object.keys(returnOvInfo)[40]]
	let DMA50=returnOvInfo[Object.keys(returnOvInfo)[41]]
	let DMA200=returnOvInfo[Object.keys(returnOvInfo)[42]]
	ovEarningRows=[{"id":0, "Desc":returnOvInfo.Description, "EBITDA":returnOvInfo.EBITDA, "PE":returnOvInfo.PERatio, "EPS":returnOvInfo.EPS, "52WKH":WH52, "52WKL":WL52, "50DMA":DMA50, "200DMA":DMA200, "OneYearEarning":"abc" }]
	console.log("ovEarningRows:", ovEarningRows)
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
								<Divider />
								<p>Company Current Month Close: {sym.current}</p>
								<Divider />
								<p>Company Past Year Average: {sym.yearAverage}</p>
								<Divider />
								<p>Company Actual Change Percentage: {sym.percent}</p>
								<Divider />
								<p>Exchange: {sym.exchange}</p>
								
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<h1></h1>
				{tableTrigger == true && (
				<div style={{ height: 400, width: '120%' }}> 
					<DataGrid
					autoHeight="true"
					align="left"
        			rows={ovEarningRows}
        			columns={ovEarningColumns}
        			initialState={{
          				pagination: {
            				paginationModel: { page: 0, pageSize: 5 },
          				},
        			}}
        			pageSizeOptions={[5, 10]}
      				/>
				</div>
				)}

			<h1></h1>
			{/*	{tableTrigger == true && (
					<div style={{ height: 400, width: '120%' }}>
					<DataGrid
					autoHeight="true"
					align="left"
        			rows={rows}
        			columns={columns}
        			initialState={{
          				pagination: {
            				paginationModel: { page: 0, pageSize: 5 },
          				},
        			}}
        			pageSizeOptions={[5, 10]}
      				/>
					</div>
				)} */}
				<h1></h1> 
   			<Button
				variant="contained"
				size="medium"
				onClick={()=>handleSubmit()}
			>
				Back to all selected symbols
			</Button>
			<h1></h1>
		</Container>
	)
}

