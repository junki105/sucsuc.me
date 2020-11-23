import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Product } from '../../core/entities/Product'
import Fuse from 'fuse.js'

export const state = () => ({
  products: [] as Product[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  products: state => state.products,
}

export const mutations: MutationTree<RootState> = {
  SET_PRODUCTS(state, products: Product[]) {
    state.products = products;
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async init({ commit }): Promise<Product[]> {
    const productFiles = await require.context('~/content/product/', false, /\.json$/);
    const products = productFiles.keys().map((key: string) => productFiles(key));
    await commit('SET_PRODUCTS', products);

    return products;
  },
  search({ state }, q) {
    if (!q || q.length === 0) {
      return []
    } 
    const fuse = new Fuse<Product>(state.products, {
      keys: ['title', 'description', 'body', 'author.title', 'author.username']
    })
    return fuse.search(q).map(r => r.item)
  },
}