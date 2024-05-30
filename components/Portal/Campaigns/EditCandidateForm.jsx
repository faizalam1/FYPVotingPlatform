'use client'

import { useState, useEffect } from "react"
import Image from "next/image"


const EditCandidateForm = ({ candidate, index, updateCandidate, removeCandidate }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [additionalFields, setAdditionalFields] = useState([])
    const [imageFile, setImageFile] = useState(null)

    const nameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/

    useEffect(() => {
        const fetchCandidateImage = async () => {
            try {
            const res = await fetch(`/api/portal/campaigns/candidates/getCandidateImage?url=${encodeURIComponent(candidate.image)}`);
            const data = await res.json();
            if (data.error) {
                console.error(data.error);
                return;
            }
            setImage("data:image;base64," + data.base64);
        }
        catch (err) {
            console.error(err);
        }
        }
        setName(candidate.name)
        setDescription(candidate.description)
        setImageFile(candidate.image)
        setAdditionalFields(candidate.additionalFields)
        if (candidate.image != "")
            fetchCandidateImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        updateCandidate(name, description, imageFile, additionalFields, index)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[name, description, imageFile, additionalFields])

    const changeAdditionalField = (name, value, i) => {
        let newAdditionalFields = additionalFields.slice()
        if (i >= 0 && i < newAdditionalFields.length) {
            if (name != null) {
                newAdditionalFields[i]["name"] = name
            }
            if (value != null) {
                newAdditionalFields[i]["value"] = value
            }
            setAdditionalFields(newAdditionalFields)
        } else {
            console.error(additionalFields, i)
            console.error(`Index ${i} out of bounds for additionalFields array`)
        }
    }


    const handleImageChange = (e) => {
        const filetype = e.target.files[0].name.split('.').pop()
        if (filetype !== 'jpg' && filetype !== 'jpeg' && filetype !== 'png') {
            alert('Please upload a valid image file');
            return;
        }

        const file = new File([e.target.files[0]], `${name}.${filetype}`);
        if (file.size > 1024 * 1024 * 2){
            alert('Please upload an image file smaller than 2MB');
            return;
        }

        setImage(URL.createObjectURL(file));
        setImageFile(file);
        
    }
    return (
        <div className="w-1/3">
            <h2 className="text-lg font-semibold mt-4">Candidate {index + 1}</h2>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Name</label>
                <input
                    type="text"
                    className={`border rounded-lg p-2 mb-2 w-full ${nameRegex.test(name) ? 'border-gray-200' : 'border-red-500'}`}
                    placeholder="Enter candidate name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {!nameRegex.test(name) && (
                    <span className="text-red-500 text-xs">Please enter a valid candidate name. It should contain only letters, numbers, spaces, hyphens, and underscores. It should start with a letter and end with a letter or number.</span>
                )}
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Description</label>
                <textarea
                    className={`border rounded-lg p-2 mb-2 w-full ${description.length >= 10 && description.length <= 500 ? 'border-gray-200' : 'border-red-500'}`}
                    placeholder="Enter candidate description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {description.length > 1024 && (
                    <span className="text-red-500 text-xs">Please enter a valid candidate description. It should contain no more than 1024 characters.</span>
                )}
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Image</label>
                <input
                    type="file"
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                    accept='image/*'
                    onChange={handleImageChange}
                />
                {image && (
                    <Image
                        className='rounded-3xl'
                        src={image}
                        alt={`Candidate ${index + 1} Image`}
                        width={128}
                        height={128}
                    />
                )}
            </div>
            <div className="flex justify-center">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setAdditionalFields((prev) => prev.concat({ "name": "", "value": "" }));
                    }}
                    className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-light py-2 px-2 rounded mt-4"
                >
                    Add Field
                </button>
            </div>
            {additionalFields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex flex-col">
                    <h2 className="text-base font-semibold mt-4">Additional Field {fieldIndex + 1}</h2>
                    <div className='flex space-x-1 w-full'>
                        <input
                            className={`border rounded-lg p-2 mb-2 w-full ${field.name ? 'border-gray-200' : 'border-red-500'}`}
                            type='text'
                            placeholder='Enter field name'
                            value={field.name || ""}
                            onChange={(e) => changeAdditionalField(e.target.value, null, fieldIndex)}
                        />
                        {!field.name && (
                            <span className="text-red-500 text-xs">Please enter a field name.</span>
                        )}
                        <p className='text-lg font-semibold pt-1'>:</p>
                        <input
                            className={`border rounded-lg p-2 mb-2 w-full ${field.value ? 'border-gray-200' : 'border-red-500'}`}
                            type='text'
                            placeholder='Enter field value'
                            value={field.value || ""}
                            onChange={(e) => changeAdditionalField(null, e.target.value, fieldIndex)}
                        />
                        {!field.value && (
                            <span className="text-red-500 text-xs">Please enter a field value.</span>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setAdditionalFields((prev) => prev.filter((_, i) => i !== fieldIndex));
                            }}
                            className="text-sm bg-red-500 hover:bg-red-700 text-white font-light py-2 px-4 rounded mt-4"
                        >
                            Remove Field
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex justify-center">
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        removeCandidate(index);
                    }}
                    className="text-sm font-light bg-red-500 hover:bg-red-700 text-white py-2 px-2 rounded mt-4"
                >
                    Remove Candidate
                </button>
            </div>
        </div>
    )
    
}

export default EditCandidateForm