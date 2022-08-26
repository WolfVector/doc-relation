import formidable from "formidable";
import fs from "fs";
import { Corpus, Similarity } from "tiny-tfidf";
import PdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false
  }
};

async function saveFile(file) {
  const data = fs.readFileSync(file.filepath)
  fs.writeFileSync(`./public/${file.originalFilename}`, data)
  await fs.unlinkSync(file.filepath)
}

async function getFileData(files) {
  const names = files.map(file => (
    file.originalFilename
  ))

  const data = await Promise.all(files.map(async (file) => {
    const temp = fs.readFileSync(file.filepath)
    const pdfExtract = await PdfParse(temp)
    return pdfExtract.text
  }))

  return [names, data]
}

async function compareFiles(files) {
  const [names, data] = await getFileData(files)
  
  const corpus = new Corpus(names, data)
  const similarity = new Similarity(corpus)

  files.forEach(async (file) => {
    await fs.unlinkSync(file.filepath)
  })

  const result = similarity.getDistanceMatrix()

  console.log(result)

  return result
}

async function post(req, res) {
  const form = new formidable.IncomingForm({ multiples: true })
  form.parse(req, async function(err, fields, files) {
    const result = await compareFiles(files['files[]'])

    return res.status(200).json({ data: result })
  })
}

export default function handler(req, res) {
  post(req, res)
}
  