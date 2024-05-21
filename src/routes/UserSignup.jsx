import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import "../../index.css";
import { useAuth } from '../contexts/AuthContext';
import { v4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import AiChat from "./AiChat";
function UserSignup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const fullNameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const usersCollection = collection(db, "Users");
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [imageUpload, setImageUpload] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      
      const userCredential = await signup(
        emailRef.current.value,
        passwordRef.current.value,
        fullNameRef.current.value
      );
      
      const uid = userCredential.user.uid;//referencing the uid of current user
      // const docRef = doc(usersCollection, uid);//referencing the document within the Users collection
      // await setDoc(docRef, { type: "Users" }, { merge: true });//creating a document within Users collection
      // const commentCollectionRef=collection(docRef, "Comments");//creating a reference to the comments collection
      // await setDoc(doc(commentCollectionRef));//creating a document within comments collection
      
      
      if (imageUpload) {
        await uploadImage(uid);
      }
      
      navigate("/userpage", {
        state: {
          uid: userCredential.user.uid,
          username: fullNameRef.current.value,
        },
      });
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  }

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(e) {
    setImageUpload(e.target.files[0]);
    const files = e.target.files;
    if (files.length === 0) return;
    const file = files[0];
    setImages((prevImages) => [
      ...prevImages,
      { name: file.name, url: URL.createObjectURL(file) },
    ]);
    fileInputRef.current.disabled = true;
  }

  function deleteImage(index) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    fileInputRef.current.disabled = false;
  }

  function onDragOver(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(true);
      e.dataTransfer.dropEffect = "copy";
    }
  }

  function onDragLeave(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    if (images.length === 0) {
      setIsDragging(false);
      const files = e.dataTransfer.files;
      setImageUpload(files[0]);
      setImages((prevImages) => [
        ...prevImages,
        { name: files[0].name, url: URL.createObjectURL(files[0]) },
      ]);
      fileInputRef.current.disabled = true;
    }
  }

 async function uploadImage(uid) {
    if (imageUpload === null) return;
    const imageRef = ref(
      storage,
      `Users/${imageUpload.name + v4()}`
    );

    const snapshot = await uploadBytes(imageRef, imageUpload);
    const downloadURL = await getDownloadURL(snapshot.ref);

    alert("Image uploaded successfully");
    const seekerProfilepicData = {
      pictureURL: downloadURL,
    };
    const docRef = doc(usersCollection, uid);
    await setDoc(docRef, seekerProfilepicData, { merge: true });
  }

  return (
    <>
    
      <div className="relative max-w-md mx-auto mt-10">
        <div className="bg-white p-8 mb-0 border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-4xl text-primary font-bold text-center mb-4">
            User Sign Up
          </h2>
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                ref={fullNameRef}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                ref={emailRef}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                ref={passwordRef}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="password-confirm"
              >
                Password Confirmation
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                ref={passwordConfirmRef}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="profile-picture">
                Profile Picture
              </label>
              <div className="relative mx-auto w-36 h-36">
                <div
                  className={`absolute inset-0 border-2 border-dashed rounded-full flex items-center justify-center ${
                    isDragging ? "border-primary" : "border-gray-300"
                  } hover:border-primary bg-secondary transition duration-300 ease-in-out`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={selectFiles}
                >
                  {isDragging ? (
                    <span className="text-primary">Drop image here</span>
                  ) : images.length === 0 ? (
                    <span className="text-white text-center cursor-pointer">
                      Click or drag & drop to upload
                    </span>
                  ) : null}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                {images.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center p-1 bg-white">
                    {images.map((image, index) => (
                      <div key={index} className="relative w-full h-full">
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 z-20"
                          onClick={() => deleteImage(index)}
                        >
                          &times;
                        </button>
                        <img
                          src={image.url}
                          alt={image.name}
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4">
            </div>
            <div className="flex justify-center mt-4">
              <button
                disabled={loading}
                
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <div className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-blue-800">
                Log In
              </Link>
            </div>
          </form>
          
        </div>
      </div>
    </>
  );
}

export default UserSignup;
