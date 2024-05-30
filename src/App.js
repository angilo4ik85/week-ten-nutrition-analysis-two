import { useEffect, useState } from 'react';
import { ProductData } from './ProductData';
import { LoaderPage } from './LoaderPage';
import { useGSAP } from '@gsap/react';
import Swal from 'sweetalert2';
import image from './bowl.png';
import gsap from 'gsap';
import './App.css';

function App() {
  gsap.registerPlugin(useGSAP);

  useGSAP(
    () => {
        gsap.from('.box', { y: -900, x: 900,
          rotation: 360,
          duration: 7 });
        gsap.to('.box', { y: 100, x: 100,
          duration: 7 });
    }
  ); 

  const [mySearch, setMySearch] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [productsData, setProductsData] = useState();
  const [stateLoader, setStateLoader] = useState(false);

  useEffect(() => {
    const getData = async (ingr) => {
      setStateLoader(true);
  
      const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=97bb79c7&app_key=068d0fd2f49bdbaeecddb80432019bbe`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingr: ingr })
      })
  
      if(response.ok) {
        setStateLoader(false);
        const data = await response.json();
        setProductsData(data);
      } else {
        setStateLoader(false);
        handleAlert();
      }
      
    }

    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      getData(ingr);
    }
  }, [wordSubmitted])
  
  const handleAlert = () => {
    Swal.fire({
      title: "Ingredients entered incorrectly",
      color: "#c4e7d3cb",
      background: "#9fe7b154",
      confirmButtonColor: "#f02d2d"
    });
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  return (<div>
    <div className='containers'>
      
      <div className='container'>
        <h1>Nutrition Analysis</h1>
        <form onSubmit={ finalSearch }>
          <input
            placeholder="1 cup rice, 1 lemon..."
            onChange={ myRecipeSearch }
          />
          <button type="submit">Search</button>
        </form>
      
        { stateLoader && <LoaderPage/> }

        <div className="container">
          <h3>{ mySearch }</h3>
          {
          productsData && <p className='par'>{ productsData.calories } kcal</p>
          }
        </div>
      </div>

      <div className='img'>
        <img src={ image } className='box' alt='meal'/>
      </div>
    </div>
    <div className='smallContainers'>
      {
        productsData && Object.values(productsData.totalNutrients)
          .map(({ label, quantity, unit, index }) => 
            <ProductData key={ index }
              label={ label }
              quantity={ quantity }
              unit={ unit }
            />
          )
        }
    </div>
  </div>
  );
}

export default App;