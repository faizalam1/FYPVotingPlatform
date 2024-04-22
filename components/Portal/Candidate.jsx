import { useEffect, useState } from 'react'
import Image from 'next/image'

const Candidate = ({ index, areAdditionalFields, numberOfAdditionalFields, addCandidate }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [additionalFields, setAdditionalFields] = useState([])

    useEffect(() => {
        setAdditionalFields(Array.from({ length: numberOfAdditionalFields }, (_, index) => {
            return { name: '', value: '' }
        }))
    }, [numberOfAdditionalFields])


    
    useEffect(() => {
        addCandidate(name, description, image, additionalFields, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, description, image, additionalFields])

    const addAdditionalField = (name, value, index) => {
        let newAdditionalFields = additionalFields.slice();
        if (name != null)
            newAdditionalFields[ index ]["name"] = name;
        if (value != null)
            newAdditionalFields[ index ]["value"] = value;
        setAdditionalFields(newAdditionalFields);
    }

    return (
        <>
            <h2 className="text-lg font-semibold mt-4">Candidate {index + 1}</h2>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Name</label>
                <input
                    type="text"
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                    placeholder="Enter candidate name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Description</label>
                <textarea
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                    placeholder="Enter candidate description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Image</label>
                <input
                    type="file"
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                    accept='image/*'
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setImage(URL.createObjectURL(file));
                    }}
                />
                {image && (<Image className='rounded-3xl' src={image} alt={`Candidate ${index + 1} Image`} width={128} height={128} />)}
            </div>
            {areAdditionalFields && (
                Array.from({ length: numberOfAdditionalFields }, (_, index) => {
                    return (
                        <div key={index} className="flex flex-col">
                            <h2 className="text-base font-semibold mt-4">Additional Field {index + 1}</h2>
                            <div className='flex space-x-1 w-full'>
                                <input
                                    className='border border-gray-200 rounded-lg p-2 mb-2 w-1/2'
                                    type='text'
                                    placeholder='Enter field name'
                                    value={additionalFields[index]?.name || ""}
                                    onChange={(e) => addAdditionalField(e.target.value, null, index)}
                                />
                                <p className='text-lg font-semibold pt-1'>:</p>
                                <input
                                    className='border border-gray-200 rounded-lg p-2 mb-2 w-1/2'
                                    type='text'
                                    placeholder='Enter field value'
                                    value={additionalFields[index]?.value || ""}
                                    onChange={(e) => addAdditionalField(null, e.target.value, index)}
                                />
                            </div>
                        </div>
                    )
                })
            )}

        </>
    )
}

export default Candidate