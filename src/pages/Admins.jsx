import { collection, doc, onSnapshot, query, setDoc, deleteDoc } from "firebase/firestore";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import { Container, Modal } from "react-bootstrap"
import { auth } from "../firebase-config"
import { fireStore } from "../auth/Firebase";
import { FaPlusCircle } from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import capitalizeWord from "../lib/capitalize";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/userAuthContext";
import {AiFillDelete} from "react-icons/ai"

const Admins = () => {
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
    document.title = "Decodar - Users-Admins"


    const [admins, setAdmins] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const fetchProducts = async () => {
        const q = query(collection(fireStore, "admins"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const result = querySnapshot.docs
                .map((doc) => ({ ...doc.data(), id: doc.id }));
                setAdmins(result);
            });
        });
    }
    
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();

    const addAdmin = (e) => {
        e.preventDefault();
        toast.info('Veuiller attendre', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        
        
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 

            const user = userCredential.user;
            await setDoc(doc(fireStore, "admins", user.uid), {
                id: user.uid,
                email: email,
                addDate: capitalizeWord(today.toLocaleDateString("fr-FR", options))
            });

            handleClose();

            toast.success('Admin ajouté', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
    <Fragment>
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Deco Dar : Admins</a>
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
                                <a className="nav-link " aria-current="page" href="/ajout">
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
                                <Link className="nav-link active mt-2" to="/admins">
                                    <span data-feather="users" className="align-text-bottom"></span>
                                    Admins
                                </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
        <Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Ajouter un administrateur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={addAdmin}>
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input value={email} onChange={e => setEmail(e.currentTarget.value)} type="email" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Password</label>
                            <input value={password} onChange={e => setPassword(e.currentTarget.value)} type="password" class="form-control" required />
                        </div>
                        <button type="submit" class="btn btn-red">Submit</button>
                    </form>
                </Modal.Body>
            </Modal>

            <h1>Admins</h1>

            <button onClick={handleShow} className="btn btn-red float-end"><FaPlusCircle /> Ajouter</button>
            <table className="table table-stripped mt-3">
                <thead>
                    <tr>
                        <th className="text-black" scope="col">#</th>
                        <th className="text-black" scope="col">Email</th>
                        <th className="text-black" scope="col">Date d'ajout</th>
                        <th>supp</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        admins.map((admin, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{admin.email}</td>
                                    <td>{admin.addDate}</td>
                                 <td className="cursor-pointer" onClick={async () => {
                        await deleteDoc(doc(fireStore, "admins", admin.id));
                        toast.success('Admin supprimé', {
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
                            )
                        })
                    }
                </tbody>
            </table>
</Container>
</div>
</div>
</Fragment>
    )
}

export default Admins