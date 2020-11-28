import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { User } from 'netlify-identity-widget'
import { Profile } from '../../core/entities/Profile'
import { Product } from '../../core/entities/Product'

export const ACTION_KEY_LOGIN = 'login'
export const ACTION_KEY_SIGNUP = 'signup'

export const state = () => ({
  user: null as User|null,
  profile: null as Profile|null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    user: (state) => state.user,
    isMentor: (state) => {
      return (
        state.user &&
        state.user.app_metadata &&
        state.user.app_metadata.roles &&
        state.user.app_metadata.roles.includes('Mentor')
      )
    },
    isAdmin: (state) => {
      return (
        state.user &&
        state.user.app_metadata &&
        state.user.app_metadata.roles &&
        state.user.app_metadata.roles.includes('Admin')
      )
    },
    profile: (state) => state.profile,
}

export const mutations: MutationTree<RootState> = {
  SET_USER(state, user: User|null) {
    state.user = user
  },
  SET_PROFILE(state, profile: Profile|null) {
    state.profile = profile
  },
  SET_PRODUCT(state, product: Product) {
    if (state.profile) {
      const products = state.profile.products.filter((p: Product) => p._id !== product._id)
      state.profile.products = [ product, ...products ]
    }
  }
}

export const actions: ActionTree<RootState, RootState> = {
  init({ dispatch, commit }) {
    this.$netlifyIdentity.on('init', (user: User) => {
      if (user) {
        commit('SET_USER', user)
        dispatch('fetchProfile')
      }
    })
    this.$netlifyIdentity.on('close', () => {
      const user = this.$netlifyIdentity.currentUser()
      if (user) {
        commit('SET_USER', user)
        dispatch('fetchProfile')
      }
    })
    this.$netlifyIdentity.init({
      APIUrl: process.env.NETLIFY_IDENTITY_ENDPOINT_URL,
      locale: 'ja',
    })
  },
  openSignup({ dispatch }) {
    dispatch('open', ACTION_KEY_SIGNUP)
  },
  openLogin({ dispatch }) {
    dispatch('open', ACTION_KEY_LOGIN)
  },
  logout({ commit }) {
    this.$netlifyIdentity.logout()
    commit('SET_USER', null)
    commit('SET_PROFILE', null)
  },
  open({ commit }, action) {
    this.$netlifyIdentity.open(action)
    this.$netlifyIdentity.on(action, (user: User) => {
      commit('SET_USER', user)
      this.$netlifyIdentity.close()
    })
  },
  refresh() {
    return this.$netlifyIdentity.refresh()
  },
  async fetchProfile({ getters, commit }) {
    if (getters.profile) {
      return
    }
    const token = await this.$netlifyIdentity.refresh()
    this.$axios.setHeader('Authorization', `Bearer ${token}`)
    const { profile } = await this.$axios.$post('/.netlify/functions/profile-retrieve')
    commit('SET_PROFILE', profile)
  },
  setProfile({ commit }, profile) {
    commit('SET_PROFILE', profile)
  },
  async updateProfile({ commit }, profile) {
    const token = await this.$netlifyIdentity.refresh()
    this.$axios.setHeader('Authorization', `Bearer ${token}`)
    const savedProfile = await this.$axios.$post(
      '/.netlify/functions/profile-update',
      profile
    )
    commit('SET_PROFILE', savedProfile)
  },
  async saveProduct({ commit }, product) {
    const token = await this.$netlifyIdentity.refresh()
    this.$axios.setHeader('Authorization', `Bearer ${token}`)
    const savedProduct = await this.$axios.$post(
      '/.netlify/functions/product-update',
      product
    )
    commit('SET_PRODUCT', savedProduct)
  }
}