import {useState} from 'react';
//const APIKey = process.env.REACT_APP_MARKETSTACK_API_KEY;
const APIKey = process.env.REACT_APP_ALPHAV_API_KEY;

function Giphy () {
	//const [gif, setGif] = useState(null)
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

	let handleGiphyInput = event => {
		//setPhrase(event.target.value)
	}

	//console.log("Gif link", gif)

	return (
		<div className="Giphy">
			<input type="text" onChange={handleGiphyInput} />
			<button onClick={getGif}>Get Gif</button>
			<h2>{phrase}</h2>
		</div>
	)
}

export default Giphy
