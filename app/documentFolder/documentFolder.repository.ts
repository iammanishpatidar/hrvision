import DocumentFolderModel from "./documentFolder.model.js"
export default class DocumentFolderRepository{
    async create(payload: Partial<DocumentFolderModel>) {
        return await DocumentFolderModel.create(payload)
      }
}