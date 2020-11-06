import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Author } from '../../core/entities/Author'
import { Blog } from '../../core/entities/Blog'

export const state = () => ({
  blogs: [] as Blog[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  blogs: state => state.blogs,

}

export const mutations: MutationTree<RootState> = {
  SET_BLOGS(state, list) {
    state.blogs = list;
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async init({ commit }, { authors }): Promise<Blog[]> {
    const blogFiles = await require.context('~/content/blog/', false, /\.json$/);
    const blogs = blogFiles.keys().map((key: string) => {
      let res = blogFiles(key);
      res.slug = key.slice(2, -5);
      res.author = authors.find((a: Author) => a.username === res.authorId)
      return res;
    });
    await commit('SET_BLOGS', blogs);

    return blogs;
  },
}