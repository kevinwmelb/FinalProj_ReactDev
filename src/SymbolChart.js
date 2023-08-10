// TradingViewWidget.jsx
import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;
let selectedSymbols = []
//console.log("selectedSymbols:", selectedSymbols)

export default function TradingViewWidget(props) {
  const onLoadScriptRef = useRef();
  selectedSymbols=[props.sym]
  console.log("selectedSymbols from SymbolChart:", selectedSymbols)

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
	for (let i=0; i<selectedSymbols.length; i++) {
        if (document.getElementById(`tradingview_${selectedSymbols[i].symbol}`) && 'TradingView' in window) {
          new window.TradingView.widget({
	    width: 500,
	    height: 300,
            symbol: `${selectedSymbols[i].symbol}`,
            interval: "W",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: `tradingview_${selectedSymbols[i].symbol}`
          });
        }
	}
       }
    },
    []
  );

  return (
    <div className='tradingview-widget-container'>
      {selectedSymbols.length > 0 && selectedSymbols.map((sym, index) => (
	<div key={index}>
      	<div id={`tradingview_${sym.symbol}`} />
      	<div className="tradingview-widget-copyright">
      	</div>
      	<h2>Stock Chart for {sym.symbol}</h2>
	</div>
      ))}
    </div>
  );
}

