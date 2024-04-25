import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Tooltip } from "react-tooltip";

const Candidate = ({ index, areAdditionalFields, numberOfAdditionalFields, addCandidate, changeAreCandidatesValid }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)
    const [additionalFields, setAdditionalFields] = useState([])

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
        addCandidate(name, description, image, additionalFields, index);
        changeAreCandidatesValid(nameRegex.test(name) && description.length >= 10 && additionalFields.every(field => field.name && field.value))
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

    return (
        <>
            <h2 className="text-lg font-semibold mt-4">Candidate {index + 1}</h2>
            <div className="flex flex-col">
                <label className="text-sm font-semibold">Candidate Name</label>
                <a
                    data-tooltip-id={`candidate${index}-name-tooltip`}
                    data-tooltip-variant='error'
                    data-tooltip-content='Please enter a valid candidate description. It should contain only letters, numbers, spaces, hyphens, and underscores. It should start with a letter and end with a letter or number.'
                >
                    <input
                        type="text"
                        className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                        placeholder="Enter candidate name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
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
                    data-tooltip-content='Please enter a valid candidate description. It should contain atleast 10 characters.'
                >
                    <textarea
                        className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                        placeholder="Enter candidate description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
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
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setImage(URL.createObjectURL(file));
                    }}
                />
                {image && (<Image className='rounded-3xl' src={image} alt={`Candidate ${index + 1} Image`} width={128} height={128} />)}
            </div>
            {areAdditionalFields && (
                Array.from({ length: numberOfAdditionalFields }, (_, index2) => {
                    return (
                        <div key={index2} className="flex flex-col">
                            <h2 className="text-base font-semibold mt-4">Additional Field {index2 + 1}</h2>
                            <div className='flex space-x-1 w-full'>
                                <a
                                    data-tooltip-id={`candidate${index}-additional${index2}-field-name-tooltip`}
                                    data-tooltip-variant='error'
                                    data-tooltip-content='Please enter a field name.'
                                >
                                    <input
                                        className='border border-gray-200 rounded-lg p-2 mb-2 w-full'
                                        type='text'
                                        placeholder='Enter field name'
                                        value={additionalFields[index2]?.name || ""}
                                        onChange={(e) => addAdditionalField(e.target.value, null, index2)}
                                    />
                                </a>
                                <Tooltip
                                    id={`candidate${index}-additional${index2}-field-name-tooltip`}
                                    place='bottom'
                                    effect='solid'
                                    hidden={additionalFields[index2]?.name !== ""}
                                />
                                <p className='text-lg font-semibold pt-1'>:</p>
                                <a
                                    data-tooltip-id={`candidate${index}-additional${index2}-field-value-tooltip`}
                                    data-tooltip-variant='error'
                                    data-tooltip-content='Please enter a field value.'
                                >
                                    <input
                                        className='border border-gray-200 rounded-lg p-2 mb-2 w-full'
                                        type='text'
                                        placeholder='Enter field value'
                                        value={additionalFields[index2]?.value || ""}
                                        onChange={(e) => addAdditionalField(null, e.target.value, index2)}
                                    />
                                </a>
                                <Tooltip
                                    id={`candidate${index}-additional${index2}-field-value-tooltip`}
                                    place='bottom'
                                    effect='solid'
                                    hidden={additionalFields[index2]?.value !== ""}
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