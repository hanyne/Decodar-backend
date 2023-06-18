import React, {Fragment} from 'react';
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { useUserAuth } from "../context/userAuthContext";



const Produit = () => {
        const { logOut, user } = useUserAuth();
      const navigate = useNavigate();
      
      const handleLogout = async () => {
        try {
          await logOut();
          navigate("/login");
        } catch (error) {
          console.log(error.message);
        }
      };
    return (
    <Fragment>
<header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/">Deco Dar</a>
<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/Ajout">Ajouter un Produit </a>
<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/consulter">Consulter/Modifier Produit</a>
<button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
<span className="navbar-toggler-icon"></span>
</button>
<div className="navbar-nav">
<div className="nav-item text-nowrap">
<button onClick={handleLogout} className="nav-link text-white bg-red px-3 rounded">Sign out</button>
</div>
</div>
</header>
 <body className='mm w-100%'>

<div className="container-fluid">
<div className="row">
<nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-red text-white sidebar collapse">

<div className="position-sticky ">
<ul className="nav flex-column mx-auto" style={{width: "90%"}}>
   <li className="nav-item">
   <a className="nav-link" href="/">
       <span data-feather="home" className="align-text-bottom"></span>
       Tableau de bord
   </a>
   </li>
   <li className="nav-item">
   <a className="nav-link" href="/message">
       <span data-feather="Users" className="align-text-bottom"></span>
       Messages 
   </a>
   </li>
   <li className="nav-item">
   <a className="nav-link active" aria-current="page" href="/ajout">
       Produits
   </a>
   </li>
   
 
</ul>
</div>
   </nav></div></div> 
   </body>
  </Fragment>  )

}



   export default Produit;