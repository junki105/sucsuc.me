import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Category } from '../../core/entities/Category'

export const state = () => ({
  categories: [] as Category[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  categories: state => state.categories,

}

export const mutations: MutationTree<RootState> = {
  SET_CATEGORIES(state, list) {
    state.categories = list;
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async init({ commit }): Promise<Category[]> {
    const categoryJson = await require('~/content/category.json');
    const categories = categoryJson.categories;
    await commit('SET_CATEGORIES', categories);

    return categories;
  },
}