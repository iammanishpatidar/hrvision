import DocumentFolderModel from './documentFolder.model.js';
import DocumentFolderRepository from './documentFolder.repository.js';
import { uploadFileToS3 } from '../../utilities/file_upload.utilities.js';
import CustomError from '../../utilities/custom_error.js';
export default class DocumentFolderService
{
     private documentFolderRepository:DocumentFolderRepository;
      constructor() {
        this.documentFolderRepository = new DocumentFolderRepository();
      }
 async create(categoryId:string,payload: Partial<DocumentFolderModel>,file: any) {
     if (!file) {
       throw new CustomError('Document is required', 500);
     }
     if(!categoryId)
     {
        throw new CustomError('Category ID is required',500);
     }
     const uploadedFileUrl = await uploadFileToS3(file);
     const created = await this.documentFolderRepository.create({
       ...payload,
       documentPath: uploadedFileUrl,
       categoryId
     });
 
     return created;
   }
}
