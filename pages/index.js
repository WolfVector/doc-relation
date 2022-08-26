import { useState } from "react"
import { handleAsyncReq } from "../lib/util"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [relationData, setRelationData] = useState([])

  function changeHandler(event) {
    setSelectedFile(event.target.files)
  }

  async function handleSubmission() {
    console.log(selectedFile)

    const formData = new FormData()
    for(let [key, value] of Object.entries(selectedFile))
      formData.append("files[]", value)
    
    const res = await handleAsyncReq({
      url: "/api/uploadfile",
      body: {
        method: "POST",
        body: formData
      }
    })

    if(res === false)
      console.log("Error while uploading the file")
    else{
      const data = []
      const keys = new Set()
      console.log(res)

      for(let i=0;i < res.data.identifiers.length;i++) {
        const file1 = res.data.identifiers[i] 
        console.log(file1)

        for(let j=0;j < res.data.identifiers.length;j++) {
          const file2 = res.data.identifiers[j]
          if(file1 != file2 && (!keys.has(file1 + file2) && !keys.has(file2 + file1))) {
            data.push({ file1, file2, value: ((1 - res.data.matrix[i][j]) * 100).toFixed(3) })
            keys.add(file1 + file2)
          }
        }
      }

      console.log(data)
      setRelationData(data)
    }
  }
  
  return (
    <div className="h-screen flex flex-column bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="mx-auto my-0">
        <div className="text-4xl text-gray-600 mb-16">Doc Relation</div>
        <input type="file" className="text-black" name="files" multiple onChange={changeHandler} />
        <div>
          <button className="text-white mt-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded p-2" type="button" onClick={handleSubmission}>Submit</button>
        </div>
        <div>
          <table className="mt-5 border-separate border border-neutral-400 rounded-lg">
            <thead className="text-black">
              <tr>
                <th className="border border-slate-400">File 1</th>
                <th className="border border-slate-400">File 2</th>
                <th className="border border-slate-400">Result</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {relationData.map(data => (
                <tr>
                  <td className="border border-slate-700 p-1">{data.file1}</td>
                  <td className="border border-slate-700 p-1">{data.file2}</td>
                  <td className={`border border-slate-700 p-1 ${data.value > 70.0 ? 'text-[#eb4034]' : 'text-[#22a34b]'}`}>{data.value + '%'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
		</div>   
  )
}
