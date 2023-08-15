import {useState} from 'react';
//import ReactDOM from 'react-dom/client';
import {Link, Routes, Route} from 'react-router-dom';
import WebTV from './WebTV';
import UrwTV from './UrwTV';
//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;


function MainPage() {
	const [phrase, setPhrase] = useState("")

	const getGif = () => {
		//fetch(`http://api.marketstack.com/v1/eod?access_key=${APIKey}&symbols=NOK`)
		//fetch(`http://api.marketstack.com/v1/eod?access_key=${APIKey}&symbols=WEB.XASX`)
		//fetch(`http://api.marketstack.com/v1/exchanges/XASX/tickers?access_key=${APIKey}&limit=1000&offset=1050`)
		fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=WBJ.FRK&apikey=${APIKey}`)
		//fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=cba&apikey=${APIKey}`)
			.then(res => res.json())
			//res.data.url has CORB issue
			.then(res => console.log("NOK", res))
			.then(res => setPhrase(res))
	}

	//console.log("Gif link", gif)

	return (
		<div className="MainPage">
			<button onClick={getGif}>Get Gif</button>
		        <UrwTV />
		        <WebTV />
		</div>
	)
}

export default MainPage
