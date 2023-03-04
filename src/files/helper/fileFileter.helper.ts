export const fileFileter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
    if(!file) {
        return cb(new Error('File Is Empty'), false);
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if(validExtensions.includes(fileExtension)) {
        return cb(null, true);
    }

    cb(null, false);
}
