import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Hashtag } from '../../core/entities/Hashtag'

export const state = () => ({
  hashtags: [] as Hashtag[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  hashtags: state => state.hashtags,

}

export const mutations: MutationTree<RootState> = {
  SET_HASHTAGS(state, list) {
    state.hashtags = list;
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async init({ commit }): Promise<Hashtag[]> {
    const json = await require('~/content/hashtag.json');
    const hashtags = json.hashtags;
    await commit('SET_HASHTAGS', hashtags);

    return hashtags;
  },
}