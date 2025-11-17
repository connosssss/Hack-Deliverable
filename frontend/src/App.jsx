import "./App.css";
import {useState, useEffect} from "react";
import Quote from "./components/quote.jsx";

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';


function App() {

	const [isLoading, setIsLoading] = useState(false);

	const [timePeriod, setTimePeriod] = useState("all");
	const [formName, setFormName] = useState("");
	const [formQuote, setFormQuote] = useState("");
	
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


	


	const handleFormSubmission = async (e) =>{
		e.preventDefault();

		try {
			const data = new FormData();
			data.append("name", formName)
			data.append("message", formQuote)

			const res = await fetch("api/quote", {
				method: "POST", 
				body: data
			})


			if(res.ok){
				setFormName("")
				setFormQuote("");

				getQuotes(timePeriod);
			}

			else{
				console.error("Form Submission Failed: ", res.status)
			}
		}
		
		catch(error) {
			console.error("Form Submission Failed: ", error)
		}


	}



	// starts off by showing all quotes, then filtering once a max age is inputted

	useEffect(() => {

    getQuotes();

  }, []);

  useEffect(() => {


   	getQuotes(timePeriod);

  }, [timePeriod]);

	return (
		<div className=" bg-red-200">
			{/* TODO: include an icon for the quote book */}
			<h1 className="text-2xl">Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form onSubmit={handleFormSubmission}>
				<label htmlFor="input-name">Name</label>

				<input type="text" name="name" id="input-name" value={formName}
				onChange={(e) => setFormName(e.target.value)} required />

				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" value={formQuote}
				onChange={(e) => setFormQuote(e.target.value)} required />

				<button type="submit">Submit</button>
			</form>


			<FormControl className="mb-6">
				<InputLabel id="max-age">Filter by Quote Age</InputLabel>
				
				<Select labelId="max-age" id="max-age-select" value={timePeriod} label="Filter by Time"
					onChange={(e) => setTimePeriod(e.target.value)}
				>
					<MenuItem value="week">Last Week Only</MenuItem>

					<MenuItem value="month">Last Month Only</MenuItem>

					<MenuItem value="year">Last Year Only</MenuItem>

					<MenuItem value="all">All Time</MenuItem>

				</Select>
			</FormControl>

			<h2>Previous Quotes</h2>



		{/* Not worrying about styling yet*/}
		<div className="w-full flex items-center flex-col gap-3">
			{

				isLoading ?
				// What to show when it is loading
				(<div>
				
				
				
				
				
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
