import { useEffect, useState } from 'react';
import Image from 'next/image';

const Candidate = ({ index, areAdditionalFieldsRequired, numberOfAdditionalFields, addCandidate }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [additionalFields, setAdditionalFields] = useState([])
    const [imageFile, setImageFile] = useState(null)

    const nameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/

    useEffect(() => {
        setAdditionalFields(prev => {
            const additionalFieldsNumber = Number(numberOfAdditionalFields);
            if (prev.length === additionalFieldsNumber)
                return prev;
            else if (prev.length > additionalFieldsNumber)
                return prev.slice(0, additionalFieldsNumber);
            else {
                let newAdditionalFields = prev.slice();
                newAdditionalFields = newAdditionalFields.concat(Array.from({ length: additionalFieldsNumber - prev.length }, (_, index) => {
                    return { name: '', value: '' }
                }
                ));
                return newAdditionalFields;
            }
        })
    }, [numberOfAdditionalFields])



    useEffect(() => {
        addCandidate(name, description, imageFile, additionalFields, index);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, description, image, additionalFields])

    const addAdditionalField = (name, value, i) => {
        let newAdditionalFields = additionalFields.slice();
        if (i >= 0 && i < newAdditionalFields.length) {
            if (name != null)
                newAdditionalFields[i]["name"] = name;
            if (value != null)
                newAdditionalFields[i]["value"] = value;
            setAdditionalFields(newAdditionalFields);
        } else {
            console.error(additionalFields, i)
            console.error(`Index ${i} out of bounds for additionalFields array`);
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
        <>
            <h2 className="text-lg font-semibold mt-4">Candidate {index + 1}</h2>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Name</label>
                    <input
                        type="text"
                        className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                        placeholder="Enter candidate name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                {name && !nameRegex.test(name) && (
                    <p className='text-red-500 text-sm'>Please enter a valid candidate name. It should contain only alphabets, numbers, hyphens, underscores and spaces.</p>
                )}
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Description</label>
                    <textarea
                        className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                        placeholder="Enter candidate description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {description.length > 1024 && (
                        <p className='text-red-500 text-sm'>Description should be less than 1024 characters.</p>
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
                {image && (<Image className='rounded-3xl' src={image} alt={`Candidate ${index + 1} Image`} width={128} height={128} />)}
            </div>
            {areAdditionalFieldsRequired && (
                Array.from({ length: numberOfAdditionalFields }, (_, fieldIndex) => {
                    return (
                        <div key={fieldIndex} className="flex flex-col">
                            <h2 className="text-base font-semibold mt-4">Additional Field {fieldIndex + 1}</h2>
                            <div className='flex space-x-1 w-full'>
                                    <input
                                        className='border border-gray-200 rounded-lg p-2 mb-2 w-full'
                                        type='text'
                                        placeholder='Enter field name'
                                        value={additionalFields[fieldIndex]?.name || ""}
                                        onChange={(e) => addAdditionalField(e.target.value, null, fieldIndex)}
                                        required
                                    />
                                    {additionalFields[fieldIndex]?.name && !nameRegex.test(additionalFields[fieldIndex]?.name) && (
                                        <p className='text-red-500 text-sm'>Please enter a valid field name. It should contain only alphabets, numbers, hyphens, underscores and spaces.</p>
                                    )}
                                <p className='text-lg font-semibold pt-1'>:</p>
                                    <input
                                        className='border border-gray-200 rounded-lg p-2 mb-2 w-full'
                                        type='text'
                                        placeholder='Enter field value'
                                        value={additionalFields[fieldIndex]?.value || ""}
                                        onChange={(e) => addAdditionalField(null, e.target.value, fieldIndex)}
                                    />
                                {additionalFields[fieldIndex]?.value && !nameRegex.test(additionalFields[fieldIndex]?.value) && (
                                    <p className='text-red-500 text-sm'>Please enter a valid field value. It should contain only alphabets, numbers, hyphens, underscores and spaces.</p>
                                )}
                            </div>
                        </div>
                    )
                })
            )}

        </>
    )
}

export default Candidate