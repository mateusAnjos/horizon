import Header from '../../Components/Header'
import Body from '../../Components/Body'
import Footer from '../../Components/Footer'
import { useLocation } from 'react-router-dom';
import SearchBar from '../../Components/SearchBar'



function Home(){
  
    

    return(
        <>
            <Header/>
            <SearchBar/>
            <Body/>
            <Footer/>
      </>
    )
}

export default Home