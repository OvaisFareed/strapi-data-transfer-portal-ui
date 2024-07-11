import { localAPIRoutes } from "@/constants/api-routes";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { MessageBox } from "../MessageBox";

export const HomeComp = () => {
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        from: '',
        to: '',
        fromAPIToken: '',
        toAPIToken: '',
    });
    const [isRequestPending, setRequestFlag] = useState(false);
    const [responseMessage, setResponseMessage] = useState({});

    const form = [
        {
            name: 'from',
            label: 'From (source)',
            type: 'text',
            placeholder: 'Enter source url',
        },
        {
            name: 'to',
            label: 'To (destination)',
            type: 'text',
            placeholder: 'Enter destination url',
        },
        {
            name: 'fromAPIToken',
            label: 'API Token (source)',
            type: 'text',
            placeholder: `Enter source's API Token`,
        },
        {
            name: 'toAPIToken',
            label: 'API Token (destination)',
            type: 'text',
            placeholder: `Enter destination's API Token`,
        },
    ];

    const setValue = (value, name) => {
        const formValue = { ...formValues };
        formValue[name] = value;
        setFormValues(formValue);
    }

    const submit = async () => {
        const fileName = 'env.json';
        try {
            const res = await axios.post(`${localAPIRoutes.WRITE_FILE}${fileName}`, formValues);
            const message = {
                message: res.message,
                success: true
            };
            setResponseMessage(message);
            setTimeout(() => {
                router.push("/collections", undefined, {
                    shallow: true
                })
            }, 2000);
        }
        catch (err) {
            const message = {
                message: err,
                success: false
            };
            setResponseMessage(message);
        }
    }

    const closeMessageBox = () => {
        const message = {
            message: '',
            success: false
        };
        setResponseMessage(message);
    }


    return (
        <>
            <div className="flex flex-col justify-center items-center my-16">
                <h1 className="text-2xl text-center font-medium">Strapi Data Transfer Portal</h1>
                <p className="text-lg text-center font-light">(transfer data between two strapi instances)</p>
            </div>
            {responseMessage && responseMessage.message && (
                <MessageBox response={responseMessage} closeMessageBox={closeMessageBox} />
            )}
            <div className="flex flex-col justify-center items-center w-full mt-8">
                <form className="mb-4">
                    {form.slice(0, 2).map(input => {
                        return (
                            <div className="flex items-center mb-4">
                                <div className="w-[180px] mr-2"><label>{input.label}</label></div>
                                <input
                                    name={input.name}
                                    className="w-[300px] h-[50px] p-2 bg-slate-100 rounded outline-none"
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    value={formValues[input.name]}
                                    onChange={(e) =>
                                        setValue(e.target.value, input.name)
                                    }
                                />
                            </div>
                        )
                    })}
                    {form.slice(2, 4).map(input => {
                        return (
                            <div className="flex items-start mb-4">
                                <div className="w-[180px] mr-2 pt-2"><label>{input.label}</label></div>
                                <textarea
                                    name={input.name}
                                    className="w-[300px] h-[100px] p-2 bg-slate-100 rounded outline-none"
                                    type={input.type}
                                    placeholder={input.placeholder}
                                    value={formValues[input.name]}
                                    onChange={(e) =>
                                        setValue(e.target.value, input.name)
                                    }
                                ></textarea>
                            </div>
                        )
                    })}
                </form>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`w-[90px] h-[36px] bg-blue-700 text-white px-3 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                        onClick={() => submit()}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
