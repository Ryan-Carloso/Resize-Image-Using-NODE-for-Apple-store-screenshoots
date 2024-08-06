const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const readlineSync = require('readline-sync');

// Dimensões dos dispositivos em pixels (largura x altura)
const sizes = {
    iphone: {
        '6.7_inches': { width: 1290, height: 2796 },  // iPhone 12 Pro Max
        '6.5_inches': { width: 1242, height: 2688 },  // iPhone 11 Pro Max
        '5.5_inches': { width: 1242, height: 2208 }   // iPhone 8 Plus
    },
    ipad: {
        '13_inches': { width: 2048, height: 2732 },   // iPad Pro 12.9-inch
        '12.9_inches': { width: 2048, height: 2732 }  // iPad Pro 12.9-inch (geração anterior)
    }
};

// Caminhos das imagens originais
const inputImagesPaths = [
    'image1.png',
    'image2.png',
    'image3.png',
    'image4.png'
];

// Solicitar a cor de fundo ao usuário
let backgroundcolor = readlineSync.question('Por favor, insira a cor de fundo (em formato hexadecimal, por exemplo, #ffffff): ');

// Definir cor de fundo padrão se nenhuma cor for inserida
if (!backgroundcolor) {
    backgroundcolor = '#ffffff';
}

// Função para redimensionar imagem
const resizeImage = async (inputPath, outputPath, size) => {
    try {
        await sharp(inputPath)
            .resize(size.width, size.height, {
                fit: 'contain',
                background: backgroundcolor
            })
            .toFile(outputPath);
        console.log(`Imagem ${inputPath} salva em ${outputPath}`);
    } catch (error) {
        console.error(`Erro ao redimensionar a imagem ${inputPath}:`, error);
    }
};

// Função para criar diretórios se não existirem
const createDirectoryIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Função para redimensionar imagens para todos os tamanhos
const resizeImagesForAllSizes = (deviceSizes, deviceType) => {
    for (const [sizeName, size] of Object.entries(deviceSizes)) {
        const dir = `./images/output/${deviceType}_${sizeName}`;
        createDirectoryIfNotExists(dir);

        inputImagesPaths.forEach(inputImagePath => {
            const outputPath = path.join(dir, `${path.parse(inputImagePath).name}${path.extname(inputImagePath)}`);
            resizeImage(inputImagePath, outputPath, size);
        });
    }
};

// Redimensionar para todos os tamanhos de iPhone e iPad
resizeImagesForAllSizes(sizes.iphone, 'iphone');
resizeImagesForAllSizes(sizes.ipad, 'ipad');
