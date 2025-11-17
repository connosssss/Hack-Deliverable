import "./App.css";
import {useState, useEffect} from "react";
import Quote from "./components/quote.jsx";
import quotebookLogo from './static/quotebook.png';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';



/*
Possible Color Schemes
Lightest -> Darkest as you go down the list

Greenish:
#132A13
#31572C
#4F772D
#90A955
#ECF39E

Mint-Orange:
#D0E3CC
#F7FFDD
#FCFDAF
#EFD780
#DBA159

Rock Grays:
#84828F
#6A687A
#536271
#3E4C5E
#2C3D55

Library brown:
#C3A995
#AB947E
#6F5E53
#8A7968
#593D3B
*/

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
		<div className="bg-[#6F5E53] text-white w-full h-full
		flex flex-col items-center gap-10">
			{/* TODO: include an icon for the quote book */}
			<div className="w-full flex flex-col items-center gap-5 
			p-10 bg-[#8A7968] shadow-lg
			">
				<img src={quotebookLogo} alt="Quotebook Logo" className="h-[7rem] invert"/>
				<h1 className="text-5xl font-bold">Hack at UCI Tech Deliverable</h1>
			</div>



			<div className="w-[30%] min-h-[28rem] flex flex-col items-center
			 p-8 rounded-2xl shadow-lg bg-[#8A7968]">

				<h2 className="text-3xl font-semibold">Submit a quote</h2>
				{/* TODO: implement custom form submission logic to not refresh the page */}
				
				<form onSubmit={handleFormSubmission}
				className="h-full w-full flex flex-col items-center mt-[2rem]
				 gap-5 ">

					<div className="w-full flex flex-col items-center gap-3">
						<label htmlFor="input-name"
						className="text-xl font-medium">Name</label>

						<input type="text" name="name" id="input-name" value={formName}
						onChange={(e) => setFormName(e.target.value)} 
						className="rounded-sm bg-[#C3A995] focus:outline-none focus:brightness-125 px-8 py-5
						transition-all duration-300  " required />
					</div>

					<div className="w-full flex flex-col items-center gap-3">
						<label htmlFor="input-message"
						className="text-xl font-medium">Quote</label>
						{/*  Changed from input to text area so it could expand once a lot of text is inserted
						also to whoever is seeing this, sorry that this commit was so big I didn't expect to want to change it while styling */}
						<textarea
            				value={formQuote} rows="1"
            				onChange={(e) => {
              				setFormQuote(e.target.value);
              				e.target.style.height = 'auto';
              				e.target.style.height = e.target.scrollHeight + 'px';
            				}}
							className="rounded-sm bg-[#C3A995] focus:outline-none focus:brightness-125 px-8 py-5
							transition-all duration-300  resize-none overflow-hidden min-h-[5rem]"
          					/>
					</div>
					<button type="submit"
					className="bg-[#C3A995] hover:brightness-125 px-6 py-3 rounded-md
					transition-all duration-300">Submit</button>
				</form>
			</div>


			<FormControl className="text-white">
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
