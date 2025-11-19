import "./App.css";
import {useState, useEffect} from "react";
import Quote from "./components/quote.jsx";
import Form from "./components/form.jsx"
import quotebookLogo from './static/quotebook.png';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';



/*
Possible Color Schemes
Lightest -> Darkest as you go down the list


#C3A995
#AB947E
#6F5E53
#8A7968
#593D3B
*/

function App() {

	const [isLoading, setIsLoading] = useState(false);

	const [timePeriod, setTimePeriod] = useState("all");
	
	
	const [quotes, setQuotes] = useState([]);


	const getMaxAge = (timePeriod) => {
		if(timePeriod == "allTime"){
			return null;
		}

		const now = new Date()
		const date = new Date();

		switch(timePeriod) {
			case "week":
				date.setDate(now.getDate() - 7);
				break;

			case "month":
				date.setMonth(now.getMonth() - 1);
				break;

			case "year":
				date.setFullYear(now.getFullYear() - 1);
				break;

			default:
				return null;
		}

		// Returns only the date part and gets rid of the time
		// For example date.toISOString() when working on this would be 2025-10-17T01:15:08.146Z
		return date.toISOString().split('T')[0];
	}

	const getQuotes = async (timePeriod) => {
		setIsLoading(true);
		

		// Make it so the default is all in case no date has been inputted
		try{
			const formattedMaxAge = getMaxAge(timePeriod)
			const fetchURL = formattedMaxAge ? `api/quote?max_age=${formattedMaxAge}` : "api/quote";
			const res = await fetch(fetchURL)
			const json = await res.json()

			json.sort((a, b) => new Date(b.time) - new Date(a.time))

			setQuotes(json)
		}

		catch (error){
			console.error("Get quotes API failed: ", error)
		}

		finally{
			setIsLoading(false)
		}
	}



	const darkTheme = createTheme({
  		palette: {
    		mode: 'dark',
			background: {
     			 paper: '#8A7968', 
    		},
  		},
		
	});


	// starts off by showing all quotes, then filtering once a max age is inputted

	useEffect(() => {

    getQuotes();

  }, []);

  useEffect(() => {


   	getQuotes(timePeriod);

  }, [timePeriod]);

	return (
		<div className="bg-[#6F5E53] text-white w-full h-full
		flex flex-col items-center gap-10">
			{/* TODO: include an icon for the quote book */}
			<div className="w-full flex flex-row justify-center items-center gap-6
			p-10 bg-[#8A7968] shadow-md
			">
				<img src={quotebookLogo} alt="Quotebook Logo" className="h-[5rem] w-[5rem] invert"/>
				<h1 className="text-5xl font-bold ">Hack at UCI Tech Deliverable</h1>
			</div>



			<Form onQuoteSubmitted={() => getQuotes(timePeriod)}/>

			<ThemeProvider theme={darkTheme}>
			<FormControl className="w-[30%] " sx={{color: 'white' }}>
				<InputLabel id="max-age" className=""> Filter by Date</InputLabel>
				
				<Select labelId="max-age" id="max-age-select" value={timePeriod} label="Filter by Time"
					onChange={(e) => setTimePeriod(e.target.value)} sx={{textAlign: "center"}}
				>
					<MenuItem value="week" sx={{justifyContent: "center"}}>Last Week Only</MenuItem>

    				<MenuItem value="month" sx={{justifyContent: "center"}}>Last Month Only</MenuItem>

    				<MenuItem value="year" sx={{justifyContent: "center"}}>Last Year Only</MenuItem>

    				<MenuItem value="all" sx={{justifyContent: "center"}}>All Time</MenuItem>

				</Select>
			</FormControl>
			</ThemeProvider>

			
			




		<div className="w-full flex items-center flex-col gap-8 pb-20 ">
			<h2 className="w-1/2 h-[3rem] text-center text-3xl font-semibold 
			border-b-2 border-[#C3A995] bg-[#6F5E53] mt-5">Previous Quotes</h2>
			{

				(isLoading && quotes.length < 1) ?
				// What to show when it is loading for the first time 
				(<div className="h-[40rem] text-white text-2xl w-full text-center">
				
				Loading ...
				
				
				
				</div>) :
				// What to show when it isn't
				quotes.map((quote, index) => (

					<Quote name={quote.name} quote={quote.message} time={quote.time} key={index}/>

				))
		
		

			}
			</div>
 
		</div>
	);
}

export default App;
