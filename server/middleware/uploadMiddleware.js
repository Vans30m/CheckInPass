import multer from 'multer';
{/* multer is a middleware used to handle file uploads; storage: multer.diskStorage({}) -> tells multer to temporarily use local disk storage for file uploads. */ }
const upload = multer({ storage: multer.diskStorage({}) })
export default upload;