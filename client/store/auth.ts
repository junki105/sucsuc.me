import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { User } from 'netlify-identity-widget'

export const ACTION_KEY_LOGIN = 'login'
export const ACTION_KEY_SIGNUP = 'signup'

export const state = () => ({
  user: null as User|null
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
    }
}

export const mutations: MutationTree<RootState> = {
  SET_USER(state, user: User|null) {
    state.user = user
  }
}

export const actions: ActionTree<RootState, RootState> = {
  init({ commit }) {
    this.$netlifyIdentity.on('init', (user: User) => {
      if (user) {
        commit('SET_USER', user)
      }
    })
    this.$netlifyIdentity.on('close', () => {
      const user = this.$netlifyIdentity.currentUser()
      if (user) {
        commit('SET_USER', user)
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
  }
}