// TradingViewWidget.jsx
import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;
let selectedSymbols = ["ASX:WEB", "ASX:URW", "XETR:ALI", "XETR:NOA3", "XETR:AMEA"]
console.log("selectedSymbols:", selectedSymbols)

export default function TradingViewWidget() {
  const onLoadScriptRef = useRef();

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
        if (document.getElementById('tradingview_ASX:WEB') && 'TradingView' in window) {
          new window.TradingView.widget({
	    width: 500,
	    height: 300,
            symbol: "ASX:WEB",
            interval: "W",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: "tradingview_ASX:WEB"
          });
        }
        if (document.getElementById('tradingview_ASX:URW') && 'TradingView' in window) {
          new window.TradingView.widget({
	    width: 500,
	    height: 300,
            symbol: "ASX:URW",
            interval: "W",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: "tradingview_ASX:URW"
	  });
         }
       }
    },
    []
  );

  return (
    <div className='tradingview-widget-container'>
      <div id='tradingview_ASX:WEB' />
      <div className="tradingview-widget-copyright">
      </div>
      <h2></h2>
      <div id='tradingview_ASX:URW' />
      <div className="tradingview-widget-copyright">
      </div>
      <h2></h2>
    </div>
  );
}

