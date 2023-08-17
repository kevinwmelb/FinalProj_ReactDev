//import ReactDOM from 'react-dom/client';
import {Link, Routes, Route} from 'react-router-dom';
import SymbolChart from './SymbolChart';
import IndexDAX from './Index_DAX'
import IndexDXY from './Index_DXY'
import IndexSPX from './Index_SPX'
import IndexVIX from './Index_VIX'
import {useState, useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {Container, Stack, NativeSelect, TextField, Button, InputLabel} from '@mui/material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { DataGrid } from '@mui/x-data-grid';

//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;
//To avoid rendering caused by mount:
let fromMount=0
let returnInfo=[]
let apiError=null
let symbolString=""
let topicString=""
let limitString=""
let indexDAX={"symbol": "INDEX:DEU40"}
let indexDXY={"symbol": "CAPITALCOM:DXY"}
let indexSPX={"symbol": "OANDA:SPX500USD"}
let indexVIX={"symbol": "CAPITALCOM:VIX"}

function MacroEconomics() {
	const [symbol, setSymbol] = useState("")
	const [topic, setTopic] = useState("")
	const [limit, setLimit] = useState(50)
	const [timeup, setTimeup] = useState(false)
	const [startSelect, setStartSelect] = useState(false)

	const handleAPI = () => {
		fromMount+=1
		console.log("fromMount:", fromMount)
		if (fromMount<2) {
			return
		}

		if (symbol != "") {
			symbolString="&tickers="+symbol
			console.log("symbolString:", symbolString)
		}

		if (topic != "") {
			topicString="&topics="+topic
			console.log("topicString:", topicString)
		}

		limitString="&limit="+limit
		console.log("limitString:", limitString)

		console.log("URL:", `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${APIKey}${symbolString}${topicString}${limitString}`)

		fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${APIKey}${symbolString}${topicString}${limitString}`)
		//fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=cba&apikey=${APIKey}`)
			.then(res=>{
				console.log("res status:", res.status)
				if (res.status !== 200) {
					returnInfo=[]
					console.log("res status & info:", res.status, res.Information)
				} else {
					res.json().then(res => {
						console.log("res:", res)
					    console.log("res items:", res.items)
						if (res.items != "0") {
					       returnInfo=res.feed
					       console.log("returnInfo:", returnInfo)

					    } else {
							returnInfo=[]
					    }
				   })
				}
			})

		setTimeout(
			()=>{
				console.log("Due to license limit, pls wait 1 min...");
				setTimeup(false)
			},
			10000
		)
		//return selectedSymbols
		return
	}

	useEffect(handleAPI, [startSelect])

	
	const columns = [
		{ field: 'Title', headerName: 'Title', width: 100 },
		{ field: 'Summary', headerName: 'Summary', width: 130 },
		{ field: 'PublishTime', headerName: 'PublishTime', width: 50 },
		{
	  		field: 'Source',
	  		headerName: 'Source',
	  		width: 40,
		},
		{
	  		field: 'RelatedStockSymbol',
	  		headerName: 'RelatedStockSymbol',
	  		width: 80,
		},
		{ field: 'OverallSentimentScore', headerName: 'OverallSentimentScore', width: 30 },
		{ field: 'OverallSentimentLabel', headerName: 'OverallSentimentLabel', width: 30 },
  	];
  
	  const rows = [
		{ Title: "a", Summary: 'bc', PublishTime: '20230816T102524', Source: "Cointelegraph", RelatedStockSymbol: "CRYPTO:BTC", OverallSentimentScore: -0.189983, OverallSentimentLabel: "Somewhat-Bearish"},
		{ Title: "d", Summary: 'ef', PublishTime: '20230816T102525', Source: "Cointelegraph", RelatedStockSymbol: "NOK", OverallSentimentScore: 0.189983, OverallSentimentLabel: "Somewhat-Bullish"},
	  ];

	return (

		<Container className="MacroEconomics" maxWidth="md" sx={{textAlign: "center"}}>
  			 <fieldset style={{width:"100%", marginleft:"auto", marginright:"auto"}}>
   			   <legend style={{backgroundcolor:"blue", fontweight:"bold",}}>Index Dashboard</legend>
      			<table>
         			<tr>
            			<td><IndexDAX /><Divider orientation="vertical" flexItem /></td>
            			<td><IndexDXY /></td>
						<td><IndexSPX /></td>
            			<td><IndexVIX /></td>
         			</tr>
      			</table>
   			</fieldset>

		  <h1>Market News & Sentiment Search</h1>
		  <form onSubmit={handleAPI}>
		    <Stack
		     direction="row"
		     justifyContent="center"
		     alignItems="center"
		     spacing={2}
		    >
			{/* can't co-exist with topics:
			<TextField
			  label="symbol"
			  size="small"
			  value={symbol}
			  onChange={event=>setSymbol(event.target.value)}
	        /> */}
			<InputLabel variant="standard">Topics</InputLabel>
		 	<NativeSelect 
			 defaultValue={""}
			 onChange={e=>{setTopic(e.target.value); setTimeup(false)}}
			 inputProps={{
				 name: 'News Topic',
				 id: 'topic',
			 }}
			>
			 <option value={""}>None</option>
			 <option value={"blockchain"}>Blockchain</option>
			 <option value={"earnings"}>Earnings</option>
			 <option value={"mergers_and_acquisitions"}>Mergers & Acquisitions</option>
			 <option value={"financial_markets"}>Financial Markets</option>
			 <option value={"economy_fiscal"}>Economy-Fiscal Policy</option>
			 <option value={"economy_monetary"}>Economy-Monetary Policy</option>
			 <option value={"economy_macro"}>Economy-Macro</option>
			 <option value={"energy_transportation"}>Energy & Transportation</option>
			 <option value={"finance"}>Finance</option>
			 <option value={"life_sciences"}>Life Sciences</option>
			 <option value={"manufacturing"}>Manufacturing</option>
			 <option value={"real_estate"}>Real Estate & Construction</option>
			 <option value={"retail_wholesale"}>Retail & Wholesale</option>
			 <option value={"technology"}>Technology</option>
			</NativeSelect>

			<InputLabel variant="standard">Limit</InputLabel>
		 	<NativeSelect 
			 defaultValue={50}
			 onChange={e=>{setLimit(e.target.value); setTimeup(false)}}
			 inputProps={{
				 name: 'News Limit',
				 id: 'limit',
			 }}
			>
			 <option value={50}>50</option>
			 <option value={100}>100</option>
			</NativeSelect>
		
			<LoadingButton
		         variant="contained"
				 size="large"
				 fontsize="3%"
		         loading={timeup}
				 loadingIndicator="One Min Query..."
		         onClick={e=>{returnInfo=[]; setStartSelect(!startSelect); setTimeup(true)}}
		    >
			  Start Search
		    </LoadingButton>

		    </Stack>
		   </form>

			<div> 
				{returnInfo.length > 0 && returnInfo.map((news, index) => 
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
		 </Container>
	)

}

export default MacroEconomics
