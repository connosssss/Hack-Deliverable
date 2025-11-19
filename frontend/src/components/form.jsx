
import "../App.css";
import {useState} from "react";



export default function Form(props){
    

    const [formName, setFormName] = useState("");
    const [formQuote, setFormQuote] = useState("");
    

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
    
                    const textarea = document.getElementById('quote-area');
                    if(textarea) {
                        textarea.style.height = 'auto';
                    }
    
                    props.onQuoteSubmitted();
                }
    
                else{
                    console.error("Form Submission Failed: ", res.status)
                }
            }
            
            catch(error) {
                console.error("Form Submission Failed: ", error)
            }
    
    
        }


    return(
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
						className="rounded-sm bg-[#C3A995] focus:outline-none focus:brightness-125 w-3/4 px-5 py-5
						transition-all duration-300  " required />
					</div>

					<div className="w-full flex flex-col items-center gap-3">
						<label htmlFor="input-message"
						className="text-xl font-medium">Quote</label>
						{/*  Changed from input to text area so it could expand once a lot of text is inserted */}
						<textarea
            				value={formQuote} rows="1" id="quote-area"
            				onChange={(e) => {
              				setFormQuote(e.target.value);
              				e.target.style.height = 'auto';
              				e.target.style.height = e.target.scrollHeight + 'px';
            				}}
							className="rounded-sm bg-[#C3A995] focus:outline-none focus:brightness-125 w-3/4 px-5 pt-7
							transition-all duration-300  resize-none overflow-hidden min-h-[5rem]"
          					 required/>
					</div>
					<button type="submit"
					className="bg-[#C3A995] hover:brightness-125 px-6 py-3 rounded-md
					transition-all duration-300">Submit</button>
				</form>
			</div>
    )
}