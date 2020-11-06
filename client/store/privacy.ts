import { GetterTree, ActionTree, MutationTree } from 'vuex'


export const state = () => ({
  document: '' as String
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  document: (state) => state.document
}

export const mutations: MutationTree<RootState> = {
  SET_DOCUMENT(state, document: String) {
    state.document = document
  }
}

export const actions: ActionTree<RootState, RootState> = {
  async init({ commit }) {
    const document = await require('~/content/privacy.md').default;
    await commit('SET_DOCUMENT', document);
  },
}