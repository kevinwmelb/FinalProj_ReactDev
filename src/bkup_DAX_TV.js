// TradingViewWidget.jsx

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;
let selectedSymbols = null
export default function DAXIndex(props) {
  const onLoadScriptRef = useRef();
  selectedSymbols=props.sym
  console.log("selectedSymbols from DAXIndex:", selectedSymbols)

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
        if (document.getElementById(`tradingview_${selectedSymbols}`) && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: `${selectedSymbols}`,
            interval: "W",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: `tradingview_${selectedSymbols}`
          });
        }
      }
    },
    []
  );

  return (
    <div className='tradingview-widget-container'>
      <div id={`tradingview_${selectedSymbols}`} />
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a>
      </div>
    </div>
  );
}

