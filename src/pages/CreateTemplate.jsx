// Dependencies
import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// firebase
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";

// Custom hooks
import useTemplates from "../hooks/useTemplates";
import useUser from "../hooks/useUser";

import { adminIds, checkFileType, initialTags } from "../utils/helpers";

// Assets
import { FaTrash, FaUpload } from "react-icons/fa6";

const CreateTemplate = () => {
    const navigate = useNavigate();

    // Collection of form data
    const [formData, setFormData] = useState({
        title: "",
        imageURL: null,
    });

    // Image data
    const [imageAsset, setImageAsset] = useState({
        // Loading state for image
        isImageLoading: false,
        // Image url returned from firebase store
        uri: null,
        // Image progress bar while uploading image
        progress: 0,
    });

    // To store Selected Tags data
    const [selectedTags, setSelectedTags] = useState([]);

    // fetch Template data using useTemplates() hook
    const {
        data: templates,
        isError: templatesIsError,
        isLoading: templatesIsLoading,
        refetch: templatesRefetch,
    } = useTemplates();

    // fetch user data using useUser() hook
    const { data: user, isLoading } = useUser();

    // Handling template title input field
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevRecord) => ({ ...prevRecord, [name]: value }));
    };

    // Handling image upload field
    const handleFileSelect = async (e) => {
        // Set image loading state
        setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));

        // Select image from user
        // `files` is an array-like object which includes a list of File objects representing the files selected by the user.
        const file = e.target.files[0];

        // Check file type before uploading to the server
        if (file && checkFileType(file)) {
            // Storage reference
            const storageRef = ref(
                storage,
                `Template/${Date.now()}-${file.name}`
            );

            // Upload file to firebase store
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Get task progress info, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const fileProgress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    // Update progress bar
                    setImageAsset((prevAsset) => ({
                        ...prevAsset,
                        progress: fileProgress,
                    }));
                },
                (error) => {
                    // Handle unsuccessful uploads
                    if (error.message.includes("storage/unauthorized")) {
                        toast.error(`Error : Authorization Revoked`);
                    } else {
                        toast.error(`Error: ${error.message}`);
                    }
                },
                () => {
                    // if no error occurs, Get download URL so we can fetch uploaded image from the firebase store and show it in the UI with the help of `getDownloadURL`
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            setImageAsset((prevAsset) => ({
                                ...prevAsset,
                                uri: downloadURL,
                            }));
                        }
                    );

                    // Show the notification for successful upload to ADMIN User
                    toast.success("Image uploaded successfully! ");

                    // Hide the progress bar after successful upload after 2 seconds
                    setInterval(() => {
                        setImageAsset((prevAsset) => ({
                            ...prevAsset,
                            isImageLoading: false,
                        }));
                    }, 2000);
                }
            );
        } else {
            toast.info(
                "Invalid format. Please select file with '.jpg, .jpeg, .png' extension."
            );
        }
    };

    // Handling Template Image deletion from the firebase store
    const handleDeleteImageObject = async () => {
        // Remove the Image from UI first
        setInterval(() => {
            setImageAsset((prevAsset) => ({
                ...prevAsset,
                progress: 0,
                uri: null,
            }));
        }, 2000);

        // Storage reference
        const deleteRef = ref(storage, imageAsset.uri);

        // Delete image from firebase store
        deleteObject(deleteRef).then(() => {
            // Show the notification for successful deletion of Template Image
            toast.success("Template deleted successfully! ");
        });
    };

    // Handling Selected Tags
    const handleSelectedTags = (tag) => {
        // Check if the tag is selected or not
        if (selectedTags.includes(tag)) {
            // if selected, then remove it
            setSelectedTags(
                selectedTags.filter((selected) => selected !== tag)
            );
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // Handling Push all data to firebase store
    const pushDataToCloud = async () => {
        // Collect all data from the form
        const timeStamp = serverTimestamp();
        const id = `${Date.now()}`;

        // create a document to store in 'templates' collection
        const _doc = {
            _id: id,
            title: formData.title,
            imageURL: imageAsset.uri,
            tags: selectedTags,
            name:
                templates && templates.length > 0
                    ? `template${templates.length + 1}`
                    : "template1",
            timestamp: timeStamp,
        };

        // Push data to firebase store
        await setDoc(doc(db, "templates", id), _doc)
            .then(() => {
                // Once data is pushed, reset the form
                setFormData((prevData) => ({
                    ...prevData,
                    title: "",
                    imageURL: null,
                }));
                setImageAsset((prevAsset) => ({
                    ...prevAsset,
                    progress: 0,
                    uri: null,
                }));
                setSelectedTags([]);
                templatesRefetch();

                // Show the notification for successful upload to ADMIN User
                toast.success("Template pushed to the cloud successfully! ");
            })
            .catch((error) => {
                toast.error(`Error: ${error.message}`);
            });
    };

    // Handling template deletion from UI and firebase store as well
    const handleDeleteTemplate = async (template) => {
        const deleteRef = ref(storage, template?.imageURL);
        await deleteObject(deleteRef).then(async () => {
            await deleteDoc(doc(db, "templates", template?._id))
                .then(() => {
                    toast.success("Template deleted successfully! ");
                    templatesRefetch();
                })
                .catch((error) => {
                    toast.error(`Error: ${error.message}`);
                });
        });
    };

    // if user is not admin and directly try to gain access of createTemplate by url in the url bar then redirect to home page
    useEffect(() => {
        if (isLoading && !adminIds.includes(user.uid)) {
            navigate("/", { replace: true });
        }
    }, [user, isLoading]);

    return (
        <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
            {/* left Container */}
            <div className="colspan-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-col items-center justify-start gap-4 px-2 flex-1">
                {/* title */}
                <div className="w-full">
                    <p className="text-lg text-txtPrimary">
                        Create a New Template
                    </p>
                </div>

                {/* template ID section */}
                <div className="w-full flex items-center justify-end">
                    <p className="text-base text-txtLight uppercase font-semibold">
                        TempID:
                    </p>
                    <p className="text-sm text-txtDark capitalize font-bold">
                        {/* Fetch template data using custom */}
                        {templates && templates.length > 0
                            ? `template${templates.length + 1}`
                            : "template1"}
                    </p>
                </div>

                {/* template title section */}
                <input
                    className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 outline-none text-lg text-txtPrimary focus:text-txtDark focus:shadow-md"
                    type="text"
                    name="title"
                    placeholder="Template Title"
                    value={formData.title}
                    onChange={handleInputChange}
                />

                {/* File uploader field */}
                <div className="w-full bg-gray-100 backdrop-blur-md h-[220px] lg:h-[320px] 2xl:h-[400px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
                    {imageAsset.isImageLoading ? (
                        // show loading animation and progress bar while image is uploading
                        <React.Fragment>
                            <div className="flex flex-col items-center justify-center">
                                {/* Loading animation */}
                                <PuffLoader color="#498FCD" size={40} />

                                {/* Progress bar */}
                                <p>{imageAsset.progress.toFixed(2)}%</p>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {/* If images isn't uploading, you either have uploaded Image or you haven't uploaded any image. */}

                            {!imageAsset?.uri ? (
                                // first case: Show upload image icon
                                <React.Fragment>
                                    <label className="w-full h-full cursor-pointer">
                                        {/* label and Uploader icon */}
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <div className="flex flex-col items-center justify-center cursor-pointer">
                                                <FaUpload className="text-2xl" />
                                                <p className="text-lg text-txtLight gap-4">
                                                    Click to upload
                                                </p>
                                            </div>
                                        </div>

                                        {/* Uploading Image Input Field */}
                                        {/* Keep it hidden */}
                                        <input
                                            type="file"
                                            className="w-0 h-0"
                                            accept=".jpeg,.jpg,.png"
                                            onChange={handleFileSelect}
                                        />
                                    </label>
                                </React.Fragment>
                            ) : (
                                // Second case: Show preview of uploaded image
                                <React.Fragment>
                                    <div className="relative w-full h-full overflow-hidden rounded-md">
                                        <img
                                            src={imageAsset?.uri}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            alt=""
                                        />

                                        {/* Delete Image Action Button */}
                                        <div
                                            className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                                            onClick={handleDeleteImageObject}
                                        >
                                            <FaTrash className="text-xs text-white" />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>

                {/* Tags Section */}
                <div className="w-full flex items-center flex-wrap gap-2">
                    {initialTags.map((tag, index) => (
                        <div
                            key={index}
                            className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                                selectedTags.includes(tag)
                                    ? "bg-blue-500 text-white"
                                    : ""
                            }`}
                            onClick={() => handleSelectedTags(tag)}
                        >
                            <p className="text-xs">{tag}</p>
                        </div>
                    ))}
                </div>

                {/* Save Action Button */}
                <button
                    type="button"
                    className="w-full bg-blue-700 text-white py-3 rounded-md"
                    onClick={pushDataToCloud}
                >
                    Save
                </button>
            </div>

            {/* Right Container */}
            <div className="colspan-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
                {templatesIsLoading ? (
                    // show loading animation before data is fetched
                    <React.Fragment>
                        <div className="w-full h-full flex items-center justify-center">
                            <PuffLoader color="#498FCD" size={40} />
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {templates && templates.length > 0 ? (
                            // Show data fetched from firebase store
                            <React.Fragment>
                                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                                    {templates.map((template) => (
                                        <div
                                            key={template._id}
                                            className="w-full h-[400px] rounded-md overflow-hidden relative"
                                        >
                                            {/* Image Preview */}
                                            <img
                                                src={template.imageURL}
                                                className="w-full h-full object-cover"
                                                alt=""
                                            />

                                            {/* Delete Image Action Button */}
                                            <div
                                                className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                                                onClick={() =>
                                                    handleDeleteTemplate(
                                                        template
                                                    )
                                                }
                                            >
                                                <FaTrash className="text-xs text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        ) : (
                            // If No data fetched from firebase store
                            <React.Fragment>
                                <div className="w-full h-full flex flex-col items-center justify-center">
                                    <PuffLoader color="#498FCD" size={40} />
                                    <p className="text-xl tracking-wider capitalize text-txtPrimary">
                                        No Data
                                    </p>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default CreateTemplate;
