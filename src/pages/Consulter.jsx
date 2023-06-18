import React, { useState, useEffect, useRef } from "react"
import { fireStore } from "../auth/Firebase"
import { collection, doc, deleteDoc, query, onSnapshot, updateDoc } from "firebase/firestore"
import { AiFillDelete } from 'react-icons/ai'
import { FaEdit } from 'react-icons/fa'
import { Button, Col, Container, Modal, Row } from "react-bootstrap"
import { toast } from 'react-toastify'
import { setUserId } from "firebase/analytics"

export default function Consulter() {
  
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [newName, setNewName] = useState("");
  const [newPrix, setNewPrix] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newShortDescription, setNewShortDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [productId, setProductId] = useState("");

  document.title = "Decodar - Accueil"

  const fetchProducts = async () => {
    const q = query(collection(fireStore, "produits"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const products = querySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }));
            setProducts(products);
        });
    });
  }

  const editProduct = async (e) => {
    e.preventDefault();

    const productRef = doc(fireStore, "produits", productId);

    // Set the "capital" field of the city 'DC'
    await updateDoc(productRef, {
      nom: newName,
      category: newCategory,
      prix: newPrix,
      description: newDescription,
      shortdescription: newShortDescription,
    });

    toast.success('Produit modifié', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    handleClose();
  }

  useEffect(() => {
      fetchProducts();
  },[])

  return (
    <div className="row justify-content-center">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={editProduct} className="rounded-3" method="post">
                        <Row>
                            <Col sm='6'>
                                <label className="mb-2 text-bold">Nom *</label>
                                <input value={newName} onChange={(e) => setNewName(e.currentTarget.value)} type="text" className="form-control mb-3" placeholder="Entrer le Nom de Produit" required />
                            </Col>
                            <Col sm='6'>
                                <label className="mb-2 text-bold">Categorie *</label>
                            
                                <select className="form-select" aria-label="Default select example" value={newCategory} onChange={e => setNewCategory(e.currentTarget.value)}>
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
                                <input value={newPrix} onChange={(e) => setNewPrix(e.currentTarget.value)} type="text" className="form-control mb-3" placeholder="Entrer votre prix" required />
                            </Col>
                            
                            <Col sm={6}>
                                <label className="mb-2 text-bold">petite description *</label>
                                <input value={newShortDescription} onChange={(e) => setNewShortDescription(e.currentTarget.value)} className="form-control" placeholder="Donner une Petite description " name="" id="" cols="30" rows="10" required></input>
                            </Col>
                            <Col sm={12}>
                                <label className="mb-2 text-bold">description *</label>
                                <textarea value={newDescription} onChange={(e) => setNewDescription(e.currentTarget.value)} className="form-control" placeholder="Donner une description sur le produit" name="" id="" cols="30" rows="10" required></textarea>
                            </Col>
                        </Row>
                        <button type="submit" className="btn btn-primary w-100 mt-4 text-bold"><FaEdit size={18} /> Envoyer</button>
                    </form>
        </Modal.Body>
      </Modal>
      <div className="text-center mb-4">
        <h1 className="h1 mb-4 text-center">Liste des Produits</h1>
        <Container>
          <table className="table">
            <thead className="thead-primary">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Produit et description</th>
                <th>Prix</th>
                <th>Supprimé un Produit</th>
                <th>Modifier un Produit</th>
              </tr>
            </thead>
            <tbody>
              {
                products.map((product, index) => {
                  return (
                    <tr className="alert" role="alert" key={index}>
                      <td>
                        {product.id}
                      </td>
                      <td>
                        <img className="img" alt={`Image of ${product.nom}`} src={product.image}></img>
                      </td>
                      <td>
                        <div className="email">
                          <h5 className="text-red">{product.nom}</h5>
                          <span className="text-black">{product.description}</span>
                        </div>
                      </td>
                      <td>{product.prix} TND</td>
                      <td className="cursor-pointer" onClick={async () => {
                        await deleteDoc(doc(fireStore, "produits", product.id));
                        toast.success('Produit supprimé', {
                          position: "top-center",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                        }}><AiFillDelete size={25} className="text-red"/></td>
                      <td><FaEdit onClick={() => {
                        setShow(true);
                        setNewName(product.nom);
                        setNewDescription(product.description);
                        setNewPrix(product.prix);
                        setNewShortDescription(product.shortdescription);
                        setNewCategory(product.category);
                        setProductId(product.id);

                      }} size={25} className="text-red"/></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </Container>
      </div>
    </div>
  )
}