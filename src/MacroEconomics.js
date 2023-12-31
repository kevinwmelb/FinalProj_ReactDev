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
let rowInit=0
let returnInfo=[]
let apiError=null
let symbolString=""
let topicString=""
let limitString=""
let rows=[]
let x=0
let z=0

function MacroEconomics() {
	const [symbol, setSymbol] = useState("")
	const [topic, setTopic] = useState("")
	const [limit, setLimit] = useState(50)
	const [timeup, setTimeup] = useState(false)
	const [startSelect, setStartSelect] = useState(false)
	const [tableTrigger, setTableTrigger] = useState(false)


	const handleAPI = () => {
		fromMount+=1
		console.log("fromMount:", fromMount)
		if (fromMount<2) {
			return
		}

		//if (symbol != "") {
		//	symbolString="&tickers="+symbol
		//	console.log("symbolString:", symbolString)
		//}

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
				setTimeout(
					()=>{
						console.log("TableTrigger!");
						setTableTrigger(true)
					},
					3000
				)
				
			})

		setTimeout(
			()=>{
				console.log("Due to license limit, pls wait 1 min...");
				setTimeup(false)
			},
			5000
		)
		//return selectedSymbols
		return
	}
	
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
		for (z=0; z<returnInfo.length; z++) {
			let stockSymbol=""
			for (x=0; x<returnInfo[z].ticker_sentiment.length; x++) {
				stockSymbol=returnInfo[z].ticker_sentiment[x].ticker+", "+stockSymbol
			}
			let urlTitle=""
			urlTitle="<a href='"+returnInfo[z].url+"'>"+returnInfo[z].title+"</a>"
			console.log("stockSymbol:", stockSymbol)
			rows=[...rows, {"id":z, "Title":returnInfo[z].title, "Summary":returnInfo[z].summary, "PublishTime":returnInfo[z].time_published, "Source":returnInfo[z].source, "StockSymbol":stockSymbol, "SentimentScore":returnInfo[z].overall_sentiment_score,"SentimentLabel":returnInfo[z].overall_sentiment_label}]
		}
		console.log("rows:", rows)
	}

	//const rows = [
	//	{ id: 1, Title: "a", Summary: 'bc', PublishTime: '20230816T102524', Source: "Cointelegraph", StockSymbol: "CRYPTO:BTC", SentimentScore: -0.189983, SentimentLabel: "Somewhat-Bearish"},
	//	{ id: 2, Title: "d", Summary: 'ef', PublishTime: '20230816T102525', Source: "Cointelegraph", StockSymbol: "NOK", SentimentScore: 0.189983, SentimentLabel: "Somewhat-Bullish"},
	//];
	useEffect(handleAPI, [startSelect])
	useEffect(handleRows, [tableTrigger])

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
				 fontSize="3%"
		         loading={timeup}
				 loadingIndicator="One Min Query..."
		         onClick={e=>{setTableTrigger(false); setStartSelect(!startSelect); setTimeup(true)}}
		    >
			  Start Search
		    </LoadingButton>

		    </Stack>
		   </form>
		   
		   {tableTrigger == true && (
		    <div style={{ height: 400, width: '120%' }}>
      			<DataGrid
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
		   )}
			<h1> </h1>
		 </Container>
	)

}

export default MacroEconomics
