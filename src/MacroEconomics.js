import {useState} from 'react';
//import ReactDOM from 'react-dom/client';
import {Link, Routes, Route} from 'react-router-dom';
import WebTV from './WebTV';
import UrwTV from './UrwTV';
//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;


function MainPage() {
	const [phrase, setPhrase] = useState("")

	const getSymbols = () => {
		//fetch(`http://api.marketstack.com/v1/exchanges/XASX/tickers?access_key=${APIKey}&limit=1000&offset=1050`)
		fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=WBJ.FRK&apikey=${APIKey}`)
			.then(res => res.json())
			//res.data.url has CORB issue
			.then(res => console.log("NOK", res))
			.then(res => setPhrase(res))
	}

	//console.log("Gif link", gif)

	return (
		<div className="MainPage">
			<button onClick={getSymbols}>Data Collection</button>
		        <WebTV />
		</div>
	)
}

export default MainPage
