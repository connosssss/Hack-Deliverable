import "./App.css";
import {useState, useEffect} from "react";

function App() {

	const [isLoading, setIsLoading] = useState(false);
	const [maxAge, setMaxAge] = useState();


	
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



	// starts off by showing all quotes, then filtering once a max age is inputted

	useEffect(() => {

    getQuotes();

  }, []);

  useEffect(() => {


   	getQuotes(maxAge);

  }, [maxAge]);

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<form action="/api/quote" method="post">
				<label htmlFor="input-name">Name</label>
				<input type="text" name="name" id="input-name" required />
				<label htmlFor="input-message">Quote</label>
				<input type="text" name="message" id="input-message" required />
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


		{
			isLoading ?
			// What to show when it is loading
			(<div>
				
				
				
				
				
			</div>) :
			// What to show when it isn't
			quotes.map((quote, index) => (

				<div key={index}>
					<h1>{quote.message}</h1>
					<p>{quote.time}</p>



				</div>

			))
		
		

		}
 
		</div>
	);
}

export default App;
