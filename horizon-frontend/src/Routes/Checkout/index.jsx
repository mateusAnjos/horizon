import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import CarCheckout from '../../Components/Checkout';
import { useParams } from 'react-router-dom';

function Checkout (){
    const {carID} = useParams();
    return(
        <>
            <Header/>
            <CarCheckout id={carID}/>
            <Footer/>
        </>
    )
}

export default Checkout