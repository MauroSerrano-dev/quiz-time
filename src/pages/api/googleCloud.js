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

export default async function handler(req, res) {

    if (req.method === 'GET') {
        const fileName = req.headers.filename; // Nome do arquivo a ser obtido
        const userUui = req.headers.useruui; // Nome do bucket

        const bucket = storage.bucket(userUui);
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

    const { newImg, userUui } = req.body
    if (req.method === "POST") {
        if (!(await checkBucketExists(userUui)))
            await createBucket(userUui)

        const bucket = storage.bucket(userUui);
        const fileName = newImg.id;
        const file = bucket.file(fileName);
        const fileExists = await file.exists();

        if (fileExists[0]) {
            // Se o arquivo com o mesmo ID já existir, exclua-o antes de enviar o novo arquivo
            await file.delete();
        }

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

// Função para verificar se o bucket já existe
async function checkBucketExists(bucketName) {
    try {
        const [exists] = await storage.bucket(bucketName).exists();
        return exists;
    } catch (err) {
        console.error('Erro ao verificar se o bucket existe:', err);
        return false;
    }
}

// Função para criar um novo bucket
async function createBucket(bucketName) {
    try {
        const bucketExists = await checkBucketExists(bucketName);

        if (bucketExists) {
            console.log(`O bucket "${bucketName}" já existe.`);
            return;
        }

        const location = 'EU'; // Defina a região desejada aqui

        // Crie um novo bucket com o nome fornecido
        await storage.createBucket(bucketName, {
            location: location
        });

        console.log(`Bucket criado com sucesso: ${bucketName}`);
    } catch (err) {
        console.error('Erro ao criar o bucket:', err);
    }
}