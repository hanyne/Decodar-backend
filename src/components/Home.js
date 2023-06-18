import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/userAuthContext";

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"

import "../App.css"
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { fireStore } from "../auth/Firebase";
import { FaCircle, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!user) {
    navigate("/login");
  }

  const fetchOrders = async () => {
    const q = query(collection(fireStore, "orders"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const result = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }));
        setOrders(result);
      });
    });
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Deco Dar</a>
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
                  <a className="nav-link active" aria-current="page" href="/">
                    <span data-feather="home" className="align-text-bottom"></span>
                    Tableau de bord
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/message">
                    <span data-feather="file" className="align-text-bottom"></span>
                    Messages 
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/ajout">
                    <span data-feather="shopping-cart" className="align-text-bottom"></span>
                    Produits
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="admins">
                    <span data-feather="users" className="align-text-bottom"></span>
                    Admins
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h2">Dashboard</h1>
            </div>

            <h2>Commandes ({orders.length})</h2>
            {
              orders.length === 0 ? (
                <div class="alert alert-info text-center p-4" role="alert">
                  <h4 class="alert-heading">Vous n'avez pas de commandes pour le moment</h4>
                  <p>Vos commandes vont apparaitre ici</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-black" scope="col">Date</th>
                      <th className="text-black" scope="col">Nom</th>
                      <th className="text-black" scope="col">Adresse</th>
                      <th className="text-black" scope="col">Code postal</th>
                      <th className="text-black" scope="col">Email</th>
                      <th className="text-black" scope="col">Telephone</th>
                      <th className="text-black" scope="col">Produits</th>
                      <th className="text-black" scope="col">Total</th>
                      <th className="text-black" scope="col">Informations</th>
                      <th className="text-black" scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orders.map((order) => {
                        return (
                          <tr>
                            <td>{order.date}</td>
                            <td>{order.firstname} {order.lastname}</td>
                            <td>{order.address}</td>
                            <td>{order.zipcode}</td>
                            <td><a href={`mailto:${order.email}`}>{order.email}</a></td>
                            <td>{order.phone}</td>
                            <td>
                              {
                                order.products.map((product) => {
                                  return (
                                    <div>
                                      <FaCircle size={6} /> {product.name} x {product.quantity} ({product.price * product.quantity} DT) <br /><br />
                                    </div>
                                  )
                                })
                              }
                            </td>
                            <td>
                              {order.total} DT
                            </td>
                            <td>{order.informations}</td>
                            <td>
                              <button onClick={async () => {
                                await deleteDoc(doc(fireStore, "orders", order.orderID));
                                toast.success('Commande supprimée', {
                                  position: "top-center",
                                  autoClose: 3000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                });
                              }} className="btn btn-danger"><FaTrash /></button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              )
            }
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;