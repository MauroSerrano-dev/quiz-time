const { Storage } = require('@google-cloud/storage');

export const config = {
    api: {
        externalResolver: true,
    },
};

const storage = new Storage({
    credentials: {
        "type": process.env.NEXT_PUBLIC_GOOGLE_TYPE,
        "project_id": process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
        "private_key_id": process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY_ID,
        "private_key": process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
        "client_id": process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        "auth_uri": process.env.NEXT_PUBLIC_GOOGLE_AUTH_URI,
        "token_uri": process.env.NEXT_PUBLIC_GOOGLE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.NEXT_PUBLIC_GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.NEXT_PUBLIC_GOOGLE_CLIENT_X509_CERT_URL,
        "universe_domain": process.env.NEXT_PUBLIC_GOOGLE_UNIVERSE_DOMAIN
    }
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