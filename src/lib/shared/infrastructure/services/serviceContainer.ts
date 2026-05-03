import { CategoryFindAll } from "../../../Category/application/use-cases/categoryFindAll.uc"
import { CategoryFindById } from "../../../Category/application/use-cases/categoryFindById.uc"
import { CategorySave } from "../../../Category/application/use-cases/categorySave.uc"
import { CategoryUpdate } from "../../../Category/application/use-cases/categoryUpdate.uc"
import { CategoryTursoRepository } from "../../../Category/infrastructure/repository/categoryTurso.repository"
import { PostFindAll } from "../../../Post/application/use-case/postFindAll.uc"
import { PostFindById } from "../../../Post/application/use-case/postFindById.uc"
import { PostFindBySlug } from "../../../Post/application/use-case/postFindBySlug.uc"
import { PostSave } from "../../../Post/application/use-case/postSave.uc"
import { PostUpdate } from "../../../Post/application/use-case/postUpdate.uc"
import { PostTursoQueryRepository } from "../../../Post/infrastructure/repository/postQuery.repository"
import { PostTursoRepository } from "../../../Post/infrastructure/repository/postTurso.repository"

const postRepository = new PostTursoRepository()
const postQueryRepository = new PostTursoQueryRepository()
const categoryRepository = new CategoryTursoRepository()

export const serviceContainer = {
  post: {
    save: new PostSave(postRepository),
    findAll: new PostFindAll(postQueryRepository),
    findById: new PostFindById(postQueryRepository),
    findBySlug: new PostFindBySlug(postQueryRepository),
    update: new PostUpdate(postRepository),
  },
  caetgory: {
    save: new CategorySave(categoryRepository),
    findAll: new CategoryFindAll(categoryRepository),
    findById: new CategoryFindById(categoryRepository),
    update: new CategoryUpdate(categoryRepository),
  },
}
