'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { Tooltip } from "react-tooltip"

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
                <a
                    data-tooltip-id={`candidate${index}-name-tooltip`}
                    data-tooltip-variant='error'
                    data-tooltip-content='Please enter a valid candidate name. It should contain only letters, numbers, spaces, hyphens, and underscores. It should start with a letter and end with a letter or number.'
                >
                    <input
                        type="text"
                        className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                        placeholder="Enter candidate name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </a>
                <Tooltip
                    id={`candidate${index}-name-tooltip`}
                    place='bottom'
                    effect='solid'
                    hidden={nameRegex.test(name)}
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Description</label>
                <a
                    data-tooltip-id={`candidate${index}-description-tooltip`}
                    data-tooltip-variant='error'
                    data-tooltip-content='Please enter a valid candidate description. It should contain atleast 10 characters not more than 500 characters.'
                >
                    <textarea
                        className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                        placeholder="Enter candidate description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </a>
                <Tooltip
                    id={`candidate${index}-description-tooltip`}
                    place='bottom'
                    effect='solid'
                    hidden={description.length >= 10}
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Image</label>
                <input
                    type="file"
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                    accept='image/*'
                    onChange={handleImageChange}
                />
                {image && (<Image className='rounded-3xl' src={image} alt={`Candidate ${index + 1} Image`} width={128} height={128} />)}
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
                        <a
                            data-tooltip-id={`candidate${index}-additional${fieldIndex}-field-name-tooltip`}
                            data-tooltip-variant='error'
                            data-tooltip-content='Please enter a field name.'
                        >
                            <input
                                className='border border-gray-200 rounded-lg p-2 mb-2 w-full'
                                type='text'
                                placeholder='Enter field name'
                                value={field.name || ""}
                                onChange={(e) => changeAdditionalField(e.target.value, null, fieldIndex)}
                            />
                        </a>
                        <Tooltip
                            id={`candidate${index}-additional${fieldIndex}-field-name-tooltip`}
                            place='bottom'
                            effect='solid'
                            hidden={field.name !== ""}
                        />
                        <p className='text-lg font-semibold pt-1'>:</p>
                        <a
                            data-tooltip-id={`candidate${index}-additional${fieldIndex}-field-value-tooltip`}
                            data-tooltip-variant='error'
                            data-tooltip-content='Please enter a field value.'
                        >
                            <input
                                className='border border-gray-200 rounded-lg p-2 mb-2 w-full'
                                type='text'
                                placeholder='Enter field value'
                                value={field.value || ""}
                                onChange={(e) => changeAdditionalField(null, e.target.value, fieldIndex)}
                            />
                        </a>
                        <Tooltip
                            id={`candidate${index}-additional${fieldIndex}-field-value-tooltip`}
                            place='bottom'
                            effect='solid'
                            hidden={field.value !== ""}
                        />
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