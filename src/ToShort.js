import {useState} from 'react';
import {Link, Routes, Route} from 'react-router-dom';

//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;


function ToShort() {
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
			<button onClick={getGif}>To Short</button>
			<h2>{phrase}</h2>
		</div>
	)
}

export default ToShort
