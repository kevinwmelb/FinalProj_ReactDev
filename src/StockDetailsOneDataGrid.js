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

export default function StockDetailsOneDataGrid(props) {
  const params=useParams()
  console.log("symbol in StockDetails:", params, params.symbol)
  const selectedSymbols=useOutletContext()
  console.log("selectedSymbols in StockDetails:", selectedSymbols)
  //Below also works as long as there is no http re-direction.
  //const props=React.useContext(Context)
	//console.log("StockDetails Context:", props)
  let navigate=useNavigate()


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


  return (
		<Container className="StockDetails" maxWidth="md" sx={{textAlign: "center"}}>
			<h1></h1>
				<div style={{ height: 400, width: '120%' }}> 
					<DataGrid
					autoHeight="true"
					align="left"
        			rows={props.rows}
        			columns={ovEarningColumns}
        			initialState={{
          				pagination: {
            				paginationModel: { page: 0, pageSize: 5 },
          				},
        			}}
        			pageSizeOptions={[5, 10]}
      				/>
				</div>

			<h1></h1>

		</Container>
	)
}

