import { localAPIRoutes } from "@/constants/api-routes";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MessageBox } from "../MessageBox";

export const HomeComp = () => {
    const router = useRouter();
    const fileName = 'env.json';
    const timeout = 3;
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
        if (Object.values(formValues).some(val => !val)) {
            const message = {
                message: `All fields must be fill.`,
                success: false
            };
            setResponseMessage(message);
            return;
        }
        if (formValues.from) {
            formValues.from = formValues.from.slice(0, formValues.from.length - 1);
        }
        if (formValues.to) {
            formValues.to = formValues.to.slice(0, formValues.to.length - 1);
        }
        try {
            const res = await axios.post(`${localAPIRoutes.WRITE_FILE}${fileName}`, formValues);
            if (res && res.data) {
                const message = {
                    message: `<p>Credentials saved successfully!</p>
                        <p>redirecting in ${timeout} seconds...</p>`,
                    success: true
                };
                setResponseMessage(message);
                setTimeout(() => {
                    router.push("/collections", undefined, {
                        shallow: true
                    });
                }, timeout * 1000);
            }

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

    useEffect(() => {
        // Todo: display filled disabled form
        // and renew form
    }, []);

    return (
        <main className="min-h-screen p-4 container mx-auto bg-[#fff] w-full">
            <div className="flex flex-col justify-center items-center mt-16 mb-8">
                <h1 className="text-2xl text-center font-medium">Strapi Data Transfer Portal</h1>
                <p className="text-lg text-center font-light">(transfer data between two strapi instances)</p>
            </div>
            <div className={`flex flex-col justify-center items-center w-full ${responseMessage && responseMessage.message ? 'visible' : 'invisible'}`}>
                <MessageBox response={responseMessage} closeMessageBox={closeMessageBox} />
            </div>
            <div className="flex flex-col justify-center items-center mt-8">
                <div className="w-[480px]">
                    <form>
                        {form.slice(0, 2).map(input => {
                            return (
                                <div className="flex items-center mb-4">
                                    <div className="w-[180px] mr-2"><label>{input.label}</label> <Estarik /></div>
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
                                    <div className="w-[180px] mr-2 pt-2"><label>{input.label}</label> <Estarik /></div>
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
                    <div className="flex justify-start w-full text-gray-500 mb-8">
                        <small>(<Estarik />) all fields are required.</small>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={`w-[90px] h-[36px] bg-blue-700 text-white px-3 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                            onClick={() => submit()}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export const Estarik = () => {
    return (
        <span className="text-red-700">*</span>
    )
}
