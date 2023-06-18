import React, { useState, Fragment, useRef } from "react"
import { Link } from "react-router-dom";
import {loading} from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 

import { storage } from "../auth/Firebase";

import { Container, Row, Col } from "react-bootstrap"
import { toast } from "react-toastify"

import { RiSendPlaneFill } from "react-icons/ri"
import { fireStore } from "../auth/Firebase";
import generateId from "../lib/generateId";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/userAuthContext";

const Ajout = () => {
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

    if (!user) {
        navigate("/login");
    }

    const [nom, setNom] = useState("");
    //const [categorie, setCategorie] = useState("");
    const [prix, setPrix] = useState("");
    const [description, setDescription] = useState("");
    const [shortdescription, setShortDescription] = useState("");
    const [image, setImage] = useState(null);
    const categoryRef = useRef();

    const addProduct = async (e) => {
        e.preventDefault();
        toast.info('Veuillez attendre', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        try {

            let id = generateId(15);
            const storageRef = ref(storage, `produits/${id}`);

            const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                            break;

                            case 'running':
                                console.log('Upload is running');
                            break;

                            default:
                                console.log('Upload is in progress');
                        }
                    }, 
                    (error) => {
                        // Handle unsuccessful uploads
                    }, 
                    () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);
                        await setDoc(doc(fireStore, "produits", id), {
                            id: id,
                            nom: nom,
                            category: categoryRef.current.value,
                            prix: prix,
                            description: description,
                            shortdescription: shortdescription,
                            image: downloadURL,
                            addedAt: new Date(),
                        });
                    });
                }
            );
            toast.success('Produit ajouté', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setNom("");
            setPrix("");
            setShortDescription("");
            setDescription("");
            setImage("");

        } catch (e) {
            console.log(e);
            toast.error("une erreur s'est produite", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (
        <Fragment>
             <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/">Deco Dar</a>
<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="/Ajout">Ajouter un Produit </a>
<a className="navbar-brand col-md-4 col-lg-2 me-0 px-3 fs-6" href="/consulter">Consulter/Modifier un Produit</a>
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
                <li className="nav-item">
                    <Link className="nav-link" to="/admins">
                        Admins
                    </Link>
                </li>
            </ul>
            </div>
                </nav>
            <Container>
                <h1 className="mb-3 text-center">Ajouter un  produit</h1>
                    <form onSubmit={addProduct} style={{
                        background: 'linear-gradient(295deg, rgba(218,29,42,1) 0%, rgba(110,21,27,1) 100%)'
                    }} className="p-4 text-white rounded-3 mb-5" method="post">
                        <Row>
                            <Col sm='6'>
                                <label className="mb-2 text-bold">Nom *</label>
                                <input value={nom} onChange={(e) => setNom(e.currentTarget.value)} type="text" className="form-control mb-3" placeholder="Entrer le Nom de Produit" required />
                            </Col>
                            <Col sm='6'>
                                <label className="mb-2 text-bold">Categorie *</label>
                            
                                <select className="form-select" aria-label="Default select example" ref={categoryRef}>
                                    <option selected value="électromenager">électromenager</option>
                                    <option value="Equipement Dressing et Placard">Equipement Dressing et Placard</option>
                                    <option value="Mitigeur Evier et Accessoires">Mitigeur Evier et Accessoires</option>
                                    <option value="Fixation et technique de collage">Fixation et technique de collage</option>
                                    <option value="Luminaire">Luminaire</option>
                                    <option value="Quincaillerie d'amublement">Quincaillerie d'amublement</option>
                                    <option value="Rangement de cuisine">Rangement de cuisine</option>
                                    <option value="Vitrage et cadre Allu">Vitrage et cadre Allu</option>
                                </select>
                            </Col>

                            <Col sm='6'>
                                <label className="mb-2 text-bold">prix *</label>
                                <input value={prix} onChange={(e) => setPrix(e.currentTarget.value)} type="text" className="form-control mb-3" placeholder="Entrer votre prix" required />
                            </Col>
                            
                            <Col sm={6}>
                                <label className="mb-2 text-bold">petite description *</label>
                                <input value={shortdescription} onChange={(e) => setShortDescription(e.currentTarget.value)} className="form-control" placeholder="Donner une Petite description " name="" id="" cols="30" rows="10" required></input>
                            </Col>
                            <Col sm={12}>
                                <label className="mb-2 text-bold">description *</label>
                                <textarea value={description} onChange={(e) => setDescription(e.currentTarget.value)} className="form-control" placeholder="Donner une description sur le produit" name="" id="" cols="30" rows="10" required></textarea>
                            </Col>
                            <Col sm={12}>
                                <label className="mb-2 text-bold">image *</label><br/>
                                <input type="file" onChange={e => {setImage(e.target.files[0]);}} className="form-control" id="inputGroupFile01"/>
                            </Col>
                        </Row>
                        <button type="submit"  disabled={loading} className="btn btn-outline-light w-100 mt-4 text-bold"><RiSendPlaneFill size={18} /> Envoyer</button>
                    </form><br/>

            </Container>
                            </div>
            </div>
        </Fragment>
    )
}

export default Ajout 