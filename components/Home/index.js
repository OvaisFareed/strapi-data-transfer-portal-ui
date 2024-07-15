import { localAPIRoutes } from "@/constants/api-routes";
import axios from "axios";
import { useEffect, useState } from "react";
import { MessageBox } from "../MessageBox";
import * as env from "../../env.json";
import { buttonStates } from "@/constants";
import { appRoutes } from "@/constants/app-routes";
import { useRouter } from "next/router";
import Image from "next/image";
import { Spinner } from "../Spinner";

export const HomeComp = () => {
    const router = useRouter();
    const fileName = 'env.json';
    const defaultFormValues = {
        from: '',
        to: '',
        fromAPIToken: '',
        toAPIToken: '',
    };
    const [formValues, setFormValues] = useState(defaultFormValues);
    const [isRequestPending, setRequestFlag] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [responseMessage, setResponseMessage] = useState({});
    const [credentials, setCredentials] = useState({ ...env?.default });
    const [buttonText, setButtonText] = useState('');
    const [timeOut, setTimer] = useState(3);

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

    const gotoRoute = (route) => {
        router.push(route, undefined, {
            shallow: true
        });
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
        setShowLoader(true);
        const payload = { ...formValues };
        if (payload.from) {
            payload.from = payload.from.slice(0, payload.from.length - 1);
        }
        if (payload.to) {
            payload.to = payload.to.slice(0, payload.to.length - 1);
        }
        try {
            const res = await axios.post(`${localAPIRoutes.WRITE_FILE}${fileName}`, payload);
            if (res && res.data) {
                const message = {
                    message: `<p>Credentials saved successfully!</p>
                        <p>redirecting in ${timeOut} seconds...</p>`,
                    success: true
                };
                setResponseMessage(message);
                setTimeout(() => {
                    setShowLoader(false);
                    gotoRoute(appRoutes.COLLECTIONS.link);
                }, timeOut * 1000);
            }

        }
        catch (err) {
            const message = {
                message: err,
                success: false
            };
            setResponseMessage(message);
            setShowLoader(false);
        }
    }

    const closeMessageBox = () => {
        const message = {
            message: '',
            success: false
        };
        setResponseMessage(message);
    }

    const clearForm = () => {
        setFormValues(defaultFormValues);
        setCredentials({});
        setButtonText(buttonStates.SUBMIT);
    }

    useEffect(() => {
        if (env?.default) {
            setFormValues(env.default);
            setCredentials(env.default);
            setButtonText(buttonStates.NEXT);
        } else {
            setButtonText(buttonStates.SUBMIT);
        }
        setShowLoader(false);
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
                {showLoader ? (
                    <div className="w-[480px]">
                        <Spinner />
                    </div>)
                    : (
                        <div className="w-[480px]">
                            <form>
                                {form.slice(0, 2).map(input => {
                                    return (
                                        <div className="flex items-center mb-4">
                                            <div className="w-[180px] mr-2"><label>{input.label}</label> <Estarik /></div>
                                            <input
                                                name={input.name}
                                                className={`w-[300px] h-[50px] p-2 bg-slate-100 rounded outline-none
                                            ${credentials[input.name] === formValues[input.name] ? 'text-slate-500' : ''}
                                            `}
                                                type={input.type}
                                                placeholder={input.placeholder}
                                                value={formValues[input.name]}
                                                onChange={(e) =>
                                                    setValue(e.target.value, input.name)
                                                }
                                                disabled={credentials[input.name] === formValues[input.name]}
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
                                                className={`w-[300px] h-[100px] p-2 bg-slate-100 rounded outline-none
                                            ${credentials[input.name] === formValues[input.name] ? 'text-slate-500' : ''}
                                            `}
                                                type={input.type}
                                                placeholder={input.placeholder}
                                                value={formValues[input.name]}
                                                onChange={(e) =>
                                                    setValue(e.target.value, input.name)
                                                }
                                                disabled={credentials[input.name] === formValues[input.name]}
                                            ></textarea>
                                        </div>
                                    )
                                })}
                            </form>
                            <div className="flex justify-start w-full text-gray-500 mb-8">
                                <small>( <Estarik /> ) all fields are required.</small>
                            </div>
                            <div className="flex justify-end">
                                {credentials.from ? <button
                                    type="submit"
                                    className={`w-[140px] h-[36px] bg-green-700 text-white px-3 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                                    onClick={() => clearForm()}
                                >
                                    New Credentials
                                </button> : <></>}
                                <button
                                    type="submit"
                                    className={`flex justify-around items-center w-[90px] h-[36px] bg-blue-700 text-white ml-2 px-3 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`}
                                    onClick={() => buttonText === buttonStates.SUBMIT ? submit() : gotoRoute(appRoutes.COLLECTIONS.link)}
                                >
                                    {buttonText}
                                    {buttonText === buttonStates.NEXT ?
                                        <Image
                                            src={"/images/arrow-forward.svg"}
                                            alt={""}
                                            width={20}
                                            height={20}
                                            className="ml-2"
                                        />
                                        : <></>}
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </main>
    );
}

export const Estarik = () => {
    return (
        <span className="text-red-700">*</span>
    )
}
