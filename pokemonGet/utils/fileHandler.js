import { unlink } from 'fs/promises';
import path from 'path';
 
const UPLOADS_DIR = path.join(process.cwd(), "static");

export const deleteFile = async (relativePath) => {
    
    if (!relativePath || relativePath.trim() === '') return;

    const filePath = path.join(UPLOADS_DIR, relativePath);

    try {
        await unlink(filePath);
        console.log(`✅ Archivo eliminado físicamente: ${relativePath}`);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error(`❌ Error al intentar borrar el archivo ${relativePath}:`, error);
        }
    }
}