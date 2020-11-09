import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Author } from '../../core/entities/Author'
import { Plan } from '../../core/entities/Plan'
import { Hashtag } from '../../core/entities/Hashtag'
import Fuse from 'fuse.js'

export const state = () => ({
  plans: [] as Plan[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  plans: state => state.plans,
  authorPlanPosts: state => (author: Author) => {
    const plans = state.plans.filter((plan: Plan) => plan.author.slug === author.slug)
    plans.sort((a, b) => {
      if(a.price < b.price) {
        return -1;
      }
      if(a.price > b.price) {
        return 1;
      }
      return 0;
    })
    return plans
  },
}

export const mutations: MutationTree<RootState> = {
  SET_PLANS(state, list: Plan[]) {
    state.plans = list;
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async init({ commit }, { authors, hashtags }): Promise<Plan[]> {
    const planFiles = await require.context('~/content/plan/', false, /\.json$/);
    const plans = planFiles.keys().map((key: string) => {
      let res = planFiles(key);
      res.slug = `${res.authorId}-${res.uuid}`
      res.author = authors.find((a: Author) => a.username === res.authorId)
      res.hashtags = res.hashtagIds.map((str: string) => hashtags.find((h: Hashtag) => h.value === str))
      return res;
    });
    await commit('SET_PLANS', plans);

    return plans;
  },
  search({ state }, q) {
    if (!q || q.length === 0) {
      return []
    } 
    const fuse = new Fuse<Plan>(state.plans, {
      keys: ['title', 'description', 'body', 'author.title', 'author.username']
    })
    return fuse.search(q).map(r => r.item)
  },
}