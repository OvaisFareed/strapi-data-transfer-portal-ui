import { localAPIRoutes, strapiAPIRoutes } from "@/constants/api-routes";
import { getAllData } from "@/services/api-service";
import { useEffect, useState } from "react";
import axios from "axios";
import { REMOTE_STRAPI_BASE_PATH } from "@/constants/environment";
import { normalizeData } from "@/services/helper";

export default function Home({ data, error }) {
  const [collections, setCollections] = useState([]);
  const [isRequestPending, setRequestFlag] = useState(false);
  const [responseMessage, setResponseMessage] = useState({});

  useEffect(() => {
    if (error) {
      throw new Error(error);
    }
    console.log('data: ', data)
    setCollections(data)
  }, []);

  const postDataToLocal = async (collectionName, index) => {
    const message = { ...responseMessage };
    setRequestFlag(true);
    try {
      const res = await axios.post(`${localAPIRoutes.CREATE_MANY}${strapiAPIRoutes[collectionName]}`, collections[index].data);
      if (res.data && res.data.success) {
        message[index] = res.data;
        setResponseMessage(message);
      }
      setRequestFlag(false);
    } catch (e) {
      message[index] = {
        message: e.message ? e.message : 'Error in inserting record(s)',
        success: false
      };
      setResponseMessage(message);
      setRequestFlag(false);
    }
  }

  const emptyLocalCollection = async () => {
    setRequestFlag(true);
    try {
      const res = await axios.delete(`${localAPIRoutes.DELETE_MANY}${strapiAPIRoutes.BANNER}`);
      if (res.data && res.data.success) {
        setResponseMessage(res.data);
      }
      setRequestFlag(false);
    } catch (e) {
      setResponseMessage({
        message: e.message ? e.message : 'Error in deleting record(s)',
        success: false
      });
      setRequestFlag(false);
    }
  }

  const closeMessageBox = (index) => {
    const message = { ...responseMessage };
    message[index] = {
      message: '',
      success: false
    };
    setResponseMessage(message);
  }

  return (
    <main className="min-h-screen p-4 container mx-auto bg-[#fff] w-full">
      <div className="flex justify-center items-center my-4">
        <h1 className="text-2xl text-center font-medium">All collections from Remote Strapi</h1>
      </div>
      {collections.map((collection, index) => {
        return (
          <div key={index}>
            <div key={index} className="flex justify-between items-center mb-4 mt-16 w-full">
              <span className="text-xl font-bold p-1">{collection.title}</span>
              {responseMessage[index] && responseMessage[index].message && (
                <span className={`flex justify-between items-center ml-4 px-3 py-1 w-[350px] rounded ${responseMessage[index].success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {responseMessage[index].message}

                  <span className="text-black font-medium cursor-pointer" onClick={() => closeMessageBox(index)}>x</span>
                </span>
              )}
              <div>
                <button className={`bg-green-700 text-white px-3 py-1 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => postDataToLocal(collection.title, index)}>Post to Local</button>
                {/* <button className={`bg-red-700 text-white ml-2 px-3 py-1 rounded ${isRequestPending ? 'pointer-events-none cursor-wait' : ''}`} onClick={() => emptyLocalCollection()}>Empty Local Collection</button> */}
              </div>
            </div>
            <div className="max-h-[308px] overflow-y-scroll w-full mb-8">
              <table className="table-auto border-collapse border border-slate-400 w-full">
                <thead className="bg-[#eee]">
                  <tr>
                    <th className="w-1/12 border border-slate-300">S No.</th>
                    <th className="w-1/12 border border-slate-300">Image</th>
                    <th className="w-4/6 border border-slate-300">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {collection?.data?.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td className="w-1/12 border border-slate-300 text-center font-medium">{i + 1}</td>
                        {item.image ?
                          <td className="w-1/12 border border-slate-300 text-center w-[70px] h-[70px] p-2">
                            <span style={{
                              backgroundImage: `url(${REMOTE_STRAPI_BASE_PATH}${item.image?.url})`,
                              height: "50px",
                              width: "50px",
                              backgroundRepeat: "no-repeat",
                              borderRadius: "50%",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              display: "block"
                            }}></span>
                          </td>
                          : <td className="w-1/12 border border-slate-300 text-center w-[70px] h-[70px] p-2">
                            <span>-</span>
                          </td>}
                        <td className="w-4/6 border border-slate-300 pl-1">{item?.title ?? item?.label}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </main>
  );
}

export async function getServerSideProps() {
  const collectionNames = Object.keys(strapiAPIRoutes);
  const result = [];
  try {
    const resp = await getAllData();
    for (let i = 0; i < resp?.length; i++) {
      if (resp[i].data && resp[i].data.data) {
        result.push({
          title: collectionNames[i],
          data: normalizeData(resp[i].data.data)
        });
      }
    };

    return {
      props: { data: result ?? [] }
    }
  } catch (e) {
    return {
      props: {
        error: JSON.parse(JSON.stringify(e)),
      },
    };
  }
}

