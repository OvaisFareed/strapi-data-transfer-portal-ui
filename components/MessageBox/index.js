export const MessageBox = ({ response, closeMessageBox, index = undefined }) => {
    console.log(typeof closeMessageBox)
    return (
        <span className={`flex justify-between items-center ml-4 px-3 py-2 w-[350px] rounded ${response.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <div dangerouslySetInnerHTML={{
                __html: response.message
            }}></div>
            <span className="text-black font-medium cursor-pointer" onClick={() => index === undefined ? closeMessageBox() : closeMessageBox(index)}>x</span>
        </span>
    )
}