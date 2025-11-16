import "../App.css";


export default function Quote(props){


    // just working on getting it working not about styling yet
    return(
        <div className="bg-slate-500 w-1/2 h-1/3 flex flex-col gap-3">
            <h1>{props.name}</h1>
            <h3>{props.quote}</h3>
            <p>{props.time}</p>

        </div>
    )
}