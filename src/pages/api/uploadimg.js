const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    keyFilename: './google-serranos-software.json',
});

const bucketName = 'quiztime';

export default function handler(req, res) {

    const { newImg } = req.body

    if (req.method === 'GET') {
        const fileName = req.headers.filename; // Nome do arquivo a ser obtido

        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);

        file.download((err, fileContents) => {
            if (err) {
                console.error('Erro ao obter o arquivo do bucket:', err);
                res.status(500).json({ error: 'Erro ao obter o arquivo do bucket.' });
            } else {
                res.status(200).json({ fileContents: fileContents });
            }
        });
    }

    if (req.method === "POST") {
        const bucket = storage.bucket(bucketName);
        const fileName = newImg.name;
        const fileContent = newImg.content;

        const fileStream = bucket.file(fileName).createWriteStream();

        fileStream.on('error', (err) => {
            console.error('Erro ao fazer upload do arquivo:', err);
        });

        fileStream.on('finish', () => {
            console.log('Arquivo enviado com sucesso:', fileName);
        });

        fileStream.end(JSON.stringify(newImg));
    }
}