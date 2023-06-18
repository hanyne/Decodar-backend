import { fireStore } from "../auth/Firebase"
import { getDocs, collection } from "firebase/firestore"
import React, { useState, useEffect, Fragment } from "react"
import Container from "react-bootstrap/esm/Container";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/userAuthContext";
import {BiMessageAltDetail} from "react-icons/bi"
import {AiFillDelete} from "react-icons/ai"
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import { doc, deleteDoc} from "firebase/firestore"

export default function Message() {
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
  
    const [messages, setMessages] = useState([]);
    const elemPrefix = "test";
    const getId = (index) => `${elemPrefix}${index}`;

    const getItems = () =>
    Array(20)
        .fill(0)
        .map((_, ind) => ({ id: getId(ind) }));

    const [items] = useState(getItems);

    document.title = "Decodar - Users-Messages"

    const fetchMessages = async () => {
        const querySnapshot = await getDocs(collection(fireStore, "messages"));
        querySnapshot.forEach((doc) => {
            const messages = querySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }));
            setMessages(messages);
        });
    }

    useEffect(() => {
        fetchMessages();
    },[])
  return (
    <Fragment>
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Deco Dar : Message</a>
<button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
  <span className="navbar-toggler-icon"></span>
</button>
    <div className="navbar-nav">
        <div className="nav-item text-nowrap">
        <button onClick={handleLogout} className="nav-link text-white bg-red px-3 rounded">Sign out</button>
        </div>
    </div>
    </header>

    <div className="container-fluid">
        <div className="row">
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-red text-white sidebar collapse">
            <div className="position-sticky pt-3">
            <ul className="nav flex-column mx-auto" style={{width: "90%"}}>
                <li className="nav-item">
                <a className="nav-link" href="/">
                    <span data-feather="home" className="align-text-bottom"></span>
                    Tableau de bord
                </a>
                </li>
                <li className="nav-item">
                <a className="nav-link active mt-2" aria-current="page" href="/ajout">
                    <span data-feather="Users" className="align-text-bottom"></span>
                    Messages 
                </a>
                </li>
                <li className="nav-item">
                <a className="nav-link" href="/ajout">
                    Produits
                </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admins">
                    <span data-feather="users" className="align-text-bottom"></span>
                    Admins
                  </Link>
                </li>
            </ul>
            </div>
                </nav>
        <Container>
    <div className="row justify-content-center">
                                  <div className=" text-center mb-4">
        <h1 className="h1 mb-4 text-center"><BiMessageAltDetail className="mx-2"/>Messages ({messages.length})</h1>
        <div >
          <table className="table" >
            <thead className="thead-primary">
            
              <tr>

                <th>ID</th>
                <th >Nom et Prénom</th>
                <th>Email</th>
                <th>Message</th>
                <th>supp</th>
              </tr>
            </thead>
        {
                            messages.map((message, index) => {
                                return (
            <tbody>
              <tr className="alert" role="alert" key={index}>
                <td>
                {message.id}
                </td>
                <td ><h6 className="text-red">{message.lastname} {message.firstname} </h6></td>
                
                <td><a href={`mailto:${message.email}`}>{message.email} </a></td>
                <td>
                {message.message}
                </td>
                <td className="cursor-pointer" onClick={async () => {
                        await deleteDoc(doc(fireStore, "messages", message.id));
                        toast.success('Messages supprimé', {
                          position: "top-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                        }}><AiFillDelete size={25} className="text-red"/></td>
</tr>
</tbody>


)

} )

}</table></div>
</div>
</div>
</Container>
</div>
</div>
</Fragment>


)}


