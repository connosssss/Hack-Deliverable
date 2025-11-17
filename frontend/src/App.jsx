import "./App.css";
import {useState, useEffect} from "react";
import Quote from "./components/quote.jsx";

function App() {

	const [isLoading, setIsLoading] = useState(false);

	const [maxAge, setMaxAge] = useState();
	const [formName, setFormName] = useState("");
	const [formQuote, setFormQuote] = useState("");
	
	const [quotes, setQuotes] = useState([]);




	const getQuotes = async (maxAge) => {
		setIsLoading(true);
		

		// Make it so the default is all in case no date has been inputted
		try{
			const fetchURL = maxAge ? `api/quote?max_age=${maxAge}` : "api/quote";
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

				getQuotes(maxAge);
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


   	getQuotes(maxAge);

  }, [maxAge]);

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

			<h2>Previous Quotes</h2>

			<input type="date" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />

			{/* TODO: Display the actual quotes from the database */}
			<div className="messages">
				<p>Peter Anteater</p>
				<p>Zot Zot Zot!</p>
				<p>Every day</p>
			</div>

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
