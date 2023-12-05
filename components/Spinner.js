import {PacmanLoader} from 'react-spinners'

export default function Spinner({fullWidth}){
    if(fullWidth){
       return(
           <div className={'w-full flex justify-center'}>
               <PacmanLoader color={'#1e3a8a'} speedMultiplier={2} />
           </div>
       )
    }

    return (
        <PacmanLoader color={'#1e3a8a'} speedMultiplier={2} />
    )
}

