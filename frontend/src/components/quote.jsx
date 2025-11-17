import "../App.css";

/*Library brown:
#C3A995
#AB947E
#6F5E53
#8A7968
#593D3B
*/
export default function Quote(props){

    const formatDate = (dateAndTime) => {
        const date = new Date(dateAndTime)

        let minutes = ""

        if(Math.floor(date.getMinutes()/10) < 1){
            minutes = "0" + date.getMinutes().toString()
        }
        else{
            minutes = date.getMinutes()
        }
        let out = `${date.getHours()}:${minutes}  ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
        return out
    }
    // just working on getting it working not about styling yet
    return(
        <div className="bg-[#AB947E] rounded-lg w-1/2 min-h-1/3 flex flex-col gap-3 justify-center items-center p-5 shadow-md">
            <h1 className="text-2xl font-semibold break-words w-full text-center">{props.name}</h1>
            <h3 className="text-lg break-words w-full text-center">"{props.quote}"</h3>
            <p>{formatDate(props.time)}</p>

        </div>
    )
}